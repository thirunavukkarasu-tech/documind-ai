# DocuMind AI

An AI-powered document intelligence platform for intelligent document processing, analysis, and management.

## Project Status

**Phase 2: Authentication & User Management** ✅ Complete
**Phase 3: Document Upload & Management** ✅ Complete

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool with HMR
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client with interceptors
- **React Router** - Client-side routing
- **React Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT (JSON Web Tokens)** - Authentication
- **bcryptjs** - Password hashing
- **Zod** - Runtime schema validation
- **Multer** - File upload handling (Phase 3)

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **MongoDB** - Primary database
- **Qdrant** - Vector database (prepared for Phase 4+)

## Project Structure

```
documind-ai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── DocumentList.tsx    # Phase 3
│   │   │   └── UploadModal.tsx     # Phase 3
│   │   ├── contexts/       # React Context for state management
│   │   │   └── auth.context.tsx
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   └── useDocuments.ts     # Phase 3
│   │   ├── pages/          # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── Documents.tsx       # Phase 3
│   │   ├── services/       # API services
│   │   │   └── api.ts
│   │   ├── App.tsx         # Main app component with routing
│   │   ├── main.tsx        # React entry point
│   │   └── index.css       # Tailwind styles
│   ├── index.html          # HTML entry point
│   ├── package.json        # Dependencies
│   ├── vite.config.ts      # Vite configuration
│   ├── tsconfig.json       # TypeScript configuration
│   ├── tailwind.config.js  # Tailwind configuration
│   └── eslint.config.cjs   # ESLint configuration
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # Configuration
│   │   │   ├── environment.ts
│   │   │   └── database.ts
│   │   ├── controllers/    # Route handlers
│   │   │   ├── auth.controller.ts
│   │   │   └── document.controller.ts     # Phase 3
│   │   ├── middleware/     # Express middleware
│   │   │   └── auth.middleware.ts
│   │   ├── models/         # Mongoose schemas
│   │   │   ├── user.model.ts
│   │   │   └── document.model.ts          # Phase 3
│   │   ├── routes/         # API routes
│   │   │   ├── auth.routes.ts
│   │   │   └── document.routes.ts         # Phase 3
│   │   ├── services/       # Business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── document.service.ts        # Phase 3
│   │   │   └── storage/                   # Phase 3
│   │   │       ├── storage.service.ts     # Phase 3 (interface)
│   │   │       └── local-storage.service.ts # Phase 3
│   │   ├── types/          # TypeScript types
│   │   │   ├── auth.types.ts
│   │   │   └── index.ts
│   │   ├── utils/          # Utility functions
│   │   │   ├── jwt.ts
│   │   │   ├── password.ts
│   │   │   ├── logger.ts
│   │   │   ├── response.ts
│   │   │   └── file-validation.ts        # Phase 3
│   │   ├── constants/      # Constants
│   │   │   └── index.ts
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── package.json        # Dependencies
│   ├── tsconfig.json       # TypeScript configuration
│   └── eslint.config.cjs   # ESLint configuration
│
├── docker-compose.yml      # Docker services configuration
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
└── README.md               # This file

```

## Phase 2: Authentication & User Management

### Features Implemented

#### Backend Authentication
- ✅ User registration with email and password
- ✅ User login with credentials validation
- ✅ JWT access token (15-minute expiry)
- ✅ Refresh token in httpOnly cookie (7-day expiry)
- ✅ Automatic token refresh on 401 responses
- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ Password strength validation (8+ chars, uppercase, lowercase, number)
- ✅ User profile retrieval (GET /auth/me)
- ✅ Logout functionality

#### Security Features
- ✅ httpOnly cookies for refresh tokens (prevents XSS attacks)
- ✅ Secure cookie configuration (sameSite: strict, secure in production)
- ✅ Bearer token authentication in Authorization header
- ✅ Role-based access control (USER/ADMIN)
- ✅ Generic error messages for failed login (no user enumeration)
- ✅ Helmet.js for security headers
- ✅ CORS configuration
- ✅ Input validation with Zod schema

#### Frontend Authentication
- ✅ Login page with email/password form
- ✅ Register page with validation
- ✅ Dashboard page (protected route)
- ✅ ProtectedRoute component for client-side route protection
- ✅ Authentication context for state management
- ✅ Axios interceptors for automatic token refresh
- ✅ Custom auth hooks (useLogin, useRegister, useLogout, useCurrentUser)
- ✅ Session persistence with sessionStorage
- ✅ Loading states and error handling

### API Endpoints

#### Authentication Routes (Base: `/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| POST | `/refresh` | Refresh access token | No |
| POST | `/logout` | Logout user | No |
| GET | `/me` | Get current user profile | Yes |

#### Request/Response Examples

**POST /auth/register**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

Response (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "USER",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**POST /auth/login**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "USER",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**GET /auth/me** (with Authorization header)
```
Headers: Authorization: Bearer <accessToken>
```

Response (200):
```json
{
  "success": true,
  "message": "User profile retrieved",
  "data": {
    "user": {
      "id": "user123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "USER",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

## Phase 3: Document Upload & Management

### Features Implemented

#### Backend Document Management
- ✅ Document upload (PDF, TXT, DOCX files)
- ✅ File validation (MIME type + extension verification)
- ✅ Safe file storage with path traversal protection
- ✅ User ownership enforcement (database-level)
- ✅ Document metadata storage (name, size, type, status, dates)
- ✅ Paginated document listing (max 100 items/page)
- ✅ MongoDB text search by document name
- ✅ Filter by status (UPLOADED, PROCESSING, READY, FAILED)
- ✅ Filter by file type (PDF, TXT, DOCX)
- ✅ Sort by created date, name, or file size
- ✅ Document rename with validation
- ✅ Safe document deletion (file + database)
- ✅ Download with proper Content-Type and streaming

#### Storage Architecture
- ✅ Storage abstraction interface (supports local FS, S3, Cloudinary, etc.)
- ✅ Local filesystem implementation with userId-based organization
- ✅ Safe filename generation: `{userId}_{timestamp}.{extension}`
- ✅ Automatic directory creation per user
- ✅ Path traversal attack prevention

#### Frontend Document Management
- ✅ Documents page as main authenticated interface
- ✅ Drag-and-drop file upload modal
- ✅ File type validation before upload (PDF/TXT/DOCX, max 20MB)
- ✅ Document list with sortable table
- ✅ Inline rename with save/cancel
- ✅ Delete confirmation modal
- ✅ Download functionality with blob handling
- ✅ Search documents by name
- ✅ Filter by status and file type
- ✅ Sort by date, name, or size
- ✅ Pagination with previous/next/page numbers
- ✅ Items per page selector (10/25/50)
- ✅ Loading states and error handling
- ✅ Empty state messaging

#### Security Features
- ✅ User ownership validation at database level
- ✅ Path traversal protection with `path.resolve()`
- ✅ MIME type and file extension matching
- ✅ JWT authentication on all document endpoints
- ✅ File size limits (configurable, default 20MB)
- ✅ Safe filename generation with timestamps
- ✅ Database indexes for optimal query performance

### API Endpoints

#### Document Routes (Base: `/api/documents`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Upload document | Yes |
| GET | `/` | List documents (paginated) | Yes |
| GET | `/:id` | Get document details | Yes |
| PATCH | `/:id` | Rename document | Yes |
| DELETE | `/:id` | Delete document | Yes |
| GET | `/:id/download` | Download document file | Yes |

### Request/Response Examples

**POST /documents** (Upload)
```bash
curl -X POST http://localhost:5000/api/documents \
  -H "Authorization: Bearer TOKEN" \
  -F "file=@document.pdf"
```

Response (201):
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "id": "doc123",
    "originalName": "document.pdf",
    "storedName": "userId_1696679200000.pdf",
    "mimeType": "application/pdf",
    "size": 2048576,
    "status": "UPLOADED",
    "pageCount": 0,
    "createdAt": "2024-10-07T08:00:00Z",
    "updatedAt": "2024-10-07T08:00:00Z"
  }
}
```

**GET /documents** (List with filters)
```bash
curl -X GET 'http://localhost:5000/api/documents?page=1&limit=10&search=invoice&status=READY&sortBy=createdAt&sortOrder=desc' \
  -H "Authorization: Bearer TOKEN"
```

Response (200):
```json
{
  "success": true,
  "message": "Documents retrieved successfully",
  "data": {
    "documents": [
      {
        "id": "doc123",
        "originalName": "invoice.pdf",
        "mimeType": "application/pdf",
        "size": 2048576,
        "status": "READY",
        "pageCount": 15,
        "createdAt": "2024-10-07T08:00:00Z",
        "updatedAt": "2024-10-07T08:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "limit": 10,
      "total": 42,
      "totalPages": 5
    }
  }
}
```

**PATCH /documents/:id** (Rename)
```bash
curl -X PATCH http://localhost:5000/api/documents/doc123 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "invoice-2024.pdf"}'
```

Response (200):
```json
{
  "success": true,
  "message": "Document renamed successfully",
  "data": {
    "id": "doc123",
    "originalName": "invoice-2024.pdf",
    "mimeType": "application/pdf",
    "size": 2048576,
    "status": "READY",
    "pageCount": 15,
    "updatedAt": "2024-10-07T08:30:00Z"
  }
}
```

**DELETE /documents/:id**
```bash
curl -X DELETE http://localhost:5000/api/documents/doc123 \
  -H "Authorization: Bearer TOKEN"
```

Response (200):
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker & Docker Compose (for database)
- MongoDB (via Docker)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd documind-ai
```

2. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start MongoDB and Qdrant with Docker**
```bash
docker-compose up -d
```

### Backend Setup

1. **Navigate to server directory**
```bash
cd server
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

The backend will start on `http://localhost:5000`

4. **Health check**
```bash
curl http://localhost:5000/api/health
```

### Frontend Setup

1. **Navigate to client directory** (in a new terminal)
```bash
cd client
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### Accessing the Application

1. Open http://localhost:5173 in your browser
2. Click "Sign up" to register a new account
3. Fill in the registration form with valid credentials
4. Log in with your credentials
5. You'll be redirected to the dashboard

## Authentication Flow

### Registration Flow
```
User fills registration form
    ↓
Client validates password strength
    ↓
POST /auth/register
    ↓
Server validates input with Zod
    ↓
Server checks duplicate email
    ↓
Server hashes password with bcryptjs
    ↓
Server creates user in MongoDB
    ↓
Server generates JWT access token
    ↓
Server sets httpOnly refresh token cookie
    ↓
Server returns user + accessToken
    ↓
Client stores accessToken in sessionStorage
    ↓
Client sets auth context
    ↓
Redirect to dashboard
```

### Login Flow
```
User enters email/password
    ↓
POST /auth/login
    ↓
Server validates input
    ↓
Server finds user by email
    ↓
Server checks if user is active
    ↓
Server compares password with hash
    ↓
Server generates JWT token pair
    ↓
Server sets httpOnly refresh token cookie
    ↓
Server returns user + accessToken
    ↓
Client stores accessToken in sessionStorage
    ↓
Client sets auth context
    ↓
Redirect to dashboard
```

### Token Refresh Flow
```
Client makes API request with accessToken
    ↓
Server validates token
    ↓
If token expired (401):
    ↓
    Client reads refreshToken from cookie
    ↓
    POST /auth/refresh
    ↓
    Server verifies refreshToken
    ↓
    Server generates new accessToken
    ↓
    Server returns new accessToken
    ↓
    Client updates sessionStorage with new token
    ↓
    Client retries original request
    ↓
If refreshToken invalid:
    ↓
    Server clears cookie
    ↓
    Client clears sessionStorage
    ↓
    Client redirects to /login
```

## Testing Authentication

### Test Checklist

#### Registration Tests
- ✓ Register with valid credentials
- ✓ Register with duplicate email (should fail)
- ✓ Register with weak password (should fail)
- ✓ Register with missing required fields (should fail)
- ✓ Verify user created in MongoDB with USER role
- ✓ Verify password is hashed (not plain text)

#### Login Tests
- ✓ Login with valid credentials
- ✓ Login with invalid email (generic error message)
- ✓ Login with invalid password (generic error message)
- ✓ Login with unverified/inactive account
- ✓ Verify accessToken and refreshToken are returned

#### Token Tests
- ✓ Access protected route with valid token
- ✓ Access protected route with expired token (auto-refresh)
- ✓ Access protected route with invalid token (401 error)
- ✓ Token refresh with valid refreshToken
- ✓ Token refresh with invalid/expired refreshToken

#### Security Tests
- ✓ Verify refreshToken is httpOnly (not accessible from JavaScript)
- ✓ Verify password is never returned in API responses
- ✓ Verify generic error messages on login failure (no user enumeration)
- ✓ Verify CORS is properly configured

### Manual Testing with cURL

**Register User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

**Login User**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

**Access Protected Route**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <accessToken>" \
  -b cookies.txt
```

**Logout**
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
LOG_LEVEL=info

MONGODB_URI=mongodb://admin:password@localhost:27017/documind-ai?authSource=admin

JWT_ACCESS_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

CLIENT_URL=http://localhost:5173
```

## Development Commands

### Backend
```bash
cd server

# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npm run type-check
```

### Frontend
```bash
cd client

# Development server with HMR
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## MongoDB Connection

The application uses MongoDB with authentication. Connection details:
- **Host:** localhost
- **Port:** 27017
- **Database:** documind-ai
- **Username:** admin
- **Password:** password (change in production)

To connect to MongoDB directly:
```bash
mongosh "mongodb://admin:password@localhost:27017/documind-ai?authSource=admin"
```

## Security Best Practices Implemented

1. **Password Security**
   - Bcryptjs with 10 salt rounds
   - Password strength validation (8+ chars, uppercase, lowercase, number)
   - Passwords never stored or returned in API responses

2. **Token Security**
   - JWT access tokens with 15-minute expiry
   - Refresh tokens in httpOnly cookies (7-day expiry)
   - Automatic token rotation on refresh

3. **API Security**
   - CORS configured for frontend origin
   - Helmet.js security headers
   - Input validation with Zod
   - Generic error messages (no user enumeration)
   - Rate limiting ready (to be implemented)

4. **Frontend Security**
   - sessionStorage for access token (cleared on browser close)
   - httpOnly cookies for refresh token
   - Protected routes with ProtectedRoute component
   - Automatic redirect on token expiration

## Known Limitations

- Phase 2 focuses on authentication only
- No email verification implemented (Phase 3+)
- No password reset functionality (Phase 3+)
- No two-factor authentication (Phase 3+)
- No rate limiting on login attempts (Phase 3+)
- No session management UI (Phase 3+)

## Next Phases

**Phase 4: Document Processing & AI Integration**
- PDF/Document parsing
- OCR and text extraction
- Text chunking and preprocessing
- AI-powered document analysis
- Vector embeddings with Qdrant
- Semantic search and retrieval
- Q&A with RAG (Retrieval Augmented Generation)
- Document summarization

**Phase 5: Advanced Features**
- Document collaboration
- Real-time updates
- Advanced analytics
- Custom document workflows
- Integration with external services
- Export functionality (Markdown, PDF with highlights)

## Troubleshooting

### MongoDB Connection Error
```
Error: MongooseError: Cannot connect to MongoDB
```
**Solution:** Ensure Docker containers are running:
```bash
docker-compose up -d
docker-compose ps
```

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Ensure `CLIENT_URL` in `.env` matches your frontend URL (http://localhost:5173)

### Token Expiry Issues
```
401 Unauthorized
```
**Solution:** Check that:
1. Token is included in Authorization header
2. Token hasn't expired (15 min for access token)
3. Refresh token cookie is being sent with requests

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change the PORT in `.env` or kill the process using port 5000

## Contributing

Instructions for contributing to the project (to be added)

## License

MIT

## Support

For issues and questions, please open an issue on the repository.
