import './utils/bigint'; // Custom BigInt JSON serializer (Must be first!)
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import apiRouter from './routes';
import { errorHandler } from './middleware/error.middleware';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Sajikan berkas unggahan lokal secara statis untuk local fallback
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Standard Middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup - only allow FRONTEND_URL
const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:5173'];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Request Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Master API Routes
app.use('/api', apiRouter);

// Global Error Handler (Registered last)
app.use(errorHandler);

// Start Server
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Server] GuruBantu AI Backend is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

export default app;
