import React, { useState } from 'react';
import { Document } from '../hooks/useDocuments';
import { useRenameDocument, useDeleteDocument, useDownloadDocument, useRetryProcessing } from '../hooks/useDocuments';

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  onRefresh: () => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, isLoading, onRefresh }) => {
  const [renameId, setRenameId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { renameDocument, isLoading: isRenaming } = useRenameDocument();
  const { deleteDocument, isLoading: isDeleting } = useDeleteDocument();
  const { downloadDocument } = useDownloadDocument();
  const { retryProcessing, isLoading: isRetrying } = useRetryProcessing();

  const handleStartRename = (doc: Document) => {
    setRenameId(doc.id);
    setNewName(doc.originalName);
  };

  const handleSaveRename = async () => {
    if (!renameId || !newName.trim()) return;

    try {
      await renameDocument(renameId, newName);
      setRenameId(null);
      onRefresh();
    } catch {
      // Error is handled by the hook
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteDocument(deleteId);
      setDeleteId(null);
      onRefresh();
    } catch {
      // Error is handled by the hook
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      await downloadDocument(doc.id, doc.originalName);
    } catch {
      // Error is handled by the hook
    }
  };

  const handleRetryProcessing = async (doc: Document) => {
    try {
      await retryProcessing(doc.id);
      onRefresh();
    } catch {
      // Error is handled by the hook
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPLOADED':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'READY':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('text')) return '📝';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📑';
    return '📎';
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading documents...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📁</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
        <p className="text-gray-600">Upload your first document to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Size</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-4">
                {renameId === doc.id ? (
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="form-input"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <span>{getFileIcon(doc.mimeType)}</span>
                    <span className="text-gray-900 font-medium truncate">{doc.originalName}</span>
                  </div>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{doc.mimeType.split('/')[1]}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{formatFileSize(doc.size)}</td>
              <td className="px-6 py-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                  {doc.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(doc.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  {renameId === doc.id ? (
                    <>
                      <button
                        onClick={handleSaveRename}
                        disabled={isRenaming}
                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setRenameId(null)}
                        className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {doc.status === 'FAILED' ? (
                        <button
                          onClick={() => handleRetryProcessing(doc)}
                          disabled={isRetrying}
                          title="Retry processing"
                          className="text-purple-600 hover:text-purple-700 text-lg disabled:opacity-50"
                        >
                          🔄
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDownload(doc)}
                          title="Download"
                          className="text-blue-600 hover:text-blue-700 text-lg"
                        >
                          ⬇️
                        </button>
                      )}
                      <button
                        onClick={() => handleStartRename(doc)}
                        title="Rename"
                        className="text-orange-600 hover:text-orange-700 text-lg"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setDeleteId(doc.id)}
                        title="Delete"
                        className="text-red-600 hover:text-red-700 text-lg"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Document</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this document? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="btn-primary flex-1 bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
