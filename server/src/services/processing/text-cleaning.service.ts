/**
 * Text cleaning service
 * Normalizes extracted text while preserving meaningful content
 */

export class TextCleaningService {
  /**
   * Clean and normalize extracted text
   * - Normalizes line endings
   * - Removes excessive whitespace
   * - Preserves paragraph boundaries
   * - Handles empty content
   */
  static clean(text: string): string {
    if (!text || typeof text !== 'string') {
      return '';
    }

    let cleaned = text;

    // 1. Normalize line endings: CRLF → LF
    cleaned = cleaned.replace(/\r\n/g, '\n');

    // 2. Remove carriage returns
    cleaned = cleaned.replace(/\r/g, '\n');

    // 3. Replace multiple consecutive spaces with single space
    cleaned = cleaned.replace(/ {2,}/g, ' ');

    // 4. Replace tabs with space
    cleaned = cleaned.replace(/\t/g, ' ');

    // 5. Normalize multiple newlines (keep max 2 for paragraph breaks)
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

    // 6. Remove leading/trailing whitespace from each line
    cleaned = cleaned
      .split('\n')
      .map((line) => line.trim())
      .join('\n');

    // 7. Remove leading/trailing whitespace from entire text
    cleaned = cleaned.trim();

    return cleaned;
  }

  /**
   * Check if text is empty or too small for meaningful processing
   */
  static isEmpty(text: string): boolean {
    if (!text || typeof text !== 'string') {
      return true;
    }

    return text.trim().length === 0;
  }

  /**
   * Get character count of cleaned text
   */
  static getCharacterCount(text: string): number {
    if (!text || typeof text !== 'string') {
      return 0;
    }

    return text.length;
  }
}
