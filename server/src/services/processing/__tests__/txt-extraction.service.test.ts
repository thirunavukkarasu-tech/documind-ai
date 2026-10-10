import { TxtExtractionService } from '../txt-extraction.service';

describe('TxtExtractionService', () => {
  const service = new TxtExtractionService();

  describe('canHandle()', () => {
    it('should handle text/plain MIME type', () => {
      expect(service.canHandle('text/plain', '.txt')).toBe(true);
    });

    it('should handle .txt extension', () => {
      expect(service.canHandle('text/plain', '.txt')).toBe(true);
    });

    it('should not handle other MIME types', () => {
      expect(service.canHandle('application/pdf', '.txt')).toBe(true);
      expect(service.canHandle('application/json', '.json')).toBe(false);
    });

    it('should handle extension with or without dot', () => {
      expect(service.canHandle('text/plain', 'txt')).toBe(true);
      expect(service.canHandle('text/plain', '.txt')).toBe(true);
    });

    it('should handle case-insensitive extension', () => {
      expect(service.canHandle('text/plain', '.TXT')).toBe(true);
      expect(service.canHandle('text/plain', '.Txt')).toBe(true);
    });
  });

  describe('extract()', () => {
    it('should extract text from valid TXT file', async () => {
      const buffer = Buffer.from('Hello World');
      const result = await service.extract(buffer, 'test.txt');

      expect(result.text).toBe('Hello World');
      expect(result.pageCount).toBe(1);
      expect(result.pages).toBeDefined();
      expect(result.pages?.[0].pageNumber).toBe(1);
      expect(result.pages?.[0].text).toBe('Hello World');
    });

    it('should handle multi-line text', async () => {
      const text = 'Line 1\nLine 2\nLine 3';
      const buffer = Buffer.from(text);
      const result = await service.extract(buffer, 'test.txt');

      expect(result.text).toBe(text);
      expect(result.pageCount).toBe(1);
    });

    it('should handle UTF-8 encoded text', async () => {
      const text = 'Hello 世界 مرحبا мир';
      const buffer = Buffer.from(text, 'utf-8');
      const result = await service.extract(buffer, 'test.txt');

      expect(result.text).toContain('世界');
      expect(result.text).toContain('مرحبا');
      expect(result.text).toContain('мир');
    });

    it('should trim whitespace from extracted text', async () => {
      const buffer = Buffer.from('  Hello World  \n\n');
      const result = await service.extract(buffer, 'test.txt');

      expect(result.text).toBe('Hello World');
    });

    it('should throw error for empty file', async () => {
      const buffer = Buffer.from('');

      await expect(service.extract(buffer, 'empty.txt')).rejects.toThrow('no extractable text');
    });

    it('should throw error for whitespace-only file', async () => {
      const buffer = Buffer.from('   \n  \t  ');

      await expect(service.extract(buffer, 'whitespace.txt')).rejects.toThrow('no extractable text');
    });

    it('should handle large text files', async () => {
      const text = 'Hello World '.repeat(10000);
      const buffer = Buffer.from(text);
      const result = await service.extract(buffer, 'large.txt');

      expect(result.text.length).toBeGreaterThan(100000);
      expect(result.pageCount).toBe(1);
    });
  });
});
