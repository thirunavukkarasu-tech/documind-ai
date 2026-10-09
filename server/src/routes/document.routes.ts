import { Router } from 'express';
import multer, { Multer } from 'multer';
import {
  uploadDocument,
  listDocuments,
  getDocument,
  renameDocument,
  deleteDocument,
  downloadDocument,
} from '../controllers/document.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store in memory for processing
const upload: Multer = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB max (will be validated in controller)
  },
});

// All document routes require authentication
router.use(requireAuth);

// Upload document
router.post('/', upload.single('file'), uploadDocument);

// List documents with pagination, search, filter
router.get('/', listDocuments);

// Get document details
router.get('/:id', getDocument);

// Rename document
router.patch('/:id', renameDocument);

// Delete document
router.delete('/:id', deleteDocument);

// Download document
router.get('/:id/download', downloadDocument);

export default router;
