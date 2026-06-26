# Turtl.Bio — Frontend

Next.js 16 frontend for the Turtl.Bio regulatory decision-support workspace.

**Live:** https://turtl-bio-p8aqj.ondigitalocean.app/

---

## Quick Start

```bash
cd turtl.bio
npm install
cp .env.example .env   # fill in values (see Environment Variables below)
npm run dev            # http://localhost:3000
```

### Full stack (frontend + backend)

```bash
# from repo root
docker-compose up
```

---

## Environment Variables

Create `turtl.bio/.env`:

```env
BACKEND_URL=http://localhost:8080
ALPHA_AUTH_SECRET=<shared-secret>   # must match backend
ALPHA_AUTH_USER=<username>
ALPHA_AUTH_PASSWORD=<password>
```

The `ALPHA_AUTH_SECRET` must be identical in both `turtl.bio/.env` and `backend/.env` for JWT verification to work.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on `localhost:3000` |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint (core-web-vitals + TypeScript) |

---

## App Structure

```
app/
  (marketing)/         Public pages (landing, about) — Navbar layout
  workspace/           Protected IDE workspace — JWT-gated
  login/               Auth page
  api/
    auth/login/        JWT issuance via jose
    copilot/chat/      Stub chat handler
    health/            Health check

components/
  workspace/
    PathMap/           Path-to-Market Map feature (see below)
  marketing/           Landing page components
  ui/                  shadcn/ui primitives (Radix-based)

middleware.ts          Checks alpha_access_token cookie on /workspace/*
```

---

## Path-to-Market Map

The core feature of the workspace. Accessed at `/workspace` after logging in.

### What it does

Visualises a biotech program's full path to IND as an interactive map. Pre-loaded with a demo program (END-101, PKU indication) showing a live biotherapeutic regulatory path.

### Two views (toggle in toolbar)

**Graph view** — Jira-style dependency graph. Nodes are milestones; arrows are typed relationships ("informs duration", "funds", "gates"). Position = dependency depth, not time.

**Gantt view** — Time-locked timeline. X-axis is Q1–Q4. Bars show duration and runway coverage per milestone.

### Three lanes

| Lane | Color | Contents |
|------|-------|----------|
| Funding | Green | SBIR grants, seed round, Series A |
| Sponsor | Teal | POC, Non-GLP, GLP Tox, Env. Assessment |
| FDA | Blue | INTERACT, Type B/C meetings, ODD, IND submission |

### Type C scenario

Toggle in the top-right corner. Inserts an optional Type C FDA meeting node and re-routes the graph to show how that decision pushes Type B and Series A later.

### AI Co-Pilot

Docked panel on the right. Click nodes on the map to load them as context, then ask a question. The panel runs a 4-step workflow (mechanism decomposition → evidence retrieval → regulatory translation → output) and returns results in Sources / Analysis / Recommendation tabs.

For the demo, the co-pilot returns a canned response grounded in FDA 2022 LBP draft guidance and ICH S6(R1). See `components/workspace/PathMap/data.ts` → `COPILOT_RESPONSE` to update the demo content.

### Data model

All map data lives in `components/workspace/PathMap/data.ts`:

```ts
MapNode {
  id, label, subtitle
  lane: "funding" | "sponsor" | "fda"
  status: "done" | "in-progress" | "active" | "planned" | "backlog"
  col, row          // position in 4×4 grid
  ganttStart, ganttDuration  // in quarters (1–4)
  scenario?: "typeC" // only shown when Type C toggle is on
}

MapEdge {
  from, to
  label             // e.g. "informs duration", "funds", "gates"
  bold?             // highlights the three story edges
  scenario?: "typeC"
}
```

Grid constants: `COL_X = [20, 222, 444, 666]`, `ROW_Y = [22, 148, 264, 362]`, cards are 162×76px.

---

## Auth Flow

1. `middleware.ts` checks for `alpha_access_token` cookie on all `/workspace/*` routes
2. Missing or invalid → redirect to `/login`
3. `/login` POSTs credentials to `/api/auth/login`, which verifies against `ALPHA_AUTH_USER` / `ALPHA_AUTH_PASSWORD` and issues a signed JWT stored as a cookie
4. JWT is verified on both the Next.js middleware side and the Go backend

---

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**, **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (new-york style, Radix primitives)
- **jose** — JWT signing/verification
- **lucide-react** — icons (workspace uses Google Material Symbols via CDN)
