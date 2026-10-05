import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/environment';
import { logger } from './utils/logger';
import { sendError } from './utils/response';
import healthRoutes from './routes/health.routes';

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
// Body Parser Middleware
// ==========================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ==========================================
// API Routes
// ==========================================
app.use('/api/health', healthRoutes);

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
  (err: Error, req: Request, res: Response, _next: NextFunction) => {
    logger.error('Unhandled error:', err);

    const statusCode = (err as any).statusCode || 500;
    const message = err.message || 'Internal server error';

    sendError(res, message, err, statusCode);
  }
);

export default app;
