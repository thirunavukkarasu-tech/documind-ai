# 📄 DocuMind AI

**AI-powered Document Intelligence Platform with RAG Capabilities**

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Core Features (Planned)](#core-features-planned)
- [Technology Stack](#technology-stack)
- [Architecture Overview](#architecture-overview)
- [Current Development Phase](#current-development-phase)
- [Local Development Setup](#local-development-setup)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Future Phases](#future-phases)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Project Overview

**DocuMind AI** is a production-grade AI document intelligence platform designed to help users extract insights from documents using advanced natural language processing and retrieval-augmented generation (RAG) techniques.

The platform enables organizations to:
- Upload and process PDF, DOCX, and TXT documents
- Extract and chunk document content intelligently
- Generate vector embeddings for semantic search
- Ask natural language questions about documents
- Retrieve relevant content with AI-powered answers
- Compare documents and generate summaries
- Search across multiple documents with RAG

---

## 🔍 Problem Statement

Many organizations struggle with:
1. **Information Overload** — Managing large document repositories
2. **Search Limitations** — Keyword-only search doesn't capture meaning
3. **Manual Extraction** — Time-consuming extraction and summarization
4. **Lack of Context** — Limited ability to ask questions across documents
5. **Citation Challenges** — Difficulty tracking document sources for answers

DocuMind AI solves these problems by combining modern AI with vector search to provide intelligent document analysis and retrieval.

---

## ✨ Core Features (Planned)

### Phase 2+: Authentication & User Management
- User registration and login
- JWT-based authentication
- User session management

### Phase 2+: Document Processing
- PDF, DOCX, TXT file upload
- Text extraction from documents
- Intelligent document chunking
- Document metadata storage

### Phase 3+: AI & Embeddings
- Vector embedding generation
- Semantic document search
- Qdrant vector database integration
- Embedding storage and retrieval

### Phase 4+: RAG & Chat
- Retrieval-augmented generation (RAG)
- Document-aware AI chat
- Citation tracking
- Context-aware responses

### Phase 5+: Advanced Analytics
- Document summarization
- Document comparison
- Cross-document search
- Analytics and insights

---

## 🛠️ Technology Stack

### Frontend
- **React 18** — UI library
- **Vite** — Build tool & dev server
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **React Router** — Client-side routing
- **TanStack Query** — Data fetching & caching
- **Axios** — HTTP client

### Backend
- **Node.js** — Runtime
- **Express.js** — Web framework
- **TypeScript** — Type safety
- **Zod** — Schema validation
- **Mongoose** — MongoDB ODM
- **Helmet** — Security headers
- **Morgan** — Request logging
- **CORS** — Cross-origin resource sharing

### Database & Infrastructure
- **MongoDB** — Primary database
- **Qdrant** — Vector database (Phase 2+)
- **Ollama** — Local LLM provider (Phase 3+)
- **Docker** — Containerization
- **Docker Compose** — Local development orchestration

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                          │
│         (Vite, TypeScript, Tailwind, React Router)         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                Node.js Express Backend                      │
│        (TypeScript, Zod, Helmet, Morgan, CORS)             │
└────────┬──────────────┬──────────────────┬──────────────────┘
         │              │                  │
         ↓              ↓                  ↓
    ┌─────────┐    ┌──────────┐    ┌────────────────┐
    │ MongoDB │    │  Qdrant  │    │ Ollama (LLM)   │
    │(Phase 1)│    │(Phase 2+)│    │  (Phase 3+)    │
    └─────────┘    └──────────┘    └────────────────┘

Application Services:
├── Authentication (Phase 2+)
├── Document Processing (Phase 2+)
├── Document Storage (Phase 1)
├── Embedding Generation (Phase 3+)
├── Vector Search (Phase 3+)
├── RAG Service (Phase 4+)
└── Analytics (Phase 5+)
```

---

## 🚀 Current Development Phase

### **Phase 1 — Project Foundation & Architecture** ✅

**Status:** In Development

This phase focuses on creating a clean, scalable monorepo foundation with:
- ✅ Monorepo structure (client/server/docs)
- ✅ React + Vite + TypeScript frontend setup
- ✅ Express + TypeScript backend setup
- ✅ MongoDB configuration (future phases)
- ✅ Docker development environment
- ✅ TypeScript strict mode
- ✅ Professional documentation
- ✅ Health check endpoint
- ✅ Error handling middleware
- ✅ Environment configuration
- ✅ CORS & security setup

**What's NOT included in Phase 1:**
- ❌ Authentication/JWT
- ❌ User management
- ❌ File upload
- ❌ Document processing
- ❌ Embeddings
- ❌ Vector search
- ❌ Ollama integration
- ❌ Qdrant integration
- ❌ RAG functionality
- ❌ AI chat

---

## 📦 Local Development Setup

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** & **Docker Compose** (for containerized development)
- **MongoDB** (running via Docker Compose or locally)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/documind-ai.git
   cd documind-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

   This installs dependencies for both client and server using npm workspaces.

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration values.

4. **Start MongoDB (using Docker)**
   ```bash
   npm run docker-up
   ```

   This starts MongoDB and Qdrant (for future use) using Docker Compose.

5. **Start development servers**
   ```bash
   npm run dev
   ```

   This starts both frontend and backend in development mode.

   - **Frontend:** http://localhost:5173
   - **Backend API:** http://localhost:5000

---

## 🌍 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Application
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://root:password@localhost:27017/documind-ai?authSource=admin

# Logging
LOG_LEVEL=info

# CORS
CORS_ORIGIN=http://localhost:5173

# Future phases
JWT_ACCESS_SECRET=your_secret_here
OLLAMA_BASE_URL=http://localhost:11434
QDRANT_URL=http://localhost:6333
```

**⚠️ IMPORTANT:** Never commit `.env` with real secrets. Use `.env.example` as a template.

---

## 📜 Available Scripts

### Root Level

```bash
# Start both client and server in parallel
npm run dev

# Start only frontend
npm run client

# Start only backend
npm run server

# Build both projects
npm run build

# Run linters
npm run lint

# Type check all projects
npm run type-check

# Start Docker containers
npm run docker-up

# Stop Docker containers
npm run docker-down
```

### Client Only

```bash
cd client

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run type-check
```

### Server Only

```bash
cd server

# Development server (with hot reload)
npm run dev

# Compile TypeScript
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Type check
npm run type-check
```

---

## 📁 Project Structure

```
documind-ai/
│
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Page components
│   │   ├── layouts/                 # Layout components
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── services/                # API services
│   │   ├── store/                   # State management
│   │   ├── utils/                   # Utility functions
│   │   ├── types/                   # TypeScript types
│   │   ├── constants/               # Application constants
│   │   ├── App.tsx                  # Root component
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Global styles
│   │
│   ├── public/                      # Static assets
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .eslintrc.cjs
│
├── server/                          # Express backend
│   ├── src/
│   │   ├── config/                  # Configuration files
│   │   ├── controllers/             # Request handlers
│   │   ├── middleware/              # Express middleware
│   │   ├── models/                  # Mongoose models
│   │   ├── routes/                  # API routes
│   │   ├── services/                # Business logic
│   │   ├── utils/                   # Utility functions
│   │   ├── types/                   # TypeScript types
│   │   ├── constants/               # Application constants
│   │   ├── app.ts                   # Express app
│   │   └── server.ts                # Entry point
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── .eslintrc.cjs
│
├── docs/                            # Documentation
│   ├── architecture/
│   │   └── system-architecture.md
│   ├── api/
│   │   └── api-overview.md
│   └── decisions/
│       └── technology-decisions.md
│
├── docker-compose.yml               # Docker setup
├── .env.example                     # Environment template
├── .gitignore
├── package.json                     # Root workspace config
└── README.md                        # This file
```

---

## 🔮 Future Phases

### Phase 2 — Authentication & User Management
- User registration/login system
- JWT token management
- User profiles
- Secure session handling

### Phase 3 — Document Processing & Embeddings
- Document upload (PDF/DOCX/TXT)
- Text extraction
- Smart chunking
- Vector embedding generation
- Qdrant integration

### Phase 4 — RAG & Intelligent Search
- Retrieval-augmented generation
- Document-aware chat
- Citation tracking
- Context-aware responses
- Ollama LLM integration

### Phase 5 — Advanced Features
- Document summarization
- Document comparison
- Multi-document search
- Analytics & insights
- Export capabilities

### Phase 6+ — Enterprise Features
- Team collaboration
- Document sharing
- Advanced permissions
- Audit logging
- API for third-party integration

---

## 🤝 Contributing

This is a portfolio project demonstrating professional MERN development practices.

### Code Standards
- **TypeScript Strict Mode** — All code must pass strict type checking
- **ESLint** — Follow project linting rules
- **Prettier** — Format code consistently
- **No Unused Dependencies** — Clean dependency management
- **Clean Architecture** — Modular, maintainable code
- **Comprehensive Documentation** — Self-documenting code and comments

### Commit Guidelines
- Use descriptive commit messages
- Reference the phase and feature being worked on
- Example: `feat(phase-2): add user authentication`

---

## 📄 License

MIT License — See LICENSE file for details

---

## 📞 Support

For questions or issues:
1. Check the documentation in `/docs`
2. Review the architecture overview
3. Check existing issues
4. Create a new issue with detailed information

---

## 🙏 Acknowledgments

Built with modern web development best practices and professional-grade architecture patterns.

---

**Last Updated:** October 4, 2026  
**Current Phase:** 1 (Foundation & Architecture)  
**Status:** 🚀 In Development
