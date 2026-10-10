import { IExtractionService, ExtractionResult } from './extraction.service';
import { logger } from '../../utils/logger';

export class PdfExtractionService implements IExtractionService {
  canHandle(mimetype: string, extension: string): boolean {
    return (
      mimetype === 'application/pdf' ||
      extension.toLowerCase() === '.pdf'
    );
  }

  async extract(buffer: Buffer, filename: string): Promise<ExtractionResult> {
    try {
      // Try to use pdf-parse library if available
      let pdfParse;
      try {
        pdfParse = (await import('pdf-parse')).default;
      } catch {
        // Fallback: try pdfjs-dist
        logger.warn('pdf-parse not available, attempting fallback extraction');
        return this.extractWithPdfjsDist(buffer, filename);
      }

      const pdfData = await pdfParse(buffer);

      // Check if PDF has extractable text
      if (!pdfData.text || pdfData.text.trim().length === 0) {
        throw new Error('PDF contains no extractable text (may be a scanned image)');
      }

      logger.info(`Extracted text from PDF file: ${filename} (${pdfData.numpages} pages)`);

      return {
        text: pdfData.text,
        pageCount: pdfData.numpages,
      };
    } catch (error) {
      logger.error(`PDF extraction failed for ${filename}: ${error}`);
      throw new Error(`Failed to extract text from PDF file: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Fallback extraction using pdfjs-dist
   * More basic but available without extra dependencies
   */
  private async extractWithPdfjsDist(buffer: Buffer, filename: string): Promise<ExtractionResult> {
    try {
      // Dynamic import to avoid hard dependency
      const pdfjsLib = await import('pdfjs-dist');
      const pdfjs = pdfjsLib.default || pdfjsLib;

      // Set up the worker
      const workerSrc = (await import('pdfjs-dist/build/pdf.worker.mjs')).default;
      pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

      const pdf = await pdfjs.getDocument({ data: buffer }).promise;

      let fullText = '';
      const pages: Array<{ pageNumber: number; text: string }> = [];

      // Extract text from each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .filter((item: any) => item.str !== undefined)
          .map((item: any) => item.str)
          .join(' ');

        if (pageText.trim()) {
          fullText += pageText + '\n';
          pages.push({
            pageNumber: i,
            text: pageText,
          });
        }
      }

      if (!fullText || fullText.trim().length === 0) {
        throw new Error('PDF contains no extractable text (may be a scanned image)');
      }

      logger.info(`Extracted text from PDF file using pdfjs-dist: ${filename} (${pdf.numPages} pages)`);

      return {
        text: fullText,
        pageCount: pdf.numPages,
        pages,
      };
    } catch (error) {
      logger.error(`PDF extraction with pdfjs-dist failed for ${filename}: ${error}`);
      throw new Error(`Failed to extract text from PDF file: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
