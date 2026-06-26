import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { DocumentService } from '../services/document.service';
import { sendSuccess, sendError } from '../utils/response';

/**
 * POST /api/documents/generate
 * Membuat dokumen baru (RPP, Soal Ujian, atau Modul Ajar) secara otomatis menggunakan AI
 */
export const generateDocument = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userIdStr = req.user?.userId;
    if (!userIdStr) {
      sendError(res, 401, 'UNAUTHORIZED', 'Sesi Anda tidak valid. Silakan login kembali.');
      return;
    }

    const userId = parseInt(userIdStr, 10);
    const { type, inputData } = req.body;

    if (!type || !inputData || !['rpp', 'soal', 'modul_ajar'].includes(type)) {
      sendError(res, 400, 'BAD_REQUEST', 'Parameter tipe dokumen atau data masukan tidak valid.');
      return;
    }

    const result = await DocumentService.generateDocument(userId, type, inputData);
    sendSuccess(res, result, undefined, 201);
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error.statusCode, error.error, error.message);
    } else {
      next(error);
    }
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
      sendError(res, 401, 'UNAUTHORIZED', 'Sesi kadaluwarsa.');
      return;
    }

    const userId = parseInt(userIdStr, 10);
    const { type, dateFrom, dateTo, cursor, limit } = req.query;

    const limitNum = limit ? parseInt(limit as string, 10) : 10;
    const cursorNum = cursor ? parseInt(cursor as string, 10) : undefined;

    const result = await DocumentService.listDocuments(userId, {
      type: type as string,
      dateFrom: dateFrom as string,
      dateTo: dateTo as string,
      cursor: cursorNum,
      limit: limitNum,
    });

    sendSuccess(res, result);
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error.statusCode, error.error, error.message);
    } else {
      next(error);
    }
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
      sendError(res, 401, 'UNAUTHORIZED', 'Sesi kadaluwarsa.');
      return;
    }

    const userId = parseInt(userIdStr, 10);
    const docId = parseInt(id, 10);

    if (isNaN(docId)) {
      sendError(res, 400, 'BAD_REQUEST', 'Format ID dokumen tidak valid.');
      return;
    }

    const result = await DocumentService.downloadDocument(userId, docId);
    sendSuccess(res, result);
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error.statusCode, error.error, error.message);
    } else {
      next(error);
    }
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
      sendError(res, 401, 'UNAUTHORIZED', 'Sesi kadaluwarsa.');
      return;
    }

    const userId = parseInt(userIdStr, 10);
    const docId = parseInt(id, 10);

    if (isNaN(docId)) {
      sendError(res, 400, 'BAD_REQUEST', 'Format ID dokumen tidak valid.');
      return;
    }

    const result = await DocumentService.deleteDocument(userId, docId);
    sendSuccess(res, result, 'Dokumen berhasil dihapus secara permanen.');
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error.statusCode, error.error, error.message);
    } else {
      next(error);
    }
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
      sendError(res, 401, 'UNAUTHORIZED', 'Sesi tidak valid.');
      return;
    }
    const userId = parseInt(userIdStr, 10);
    const docId = parseInt(req.params.id, 10);

    if (isNaN(docId)) {
      sendError(res, 400, 'BAD_REQUEST', 'ID dokumen tidak valid.');
      return;
    }

    const result = await DocumentService.toggleDocumentShare(userId, docId);
    sendSuccess(res, result);
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error.statusCode, error.error, error.message);
    } else {
      next(error);
    }
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

    const result = await DocumentService.getPublicLibrary(page, limit, type);
    sendSuccess(res, result);
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error.statusCode, error.error, error.message);
    } else {
      next(error);
    }
  }
};
