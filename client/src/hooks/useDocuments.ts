import { useState, useCallback } from 'react';
import { documentAPI } from '../services/api';

export interface Document {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  status: 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED';
  pageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessingStatus {
  id: string;
  status: 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED';
  processingStartedAt: string | null;
  processingCompletedAt: string | null;
  processingError: string | null;
  pageCount: number;
  extractedCharacterCount: number;
  chunkCount: number;
}

export interface DocumentChunk {
  id: string;
  index: number;
  content: string;
  characterCount: number;
  pageNumber: number | null;
}

export interface ListDocumentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const useUploadDocument = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadDocument = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate file before upload
      if (!file) {
        throw new Error('No file selected');
      }

      const response = await documentAPI.uploadDocument(file);
      return response;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || 'Failed to upload document';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { uploadDocument, isLoading, error };
};

export const useListDocuments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listDocuments = useCallback(async (params?: ListDocumentsParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await documentAPI.listDocuments(params);
      return response;
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Failed to load documents';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { listDocuments, isLoading, error };
};

export const useGetDocument = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDocument = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await documentAPI.getDocument(id);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to load document';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getDocument, isLoading, error };
};

export const useRenameDocument = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const renameDocument = useCallback(async (id: string, name: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await documentAPI.renameDocument(id, name);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to rename document';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { renameDocument, isLoading, error };
};

export const useDeleteDocument = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteDocument = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await documentAPI.deleteDocument(id);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete document';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { deleteDocument, isLoading, error };
};

export const useDownloadDocument = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadDocument = useCallback(async (id: string, filename: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await documentAPI.downloadDocument(id);

      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to download document';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { downloadDocument, isLoading, error };
};

// Phase 4: Document Processing
export const useGetProcessingStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProcessingStatus = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await documentAPI.getProcessingStatus(id);
      return response;
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Failed to get processing status';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getProcessingStatus, isLoading, error };
};

export const useGetDocumentChunks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDocumentChunks = useCallback(
    async (id: string, params?: { page?: number; limit?: number }) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await documentAPI.getDocumentChunks(id, params);
        return response;
      } catch (err: any) {
        const message =
          err.response?.data?.message || 'Failed to get document chunks';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { getDocumentChunks, isLoading, error };
};

export const useRetryProcessing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const retryProcessing = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await documentAPI.retryProcessing(id);
      return response;
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Failed to retry processing';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { retryProcessing, isLoading, error };
};
