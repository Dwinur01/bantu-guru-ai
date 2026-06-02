import rateLimit from 'express-rate-limit';

// Limiter untuk masuk akun (login) - Maks 5 per 15 menit per IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5,
  message: {
    status: 429,
    message: 'Terlalu banyak percobaan masuk. Silakan coba lagi dalam 15 menit.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter untuk daftar akun (register) - Maks 3 per 1 jam per IP
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 3,
  message: {
    status: 429,
    message: 'Terlalu banyak pembuatan akun dari perangkat ini. Silakan coba lagi dalam 1 jam.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter untuk pembuatan dokumen dengan AI (generate) - Maks 10 per 1 menit per IP
export const generateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 10,
  message: {
    status: 429,
    message: 'Terlalu banyak permintaan pembuatan dokumen. Silakan tunggu 1 menit.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
