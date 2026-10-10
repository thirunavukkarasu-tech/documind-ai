import { IExtractionService, ExtractionResult } from './extraction.service';
import { logger } from '../../utils/logger';
import { createReadStream } from 'fs';
import { Readable } from 'stream';

export class DocxExtractionService implements IExtractionService {
  canHandle(mimetype: string, extension: string): boolean {
    return (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      extension.toLowerCase() === '.docx'
    );
  }

  async extract(buffer: Buffer, filename: string): Promise<ExtractionResult> {
    try {
      // Try to use mammoth library if available
      let mammoth;
      try {
        mammoth = (await import('mammoth')).default;
      } catch {
        // Fallback: manual XML extraction
        return this.extractManual(buffer, filename);
      }

      // Use mammoth for extraction
      const result = await mammoth.extractRawText({ buffer });

      if (!result.value || result.value.trim().length === 0) {
        throw new Error('File contains no extractable text');
      }

      logger.info(`Extracted text from DOCX file using mammoth: ${filename}`);

      return {
        text: result.value,
        pageCount: 1, // DOCX doesn't have clear page boundaries like PDF
        pages: [
          {
            pageNumber: 1,
            text: result.value,
          },
        ],
      };
    } catch (error) {
      logger.error(`DOCX extraction failed for ${filename}: ${error}`);
      throw new Error(`Failed to extract text from DOCX file: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Fallback manual extraction from DOCX XML structure
   * DOCX files are ZIP archives containing XML files
   */
  private async extractManual(buffer: Buffer, filename: string): Promise<ExtractionResult> {
    try {
      // Try to extract text from DOCX ZIP structure manually
      let unzipper;
      try {
        unzipper = (await import('unzipper')).default;
      } catch {
        throw new Error('Mammoth library required for DOCX extraction. Install with: npm install mammoth');
      }

      const directory = await unzipper.Open.buffer(buffer);

      // Find and extract from document.xml
      let documentXml = '';
      for (const file of directory.files) {
        if (file.path === 'word/document.xml') {
          documentXml = await file.buffer().then((buf: Buffer) => buf.toString('utf-8'));
          break;
        }
      }

      if (!documentXml) {
        throw new Error('Could not find document.xml in DOCX file');
      }

      // Extract text from XML (simple regex-based approach)
      const textMatches = documentXml.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
      const text = textMatches.map((match) => match.replace(/<w:t[^>]*>|<\/w:t>/g, '')).join('');

      if (!text || text.trim().length === 0) {
        throw new Error('File contains no extractable text');
      }

      logger.info(`Extracted text from DOCX file manually: ${filename}`);

      return {
        text,
        pageCount: 1,
        pages: [
          {
            pageNumber: 1,
            text,
          },
        ],
      };
    } catch (error) {
      logger.error(`Manual DOCX extraction failed for ${filename}: ${error}`);
      throw new Error(`Failed to extract text from DOCX file: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
