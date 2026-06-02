import { Router } from 'express';
import { 
  generateDocument, 
  listDocuments, 
  downloadDocument, 
  deleteDocument 
} from '../controllers/document.controller';
import { verifyAccessToken } from '../middleware/auth.middleware';
import { checkQuota } from '../middleware/quota.middleware';
import { generateLimiter } from '../middleware/rate-limit.middleware';

const documentRouter = Router();

// Semua rute dokumen wajib dilindungi oleh otentikasi JWT
documentRouter.use(verifyAccessToken);

// POST /api/documents/generate - Generasi dokumen otomatis bertenaga AI (RPP / Soal)
// checkQuota dipasang sebelum handler utama agar kuota dicek lebih awal
documentRouter.post('/generate', generateLimiter, checkQuota, generateDocument);

// GET /api/documents - Ambil daftar riwayat dokumen user (dengan filter & pagination)
documentRouter.get('/', listDocuments);

// GET /api/documents/:id/download - Ambil signed URL pengunduhan dinamis valid 24 jam
documentRouter.get('/:id/download', downloadDocument);

// DELETE /api/documents/:id - Hapus rekam dokumen dari DB & berkas fisik dari penyimpanan
documentRouter.delete('/:id', deleteDocument);

export default documentRouter;
