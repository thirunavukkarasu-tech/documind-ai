// Type definitions for the frontend
// These will be expanded in future phases

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Document {
  id: string;
  userId: string;
  name: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}
