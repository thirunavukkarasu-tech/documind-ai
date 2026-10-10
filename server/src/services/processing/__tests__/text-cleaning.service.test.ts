import { TextCleaningService } from '../text-cleaning.service';

describe('TextCleaningService', () => {
  describe('clean()', () => {
    it('should normalize line endings from CRLF to LF', () => {
      const input = 'Hello\r\nWorld';
      const result = TextCleaningService.clean(input);
      expect(result).toBe('Hello\nWorld');
    });

    it('should remove carriage returns', () => {
      const input = 'Hello\rWorld';
      const result = TextCleaningService.clean(input);
      expect(result).toBe('HelloWorld');
    });

    it('should replace multiple spaces with single space', () => {
      const input = 'Hello    World';
      const result = TextCleaningService.clean(input);
      expect(result).toBe('Hello World');
    });

    it('should replace tabs with space', () => {
      const input = 'Hello\tWorld';
      const result = TextCleaningService.clean(input);
      expect(result).toBe('Hello World');
    });

    it('should normalize multiple newlines to max 2', () => {
      const input = 'Hello\n\n\n\nWorld';
      const result = TextCleaningService.clean(input);
      expect(result).toBe('Hello\n\nWorld');
    });

    it('should trim leading/trailing whitespace', () => {
      const input = '  Hello World  ';
      const result = TextCleaningService.clean(input);
      expect(result).toBe('Hello World');
    });

    it('should handle complex text with mixed issues', () => {
      const input = '  Hello\r\n\n   World  \t  Test  ';
      const result = TextCleaningService.clean(input);
      expect(result).toBe('Hello\n\nWorld Test');
    });

    it('should return empty string for null/undefined', () => {
      expect(TextCleaningService.clean(null as any)).toBe('');
      expect(TextCleaningService.clean(undefined as any)).toBe('');
    });
  });

  describe('isEmpty()', () => {
    it('should return true for empty string', () => {
      expect(TextCleaningService.isEmpty('')).toBe(true);
    });

    it('should return true for whitespace-only string', () => {
      expect(TextCleaningService.isEmpty('   \n  \t  ')).toBe(true);
    });

    it('should return true for null/undefined', () => {
      expect(TextCleaningService.isEmpty(null as any)).toBe(true);
      expect(TextCleaningService.isEmpty(undefined as any)).toBe(true);
    });

    it('should return false for non-empty string', () => {
      expect(TextCleaningService.isEmpty('Hello')).toBe(false);
    });
  });

  describe('getCharacterCount()', () => {
    it('should return correct character count', () => {
      expect(TextCleaningService.getCharacterCount('Hello')).toBe(5);
    });

    it('should include spaces in count', () => {
      expect(TextCleaningService.getCharacterCount('Hello World')).toBe(11);
    });

    it('should return 0 for empty string', () => {
      expect(TextCleaningService.getCharacterCount('')).toBe(0);
    });

    it('should return 0 for null/undefined', () => {
      expect(TextCleaningService.getCharacterCount(null as any)).toBe(0);
      expect(TextCleaningService.getCharacterCount(undefined as any)).toBe(0);
    });
  });
});
