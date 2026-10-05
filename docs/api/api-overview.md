# API Overview — DocuMind AI

**Phase 1: Foundation & Architecture**

---

## Base URL

```
Development: http://localhost:5000/api
Production: https://api.documind-ai.com/api
```

---

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

## API Endpoints

### Phase 1 (Current)

#### Health Check

**Endpoint:** `GET /api/health`

**Description:** Verify API is running

**Request:**
```bash
curl http://localhost:5000/api/health
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "DocuMind AI API is running"
}
```

---

### Phase 2 (Planned)

#### Authentication

```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
POST   /api/auth/logout            # User logout
POST   /api/auth/refresh           # Refresh tokens
GET    /api/auth/me                # Get current user
POST   /api/auth/forgot-password   # Password reset request
POST   /api/auth/reset-password    # Reset password with token
```

#### User Management

```
GET    /api/users/:id              # Get user profile
PATCH  /api/users/:id              # Update user profile
DELETE /api/users/:id              # Delete user account
```

---

### Phase 3 (Planned)

#### Document Management

```
GET    /api/documents              # List user documents
POST   /api/documents/upload       # Upload document
GET    /api/documents/:id          # Get document details
PATCH  /api/documents/:id          # Update document
DELETE /api/documents/:id          # Delete document
GET    /api/documents/:id/chunks   # Get document chunks
```

#### Embeddings

```
POST   /api/embeddings/generate    # Generate embeddings for document
GET    /api/embeddings/:documentId # Get embeddings for document
```

---

### Phase 4 (Planned)

#### Chat & RAG

```
POST   /api/chat/query             # Ask question about document
GET    /api/chat/history           # Get chat history
DELETE /api/chat/conversation/:id  # Delete conversation
POST   /api/search                 # Multi-document search
```

---

### Phase 5+ (Planned)

#### Analytics & Summaries

```
GET    /api/documents/:id/summary  # Generate document summary
POST   /api/documents/compare      # Compare documents
GET    /api/analytics/usage        # Get usage analytics
```

---

## Authentication (Phase 2+)

### JWT Bearer Token

Include in request headers:

```http
Authorization: Bearer <access_token>
```

### Token Refresh

Access tokens expire in 15 minutes. Use refresh token to get new access token:

```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "..."
}
```

---

## Error Handling

### Standard Error Responses

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Email is invalid"
}
```

**Unauthorized (401):**
```json
{
  "success": false,
  "message": "Unauthorized",
  "error": "Token expired or invalid"
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "Document not found",
  "error": "Document with ID xyz does not exist"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "An unexpected error occurred"
}
```

---

## Rate Limiting (Phase 2+)

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1633024800
```

---

## Pagination (Phase 2+)

### Query Parameters

```
GET /api/documents?page=1&limit=20&sort=-createdAt
```

### Response Format

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

---

## Filtering (Phase 2+)

### Query Parameters

```
GET /api/documents?status=active&createdAfter=2024-01-01
```

---

## Sorting (Phase 2+)

### Query Parameters

```
GET /api/documents?sort=name           # Ascending
GET /api/documents?sort=-createdAt     # Descending
```

---

## Request/Response Examples

### Example 1: Health Check

**Request:**
```bash
curl -X GET http://localhost:5000/api/health
```

**Response:**
```json
{
  "success": true,
  "message": "DocuMind AI API is running"
}
```

### Example 2: Login (Phase 2+)

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

### Example 3: Upload Document (Phase 2+)

**Request:**
```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@document.pdf" \
  -F "title=My Document"
```

**Response:**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "id": "doc-id",
    "name": "My Document",
    "fileType": "application/pdf",
    "fileSize": 102400,
    "uploadedAt": "2024-10-04T10:30:00Z"
  }
}
```

### Example 4: Query Document (Phase 4+)

**Request:**
```bash
curl -X POST http://localhost:5000/api/chat/query \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "documentId": "doc-id",
    "query": "What are the main points?"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Query processed",
  "data": {
    "answer": "The main points are...",
    "citations": [
      {
        "documentId": "doc-id",
        "page": 3,
        "text": "Relevant excerpt..."
      }
    ]
  }
}
```

---

## SDK Integration

### TypeScript/JavaScript

```typescript
import apiClient from '@documind-ai/client';

// Health check
const health = await apiClient.get('/health');

// Login (Phase 2+)
const { data } = await apiClient.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123',
});

// Query document (Phase 4+)
const response = await apiClient.post('/chat/query', {
  documentId: 'doc-id',
  query: 'What is this about?',
});
```

---

## API Versioning (Phase 2+)

Current version: `v1` (implicit in base URL)

Future versions might be:
```
/api/v1/health     # Current
/api/v2/health     # Future
```

---

## CORS Policy

**Allowed Origins:** Configured in environment
```
CORS_ORIGIN=http://localhost:5173
```

**Allowed Methods:** GET, POST, PATCH, DELETE, OPTIONS

**Allowed Headers:** Content-Type, Authorization

---

## Development Notes

- All endpoints use JSON for request/response bodies
- Timestamps are in ISO 8601 format
- IDs are MongoDB ObjectIds (24-char hex strings)
- File uploads use multipart/form-data
- All requests/responses logged for debugging

---

## Testing Endpoints

### Using cURL

```bash
# Health check
curl http://localhost:5000/api/health

# With headers
curl -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  http://localhost:5000/api/health
```

### Using Postman

1. Import collection from `/docs/postman-collection.json` (future)
2. Set environment variables
3. Test endpoints

### Using Thunder Client (VS Code)

1. Create requests in Thunder Client
2. Test against localhost:5000
3. Verify responses

---

**Last Updated:** October 4, 2026  
**Current Phase:** 1 (Foundation & Architecture)  
**Next Phase:** 2 (Authentication & User Management)
