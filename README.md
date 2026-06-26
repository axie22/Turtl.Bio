# Turtl.Bio

[Live Deployment](https://turtl-bio-p8aqj.ondigitalocean.app/)

**A decision-support workspace for preclinical biotech teams preparing IND applications.**

Turtl.Bio helps founder-scientists understand **what FDA guidance and regulatory precedent actually mean for their specific program** — and visualises the full path to IND as an interactive, context-aware map.

---

## What Our Platform Is

- A **decision-support workspace** for regulatory interpretation
- Designed for **early-stage, preclinical biotech teams**
- Helps teams reason about:
  - which guidance applies
  - under what conditions
  - based on product modality and precedent

Turtl.Bio structures FDA guidance and historical precedent so teams can make **earlier, clearer applicability decisions** during development.

---

## What Our Project is Not

- A submission generator
- A drafting or filing automation tool
- A replacement for regulatory consultants
- A generic “chat with your PDFs” system

The goal is to **reduce ambiguity earlier**, not automate downstream regulatory work.

---

## Problem Being Addressed

From interviews with early-stage biotech teams:

- FDA guidance is high-level and conditional
- Applicability depends on modality, mechanism, and precedent
- Relevant precedent is fragmented across PDFs, spreadsheets, and notes
- Interpretation becomes a bottleneck, leading to delays and reliance on consultants

The challenge isn’t access to information, it’s **interpreting it in context**.

---

## Core Feature — Path-to-Market Map

The workspace centres on an interactive **Path-to-Market Map**: a dependency graph and Gantt chart of the program's full regulatory path to IND, organised across three lanes (FDA, Sponsor, Funding).

**Graph view** (Jira-style) — nodes are milestones, arrows are typed relationships ("informs duration", "funds", "gates"). Dependency depth determines position.

**Gantt view** — time-locked to Q1–Q4. Funding bars show runway coverage end-to-end; gaps are visible as runway risk.

**Type C scenario toggle** — flips the optional Type C FDA meeting on/off and re-routes the graph in real time, showing how one regulatory decision pushes all downstream milestones.

**AI Co-Pilot** — docked alongside the map. The user selects nodes as context, asks a question, and the system returns a grounded, purely academic answer with citations — no opinion, no recommendation, just what the sources state.

---

## Repository Layout

```
turtl.bio/    Next.js 16 frontend (React 19, TypeScript, Tailwind v4)
backend/      Go backend (stdlib net/http, JWT auth)
docker-compose.yml
```

See [`turtl.bio/README.md`](turtl.bio/README.md) for frontend setup, environment variables, and the Path-to-Market Map data model.
See [`backend/README.md`](backend/README.md) for backend architecture.

---

## Current Focus

This repository represents an early-stage exploration of:

- Interactive path-to-market visualisation for regulatory planning
- Context-aware AI co-pilot grounded in program-specific data
- Qualifying regulatory literature and competitor precedent against a team's actual science
- Structuring FDA guidance and historical precedent into interpretable, traversable components

We are intentionally prioritising **clarity, correctness, and trust** over automation.

---

## Open Questions

We are actively testing:

- Whether teams adopt a dedicated interpretation workspace
- Whether structuring guidance + precedent reduces uncertainty
- How generalizable interpretation patterns are across product types

These questions guide short-term experiments and iteration.

---

## Project Status

**Early / Experimental**

Expect rapid iteration and changes as we validate assumptions through continued user discovery and prototyping.
