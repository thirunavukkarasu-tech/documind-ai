# Quick Start Guide — DocuMind AI

Get up and running with DocuMind AI in 5 minutes.

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker & Docker Compose** (for local development with databases)

## Installation

### 1. Clone & Install Dependencies
```bash
cd documind-ai
npm install
```

This installs dependencies for all workspaces (client + server).

### 2. Set Up Environment
```bash
# Copy the example to create .env
cp .env.example .env
```

The default values are pre-configured for local development.

### 3. Start Docker Services (Optional)
```bash
npm run docker-up
```

This starts MongoDB and Qdrant containers. Requires Docker to be running.

## Running the Application

### Option A: Run Both Frontend & Backend Together
```bash
npm run dev
```

Then access:
- **Frontend:** http://localhost:5173 (React app)
- **Backend:** http://localhost:5000 (API)

### Option B: Run Frontend Only
```bash
npm run client
```

Access: http://localhost:5173

### Option C: Run Backend Only
```bash
npm run server
```

Access: http://localhost:5000/api/health for health check

## Testing the Setup

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "DocuMind AI API is running"
}
```

### 2. Frontend
Open http://localhost:5173 in your browser. You should see the DocuMind AI home page showing the API health status.

## Build for Production

```bash
npm run build
```

Builds both frontend and backend for production.

## Code Quality

### Lint All Code
```bash
npm run lint
```

### Type Check All Code
```bash
npm run type-check
```

## Stopping Services

### Stop Docker Services
```bash
npm run docker-down
```

### Stop Development Servers
Press `Ctrl+C` in the terminal running `npm run dev`

## Folder Structure

- **client/** — Frontend (React + Vite + TypeScript)
- **server/** — Backend (Express + TypeScript)
- **docs/** — Documentation (Architecture, API, Decisions)

See `README.md` for detailed project information.

## Common Issues

### Port Already in Use
If port 5173 or 5000 is already in use:
- Change the port in the server: `PORT=5001 npm run server`
- Change the port in the client vite config and re-run

### Database Connection Error
Make sure Docker services are running:
```bash
npm run docker-up
```

### npm install fails
Try clearing npm cache:
```bash
npm cache clean --force
npm install
```

## Next Steps

1. Explore the codebase in `client/src` and `server/src`
2. Read the architecture documentation in `docs/architecture/`
3. Review the API documentation in `docs/api/`
4. Start Phase 2: Authentication & User Management

## Documentation

- **README.md** — Project overview and detailed setup
- **PHASE-1-IMPLEMENTATION-REPORT.md** — Phase 1 completion summary
- **docs/architecture/system-architecture.md** — System design
- **docs/api/api-overview.md** — API endpoints and usage
- **docs/decisions/technology-decisions.md** — Technology choices

## Support

For questions or issues:
1. Check the documentation
2. Review the code comments
3. Check the GitHub issues (future)

---

**Phase:** 1 — Project Foundation & Architecture ✅  
**Status:** Ready for development
