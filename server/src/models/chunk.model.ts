import mongoose, { Document as MongooseDocument, Schema } from 'mongoose';

export interface IChunk extends MongooseDocument {
  documentId: string;
  userId: string;
  chunkIndex: number;
  content: string;
  pageNumber?: number;
  characterCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const chunkSchema = new Schema<IChunk>(
  {
    documentId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    chunkIndex: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    pageNumber: {
      type: Number,
      default: null,
    },
    characterCount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Composite indexes for common queries
chunkSchema.index({ documentId: 1, chunkIndex: 1 });
chunkSchema.index({ userId: 1, documentId: 1 });

// Ensure timestamps are always Date objects
chunkSchema.pre('save', function (next) {
  if (!(this.createdAt instanceof Date)) {
    this.createdAt = new Date();
  }
  if (!(this.updatedAt instanceof Date)) {
    this.updatedAt = new Date();
  }
  next();
});

export const Chunk = mongoose.model<IChunk>('Chunk', chunkSchema);
