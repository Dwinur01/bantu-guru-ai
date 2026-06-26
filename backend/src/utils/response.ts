import { Response } from 'express';

/**
 * Helper standar response format untuk seluruh controller GuruBantu AI.
 * Memastikan semua endpoint mengembalikan struktur yang konsisten.
 */

export const sendSuccess = (
  res: Response,
  data: unknown,
  message?: string,
  statusCode = 200
): void => {
  res.status(statusCode).json({
    success: true,
    ...(message && { message }),
    data,
  });
};

export const sendError = (
  res: Response,
  statusCode: number,
  error: string,
  message: string,
  details?: Record<string, string>
): void => {
  res.status(statusCode).json({
    success: false,
    error,
    message,
    ...(details && { details }),
  });
};
