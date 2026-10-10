import { Document, IDocument } from '../models/document.model';
import { Chunk, IChunk } from '../models/chunk.model';
import { StorageService } from './storage/storage.service';
import { logger } from '../utils/logger';

export interface ListDocumentsOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class DocumentService {
  constructor(private storageService: StorageService) {}

  async createDocument(
    userId: string,
    originalName: string,
    storedName: string,
    storagePath: string,
    mimeType: string,
    extension: string,
    size: number
  ): Promise<IDocument> {
    try {
      const document = new Document({
        userId,
        originalName,
        storedName,
        storagePath,
        mimeType,
        extension,
        size,
        status: 'UPLOADED',
        pageCount: 0,
      });

      await document.save();
      logger.info(`Document created: ${document._id} for user ${userId}`);

      return document;
    } catch (error) {
      logger.error(`Failed to create document: ${error}`);
      throw new Error('Failed to create document');
    }
  }

  async getDocumentsByUserId(userId: string, options: ListDocumentsOptions = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        status = '',
        type = '',
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = options;

      // Validate pagination parameters
      const pageNum = Math.max(1, page);
      const limitNum = Math.min(limit, 100); // Max 100 documents per page
      const skip = (pageNum - 1) * limitNum;

      // Build query
      const query: any = { userId };

      // Add search filter
      if (search) {
        query.$text = { $search: search };
      }

      // Add status filter
      if (status) {
        query.status = status;
      }

      // Add file type filter
      if (type) {
        query.extension = type.startsWith('.') ? type.toLowerCase() : `.${type.toLowerCase()}`;
      }

      // Validate sort field (whitelist allowed fields)
      const allowedSortFields = ['createdAt', 'originalName', 'size'];
      const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

      const sortOrder_: 1 | -1 = sortOrder === 'asc' ? 1 : -1;

      // Execute query
      const documents = await Document.find(query)
        .sort({ [sortField]: sortOrder_ })
        .skip(skip)
        .limit(limitNum)
        .lean();

      // Get total count
      const total = await Document.countDocuments(query);

      const pagination: PaginationInfo = {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      };

      logger.debug(`Retrieved ${documents.length} documents for user ${userId}`);

      return {
        documents,
        pagination,
      };
    } catch (error) {
      logger.error(`Failed to list documents: ${error}`);
      throw new Error('Failed to list documents');
    }
  }

  async getDocumentById(documentId: string, userId: string): Promise<IDocument> {
    try {
      const document = await Document.findOne({
        _id: documentId,
        userId,
      });

      if (!document) {
        throw new Error('Document not found');
      }

      logger.debug(`Retrieved document: ${documentId}`);

      return document;
    } catch (error) {
      logger.error(`Failed to get document: ${error}`);
      throw error;
    }
  }

  async renameDocument(documentId: string, userId: string, newName: string): Promise<IDocument> {
    try {
      // Validate new name
      if (!newName || newName.trim().length === 0) {
        throw new Error('Document name cannot be empty');
      }

      if (newName.length > 255) {
        throw new Error('Document name is too long (max 255 characters)');
      }

      // Find and update document
      const document = await Document.findOneAndUpdate(
        {
          _id: documentId,
          userId,
        },
        {
          originalName: newName.trim(),
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (!document) {
        throw new Error('Document not found');
      }

      logger.info(`Document renamed: ${documentId} to ${newName}`);

      return document;
    } catch (error) {
      logger.error(`Failed to rename document: ${error}`);
      throw error;
    }
  }

  async deleteDocument(documentId: string, userId: string): Promise<void> {
    try {
      // Find document
      const document = await Document.findOne({
        _id: documentId,
        userId,
      });

      if (!document) {
        throw new Error('Document not found');
      }

      // Delete physical file
      try {
        await this.storageService.delete(document.storagePath);
      } catch (error) {
        logger.warn(`Failed to delete physical file: ${document.storagePath}`);
        // Continue with database deletion even if file deletion fails
      }

      // Delete database record
      await Document.deleteOne({
        _id: documentId,
        userId,
      });

      logger.info(`Document deleted: ${documentId}`);
    } catch (error) {
      logger.error(`Failed to delete document: ${error}`);
      throw error;
    }
  }

  async updateDocumentStatus(
    documentId: string,
    status: 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED',
    pageCount?: number
  ): Promise<IDocument> {
    try {
      const updateData: any = {
        status,
        updatedAt: new Date(),
      };

      if (pageCount !== undefined) {
        updateData.pageCount = pageCount;
      }

      const document = await Document.findByIdAndUpdate(documentId, updateData, { new: true });

      if (!document) {
        throw new Error('Document not found');
      }

      logger.debug(`Document status updated: ${documentId} to ${status}`);

      return document;
    } catch (error) {
      logger.error(`Failed to update document status: ${error}`);
      throw error;
    }
  }

  /**
   * Get processing status and metadata for a document
   */
  async getProcessingStatus(documentId: string, userId: string) {
    try {
      const document = await this.getDocumentById(documentId, userId);

      return {
        id: document._id,
        status: document.status,
        processingStartedAt: document.processingStartedAt || null,
        processingCompletedAt: document.processingCompletedAt || null,
        processingError: document.processingError || null,
        pageCount: document.pageCount || 0,
        extractedCharacterCount: document.extractedCharacterCount || 0,
        chunkCount: document.chunkCount || 0,
      };
    } catch (error) {
      logger.error(`Failed to get processing status: ${error}`);
      throw error;
    }
  }

  /**
   * Get chunks for a document with pagination
   */
  async getDocumentChunks(
    documentId: string,
    userId: string,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      // Verify document ownership
      await this.getDocumentById(documentId, userId);

      // Validate pagination
      const pageNum = Math.max(1, page);
      const limitNum = Math.min(limit, 100);
      const skip = (pageNum - 1) * limitNum;

      // Get chunks
      const chunks = await Chunk.find({
        documentId,
        userId,
      })
        .sort({ chunkIndex: 1 })
        .skip(skip)
        .limit(limitNum)
        .lean();

      // Get total count
      const total = await Chunk.countDocuments({
        documentId,
        userId,
      });

      const pagination = {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      };

      logger.debug(`Retrieved ${chunks.length} chunks for document ${documentId}`);

      return {
        chunks: chunks.map((chunk) => ({
          id: chunk._id,
          index: chunk.chunkIndex,
          content: chunk.content,
          characterCount: chunk.characterCount,
          pageNumber: chunk.pageNumber || null,
        })),
        pagination,
      };
    } catch (error) {
      logger.error(`Failed to get document chunks: ${error}`);
      throw error;
    }
  }

  /**
   * Delete chunks for a document (used during processing cleanup)
   */
  async deleteDocumentChunks(documentId: string): Promise<number> {
    try {
      const result = await Chunk.deleteMany({ documentId });
      logger.debug(`Deleted ${result.deletedCount} chunks for document ${documentId}`);
      return result.deletedCount || 0;
    } catch (error) {
      logger.error(`Failed to delete document chunks: ${error}`);
      throw error;
    }
  }
}
