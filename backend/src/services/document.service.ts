import prisma from '../utils/db';
import { generateRPPContent, generateSoalContent, generateModulAjarContent } from '../utils/gemini';
import { buildRPPDocx, buildSoalDocx, buildModulAjarDocx } from '../utils/docxBuilder';
import { uploadFile, getSignedUrl, deleteFile } from '../utils/gcs';

export class DocumentService {
  static async generateDocument(userId: number, type: 'rpp' | 'soal' | 'modul_ajar', inputData: any) {
    // 1. Cek Kuota & Detail User di Database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw { statusCode: 404, error: 'NOT_FOUND', message: 'Data pengguna tidak ditemukan.' };
    }

    // Cek batas kuota jika bukan plan unlimited (basic / pro)
    const isPremium = user.plan === 'basic' || user.plan === 'pro';
    if (!isPremium && user.quota_remaining <= 0) {
      throw {
        statusCode: 429,
        error: 'QUOTA_EXCEEDED',
        message: 'Batas kuota bulanan Anda telah habis. Silakan tingkatkan akun Anda ke Premium.',
        quotaRemaining: 0,
      };
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
      throw {
        statusCode: 502,
        error: aiError.message === 'AI_TIMEOUT' ? 'AI_TIMEOUT' : 'AI_ERROR',
        message: aiError.message === 'AI_TIMEOUT'
          ? 'Koneksi asisten AI tersendat. Silakan coba sesaat lagi.'
          : 'Gagal memproses data masukan menggunakan asisten AI.',
      };
    }

    // 3. Mengunggah berkas terkompilasi ke GCS / Lokal fallback
    const timestamp = Date.now();
    const destinationPath = `${type}/${userId}-${timestamp}-${type}.docx`;
    
    let gcsPath = '';
    try {
      gcsPath = await uploadFile(docBuffer, destinationPath);
    } catch (uploadError) {
      console.error('[Generate-Upload-Error]', uploadError);
      throw {
        statusCode: 500,
        error: 'STORAGE_ERROR',
        message: 'Gagal mengunggah berkas dokumen ke penyimpanan awan.',
      };
    }

    // 4. Operasi Database Transaksional (Atomic)
    let createdDoc: any = null;
    let updatedQuotaRemaining = user.quota_remaining;

    try {
      const resultTx = await prisma.$transaction(async (tx: any) => {
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
      
      // Bersihkan file yang terunggah jika database gagal mencatat rekam
      try {
        await deleteFile(gcsPath);
      } catch (cleanupError) {
        console.error('[Generate-Cleanup-Error] Failed to remove orphan GCS file:', cleanupError);
      }

      throw {
        statusCode: 500,
        error: 'DATABASE_ERROR',
        message: 'Gagal mencatat data transaksi dokumen baru di server.',
      };
    }

    // 5. Terbitkan tautan signed URL unduh
    const signedUrl = await getSignedUrl(gcsPath);

    return {
      document: {
        id: createdDoc.id,
        type: createdDoc.type,
        title: createdDoc.title,
        gcsPath: createdDoc.gcs_path,
        createdAt: createdDoc.created_at,
      },
      signedUrl,
      quotaRemaining: updatedQuotaRemaining,
    };
  }

  static async listDocuments(userId: number, filters: { type?: string; dateFrom?: string; dateTo?: string; cursor?: number; limit?: number }) {
    const limitNum = filters.limit ? filters.limit : 10;
    const cursorNum = filters.cursor ? filters.cursor : undefined;

    // Susun filter query
    const whereConditions: any = {
      user_id: userId,
    };

    if (filters.type && ['rpp', 'soal', 'modul_ajar'].includes(filters.type)) {
      whereConditions.type = filters.type;
    }

    if (filters.dateFrom || filters.dateTo) {
      whereConditions.created_at = {};
      if (filters.dateFrom) {
        whereConditions.created_at.gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        whereConditions.created_at.lte = new Date(`${filters.dateTo}T23:59:59.999Z`);
      }
    }

    // Eksekusi pencarian dengan pagination berbasis cursor
    const docs = await prisma.document.findMany({
      where: whereConditions,
      take: limitNum + 1,
      cursor: cursorNum ? { id: cursorNum } : undefined,
      skip: cursorNum ? 1 : 0,
      orderBy: { id: 'desc' },
    });

    let nextCursor: number | null = null;
    if (docs.length > limitNum) {
      const nextItem = docs.pop();
      nextCursor = nextItem!.id;
    }

    return {
      documents: docs.map((doc: any) => ({
        id: doc.id,
        type: doc.type,
        title: doc.title,
        gcsPath: doc.gcs_path,
        createdAt: doc.created_at,
      })),
      nextCursor,
    };
  }

  static async downloadDocument(userId: number, docId: number) {
    // Cari rekam dokumen
    const doc = await prisma.document.findUnique({
      where: { id: docId },
    });

    if (!doc || doc.user_id !== userId) {
      throw {
        statusCode: 404,
        error: 'NOT_FOUND',
        message: 'Dokumen tidak ditemukan atau Anda tidak memiliki hak akses.',
      };
    }

    if (!doc.gcs_path) {
      throw {
        statusCode: 422,
        error: 'UNPROCESSABLE_ENTITY',
        message: 'Berkas fisik dokumen ini tidak terdaftar di penyimpanan.',
      };
    }

    // Terbitkan signed URL aman
    const signedUrl = await getSignedUrl(doc.gcs_path);

    return {
      signedUrl,
      filename: `${doc.title}.docx`,
    };
  }

  static async deleteDocument(userId: number, docId: number) {
    // Cari rekam dokumen
    const doc = await prisma.document.findUnique({
      where: { id: docId },
    });

    if (!doc || doc.user_id !== userId) {
      throw {
        statusCode: 404,
        error: 'NOT_FOUND',
        message: 'Dokumen tidak ditemukan atau Anda tidak memiliki hak akses.',
      };
    }

    // 1. Hapus berkas fisik dari GCS / Penyimpanan lokal
    if (doc.gcs_path) {
      try {
        await deleteFile(doc.gcs_path);
      } catch (storageError) {
        console.error(`[Delete-Storage-Error] Failed to remove file ${doc.gcs_path}:`, storageError);
      }
    }

    // 2. Hapus rekam dokumen dari Database
    await prisma.document.delete({
      where: { id: docId },
    });

    return { success: true };
  }

  static async toggleDocumentShare(userId: number, docId: number) {
    const doc = await prisma.document.findFirst({ where: { id: docId, user_id: userId } });
    if (!doc) {
      throw { statusCode: 404, error: 'NOT_FOUND', message: 'Dokumen tidak ditemukan.' };
    }

    const newIsPublic = !doc.is_public;
    const updated = await prisma.document.update({
      where: { id: docId },
      data: {
        is_public: newIsPublic,
        shared_at: newIsPublic ? new Date() : null,
      },
    });

    return {
      id: updated.id,
      isPublic: updated.is_public,
      sharedAt: updated.shared_at,
      message: newIsPublic
        ? 'Dokumen berhasil dibagikan ke Perpustakaan Guru.'
        : 'Dokumen berhasil disembunyikan dari Perpustakaan Guru.',
    };
  }

  static async getPublicLibrary(page: number, limit: number, type?: string) {
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

    return {
      documents: documents.map((doc: any) => ({
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
    };
  }
}
