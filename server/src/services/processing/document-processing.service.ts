import { LocalStorageService } from '../storage/local-storage.service';
import { Document, IDocument } from '../../models/document.model';
import { Chunk } from '../../models/chunk.model';
import { PdfExtractionService } from './pdf-extraction.service';
import { DocxExtractionService } from './docx-extraction.service';
import { TxtExtractionService } from './txt-extraction.service';
import { IExtractionService } from './extraction.service';
import { TextCleaningService } from './text-cleaning.service';
import { ChunkingService, ChunkingConfig } from './chunking.service';
import { logger } from '../../utils/logger';

/**
 * Main document processing service
 * Orchestrates the complete processing pipeline:
 * 1. Extract text from document
 * 2. Clean extracted text
 * 3. Split into chunks
 * 4. Save chunks to database
 * 5. Update document status and metadata
 */
export class DocumentProcessingService {
  private extractionServices: IExtractionService[] = [
    new PdfExtractionService(),
    new DocxExtractionService(),
    new TxtExtractionService(),
  ];

  private storageService: LocalStorageService;
  private chunkingConfig: ChunkingConfig;

  constructor(storageService: LocalStorageService, chunkingConfig?: Partial<ChunkingConfig>) {
    this.storageService = storageService;
    this.chunkingConfig = {
      chunkSize: chunkingConfig?.chunkSize ?? 1000,
      overlap: chunkingConfig?.overlap ?? 200,
    };
  }

  /**
   * Process a document: extract, clean, chunk, and save
   */
  async processDocument(documentId: string): Promise<void> {
    try {
      // 1. Get document from database
      const doc = await Document.findById(documentId);
      if (!doc) {
        throw new Error('Document not found');
      }

      // 2. Mark as processing
      doc.status = 'PROCESSING';
      doc.processingStartedAt = new Date();
      doc.processingError = undefined;
      await doc.save();

      logger.info(`Started processing document: ${documentId}`);

      // 3. Read file from storage
      const fileBuffer = await this.storageService.getBuffer(doc.storagePath);
      if (!fileBuffer) {
        throw new Error('File not found in storage');
      }

      // 4. Extract text
      const extraction = await this.extractText(fileBuffer, doc.originalName, doc.mimeType, doc.extension);

      // 5. Clean text
      const cleanedText = TextCleaningService.clean(extraction.text);

      if (TextCleaningService.isEmpty(cleanedText)) {
        throw new Error('Extracted text is empty after cleaning');
      }

      // 6. Split into chunks
      const chunks = ChunkingService.chunk(cleanedText, this.chunkingConfig);

      if (chunks.length === 0) {
        throw new Error('No chunks generated from document');
      }

      // 7. Save chunks to database
      const savedChunks = await this.saveChunks(doc.userId, documentId, chunks);

      // 8. Update document with metadata
      doc.status = 'READY';
      doc.processingCompletedAt = new Date();
      doc.pageCount = extraction.pageCount;
      doc.extractedCharacterCount = TextCleaningService.getCharacterCount(cleanedText);
      doc.chunkCount = savedChunks.length;
      doc.processingError = undefined;

      await doc.save();

      logger.info(`Successfully processed document: ${documentId} (${chunks.length} chunks, ${doc.extractedCharacterCount} characters)`);
    } catch (error) {
      logger.error(`Processing failed for document ${documentId}: ${error}`);

      // Mark document as failed and save error message
      try {
        const doc = await Document.findById(documentId);
        if (doc) {
          doc.status = 'FAILED';
          doc.processingCompletedAt = new Date();
          doc.processingError = error instanceof Error ? error.message : String(error);

          // Clean up any partially saved chunks
          await Chunk.deleteMany({ documentId });

          await doc.save();
        }
      } catch (saveError) {
        logger.error(`Failed to update document error status: ${saveError}`);
      }

      throw error;
    }
  }

  /**
   * Extract text from document using appropriate service
   */
  private async extractText(
    buffer: Buffer,
    filename: string,
    mimetype: string,
    extension: string
  ): Promise<{ text: string; pageCount: number }> {
    // Find appropriate extraction service
    const extractionService = this.extractionServices.find((service) => service.canHandle(mimetype, extension));

    if (!extractionService) {
      throw new Error(`No extraction service available for file type: ${mimetype}`);
    }

    // Extract text
    const result = await extractionService.extract(buffer, filename);

    // Check if extraction was successful
    if (!result.text || result.text.trim().length === 0) {
      throw new Error('Failed to extract text from document (may be scanned image)');
    }

    return {
      text: result.text,
      pageCount: result.pageCount || 1,
    };
  }

  /**
   * Save chunks to database
   */
  private async saveChunks(userId: string, documentId: string, chunks: any[]): Promise<any[]> {
    try {
      // Delete existing chunks for this document (in case of retry)
      await Chunk.deleteMany({ documentId });

      // Prepare chunk documents
      const chunkDocs = chunks.map((chunk) => ({
        documentId,
        userId,
        chunkIndex: chunk.index,
        content: chunk.content,
        pageNumber: chunk.pageNumber,
        characterCount: chunk.characterCount,
      }));

      // Insert all chunks
      const savedChunks = await Chunk.insertMany(chunkDocs);

      logger.info(`Saved ${savedChunks.length} chunks for document ${documentId}`);

      return savedChunks;
    } catch (error) {
      logger.error(`Failed to save chunks: ${error}`);
      throw new Error(`Failed to save document chunks: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get extraction service capabilities
   */
  getExtractionCapabilities() {
    return {
      supportedFormats: ['PDF', 'TXT', 'DOCX'],
      services: this.extractionServices.map((s) => s.constructor.name),
      chunkingLimits: ChunkingService.getConfigLimits(),
    };
  }
}
