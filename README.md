# DocuMind AI

An AI-powered document intelligence platform for intelligent document processing, analysis, and management.

## Project Status

**Phase 2: Authentication & User Management** ✅ Complete

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

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **MongoDB** - Primary database
- **Qdrant** - Vector database (prepared for Phase 3+)

## Project Structure

```
documind-ai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/       # React Context for state management
│   │   │   └── auth.context.tsx
│   │   ├── hooks/          # Custom React hooks
│   │   │   └── useAuth.ts
│   │   ├── pages/          # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Dashboard.tsx
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
│   │   │   └── auth.controller.ts
│   │   ├── middleware/     # Express middleware
│   │   │   └── auth.middleware.ts
│   │   ├── models/         # Mongoose schemas
│   │   │   └── user.model.ts
│   │   ├── routes/         # API routes
│   │   │   └── auth.routes.ts
│   │   ├── services/       # Business logic
│   │   │   └── auth.service.ts
│   │   ├── types/          # TypeScript types
│   │   │   ├── auth.types.ts
│   │   │   └── index.ts
│   │   ├── utils/          # Utility functions
│   │   │   ├── jwt.ts
│   │   │   ├── password.ts
│   │   │   ├── logger.ts
│   │   │   └── response.ts
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

**Phase 3: Document Processing & AI Integration**
- Document upload and storage
- PDF/Document parsing
- OCR and text extraction
- AI-powered document analysis
- Vector embeddings with Qdrant
- Search and retrieval

**Phase 4: Advanced Features**
- Document collaboration
- Real-time updates
- Advanced analytics
- Custom document workflows
- Integration with external services

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
