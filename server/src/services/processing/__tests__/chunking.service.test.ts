import { ChunkingService, TextChunk } from '../chunking.service';

describe('ChunkingService', () => {
  const sampleText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(20);

  describe('chunk()', () => {
    it('should split text into chunks with default config', () => {
      const chunks = ChunkingService.chunk(sampleText);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks[0].index).toBe(0);
      expect(chunks[0].content.length).toBeLessThanOrEqual(1100); // chunk size + some margin
    });

    it('should apply custom chunk size', () => {
      const chunks = ChunkingService.chunk(sampleText, { chunkSize: 500, overlap: 100 });
      expect(chunks.length).toBeGreaterThan(1);
      // Most chunks should be close to 500 characters
      chunks.forEach((chunk) => {
        expect(chunk.content.length).toBeLessThanOrEqual(510);
      });
    });

    it('should return single chunk for text smaller than chunk size', () => {
      const shortText = 'Hello World';
      const chunks = ChunkingService.chunk(shortText);
      expect(chunks.length).toBe(1);
      expect(chunks[0].content).toBe(shortText);
    });

    it('should return empty array for empty text', () => {
      expect(ChunkingService.chunk('')).toEqual([]);
      expect(ChunkingService.chunk('   ')).toEqual([]);
    });

    it('should preserve chunk metadata', () => {
      const chunks = ChunkingService.chunk(sampleText, { chunkSize: 500, overlap: 100 });
      chunks.forEach((chunk, idx) => {
        expect(chunk.index).toBe(idx);
        expect(chunk.characterCount).toBe(chunk.content.length);
        expect(chunk.startChar).toBeGreaterThanOrEqual(0);
        expect(chunk.endChar).toBeGreaterThan(chunk.startChar);
      });
    });

    it('should try to break at word boundaries', () => {
      const chunks = ChunkingService.chunk(sampleText, { chunkSize: 500, overlap: 50 });
      chunks.forEach((chunk) => {
        // Chunks should not end with partial words (heuristic check)
        expect(chunk.content).not.toMatch(/\S\s*$/);
      });
    });

    it('should handle overlap correctly', () => {
      const chunks = ChunkingService.chunk(sampleText, { chunkSize: 200, overlap: 50 });
      if (chunks.length > 1) {
        // There should be some overlap between consecutive chunks
        const chunk1End = chunks[0].endChar;
        const chunk2Start = chunks[1].startChar;
        expect(chunk1End).toBeGreaterThan(chunk2Start);
      }
    });
  });

  describe('configuration validation', () => {
    it('should enforce minimum chunk size', () => {
      const chunks = ChunkingService.chunk(sampleText, { chunkSize: 10, overlap: 5 });
      expect(chunks.length).toBeGreaterThan(0);
      // All chunks should be at least MIN_CHUNK_SIZE
      chunks.forEach((chunk) => {
        expect(chunk.content.length).toBeGreaterThanOrEqual(100);
      });
    });

    it('should enforce maximum chunk size', () => {
      const chunks = ChunkingService.chunk(sampleText, { chunkSize: 100000, overlap: 5000 });
      expect(chunks.length).toBeGreaterThan(0);
      // No chunk should exceed MAX_CHUNK_SIZE
      chunks.forEach((chunk) => {
        expect(chunk.content.length).toBeLessThanOrEqual(50000);
      });
    });

    it('should handle overlap >= chunk size gracefully', () => {
      const chunks = ChunkingService.chunk(sampleText, { chunkSize: 200, overlap: 300 });
      expect(chunks.length).toBeGreaterThan(0);
      // Should still produce valid chunks
      chunks.forEach((chunk) => {
        expect(chunk.content.length).toBeGreaterThan(0);
      });
    });

    it('should handle negative overlap by setting to 0', () => {
      const chunks = ChunkingService.chunk(sampleText, { chunkSize: 200, overlap: -50 });
      expect(chunks.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('should handle null text', () => {
      expect(ChunkingService.chunk(null as any)).toEqual([]);
    });

    it('should handle undefined text', () => {
      expect(ChunkingService.chunk(undefined as any)).toEqual([]);
    });

    it('should handle text with only whitespace', () => {
      expect(ChunkingService.chunk('   \n   \t   ')).toEqual([]);
    });

    it('should not produce infinite loops', () => {
      // Very long text with very small config
      const longText = 'x'.repeat(10000);
      const chunks = ChunkingService.chunk(longText, { chunkSize: 50, overlap: 10 });
      expect(chunks.length).toBeLessThan(500); // Reasonable upper bound
    });
  });

  describe('getDefaultConfig()', () => {
    it('should return sensible defaults', () => {
      const config = ChunkingService.getDefaultConfig();
      expect(config.chunkSize).toBe(1000);
      expect(config.overlap).toBe(200);
      expect(config.overlap).toBeLessThan(config.chunkSize);
    });
  });

  describe('getConfigLimits()', () => {
    it('should return configuration limits', () => {
      const limits = ChunkingService.getConfigLimits();
      expect(limits.minChunkSize).toBe(100);
      expect(limits.maxChunkSize).toBe(50000);
      expect(limits.defaultChunkSize).toBe(1000);
      expect(limits.defaultOverlap).toBe(200);
    });
  });
});
