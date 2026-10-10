import { IExtractionService, ExtractionResult } from './extraction.service';
import { logger } from '../../utils/logger';

export class TxtExtractionService implements IExtractionService {
  canHandle(mimetype: string, extension: string): boolean {
    return (
      mimetype === 'text/plain' ||
      extension.toLowerCase() === '.txt'
    );
  }

  async extract(buffer: Buffer, filename: string): Promise<ExtractionResult> {
    try {
      // Decode UTF-8 text from buffer
      const text = buffer.toString('utf-8');

      if (!text || text.trim().length === 0) {
        throw new Error('File contains no extractable text');
      }

      logger.info(`Extracted text from TXT file: ${filename}`);

      return {
        text,
        pageCount: 1, // TXT files are single "page"
        pages: [
          {
            pageNumber: 1,
            text,
          },
        ],
      };
    } catch (error) {
      logger.error(`TXT extraction failed for ${filename}: ${error}`);
      throw new Error(`Failed to extract text from TXT file: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
