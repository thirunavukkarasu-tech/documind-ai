# System Architecture — DocuMind AI

**Phase 1: Foundation & Architecture**

---

## Overview

DocuMind AI is architected as a modern, scalable monorepo with clear separation of concerns between frontend, backend, and infrastructure layers.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
│              React + Vite + TypeScript + Tailwind               │
│                    (Port 5173, Development)                     │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ HTTPS/REST API
                      │
┌─────────────────────v───────────────────────────────────────────┐
│                         API Layer                               │
│                  Express.js + TypeScript                        │
│         (Port 5000, Development - Docker in Production)         │
└─────────────────────┬───────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ↓             ↓             ↓
    ┌─────────┐  ┌──────────┐  ┌──────────────┐
    │ MongoDB │  │  Qdrant  │  │ Ollama (LLM) │
    │  (v6.0) │  │  (Future)│  │  (Future)    │
    └─────────┘  └──────────┘  └──────────────┘
```

---

## Layer Breakdown

### 1. Client Layer (Frontend)

**Technology:** React 18 + Vite + TypeScript + Tailwind CSS

**Responsibilities:**
- User interface rendering
- Client-side routing
- API communication
- State management (TanStack Query)
- Form validation
- User interactions

**Key Folders:**
```
client/src/
├── pages/          # Page components (HomePage, NotFound, etc.)
├── components/     # Reusable UI components (future)
├── layouts/        # Layout wrappers (future)
├── hooks/          # Custom React hooks (future)
├── services/       # API client and service layer
├── store/          # State management (future)
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
└── constants/      # Application constants
```

**Development Mode:**
- Runs on `http://localhost:5173`
- Vite HMR enabled for instant reload
- TypeScript strict mode enabled
- ESLint configuration for code quality

---

### 2. API Layer (Backend)

**Technology:** Express.js + TypeScript + Node.js

**Responsibilities:**
- HTTP request handling
- Business logic execution
- Database operations
- Authentication/Authorization (Phase 2+)
- Document processing (Phase 2+)
- AI service coordination (Phase 3+)
- Error handling and logging

**Architecture Pattern:** MVC-like with clear separation:

```
server/src/
├── config/         # Configuration (DB, environment)
├── controllers/    # Request handlers
├── middleware/     # Express middleware
├── routes/         # API routes
├── services/       # Business logic (future)
├── models/         # Mongoose schemas (future)
├── utils/          # Utilities (logger, response)
├── types/          # TypeScript definitions
└── constants/      # Constants
```

**Middleware Stack:**
1. **Helmet** — Security headers
2. **CORS** — Cross-origin configuration
3. **Morgan** — Request logging
4. **JSON Parser** — Request body parsing
5. **Custom Middleware** — Auth, validation (future)
6. **Error Handler** — Global error handling

**Development Mode:**
- Runs on `http://localhost:5000`
- Hot reload with ts-node
- TypeScript strict mode enabled
- Request logging enabled

---

### 3. Data Layer

#### MongoDB (Phase 1+)
**Role:** Primary application database

**Responsibilities:**
- User data storage (Phase 2+)
- Document metadata
- User sessions
- Application state

**Connection:**
- URI: `mongodb://root:password@localhost:27017/documind-ai`
- Provider: Docker Compose (development)
- ODM: Mongoose

**Models (Planned):**
```
User
├── id (ObjectId)
├── email (String, unique)
├── password (String, hashed)
├── name (String)
├── createdAt (Date)
└── updatedAt (Date)

Document
├── id (ObjectId)
├── userId (ObjectId)
├── name (String)
├── fileType (String)
├── fileSize (Number)
├── content (String, processed text)
├── uploadedAt (Date)
└── updatedAt (Date)

Chunk (Phase 2+)
├── id (ObjectId)
├── documentId (ObjectId)
├── content (String)
├── pageNumber (Number)
├── chunkIndex (Number)
└── embeddingId (String)
```

#### Qdrant (Phase 2+)
**Role:** Vector database for semantic search

**Responsibilities:**
- Store document embeddings
- Similarity search
- Vector indexing
- Fast retrieval

**Future Integration:**
```typescript
// Example (Phase 3+)
const similarChunks = await qdrantClient.search('collection-name', {
  vector: queryEmbedding,
  limit: 5,
});
```

#### Ollama (Phase 3+)
**Role:** Local LLM provider

**Responsibilities:**
- Generate embeddings
- Provide chat responses
- Support RAG queries

**Future Integration:**
```typescript
// Example (Phase 3+)
const embedding = await ollama.embed('text', query);
const response = await ollama.chat({
  model: 'mistral',
  messages: context,
});
```

---

## Data Flow

### Phase 1: Foundation (Current)

```
User Browser
    ↓
React App (Vite)
    ↓
HTTP Request to Express
    ↓
Express Router
    ↓
Controller Logic
    ↓
Response (JSON)
    ↓
React State Update
    ↓
UI Render
```

### Phase 2+: With Authentication

```
Login Form
    ↓
POST /api/auth/login
    ↓
Controller validates credentials
    ↓
Generate JWT tokens
    ↓
Return tokens + user data
    ↓
Store in localStorage/sessionStorage
    ↓
Include token in subsequent requests
```

### Phase 3+: With RAG

```
User Query
    ↓
POST /api/chat/query
    ↓
Generate query embedding (Ollama)
    ↓
Search vectors in Qdrant
    ↓
Retrieve relevant chunks from MongoDB
    ↓
Build context with chunks
    ↓
Send to LLM with RAG prompt
    ↓
Stream response with citations
    ↓
Return to user
```

---

## Security Architecture

### Phase 1
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Input validation (Zod, Phase 2+)
- ✅ Environment variable protection
- ✅ No secrets in code

### Phase 2+
- 🔜 JWT authentication
- 🔜 Password hashing (bcrypt)
- 🔜 Rate limiting
- 🔜 Request validation middleware
- 🔜 Authorization checks

### Phase 3+
- 🔜 API key management
- 🔜 Audit logging
- 🔜 Data encryption
- 🔜 HTTPS enforcement

---

## Error Handling

### Express Error Middleware

```typescript
// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error:', err);
  sendError(res, err.message, err, 500);
});
```

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Client Error Handling (Phase 2+)
- Axios interceptors
- Error boundary components
- Toast notifications
- User-friendly messages

---

## Logging Strategy

### Backend Logging
- **Morgan** — HTTP request logging
- **Custom Logger** — Application events
- **Log Levels:** debug, info, warn, error
- **Output:** Console (development), files (production)

### Frontend Logging (Phase 2+)
- Console for development
- Error tracking service (e.g., Sentry)
- Performance monitoring

---

## Configuration Management

### Environment-Based Configuration
```typescript
// config/environment.ts
const env = EnvSchema.safeParse(process.env);

export const getEnvironment = (): Environment => {
  if (!result.success) {
    console.error('Invalid environment variables');
    process.exit(1);
  }
  return result.data;
};
```

### Environment Variables
```
NODE_ENV              → Execution environment
PORT                  → Express port
CLIENT_URL            → Frontend URL
MONGODB_URI           → Database connection
JWT_ACCESS_SECRET     → (Phase 2+) Auth token secret
OLLAMA_BASE_URL       → (Phase 3+) LLM server
QDRANT_URL            → (Phase 3+) Vector DB
```

---

## Deployment Architecture (Future)

### Production Deployment
```
Internet
    ↓
CDN (Static Assets)
    ↓
Load Balancer
    ↓
┌──────────────────┐
│ Kubernetes Cluster
│ ├── Frontend Pod(s)
│ ├── Backend Pod(s)
│ └── Worker Pod(s)
└──────────────────┘
    ↓
┌──────────────────┐
│ Data Layer
│ ├── MongoDB Cluster
│ ├── Qdrant Cluster
│ └── Redis Cache
└──────────────────┘
```

---

## Scalability Considerations

### Horizontal Scaling (Multiple Instances)
- Express API is stateless → Easy horizontal scaling
- JWT for distributed authentication
- MongoDB for shared data layer
- Qdrant for distributed vector search

### Vertical Scaling (Larger Instances)
- Optimize query performance
- Index MongoDB collections
- Cache frequently accessed data
- Optimize embedding generation

### Caching Strategy (Future)
- Redis for session/token cache
- TanStack Query for client-side caching
- Browser caching for static assets
- API response caching

---

## Testing Architecture (Future)

```
Unit Tests
├── Controllers
├── Services
├── Utilities
└── Components

Integration Tests
├── API endpoints
├── Database operations
└── External services

E2E Tests
├── User workflows
├── Authentication flows
└── Document processing
```

---

## Monitoring & Observability (Future)

### Metrics to Track
- API response times
- Error rates
- Database query performance
- Vector search latency
- User activity

### Monitoring Tools (Planned)
- Prometheus for metrics
- Grafana for visualization
- ELK stack for log aggregation
- Sentry for error tracking

---

## Development Workflow

### Local Development
1. Clone repository
2. Install dependencies: `npm install`
3. Start Docker: `npm run docker-up`
4. Start dev servers: `npm run dev`
5. Access frontend: `http://localhost:5173`
6. Access backend: `http://localhost:5000`

### Code Quality
- TypeScript strict mode
- ESLint for linting
- Prettier for formatting (future)
- Pre-commit hooks (future)

### Version Control
- Semantic versioning
- Feature branches for new work
- Pull request reviews
- Meaningful commit messages

---

**Last Updated:** October 4, 2026  
**Current Phase:** 1 (Foundation & Architecture)
