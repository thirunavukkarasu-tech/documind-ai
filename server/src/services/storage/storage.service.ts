export interface StorageService {
  save(userId: string, filename: string, fileBuffer: Buffer): Promise<string>;
  delete(filepath: string): Promise<void>;
  exists(filepath: string): Promise<boolean>;
  getReadStream(filepath: string): NodeJS.ReadableStream;
  getBuffer(filepath: string): Promise<Buffer | null>;
  getFilePath(userId: string, filename: string): string;
}
