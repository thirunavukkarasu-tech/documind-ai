# Quick Start Guide - DocuMind AI Phase 3

## 🚀 Get Running in 5 Minutes

### 1. Start Services
```bash
# Terminal 1: Database
docker-compose up -d

# Terminal 2: Backend
cd server
npm install
npm run dev
# Backend running on http://localhost:5000

# Terminal 3: Frontend
cd client
npm install
npm run dev
# Frontend running on http://localhost:5173
```

### 2. Access Application
```
http://localhost:5173
```

### 3. Create Account
- Click "Sign up"
- Enter email and password (must contain: 8+ chars, uppercase, lowercase, number)
- Create account

### 4. Login
- Use your credentials
- Redirected to Documents page

### 5. Upload Document
- Click "📤 Upload Document"
- Drag file or click to browse
- Supports: PDF, TXT, DOCX (max 20MB)

---

## 📋 What You Can Do

### Upload
- Drag-and-drop or click upload
- PDF, TXT, DOCX files
- Auto-validates size and type

### Organize
- Search by document name
- Filter by status or type
- Sort by date, name, or size
- Paginate through documents

### Manage
- Rename documents
- Delete with confirmation
- Download for offline use
- View file details

### Secure
- Your documents are private
- Cannot access other users' docs
- Ownership enforced at database

---

## 🔧 Project Structure

```
server/                      # Backend (Node.js/Express)
├── src/
│   ├── controllers/         # HTTP handlers
│   ├── services/            # Business logic
│   ├── models/              # Database schemas
│   ├── routes/              # API endpoints
│   └── utils/               # Helpers
└── package.json

client/                      # Frontend (React/Vite)
├── src/
│   ├── pages/              # Page components
│   ├── components/         # UI components
│   ├── hooks/              # Custom hooks
│   ├── services/           # API client
│   └── contexts/           # State management
└── package.json
```

---

## 🔌 API Endpoints

All endpoints require JWT token in `Authorization: Bearer {token}` header.

### Documents API

```bash
# Upload document
POST /api/documents
  -F "file=@document.pdf"

# List documents (paginated, searchable)
GET /api/documents?page=1&limit=10&search=query&status=UPLOADED&type=pdf

# Get document details
GET /api/documents/{id}

# Rename document
PATCH /api/documents/{id}
  -d '{"name": "new_name.pdf"}'

# Delete document
DELETE /api/documents/{id}

# Download document
GET /api/documents/{id}/download
```

---

## 📊 Database Schema

### Document Model
```typescript
{
  _id: ObjectId
  userId: string              // Owner
  originalName: string        // Original filename
  storedName: string         // Safe filename (userId_timestamp.ext)
  storagePath: string        // Full path
  mimeType: string           // e.g., application/pdf
  extension: string          // e.g., .pdf
  size: number               // File size in bytes
  status: enum               // UPLOADED | PROCESSING | READY | FAILED
  pageCount: number          // For OCR results (Phase 4)
  createdAt: Date
  updatedAt: Date
}
```

### Indexes
- `userId` - Fast user lookups
- `{userId, createdAt: -1}` - Sort by date
- `{userId, status}` - Filter by status
- `{userId, originalName: text}` - Full-text search

---

## 🔐 Security Features

### ✅ Implemented
- User ownership at database level
- Path traversal protection
- MIME type + extension validation
- Safe filename generation (userId_timestamp.ext)
- File size limits (default 20MB)
- JWT authentication
- Password hashing with bcryptjs

### 🔒 Files Storage
```
uploads/
├── userId1/
│   ├── userId1_1696679200000.pdf
│   └── userId1_1696679201000.txt
└── userId2/
    └── userId2_1696679300000.docx
```

---

## 📝 Environment Variables

Create `.env` file:
```env
# Backend
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://admin:password@localhost:27017/documind-ai?authSource=admin
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CLIENT_URL=http://localhost:5173

# File upload (Phase 3)
MAX_FILE_SIZE_MB=20
UPLOAD_DIR=uploads
```

---

## 🧪 Testing

### Manual Test (cURL)
```bash
# 1. Login and get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Password123!"}' \
  | jq -r '.data.accessToken')

# 2. Upload document
curl -X POST http://localhost:5000/api/documents \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test.pdf"

# 3. List documents
curl -X GET http://localhost:5000/api/documents \
  -H "Authorization: Bearer $TOKEN"

# 4. Download document
curl -X GET http://localhost:5000/api/documents/{id}/download \
  -H "Authorization: Bearer $TOKEN" \
  -o downloaded.pdf
```

### Test Scenarios
See `PHASE-3-TESTING-GUIDE.md` for 28 test scenarios including:
- Authentication checks
- Upload functionality
- Search and filtering
- CRUD operations
- Edge cases

---

## 🚨 Troubleshooting

### MongoDB Connection Error
```bash
# Ensure MongoDB is running
docker-compose up -d
docker-compose ps  # Verify running
```

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### File Upload Issues
- Check file type (PDF, TXT, DOCX only)
- Check file size (max 20MB)
- Verify `uploads/` directory exists
- Check `UPLOAD_DIR` in `.env`

### Token Expiry
- Token auto-refreshes via interceptors
- Refresh token in httpOnly cookie
- If issues, re-login

---

## 📚 Documentation

- **PHASE-3-IMPLEMENTATION-REPORT.md** - Complete technical docs
- **PHASE-3-TESTING-GUIDE.md** - Test scenarios and examples
- **PHASE-3-FILES-SUMMARY.md** - File changes and stats
- **PHASE-3-COMPLETION-SUMMARY.md** - Project overview
- **README.md** - Full project documentation

---

## 🎯 Key Commands

### Backend
```bash
cd server

# Install dependencies
npm install

# Start dev server
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build
```

### Frontend
```bash
cd client

# Install dependencies
npm install

# Start dev server
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build
```

---

## 📈 What's Next (Phase 4)

Phase 4 will add:
- Document text extraction (OCR)
- Text chunking
- Vector embeddings (Qdrant)
- Semantic search
- Q&A with RAG
- Document summarization

**Current Status:** Documents are stored and ready for processing. Status field supports: UPLOADED → PROCESSING → READY → FAILED

---

## 💡 Feature Highlights

### Search
- Text search on filename
- Case-insensitive
- MongoDB text index

### Filter
- By status: UPLOADED, PROCESSING, READY, FAILED
- By type: PDF, TXT, DOCX

### Sort
- By date created (default)
- By filename
- By file size
- Ascending or descending

### Pagination
- 10, 25, or 50 items per page
- Previous/Next buttons
- Jump to page number
- Item count display

---

## 🔍 Example Workflows

### Upload and Search
1. Click "Upload Document"
2. Select PDF file
3. Wait for upload complete
4. Type filename in search
5. View in list

### Filter and Download
1. Use Status filter: "READY"
2. Use Type filter: "PDF"
3. Click ⬇️ to download
4. File saved to Downloads

### Rename and Delete
1. Click ✏️ to edit name
2. Type new name
3. Click Save
4. To delete: click 🗑️ → confirm

---

## 📞 Support

### Check Logs
- Backend: Terminal running `npm run dev`
- Frontend: Browser console (F12)

### Check Database
```bash
mongosh "mongodb://admin:password@localhost:27017/documind-ai?authSource=admin"
db.documents.find()
```

### Check Files
```bash
ls -la server/uploads/{userId}/
```

---

## 🎉 You're All Set!

Everything is ready to use. Start uploading documents and building on Phase 3!

**Questions?** Check the comprehensive documentation files in the project root.

---

**Last Updated:** October 7, 2026  
**Version:** Phase 3 - Complete  
**Status:** ✅ Production Ready
