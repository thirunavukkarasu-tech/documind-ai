/**
 * Application constants
 */

export const API_PREFIX = '/api';
export const AUTH_ROUTE_PREFIX = '/auth';

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  // Auth errors
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

  // Document errors
  MISSING_FILE: 'No file provided',
  UNSUPPORTED_FILE_TYPE: 'Unsupported file type',
  FILE_TOO_LARGE: 'File size exceeds maximum limit',
  INVALID_INPUT: 'Invalid input',
  INVALID_QUERY: 'Invalid query parameters',
  DOCUMENT_NOT_FOUND: 'Document not found',
  FILE_NOT_FOUND: 'File not found',
  UPLOAD_FAILED: 'Failed to upload document',
  LIST_FAILED: 'Failed to list documents',
  RENAME_FAILED: 'Failed to rename document',
  DELETE_FAILED: 'Failed to delete document',
  DOWNLOAD_FAILED: 'Failed to download document',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  // Auth messages
  REGISTRATION_SUCCESSFUL: 'Registration successful',
  LOGIN_SUCCESSFUL: 'Login successful',
  LOGOUT_SUCCESSFUL: 'Logout successful',
  TOKEN_REFRESHED: 'Token refreshed',
  USER_RETRIEVED: 'User profile retrieved',

  // Document messages
  DOCUMENT_UPLOADED: 'Document uploaded successfully',
  DOCUMENTS_RETRIEVED: 'Documents retrieved successfully',
  DOCUMENT_RETRIEVED: 'Document retrieved successfully',
  DOCUMENT_RENAMED: 'Document renamed successfully',
  DOCUMENT_DELETED: 'Document deleted successfully',
  DOCUMENT_DOWNLOADED: 'Document download started',
} as const;
