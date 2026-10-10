/**
 * Base extraction service interface
 * Defines contract for file format-specific extraction implementations
 */

export interface ExtractionResult {
  text: string;
  pageCount: number;
  pages?: Array<{
    pageNumber: number;
    text: string;
  }>;
}

export interface IExtractionService {
  canHandle(mimetype: string, extension: string): boolean;
  extract(buffer: Buffer, filename: string): Promise<ExtractionResult>;
}
