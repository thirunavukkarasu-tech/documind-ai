/**
 * Application constants
 */

export const API_PREFIX = '/api';
export const AUTH_ROUTE_PREFIX = '/auth';

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_REGISTERED: 'Email already registered',
  USER_NOT_FOUND: 'User not found',
  ACCOUNT_NOT_ACTIVE: 'Account is not active',
  UNAUTHORIZED: 'Unauthorized',
  MISSING_AUTH_HEADER: 'Missing or invalid Authorization header',
  INVALID_TOKEN: 'Invalid or expired token',
  REFRESH_TOKEN_NOT_FOUND: 'Refresh token not found',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  PASSWORD_TOO_WEAK: 'Password does not meet security requirements',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESSFUL: 'Registration successful',
  LOGIN_SUCCESSFUL: 'Login successful',
  LOGOUT_SUCCESSFUL: 'Logout successful',
  TOKEN_REFRESHED: 'Token refreshed',
  USER_RETRIEVED: 'User profile retrieved',
} as const;
