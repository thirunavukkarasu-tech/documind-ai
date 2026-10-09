import mongoose, { Document as MongooseDocument, Schema } from 'mongoose';

export type DocumentStatus = 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED';

export interface IDocument extends MongooseDocument {
  userId: string;
  originalName: string;
  storedName: string;
  storagePath: string;
  mimeType: string;
  extension: string;
  size: number;
  status: DocumentStatus;
  pageCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    storedName: {
      type: String,
      required: true,
    },
    storagePath: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    extension: {
      type: String,
      required: true,
      lowercase: true,
    },
    size: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['UPLOADED', 'PROCESSING', 'READY', 'FAILED'],
      default: 'UPLOADED',
      index: true,
    },
    pageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Composite indexes for common queries
documentSchema.index({ userId: 1, createdAt: -1 });
documentSchema.index({ userId: 1, status: 1 });
documentSchema.index({ userId: 1, originalName: 'text' });

// Ensure timestamps are always Date objects
documentSchema.pre('save', function (next) {
  if (!(this.createdAt instanceof Date)) {
    this.createdAt = new Date();
  }
  if (!(this.updatedAt instanceof Date)) {
    this.updatedAt = new Date();
  }
  next();
});

export const Document = mongoose.model<IDocument>('Document', documentSchema);
