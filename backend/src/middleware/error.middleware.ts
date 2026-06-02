import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
  errorCode?: string;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  // Prefixing with _ tells the TypeScript compiler that it is intentionally unused
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';

  // Log error message and route information
  console.error(`[Error] ${req.method} ${req.url} - Status ${statusCode}: ${message}`);
  
  // Show stack trace only in non-production environments
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    status: 'error',
    errorCode,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
