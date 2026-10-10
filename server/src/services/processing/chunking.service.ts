/**
 * Text chunking service
 * Splits text into configurable chunks with overlap
 *
 * IMPORTANT: Chunk size is measured in CHARACTERS, not tokens
 */

export interface ChunkingConfig {
  chunkSize: number;
  overlap: number;
}

export interface TextChunk {
  index: number;
  content: string;
  startChar: number;
  endChar: number;
  characterCount: number;
  pageNumber?: number;
}

export class ChunkingService {
  private static readonly DEFAULT_CHUNK_SIZE = 1000; // characters
  private static readonly DEFAULT_OVERLAP = 200; // characters
  private static readonly MAX_CHUNK_SIZE = 50000; // prevent excessive memory usage
  private static readonly MIN_CHUNK_SIZE = 100;

  /**
   * Split text into chunks
   * Chunk size is measured in CHARACTERS, not tokens
   *
   * @param text - The text to chunk
   * @param config - Chunking configuration
   * @returns Array of text chunks with metadata
   */
  static chunk(text: string, config?: Partial<ChunkingConfig>): TextChunk[] {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return [];
    }

    // Validate and apply configuration
    const { chunkSize, overlap } = this.validateConfig(config);

    // If text is smaller than chunk size, return as single chunk
    if (text.length <= chunkSize) {
      return [
        {
          index: 0,
          content: text,
          startChar: 0,
          endChar: text.length,
          characterCount: text.length,
        },
      ];
    }

    const chunks: TextChunk[] = [];
    let currentIndex = 0;
    let chunkIndex = 0;

    while (currentIndex < text.length) {
      // Calculate chunk end position
      let chunkEnd = currentIndex + chunkSize;

      // Don't exceed text length
      if (chunkEnd > text.length) {
        chunkEnd = text.length;
      } else {
        // Try to break at word boundary if not at end of text
        chunkEnd = this.findWordBoundary(text, chunkEnd);
      }

      // Extract chunk
      const content = text.substring(currentIndex, chunkEnd).trim();

      if (content.length > 0) {
        chunks.push({
          index: chunkIndex,
          content,
          startChar: currentIndex,
          endChar: chunkEnd,
          characterCount: content.length,
        });

        chunkIndex++;
      }

      // Move forward with overlap
      currentIndex = chunkEnd - overlap;

      // Ensure we always make progress
      if (currentIndex <= chunks[chunkIndex - 2]?.endChar ?? 0) {
        currentIndex = (chunks[chunkIndex - 2]?.endChar ?? 0) + 1;
      }
    }

    return chunks;
  }

  /**
   * Find a word boundary near the given position
   * Prevents splitting words in the middle
   */
  private static findWordBoundary(text: string, position: number): number {
    // Look backward for a space/newline within reason (100 chars)
    const searchStart = Math.max(0, position - 100);
    const searchEnd = position;

    for (let i = searchEnd; i >= searchStart; i--) {
      const char = text[i];
      if (char === ' ' || char === '\n' || char === '\t') {
        return i;
      }
    }

    // If no boundary found, just return position
    return position;
  }

  /**
   * Validate and normalize chunking configuration
   */
  private static validateConfig(config?: Partial<ChunkingConfig>): ChunkingConfig {
    let chunkSize = config?.chunkSize ?? this.DEFAULT_CHUNK_SIZE;
    let overlap = config?.overlap ?? this.DEFAULT_OVERLAP;

    // Validate chunk size
    if (chunkSize < this.MIN_CHUNK_SIZE) {
      chunkSize = this.MIN_CHUNK_SIZE;
    }
    if (chunkSize > this.MAX_CHUNK_SIZE) {
      chunkSize = this.MAX_CHUNK_SIZE;
    }

    // Validate overlap
    if (overlap < 0) {
      overlap = 0;
    }
    if (overlap >= chunkSize) {
      // Overlap should be less than chunk size
      overlap = Math.floor(chunkSize / 4);
    }

    return { chunkSize, overlap };
  }

  /**
   * Get default configuration
   */
  static getDefaultConfig(): ChunkingConfig {
    return {
      chunkSize: this.DEFAULT_CHUNK_SIZE,
      overlap: this.DEFAULT_OVERLAP,
    };
  }

  /**
   * Get configuration limits
   */
  static getConfigLimits() {
    return {
      minChunkSize: this.MIN_CHUNK_SIZE,
      maxChunkSize: this.MAX_CHUNK_SIZE,
      defaultChunkSize: this.DEFAULT_CHUNK_SIZE,
      defaultOverlap: this.DEFAULT_OVERLAP,
    };
  }
}
