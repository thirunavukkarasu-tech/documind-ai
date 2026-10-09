import { logger } from './logger';

export interface FileValidationError {
  isValid: false;
  error: string;
}

export interface FileValidationSuccess {
  isValid: true;
  extension: string;
}

export type FileValidationResult = FileValidationSuccess | FileValidationError;

// MIME types mapping
const SUPPORTED_MIME_TYPES: Record<string, string[]> = {
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

// Reverse mapping for quick lookup
const MIME_TYPE_BY_EXTENSION: Record<string, string[]> = {
  '.pdf': ['application/pdf'],
  '.txt': ['text/plain'],
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

const SUPPORTED_EXTENSIONS = ['.pdf', '.txt', '.docx'];

export function validateFile(
  filename: string,
  mimeType: string,
  fileSize: number,
  maxFileSizeMB: number
): FileValidationResult {
  // Get file extension
  const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();

  // Check extension
  if (!SUPPORTED_EXTENSIONS.includes(extension)) {
    const error = `Unsupported file type: ${extension}. Supported types: ${SUPPORTED_EXTENSIONS.join(', ')}`;
    logger.warn(`File validation failed: ${error}`);
    return { isValid: false, error };
  }

  // Validate MIME type matches extension
  const expectedMimeTypes = MIME_TYPE_BY_EXTENSION[extension] || [];
  if (!expectedMimeTypes.includes(mimeType)) {
    const error = `Invalid MIME type for ${extension}: ${mimeType}`;
    logger.warn(`File validation failed: ${error}`);
    return { isValid: false, error };
  }

  // Check file size
  const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;
  if (fileSize > maxFileSizeBytes) {
    const error = `File size exceeds maximum of ${maxFileSizeMB}MB`;
    logger.warn(`File validation failed: ${error}`);
    return { isValid: false, error };
  }

  return { isValid: true, extension };
}

export function generateSafeFilename(originalFilename: string, userId: string): string {
  const timestamp = Date.now();
  const extension = originalFilename.substring(originalFilename.lastIndexOf('.')).toLowerCase();

  // Generate safe filename: userID_timestamp.extension
  const safeFilename = `${userId.replace(/[^a-zA-Z0-9]/g, '')}_${timestamp}${extension}`;

  return safeFilename;
}

export function sanitizeFilename(filename: string): string {
  // Remove any path separators and special characters
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}
