import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth.context';
import { useLogout } from '../hooks/useAuth';
import { useListDocuments, ListDocumentsParams } from '../hooks/useDocuments';
import DocumentList from '../components/DocumentList';
import UploadModal from '../components/UploadModal';

const Documents: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { logoutUser, isLoading: isLoggingOut } = useLogout();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { listDocuments, isLoading, error } = useListDocuments();
  const [documents, setDocuments] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);

  // Load documents on mount and when filters change
  useEffect(() => {
    loadDocuments();
  }, [page, limit, search, status, type, sortBy, sortOrder]);

  const loadDocuments = async () => {
    try {
      const params: ListDocumentsParams = {
        page,
        limit,
        search: search || undefined,
        status: status || undefined,
        type: type || undefined,
        sortBy: sortBy as any,
        sortOrder,
      };

      const response = await listDocuments(params);
      setDocuments(response.documents);
      setPagination(response.pagination);
    } catch {
      // Error is handled by the hook
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container-max py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">DocuMind AI</h1>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="btn-primary"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container-max py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Documents</h2>
              <p className="text-gray-600 mt-1">Welcome, {user?.firstName}!</p>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="btn-primary"
            >
              📤 Upload Document
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search Input */}
            <div>
              <label className="form-label">Search Documents</label>
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="form-input"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="form-label">Status</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="form-input"
              >
                <option value="">All Statuses</option>
                <option value="UPLOADED">Uploaded</option>
                <option value="PROCESSING">Processing</option>
                <option value="READY">Ready</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="form-label">File Type</label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setPage(1);
                }}
                className="form-input"
              >
                <option value="">All Types</option>
                <option value="pdf">PDF</option>
                <option value="txt">TXT</option>
                <option value="docx">DOCX</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="form-label">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-input"
              >
                <option value="createdAt">Date Created</option>
                <option value="originalName">Name</option>
                <option value="size">File Size</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(search || status || type) && (
            <button
              onClick={() => {
                setSearch('');
                setStatus('');
                setType('');
                setPage(1);
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 mb-6 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Document List */}
        <div className="card">
          <DocumentList
            documents={documents}
            isLoading={isLoading}
            onRefresh={loadDocuments}
          />
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1 || isLoading}
              className="btn-secondary"
            >
              Previous
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                disabled={isLoading}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  p === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
              disabled={page === pagination.totalPages || isLoading}
              className="btn-secondary"
            >
              Next
            </button>

            <div className="ml-4 text-gray-600 text-sm">
              Showing {documents.length} of {pagination.total} documents
            </div>
          </div>
        )}

        {/* Items Per Page */}
        {documents.length > 0 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <label className="text-sm text-gray-600">Items per page:</label>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
                setPage(1);
              }}
              className="px-2 py-1 rounded border border-gray-300"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        )}
      </main>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={loadDocuments}
      />
    </div>
  );
};

export default Documents;
