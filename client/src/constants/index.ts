// Frontend Constants

export const API_ROUTES = {
  HEALTH: '/health',
  // Auth routes (Phase 2+)
  // REGISTER: '/auth/register',
  // LOGIN: '/auth/login',
  // LOGOUT: '/auth/logout',

  // Document routes (Phase 2+)
  // DOCUMENTS: '/documents',
  // DOCUMENT_DETAIL: '/documents/:id',
  // UPLOAD_DOCUMENT: '/documents/upload',

  // Chat routes (Phase 3+)
  // CHAT: '/chat',
  // QUERY_DOCUMENT: '/chat/query',
} as const;

export const SUPPORTED_FILE_TYPES = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
