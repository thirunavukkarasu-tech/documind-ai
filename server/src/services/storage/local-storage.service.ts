import fs from 'fs';
import path from 'path';
import { createReadStream } from 'fs';
import { logger } from '../../utils/logger';
import { StorageService } from './storage.service';

export class LocalStorageService implements StorageService {
  private uploadDir: string;

  constructor(uploadDir: string = 'uploads') {
    this.uploadDir = uploadDir;
    this.ensureUploadDirExists();
  }

  private ensureUploadDirExists(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      logger.info(`Created upload directory: ${this.uploadDir}`);
    }
  }

  private ensureUserDirExists(userId: string): void {
    const userDir = path.join(this.uploadDir, userId);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
      logger.debug(`Created user directory: ${userDir}`);
    }
  }

  async save(userId: string, filename: string, fileBuffer: Buffer): Promise<string> {
    try {
      this.ensureUserDirExists(userId);

      const filepath = path.join(this.uploadDir, userId, filename);

      // Prevent path traversal attacks
      const resolvedPath = path.resolve(filepath);
      const uploadDirResolved = path.resolve(this.uploadDir);

      if (!resolvedPath.startsWith(uploadDirResolved)) {
        throw new Error('Invalid file path');
      }

      await fs.promises.writeFile(resolvedPath, fileBuffer);
      logger.debug(`File saved: ${filepath}`);

      return filepath;
    } catch (error) {
      logger.error(`Failed to save file: ${error}`);
      throw new Error('Failed to save file');
    }
  }

  async delete(filepath: string): Promise<void> {
    try {
      // Prevent path traversal attacks
      const resolvedPath = path.resolve(filepath);
      const uploadDirResolved = path.resolve(this.uploadDir);

      if (!resolvedPath.startsWith(uploadDirResolved)) {
        throw new Error('Invalid file path');
      }

      if (fs.existsSync(resolvedPath)) {
        await fs.promises.unlink(resolvedPath);
        logger.debug(`File deleted: ${filepath}`);
      } else {
        logger.warn(`File not found for deletion: ${filepath}`);
      }
    } catch (error) {
      logger.error(`Failed to delete file: ${error}`);
      throw new Error('Failed to delete file');
    }
  }

  async exists(filepath: string): Promise<boolean> {
    try {
      // Prevent path traversal attacks
      const resolvedPath = path.resolve(filepath);
      const uploadDirResolved = path.resolve(this.uploadDir);

      if (!resolvedPath.startsWith(uploadDirResolved)) {
        return false;
      }

      return fs.existsSync(resolvedPath);
    } catch (error) {
      logger.error(`Failed to check file existence: ${error}`);
      return false;
    }
  }

  getReadStream(filepath: string): NodeJS.ReadableStream {
    // Prevent path traversal attacks
    const resolvedPath = path.resolve(filepath);
    const uploadDirResolved = path.resolve(this.uploadDir);

    if (!resolvedPath.startsWith(uploadDirResolved)) {
      throw new Error('Invalid file path');
    }

    return createReadStream(resolvedPath);
  }

  async getBuffer(filepath: string): Promise<Buffer | null> {
    try {
      // Prevent path traversal attacks
      const resolvedPath = path.resolve(filepath);
      const uploadDirResolved = path.resolve(this.uploadDir);

      if (!resolvedPath.startsWith(uploadDirResolved)) {
        throw new Error('Invalid file path');
      }

      if (!fs.existsSync(resolvedPath)) {
        logger.warn(`File not found: ${filepath}`);
        return null;
      }

      const buffer = await fs.promises.readFile(resolvedPath);
      logger.debug(`File buffer read: ${filepath}`);
      return buffer;
    } catch (error) {
      logger.error(`Failed to read file buffer: ${error}`);
      throw new Error('Failed to read file');
    }
  }

  getFilePath(userId: string, filename: string): string {
    return path.join(this.uploadDir, userId, filename);
  }
}
