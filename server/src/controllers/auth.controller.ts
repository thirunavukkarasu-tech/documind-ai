import { Request, Response } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { env } from '../config/environment';
import { verifyRefreshToken, generateAccessToken } from '../utils/jwt';

// Validation schemas
const registerSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request
    const validated = registerSchema.parse(req.body);

    // Register user
    const { user, tokens } = await authService.register(validated);

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', tokens.refreshToken, getCookieOptions());

    // Return success response with user data and access token
    sendSuccess(res, 'Registration successful', {
      user,
      accessToken: tokens.accessToken,
    }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      sendError(res, 'Validation failed', error.errors[0].message, 400);
    } else if (error instanceof Error) {
      sendError(res, error.message, undefined, 400);
    } else {
      sendError(res, 'Registration failed', undefined, 500);
    }
  }
};

/**
 * Login a user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request
    const validated = loginSchema.parse(req.body);

    // Login user
    const { user, tokens } = await authService.login(validated);

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', tokens.refreshToken, getCookieOptions());

    // Return success response
    sendSuccess(res, 'Login successful', {
      user,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      sendError(res, 'Validation failed', error.errors[0].message, 400);
    } else if (error instanceof Error) {
      sendError(res, error.message, undefined, 401);
    } else {
      sendError(res, 'Login failed', undefined, 500);
    }
  }
};

/**
 * Refresh access token
 */
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      sendError(res, 'Refresh token not found', undefined, 401);
      return;
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      sendError(res, 'Invalid or expired refresh token', undefined, 401);
      return;
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      role: decoded.role,
    });

    sendSuccess(res, 'Token refreshed', {
      accessToken: newAccessToken,
    });
  } catch (error) {
    sendError(res, 'Token refresh failed', undefined, 500);
  }
};

/**
 * Logout a user
 */
export const logout = (_req: Request, res: Response): void => {
  try {
    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      path: '/',
    });

    sendSuccess(res, 'Logout successful');
  } catch (error) {
    sendError(res, 'Logout failed', undefined, 500);
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // User ID is attached by auth middleware
    const userId = (req as any).userId;

    if (!userId) {
      sendError(res, 'Unauthorized', undefined, 401);
      return;
    }

    const user = await authService.getUserById(userId);
    sendSuccess(res, 'User profile retrieved', { user });
  } catch (error) {
    if (error instanceof Error && error.message === 'User not found') {
      sendError(res, 'User not found', undefined, 404);
    } else {
      sendError(res, 'Failed to retrieve user', undefined, 500);
    }
  }
};
