# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

Turtl.Bio is a decision-support workspace for preclinical biotech teams preparing IND applications. It helps interpret FDA guidance and regulatory precedent. The product is early/experimental.

Deployed at: https://turtl-bio-p8aqj.ondigitalocean.app/

## Repository Structure

Two independent applications in a monorepo:

- **`turtl.bio/`** — Next.js 16 frontend (React 19, TypeScript, Tailwind CSS v4)
- **`backend/`** — Go backend (stdlib `net/http` with Gin as a dependency, JWT auth)

Orchestrated via `docker-compose.yml` (frontend on port 3000, backend on port 8080).

## Development Commands

### Frontend (`turtl.bio/`)
```bash
cd turtl.bio
npm install          # install dependencies
npm run dev          # start dev server (localhost:3000)
npm run build        # production build
npm run start        # start production server
npm run lint         # run ESLint (eslint-config-next with core-web-vitals + typescript)
```

### Backend (`backend/`)
```bash
cd backend
go run ./cmd/api     # start server (localhost:8080)
go build -o main ./cmd/api   # build binary
```

### Docker (full stack)
```bash
docker-compose up    # runs both services
```

## Environment Variables

Both services require `.env` files:

- **`backend/.env`**: `PORT`, `ALPHA_AUTH_USER`, `ALPHA_AUTH_PASSWORD`, `ALPHA_AUTH_SECRET`
- **`turtl.bio/.env`**: `BACKEND_URL`, `ALPHA_AUTH_SECRET`, `ALPHA_AUTH_USER`, `ALPHA_AUTH_PASSWORD`

The `ALPHA_AUTH_SECRET` must match between frontend and backend for JWT verification.

## Architecture

### Frontend

- **App Router** with two route groups:
  - `(marketing)/` — public pages (landing, about) with `Navbar` layout
  - `workspace/` — protected IDE-like workspace (JWT-gated via `middleware.ts`)
  - `login/` — authentication page
- **API routes** (`app/api/`): `auth/login` (JWT issuance via `jose`), `copilot/chat` (stub responses), `health`
- **Auth flow**: `middleware.ts` checks `alpha_access_token` cookie on `/workspace/*` routes, redirects to `/login` if missing/invalid
- **Workspace** (`components/workspace/`): VS Code-like layout using `react-resizable-panels` with:
  - `useFileSystem.ts` — core hook managing File System Access API, recursive split-pane layout tree (`LayoutNode`), tab management
  - `WorkspaceLayout.tsx` — recursive `LayoutRenderer` with drag-and-drop tab splitting
  - `CodeEditor.tsx` — Monaco editor
  - `PdfViewer.tsx` — PDF rendering via `pdfjs-dist`
  - `CopilotPanel.tsx` — AI chat sidebar
  - `SearchPanel.tsx` / `FileExplorer.tsx` — sidebar panels
  - `Terminal.tsx` — xterm.js terminal (dynamically imported, SSR disabled)
- **UI components** (`components/ui/`): shadcn/ui (new-york style) with Radix primitives
- **Path alias**: `@/*` maps to project root

### Backend

- **Entry point**: `cmd/api/main.go`
- **Routing**: `internal/server/routes.go` — stdlib `http.ServeMux`
- **Config**: `internal/config/config.go` — loads from `.env` via `godotenv`
- **Auth**: `internal/auth/` — login handler, JWT service, middleware
- **Copilot**: `internal/copilot/` — stub chat handler with hardcoded FDA-related responses
- The backend README describes a planned architecture (workspace, files, db, telemetry domains) that is not yet implemented
