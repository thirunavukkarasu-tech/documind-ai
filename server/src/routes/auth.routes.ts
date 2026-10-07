import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  getCurrentUser,
} from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Login a user
 */
router.post('/login', login);

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', refresh);

/**
 * POST /api/auth/logout
 * Logout a user (clear refresh token)
 */
router.post('/logout', logout);

/**
 * GET /api/auth/me
 * Get current user profile (requires authentication)
 */
router.get('/me', requireAuth, getCurrentUser);

export default router;
