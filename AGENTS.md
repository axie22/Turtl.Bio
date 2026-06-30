# AGENTS.md — Turtl.Bio Handoff Document

This document covers all work done on the Path-to-Market Map feature, the decisions made, the bugs hit and fixed, and what to avoid. Written for any AI agent (or human) picking up this codebase.

---

## Project Context

Turtl.Bio is a decision-support workspace for preclinical biotech teams preparing IND applications. The product is demo-stage, built for investor/customer meetings. The demo is pre-loaded with an END-101 (PKU — phenylketonuria) program. The user's proprietary study data is referenced throughout as `YOUR COLONIZATION DATA`.

**Deployed at:** https://turtl-bio-p8aqj.ondigitalocean.app/  
**Current branch:** `demo`  
**Auth:** username `admin`, password `biotech` (env var controlled, see below)

---

## Repository Layout

```
Turtl.Bio/
├── CLAUDE.md                   # Primary project instructions
├── AGENTS.md                   # This file
├── docker-compose.yml
├── turtl.bio/                  # Next.js 16 frontend (React 19, TypeScript, Tailwind v4)
│   ├── app/
│   │   ├── workspace/page.tsx  # TOP-LEVEL VIEW ROUTER — controls entire workspace state
│   │   ├── login/page.tsx
│   │   ├── api/auth/login/     # JWT issuance via jose
│   │   ├── api/copilot/chat/   # Stub AI responses
│   │   └── globals.css         # CSS custom properties (light theme tokens)
│   └── components/
│       └── workspace/
│           ├── WorkspaceLayout.tsx         # Old VS Code-style explorer workspace
│           └── PathMap/                    # ← New feature lives entirely here
│               ├── PathMapLayout.tsx       # Top-level shell (nav, toolbars, status bar)
│               ├── data.ts                 # ALL data: nodes, edges, grid constants, styling
│               ├── GraphView.tsx           # Jira-style dependency graph (SVG edges + HTML cards)
│               ├── GanttView.tsx           # Timeline view (Q1–Q4, lane groups)
│               ├── CopilotPanel.tsx        # 6-step AI co-pilot sidebar
│               ├── UploadPage.tsx          # Step 1 of 3: document upload (click-through)
│               └── ContextPage.tsx         # Step 2 of 3: retrieval & context qualification
└── backend/                    # Go backend (stub — not touched in this feature)
```

---

## Environment Variables

**`turtl.bio/.env`**
```
BACKEND_URL=http://localhost:8080
ALPHA_AUTH_SECRET=b5e6f902-683b-4db9-8a01-7cbf378092b0
ALPHA_AUTH_USER=admin
ALPHA_AUTH_PASSWORD=biotech
```

The `ALPHA_AUTH_SECRET` must match between frontend and backend for JWT verification. The workspace route `/workspace/*` is protected by `middleware.ts` which checks the `alpha_access_token` cookie.

---

## Feature Overview: Path-to-Market Map

A three-step flow that replaces the raw workspace for the demo:

```
Step 1: Upload (UploadPage)
  ↓ "Analyze Program" button (1200ms delay)
Step 2: Context / Retrieval (ContextPage)
  ↓ "Generate Path Map" button
Step 3: Path Map (PathMapLayout)
  ├── Graph view (GraphView) — default
  └── Gantt view (GanttView)
  Both have the AI Co-Pilot sidebar (CopilotPanel)
```

**View routing** is controlled entirely by state in `app/workspace/page.tsx`:

```tsx
"use client";
export type WorkspaceView = "upload" | "context" | "explorer" | "path-map" | "regulatory-ai";

export default function WorkspacePage() {
  const [view, setView] = useState<WorkspaceView>("upload");
  const navigate = (v: string) => setView(v as WorkspaceView);

  if (view === "upload")   return <UploadPage onAnalyze={() => setView("context")} onNavigate={navigate} />;
  if (view === "context")  return <ContextPage onGenerate={() => setView("path-map")} onNavigate={navigate} />;
  if (view === "path-map") return <PathMapLayout activeView={view} onNavigate={navigate} />;
  return <WorkspaceLayout activeView={view} onNavigate={navigate} />;  // old Explorer
}
```

The old workspace is preserved and accessible via the "Explorer" tab. Do not delete or break `WorkspaceLayout`.

---

## Data Model (`components/workspace/PathMap/data.ts`)

This is the single source of truth for the graph. Change data here; the views consume it.

### Grid Constants

```ts
CARD_W = 158    // px, card width
CARD_H = 70     // px, card height
COL_X  = [20, 210, 400, 590, 780, 970]   // x offsets for 6 columns (190px pitch)
ROW_Y  = [20, 148, 272, 396]             // y offsets for 4 rows
CANVAS_W = 1160
CANVAS_H = 490
```

**Critical constraint:** `COL_X[n] + CARD_W` must be less than `COL_X[n+1]`. With `CARD_W=158` and pitch=190, gap between cards is 32px. Do not reduce pitch below 160 or cards overlap.

### Swim Lanes

| Lane | Rows | Color |
|------|------|-------|
| `fda` | row 0 | `#2563eb` |
| `sponsor` | rows 1–2 | `#0d9488` |
| `funding` | row 3 | `#16a34a` |

### Node Layout (col × row)

```
Col:     0          1              2              3             4           5
FDA(0):             INTERACT Prep  INTERACT Mtg   ODD Sub       Type B Prep Type B Mtg
Spon(1): POC        Non-GLP        GLP Tox        GLP Reporting
Spon(2): In vitro   Env Assess     Seed close     [Type C Prep] [Type C Mtg] IND Sub
Fund(3): SBIR P1    P1→2 gap       SBIR P2        Phase 2B                  Series A
```

`[Type C Prep]` and `[Type C Mtg]` are `scenario: "typeC"` nodes — hidden unless the Type C toggle is on.

### Node Fields

```ts
interface MapNode {
  id: string;
  label: string;
  subtitle: string;
  lane: "fda" | "sponsor" | "funding";
  status: "done" | "in-progress" | "active" | "planned" | "backlog" | "runway-risk";
  isMilestone?: boolean;      // renders ◇ prefix in graph and gantt
  col: number;                // 0–5
  row: number;                // 0–3
  ganttStart: number;         // quarter, 1-indexed, fractional (e.g. 1.5 = mid-Q1)
  ganttDuration: number;      // in quarters
  ganttShiftOnTypeC?: number; // additional quarters added when Type C toggle is on
  ganttIsLongBar?: boolean;   // Env Assess: renders as full-width background band
  ganttIsGap?: boolean;       // Phase 1→2 gap: renders as hatched amber "NO FUNDING" bar
  scenario?: "typeC";         // hide unless typeCEnabled === true
}
```

### Edge Fields

```ts
interface MapEdge {
  from: string;
  to: string;
  label: string;
  bold?: boolean;     // teal (#0d9488), 2px stroke — used for narrative "story" edges
  dashed?: boolean;   // used alongside scenario: "typeC"
  scenario?: "typeC"; // hide unless typeCEnabled === true
}
```

Bold edges (the "story"): `informs`, `unlocks seed`, `funds`, `clear-to-file`.

---

## GraphView: Edge Routing

The SVG edge routing logic lives in `getEdgePath()` in `GraphView.tsx`. Three branches, evaluated in order:

```ts
// 1. Same column, different rows → vertical bezier
if (src.col === tgt.col && src.row < tgt.row)  // exit bottom → enter top
if (src.col === tgt.col && src.row > tgt.row)  // exit top → enter bottom

// 2. Long-span forward (3+ cols apart, row diff ≤ 1) → wide arc BELOW cluster
//    Used for: Env Assess (col 1) → IND Submission (col 5)
//    ARC_Y = CANVAS_H + 45  (dips 45px below the canvas)
if (tgt.col - src.col >= 3 && Math.abs(src.row - tgt.row) <= 1)

// 3. Default → horizontal cubic bezier (exits right edge of src, enters left edge of tgt)
```

**Critical:** The canvas div height is set to `CANVAS_H + ARC_OVERHANG` (ARC_OVERHANG = 90) so the wide arc below the cluster is fully visible. The SVG also has `overflow: visible`. Without the height extension the arc is clipped by the parent scroll container.

**Edge label positioning:** Labels use `getEdgeLabelPoint()`. For the wide arc case, it returns `{ x: mid, y: ARC_Y + 14 }` so the label appears at the arc's nadir, not inside the node cluster at `y ≈ 307`.

**Label legibility:** All edge labels use the `paintOrder: 'stroke fill'` trick:
```tsx
style={{
  fill: '#475569',
  paintOrder: 'stroke fill',
  stroke: 'rgba(244,245,247,0.95)',
  strokeWidth: 4,
  strokeLinejoin: 'round',
}}
```
This paints the stroke behind the fill, creating a white halo that makes labels readable on any background without needing a fixed-width rect behind each one.

---

## GanttView: Special Renders

Three render paths beyond the normal `GanttRow`:

| Node | Flag | Component | Behavior |
|------|------|-----------|----------|
| Environmental Assess. | `ganttIsLongBar: true` | `EnvAssessBar` | Full-width translucent band Q1→Q4 |
| Phase 1→2 gap | `ganttIsGap: true` | `GapBar` | Hatched amber "NO FUNDING" bar |
| Separators | (none) | `LaneSeparator` | Colored divider rows between FDA/Sponsor/Funding |

Type C shift: `effectiveStart(node, typeCEnabled)` adds `node.ganttShiftOnTypeC` to `ganttStart` when enabled. Shifted bars get a `ring-1 ring-amber-400/40` outline and a `+Q` label.

---

## CopilotPanel: 6-Step Workflow

```
Step 1: Decomposition       — parse selected nodes
Step 2: Evidence Retrieval  — fetch relevant literature
Step 3: Regulatory Trans.   — translate to IND context
Step 4: Generation          — produce Analysis / Sources / Recommendation
Step 5: (display) Sources | Analysis | Recommendation tabs
Step 6: Human Verification  — Accept / Modify (textarea) / Reject
        → logs to sessionStorage key: "turtl_copilot_verifications"
```

Verification state is local to the session. The canned response content lives in `COPILOT_RESPONSE` in `data.ts` — update it there, not in `CopilotPanel.tsx`.

---

## UploadPage

Three hardcoded demo documents:
1. `END-101_TPP_v2.3.pdf` — blue document icon, tags: PKU indication, live biotherapeutic, oral route
2. `Yucatan_NonGLP_InVivo_Summary.pdf` — amber "YOUR COLONIZATION DATA" tag — the key differentiator
3. `SBIR_Phase1_Application.pdf` — green dollar icon, tags: NIH, $300K feasibility, microbiome

Clicking "Analyze Program" triggers a 1200ms `setTimeout` then calls `onAnalyze()`. Intentional — simulates processing without a real backend call.

---

## ContextPage

Two-column layout:
- **Literature** (left): 6 items — 2 marked "Superseded by your data" (Litvak 2019, Zmora 2019), anchored to `YOUR COLONIZATION DATA` chip
- **Competitors** (right): 3 items — Synlogic and Novome "Disqualified — different mechanism" (red border/bg), Pivotal Biosciences "Partial precedent — monitor"

The 5-step loading animation fires on mount with staggered delays. It auto-completes and shows the content.

---

## Light Theme

All workspace colors are CSS custom properties defined in `app/globals.css` under `@theme inline`:

```css
--color-ws-bg:        #f4f5f7   /* page background */
--color-ws-lowest:    #ffffff   /* card/panel background */
--color-ws-low:       #f8f9fb
--color-ws-mid:       #eef0f4   /* toolbar background */
--color-ws-high:      #e4e6ea
--color-ws-highest:   #ced1d8   /* dividers */
--color-ws-teal:      #007f6a   /* primary accent */
--color-ws-teal-dark: #006454
--color-ws-text:      #111827   /* body text */
```

In Tailwind v4 these are consumed as `bg-ws-bg`, `text-ws-text`, `border-ws-highest`, etc. with opacity modifiers (`text-ws-text/40`). Do not hardcode hex colors in component files — always use `var(--color-ws-*)` or Tailwind tokens so the theme can be changed in one place.

---

## What Was Tried and Failed / What to Avoid

### 1. Backward edges in the graph
**Problem:** When `tgt.col < src.col`, the default routing (exit right of source, enter left of target) creates a giant backward loop across the entire graph.

**What triggered it:** Series A was originally at `col: 4, row: 3`. Type B Meeting is at `col: 5, row: 0`. The "clear-to-file" edge (Type B Meeting → Series A) was col 5 → col 4 — a backward edge.

**Fix:** Moved Series A to `col: 5, row: 3`. Now the edge is same-column going down — a clean vertical bezier.

**Rule:** Never place a node in a lower column than any node that sends an edge to it. Always verify: every edge satisfies `from.col <= to.col`. The routing has no fallback for backward edges.

### 2. Wide arc clipping
**Problem:** `arcY = CANVAS_H + 22` but the canvas div had `height: CANVAS_H`. The arc rendered outside the div and was clipped.

**Fix:** `ARC_OVERHANG = 90`, canvas div `height: CANVAS_H + ARC_OVERHANG`.

**Don't rely on:** `overflow: visible` on the SVG alone — the parent scroll container clips it regardless.

### 3. Column spacing too tight
**Original:** `COL_X = [20, 204, 388, 572, 756, 900]`, `CANVAS_W = 1090`.

**Problem:** `COL_X[4] + CARD_W = 756 + 158 = 914 > COL_X[5] = 900` → cards at columns 4 and 5 physically overlap by 14px.

**Fix:** `COL_X = [20, 210, 400, 590, 780, 970]`, `CANVAS_W = 1160`. 190px pitch gives 32px gap.

### 4. Edge label contrast on light background
**Problem:** `fill: '#9ca3af'` (gray-400) at 9px on `#f4f5f7` is near-invisible.

**Tried:** Darkening fill to `#64748b` — improved but labels still disappeared when overlapping white card backgrounds.

**Final fix:** `paintOrder: 'stroke fill'` with 4px semi-opaque white stroke. Readable on any background, no width calculation needed.

### 5. Wide arc label at arithmetic midpoint
**Problem:** `getEdgeLabelPoint` returning `y = (scy + tcy) / 2` for Env Assess → IND Sub placed the label at `y ≈ 307` — inside the row 2 node cluster.

**Fix:** Special case for wide arcs returns `{ y: ARC_Y + 14 }`, placing the label at the arc's visual bottom.

### 6. Node subtitle too faint
`text-ws-text/40` = `rgba(17,24,39,0.4)` on white ≈ `#c5c9ce`. Unreadable at 10px.

**Fix:** Inline style `color: 'rgba(17,24,39,0.55)'`. Still clearly secondary but legible.

### 7. Non-standard Tailwind class `writing-mode-vertical`
Tailwind v4 has no `writing-mode-vertical` utility. It silently does nothing.

**Fix:** `style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}`

### 8. `useRef` without argument in TypeScript
```tsx
// WRONG — TypeScript error
const timerRef = useRef<ReturnType<typeof setTimeout>>();

// CORRECT
const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
```

### 9. `setView` not assignable to `(view: string) => void`
Passing `setState` typed to a specific union as a prop typed `(v: string) => void` causes TypeScript errors.

**Fix in `page.tsx`:**
```tsx
const navigate = (v: string) => setView(v as WorkspaceView);
```

---

## Navigation Between Views

The three top-level nav tabs work through two mechanisms:

- **Staying in Path Map:** `setActiveTab("path-map")` in `PathMapLayout`
- **Leaving Path Map:** calls `onNavigate?.(tab.id)` → propagates up to `WorkspacePage` → `setView()`

Both `PathMapLayout` and `WorkspaceLayout` accept `onNavigate?: (view: string) => void`. New top-level views must be wired in `app/workspace/page.tsx`.

---

## Type C Scenario

A toggleable scenario (toggle in top nav) that adds an FDA "Type C Meeting" detour. Controlled by `typeCEnabled: boolean` in `PathMapLayout`.

**What changes when enabled:**
- 2 extra nodes: `END-CP` (Type C Prep, col 3 row 2) and `END-0C` (Type C Meeting, col 4 row 2)
- 3 extra dashed amber edges: `END-03 → END-CP → END-0C → END-BP`
- Gantt bars with `ganttShiftOnTypeC` shift right; shifted bars get amber ring + `+Q` label
- Status bar shows "Scenarios: Type C added" in amber

To add new scenario content: add node/edge with `scenario: "typeC"` in `data.ts`. The filters in `GraphView` and `GanttView` handle it automatically.

---

## Co-pilot Canned Content

The AI response (analysis, sources, recommendation) is in `COPILOT_RESPONSE` at the bottom of `data.ts`. It is demo-only, hardcoded for END-101 PKU. For a real implementation, replace `CopilotPanel`'s `handleSend()` with an API call to `app/api/copilot/chat/`.

---

## Build & Dev

```bash
# From turtl.bio/
npm run dev       # localhost:3000
npm run build     # verify no TypeScript errors before deploy
npm run lint      # ESLint (next/core-web-vitals + typescript)
```

Always run `npm run build` before merging. The dev server is more permissive than the compiler.

---

## Files Not to Touch Without Understanding

| File | Why |
|------|-----|
| `middleware.ts` | JWT auth gate on `/workspace/*` — breaking this locks everyone out |
| `app/api/auth/login/route.ts` | JWT issuance — changing cookie name or secret breaks login |
| `app/workspace/page.tsx` | Top-level view router — all views flow through here |
| `components/workspace/PathMap/data.ts` | Changing column positions without checking edge directions breaks routing |

---

## Potential Next Steps (Not Yet Built)

- Real backend calls from `CopilotPanel` (currently stub responses from `data.ts`)
- Actual file parsing in `UploadPage` (currently click-through with hardcoded documents)
- Editable/dynamic node graph (add/move/delete nodes)
- Export to PDF/PNG
- Multiple program support (currently hardcoded to END-101)
- Regulatory AI tab (currently a nav stub — clicking it falls back to the Explorer workspace)
- Persist co-pilot verifications to a real log (currently sessionStorage only)
