import { Response, NextFunction } from 'express';
import prisma from '../utils/db';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { generateRPPContent, generateSoalContent, generateModulAjarContent } from '../utils/gemini';
import { buildRPPDocx, buildSoalDocx, buildModulAjarDocx } from '../utils/docxBuilder';
import { uploadFile, getSignedUrl, deleteFile } from '../utils/gcs'; // GCS utility helper

/**
 * POST /api/documents/generate
 * Membuat dokumen baru (RPP atau Soal Ujian) secara otomatis menggunakan AI
 */
export const generateDocument = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userIdStr = req.user?.userId;
    if (!userIdStr) {
      res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Sesi Anda tidak valid. Silakan login kembali.',
      });
      return;
    }

    const userId = parseInt(userIdStr, 10);
    const { type, inputData } = req.body;

    if (!type || !inputData || !['rpp', 'soal', 'modul_ajar'].includes(type)) {
      res.status(400).json({
        success: false,
        error: 'BAD_REQUEST',
        message: 'Parameter tipe dokumen atau data masukan tidak valid.',
      });
      return;
    }

    // 1. Cek Kuota & Detail User di Database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Data pengguna tidak ditemukan.',
      });
      return;
    }

    // Cek batas kuota jika bukan plan unlimited (basic / pro)
    const isPremium = user.plan === 'basic' || user.plan === 'pro';
    if (!isPremium && user.quota_remaining <= 0) {
      res.status(429).json({
        success: false,
        error: 'QUOTA_EXCEEDED',
        message: 'Batas kuota bulanan Anda telah habis. Silakan tingkatkan akun Anda ke Premium.',
        quotaRemaining: 0,
      });
      return;
    }

    // 2. Jalankan Generasi Konten AI berbasis jenis dokumen
    let rawAiResponse = '';
    let parsedData: any = null;
    let docBuffer: Buffer | null = null;

    try {
      if (type === 'rpp') {
        rawAiResponse = await generateRPPContent(inputData);
        parsedData = JSON.parse(rawAiResponse);
        docBuffer = await buildRPPDocx(parsedData);
      } else if (type === 'modul_ajar') {
        rawAiResponse = await generateModulAjarContent(inputData);
        parsedData = JSON.parse(rawAiResponse);
        docBuffer = await buildModulAjarDocx(parsedData);
      } else {
        rawAiResponse = await generateSoalContent(inputData);
        parsedData = JSON.parse(rawAiResponse);
        docBuffer = await buildSoalDocx(parsedData);
      }
    } catch (aiError: any) {
      console.error('[Generate-AI-Error]', aiError);
      
      // Jika AI error, kembalikan status error tanpa mengurangi kuota user
      res.status(502).json({
        success: false,
        error: aiError.message === 'AI_TIMEOUT' ? 'AI_TIMEOUT' : 'AI_ERROR',
        message: aiError.message === 'AI_TIMEOUT'
          ? 'Koneksi asisten AI tersendat. Silakan coba sesaat lagi.'
          : 'Gagal memproses data masukan menggunakan asisten AI.',
      });
      return;
    }

    // 3. Mengunggah berkas terkompilasi ke GCS / Lokal fallback
    const timestamp = Date.now();
    const destinationPath = `${type}/${userId}-${timestamp}-${type}.docx`;
    
    let gcsPath = '';
    try {
      gcsPath = await uploadFile(docBuffer, destinationPath);
    } catch (uploadError) {
      console.error('[Generate-Upload-Error]', uploadError);
      res.status(500).json({
        success: false,
        error: 'STORAGE_ERROR',
        message: 'Gagal mengunggah berkas dokumen ke penyimpanan awan.',
      });
      return;
    }

    // 4. Operasi Database Transaksional (Atomic)
    // Kuota HANYA berkurang jika file sukses terunggah ke GCS
    let createdDoc: any = null;
    let updatedQuotaRemaining = user.quota_remaining;

    try {
      const resultTx = await prisma.$transaction(async (tx) => {
        // Tentukan judul dokumen
        const mapel = parsedData.identitas?.mapel || inputData.mapel || 'Administrasi';
        const topik = parsedData.identitas?.topik || inputData.topik || 'Topik';
        const typeLabel = type === 'rpp' ? 'RPP' : type === 'modul_ajar' ? 'Modul Ajar' : 'Soal Ujian';
        const docTitle = `${typeLabel} ${mapel} - ${topik}`;

        // Tambah rekam dokumen ke database
        const doc = await tx.document.create({
          data: {
            user_id: userId,
            type,
            title: docTitle,
            input_data: JSON.stringify(inputData),
            gcs_path: gcsPath,
          },
        });

        // Kurangi kuota jika bukan pengguna premium
        let newQuota = user.quota_remaining;
        if (!isPremium) {
          const updatedUser = await tx.user.update({
            where: { id: userId },
            data: { quota_remaining: { decrement: 1 } },
          });
          newQuota = updatedUser.quota_remaining;
        }

        return { doc, newQuota };
      });

      createdDoc = resultTx.doc;
      updatedQuotaRemaining = resultTx.newQuota;
    } catch (dbError) {
      console.error('[Generate-Database-Error]', dbError);
      
      // Bersihkan file yang terunggah jika database gagal mencatat rekam agar tidak menyampah
      try {
        await deleteFile(gcsPath);
      } catch (cleanupError) {
        console.error('[Generate-Cleanup-Error] Failed to remove orphan GCS file:', cleanupError);
      }

      res.status(500).json({
        success: false,
        error: 'DATABASE_ERROR',
        message: 'Gagal mencatat data transaksi dokumen baru di server.',
      });
      return;
    }

    // 5. Terbitkan tautan signed URL unduh valid 24 jam
    const signedUrl = await getSignedUrl(gcsPath);

    res.status(201).json({
      success: true,
      data: {
        document: {
          id: createdDoc.id,
          type: createdDoc.type,
          title: createdDoc.title,
          gcsPath: createdDoc.gcs_path,
          createdAt: createdDoc.created_at,
        },
        signedUrl,
        quotaRemaining: updatedQuotaRemaining,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/documents
 * Mengambil daftar riwayat dokumen terbuat milik pengguna yang sedang login
 */
export const listDocuments = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userIdStr = req.user?.userId;
    if (!userIdStr) {
      res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Sesi kadaluwarsa.',
      });
      return;
    }

    const userId = parseInt(userIdStr, 10);
    const { type, dateFrom, dateTo, cursor, limit } = req.query;

    const limitNum = limit ? parseInt(limit as string, 10) : 10;
    const cursorNum = cursor ? parseInt(cursor as string, 10) : undefined;

    // Susun filter query
    const whereConditions: any = {
      user_id: userId,
    };

    if (type && ['rpp', 'soal', 'modul_ajar'].includes(type as string)) {
      whereConditions.type = type as string;
    }

    if (dateFrom || dateTo) {
      whereConditions.created_at = {};
      if (dateFrom) {
        whereConditions.created_at.gte = new Date(dateFrom as string);
      }
      if (dateTo) {
        whereConditions.created_at.lte = new Date(`${dateTo as string}T23:59:59.999Z`);
      }
    }

    // Eksekusi pencarian dengan pagination berbasis cursor
    const docs = await prisma.document.findMany({
      where: whereConditions,
      take: limitNum + 1, // Tambah 1 untuk menentukan halaman selanjutnya
      cursor: cursorNum ? { id: cursorNum } : undefined,
      skip: cursorNum ? 1 : 0, // Lewati cursor bersangkutan jika disematkan
      orderBy: { id: 'desc' },
    });

    let nextCursor: number | null = null;
    if (docs.length > limitNum) {
      const nextItem = docs.pop(); // Hapus item ekstra
      nextCursor = nextItem!.id;
    }

    res.status(200).json({
      success: true,
      data: {
        documents: docs.map((doc) => ({
          id: doc.id,
          type: doc.type,
          title: doc.title,
          gcsPath: doc.gcs_path,
          createdAt: doc.created_at,
        })),
        nextCursor,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/documents/:id/download
 * Menghasilkan signed URL pengunduhan berkas dokumen valid 24 jam
 */
export const downloadDocument = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userIdStr = req.user?.userId;
    const { id } = req.params;

    if (!userIdStr) {
      res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Sesi kadaluwarsa.',
      });
      return;
    }

    const userId = parseInt(userIdStr, 10);
    const docId = parseInt(id, 10);

    if (isNaN(docId)) {
      res.status(400).json({
        success: false,
        error: 'BAD_REQUEST',
        message: 'Format ID dokumen tidak valid.',
      });
      return;
    }

    // Cari rekam dokumen
    const doc = await prisma.document.findUnique({
      where: { id: docId },
    });

    if (!doc || doc.user_id !== userId) {
      res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Dokumen tidak ditemukan atau Anda tidak memiliki hak akses.',
      });
      return;
    }

    if (!doc.gcs_path) {
      res.status(422).json({
        success: false,
        error: 'UNPROCESSABLE_ENTITY',
        message: 'Berkas fisik dokumen ini tidak terdaftar di penyimpanan.',
      });
      return;
    }

    // Terbitkan signed URL aman
    const signedUrl = await getSignedUrl(doc.gcs_path);

    res.status(200).json({
      success: true,
      data: {
        signedUrl,
        filename: `${doc.title}.docx`,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/documents/:id
 * Menghapus rekam dokumen dari database dan berkas fisik dari GCS/Penyimpanan lokal
 */
export const deleteDocument = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userIdStr = req.user?.userId;
    const { id } = req.params;

    if (!userIdStr) {
      res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Sesi kadaluwarsa.',
      });
      return;
    }

    const userId = parseInt(userIdStr, 10);
    const docId = parseInt(id, 10);

    if (isNaN(docId)) {
      res.status(400).json({
        success: false,
        error: 'BAD_REQUEST',
        message: 'Format ID dokumen tidak valid.',
      });
      return;
    }

    // Cari rekam dokumen
    const doc = await prisma.document.findUnique({
      where: { id: docId },
    });

    if (!doc || doc.user_id !== userId) {
      res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Dokumen tidak ditemukan atau Anda tidak memiliki hak akses.',
      });
      return;
    }

    // 1. Hapus berkas fisik dari GCS / Penyimpanan lokal
    if (doc.gcs_path) {
      try {
        await deleteFile(doc.gcs_path);
      } catch (storageError) {
        // Log kesalahan hapus berkas fisik namun tetap lanjutkan hapus DB agar data sinkron
        console.error(`[Delete-Storage-Error] Failed to remove file ${doc.gcs_path}:`, storageError);
      }
    }

    // 2. Hapus rekam dokumen dari Database
    await prisma.document.delete({
      where: { id: docId },
    });

    res.status(200).json({
      success: true,
      message: 'Dokumen berhasil dihapus secara permanen.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/documents/:id/share
 * Toggle dokumen menjadi publik atau privat (masuk/keluar dari perpustakaan)
 */
export const toggleDocumentShare = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userIdStr = req.user?.userId;
    if (!userIdStr) {
      res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'Sesi tidak valid.' });
      return;
    }
    const userId = parseInt(userIdStr, 10);
    const docId = parseInt(req.params.id, 10);

    if (isNaN(docId)) {
      res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'ID dokumen tidak valid.' });
      return;
    }

    const doc = await prisma.document.findFirst({ where: { id: docId, user_id: userId } });
    if (!doc) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Dokumen tidak ditemukan.' });
      return;
    }

    const newIsPublic = !doc.is_public;
    const updated = await prisma.document.update({
      where: { id: docId },
      data: {
        is_public: newIsPublic,
        shared_at: newIsPublic ? new Date() : null,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        id: updated.id,
        isPublic: updated.is_public,
        sharedAt: updated.shared_at,
        message: newIsPublic
          ? 'Dokumen berhasil dibagikan ke Perpustakaan Guru.'
          : 'Dokumen berhasil disembunyikan dari Perpustakaan Guru.',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/library
 * Mengambil semua dokumen publik untuk ditampilkan di Perpustakaan Berbagi Guru
 * Public endpoint — tidak memerlukan autentikasi
 */
export const getPublicLibrary = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const type = req.query.type as string | undefined;
    const skip = (page - 1) * limit;

    const where: any = { is_public: true };
    if (type && ['rpp', 'soal', 'modul_ajar'].includes(type)) {
      where.type = type;
    }

    const [documents, total] = await prisma.$transaction([
      prisma.document.findMany({
        where,
        skip,
        take: limit,
        orderBy: { shared_at: 'desc' },
        include: {
          user: {
            select: { name: true },
          },
        },
      }),
      prisma.document.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        documents: documents.map((doc) => ({
          id: doc.id,
          type: doc.type,
          title: doc.title,
          authorName: doc.user.name,
          sharedAt: doc.shared_at,
          gcsPath: doc.gcs_path,
        })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
