import { Request, Response } from 'express';
import { z } from 'zod';
import { DocumentService } from '../services/document.service';
import { LocalStorageService } from '../services/storage/local-storage.service';
import { DocumentProcessingService } from '../services/processing/document-processing.service';
import { sendSuccess, sendError } from '../utils/response';
import { logger } from '../utils/logger';
import { validateFile, generateSafeFilename, sanitizeFilename } from '../utils/file-validation';
import { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';

// Extended Express Request with userId and file
interface AuthenticatedRequest extends Request {
  userId?: string;
  file?: Express.Multer.File;
}

// Initialize services
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const storageService = new LocalStorageService(uploadDir);
const documentService = new DocumentService(storageService);
const processingService = new DocumentProcessingService(storageService);

// Validation schemas
const renameDocumentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
});

const listDocumentsSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(),
  status: z.enum(['UPLOADED', 'PROCESSING', 'READY', 'FAILED']).optional(),
  type: z.string().optional(),
  sortBy: z.enum(['createdAt', 'originalName', 'size']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const uploadDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const file = req.file;
    const maxFileSizeMB = parseInt(process.env.MAX_FILE_SIZE_MB || '20');

    // Validate file exists
    if (!file) {
      sendError(res, ERROR_MESSAGES.MISSING_FILE, undefined, HTTP_STATUS.BAD_REQUEST);
      return;
    }

    // Validate file
    const validationResult = validateFile(file.originalname, file.mimetype, file.size, maxFileSizeMB);

    if (!validationResult.isValid) {
      sendError(res, validationResult.error, undefined, HTTP_STATUS.BAD_REQUEST);
      return;
    }

    // Generate safe filename
    const safeFilename = generateSafeFilename(file.originalname, userId!);
    const storagePath = await storageService.save(userId!, safeFilename, file.buffer);

    // Create document record
    const document = await documentService.createDocument(
      userId!,
      sanitizeFilename(file.originalname),
      safeFilename,
      storagePath,
      file.mimetype,
      validationResult.extension,
      file.size
    );

    logger.info(`Document uploaded: ${document._id}`);

    // Start processing asynchronously (don't wait for it)
    processingService.processDocument(document._id.toString()).catch((error) => {
      logger.error(`Background processing failed for document ${document._id}: ${error}`);
    });

    sendSuccess(
      res,
      SUCCESS_MESSAGES.DOCUMENT_UPLOADED,
      {
        id: document._id,
        originalName: document.originalName,
        mimeType: document.mimeType,
        size: document.size,
        status: document.status,
        createdAt: document.createdAt,
      },
      HTTP_STATUS.CREATED
    );
  } catch (error) {
    logger.error(`Upload failed: ${error}`);
    sendError(res, ERROR_MESSAGES.UPLOAD_FAILED, error);
  }
};

export const listDocuments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    // Validate query parameters
    const validation = listDocumentsSchema.safeParse(req.query);
    if (!validation.success) {
      sendError(res, ERROR_MESSAGES.INVALID_QUERY, validation.error.errors, HTTP_STATUS.BAD_REQUEST);
      return;
    }

    const { documents, pagination } = await documentService.getDocumentsByUserId(userId!, validation.data);

    sendSuccess(res, SUCCESS_MESSAGES.DOCUMENTS_RETRIEVED, {
      documents: documents.map((doc) => ({
        id: doc._id,
        originalName: doc.originalName,
        mimeType: doc.mimeType,
        size: doc.size,
        status: doc.status,
        pageCount: doc.pageCount || 0,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })),
      pagination,
    });
  } catch (error) {
    logger.error(`List documents failed: ${error}`);
    sendError(res, ERROR_MESSAGES.LIST_FAILED, error);
  }
};

export const getDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const document = await documentService.getDocumentById(id, userId!);

    sendSuccess(res, SUCCESS_MESSAGES.DOCUMENT_RETRIEVED, {
      id: document._id,
      originalName: document.originalName,
      mimeType: document.mimeType,
      size: document.size,
      status: document.status,
      pageCount: document.pageCount || 0,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  } catch (error: any) {
    logger.error(`Get document failed: ${error}`);
    const statusCode = error.message === 'Document not found' ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.INTERNAL_ERROR;
    sendError(res, error.message || ERROR_MESSAGES.DOCUMENT_NOT_FOUND, error, statusCode);
  }
};

export const renameDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Validate body
    const validation = renameDocumentSchema.safeParse(req.body);
    if (!validation.success) {
      sendError(res, ERROR_MESSAGES.INVALID_INPUT, validation.error.errors, HTTP_STATUS.BAD_REQUEST);
      return;
    }

    const document = await documentService.renameDocument(id, userId!, validation.data.name);

    sendSuccess(res, SUCCESS_MESSAGES.DOCUMENT_RENAMED, {
      id: document._id,
      originalName: document.originalName,
      mimeType: document.mimeType,
      size: document.size,
      status: document.status,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  } catch (error: any) {
    logger.error(`Rename document failed: ${error}`);
    const statusCode = error.message === 'Document not found' ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.INTERNAL_ERROR;
    sendError(res, error.message || ERROR_MESSAGES.RENAME_FAILED, error, statusCode);
  }
};

export const deleteDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    await documentService.deleteDocument(id, userId!);

    sendSuccess(res, SUCCESS_MESSAGES.DOCUMENT_DELETED);
  } catch (error: any) {
    logger.error(`Delete document failed: ${error}`);
    const statusCode = error.message === 'Document not found' ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.INTERNAL_ERROR;
    sendError(res, error.message || ERROR_MESSAGES.DELETE_FAILED, error, statusCode);
  }
};

export const downloadDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const document = await documentService.getDocumentById(id, userId!);

    // Check if file exists
    const fileExists = await storageService.exists(document.storagePath);
    if (!fileExists) {
      sendError(res, ERROR_MESSAGES.FILE_NOT_FOUND, undefined, HTTP_STATUS.NOT_FOUND);
      return;
    }

    // Set response headers
    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
    res.setHeader('Content-Length', document.size);

    // Stream file
    const readStream = storageService.getReadStream(document.storagePath);
    readStream.pipe(res);

    readStream.on('error', (error) => {
      logger.error(`Stream error: ${error}`);
      if (!res.headersSent) {
        sendError(res, ERROR_MESSAGES.DOWNLOAD_FAILED, error);
      }
    });
  } catch (error: any) {
    logger.error(`Download document failed: ${error}`);
    const statusCode = error.message === 'Document not found' ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.INTERNAL_ERROR;
    if (!res.headersSent) {
      sendError(res, error.message || ERROR_MESSAGES.DOWNLOAD_FAILED, error, statusCode);
    }
  }
};

/**
 * Get processing status and metadata
 * GET /api/documents/:id/processing-status
 */
export const getProcessingStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const status = await documentService.getProcessingStatus(id, userId!);

    sendSuccess(res, 'Processing status retrieved', status);
  } catch (error: any) {
    logger.error(`Get processing status failed: ${error}`);
    const statusCode = error.message === 'Document not found' ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.INTERNAL_ERROR;
    sendError(res, error.message || 'Failed to get processing status', error, statusCode);
  }
};

/**
 * Get paginated chunks for a document
 * GET /api/documents/:id/chunks?page=1&limit=10
 */
export const getDocumentChunks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Validate query parameters
    const validation = z
      .object({
        page: z.coerce.number().min(1).optional(),
        limit: z.coerce.number().min(1).max(100).optional(),
      })
      .safeParse(req.query);

    if (!validation.success) {
      sendError(res, ERROR_MESSAGES.INVALID_QUERY, validation.error.errors, HTTP_STATUS.BAD_REQUEST);
      return;
    }

    const { page = 1, limit = 10 } = validation.data;

    const { chunks, pagination } = await documentService.getDocumentChunks(id, userId!, page, limit);

    sendSuccess(res, 'Document chunks retrieved', {
      chunks,
      pagination,
    });
  } catch (error: any) {
    logger.error(`Get document chunks failed: ${error}`);
    const statusCode = error.message === 'Document not found' ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.INTERNAL_ERROR;
    sendError(res, error.message || 'Failed to get document chunks', error, statusCode);
  }
};

/**
 * Retry processing for a failed document
 * POST /api/documents/:id/retry-processing
 */
export const retryProcessing = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Verify document exists and user owns it
    const document = await documentService.getDocumentById(id, userId!);

    // Only allow retry if status is FAILED
    if (document.status !== 'FAILED') {
      sendError(res, 'Processing can only be retried for documents with FAILED status', undefined, HTTP_STATUS.BAD_REQUEST);
      return;
    }

    // Start processing asynchronously
    processingService.processDocument(id).catch((error) => {
      logger.error(`Background processing failed for document ${id}: ${error}`);
    });

    sendSuccess(
      res,
      'Processing retry started',
      {
        id: document._id,
        status: document.status,
        message: 'Document is being reprocessed',
      },
      HTTP_STATUS.ACCEPTED
    );
  } catch (error: any) {
    logger.error(`Retry processing failed: ${error}`);
    const statusCode = error.message === 'Document not found' ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.INTERNAL_ERROR;
    sendError(res, error.message || 'Failed to retry processing', error, statusCode);
  }
};
