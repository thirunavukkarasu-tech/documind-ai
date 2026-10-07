import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/environment';
import { logger } from './utils/logger';
import { sendError } from './utils/response';
import authRoutes from './routes/auth.routes';

const app: Express = express();

// ==========================================
// Security Middleware
// ==========================================
app.use(helmet());

// ==========================================
// CORS Configuration
// ==========================================
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// ==========================================
// Logging Middleware
// ==========================================
app.use(
  morgan(':method :url :status :response-time ms - :res[content-length]', {
    stream: {
      write: (message: string) => {
        logger.info(message.trim());
      },
    },
  })
);

// ==========================================
// Body Parser & Cookie Parser Middleware
// ==========================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// ==========================================
// Health Check Endpoint
// ==========================================
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'DocuMind AI API is running',
  });
});

// ==========================================
// API Routes
// ==========================================
app.use('/api/auth', authRoutes);

// ==========================================
// 404 Handler
// ==========================================
app.use((req: Request, res: Response) => {
  sendError(res, `Route ${req.originalUrl} not found`, undefined, 404);
});

// ==========================================
// Global Error Handler
// ==========================================
app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error('Unhandled error:', err);

    const statusCode = (err as any).statusCode || 500;
    const message = err.message || 'Internal server error';

    sendError(res, message, err, statusCode);
  }
);

export default app;
