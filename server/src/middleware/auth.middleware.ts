import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { sendError } from '../utils/response';

/**
 * Extend Express Request to include userId and role
 */
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: string;
    }
  }
}

/**
 * Authentication middleware to protect routes
 * Expects Authorization header with Bearer token
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'Missing or invalid Authorization header', undefined, 401);
      return;
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      sendError(res, 'Invalid or expired access token', undefined, 401);
      return;
    }

    // Attach user information to request
    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  } catch (error) {
    sendError(res, 'Authentication failed', error, 401);
  }
};

/**
 * Optional authentication middleware
 * Attaches user info if token is valid, but doesn't require it
 */
export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyAccessToken(token);

      if (decoded) {
        req.userId = decoded.userId;
        req.role = decoded.role;
      }
    }

    next();
  } catch {
    // If auth fails, just continue without user info
    next();
  }
};

/**
 * Role-based access control middleware
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.role || !allowedRoles.includes(req.role)) {
      sendError(res, 'Insufficient permissions', undefined, 403);
      return;
    }
    next();
  };
};
