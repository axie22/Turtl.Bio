export type NodeStatus = "done" | "in-progress" | "active" | "planned" | "backlog" | "runway-risk";
export type NodeLane = "funding" | "sponsor" | "fda";

export interface MapNode {
  id: string;
  label: string;
  subtitle: string;
  lane: NodeLane;
  status: NodeStatus;
  isMilestone?: boolean;
  col: number;   // 0–5
  row: number;   // 0–3
  ganttStart: number;       // quarter (1–4+, fractional)
  ganttDuration: number;    // in quarters
  ganttShiftOnTypeC?: number; // extra quarters added when Type C is enabled
  ganttIsLongBar?: boolean;  // renders as a full-width background bar (Env Assess)
  ganttIsGap?: boolean;      // renders with hatched amber style (runway risk)
  scenario?: "typeC";        // only shown when Type C toggle is on
}

export interface MapEdge {
  from: string;
  to: string;
  label: string;
  bold?: boolean;
  dashed?: boolean;
  scenario?: "typeC";
}

export const PROGRAM_NAME = "Path to Market — END-101";
export const PROGRAM_SUBTITLE = "auto-plotted from TPP + submission docs";
export const PROGRAM_DATE = "06-25-2026";

// ─── Grid constants ────────────────────────────────────────────────────────────
// 6 columns × 4 rows
export const CARD_W = 158;
export const CARD_H = 70;
export const COL_X = [20, 204, 388, 572, 756, 900];
export const ROW_Y = [20, 142, 262, 382];
export const CANVAS_W = 1090;
export const CANVAS_H = 470;

// ─── Nodes ────────────────────────────────────────────────────────────────────
//
// Layout (Jira / dependency graph):
//
// Col:     0           1            2              3             4              5
// FDA(0):              INT Prep     INT Mtg        ODD           Type B Prep    Type B Mtg
// Spon(1): POC         Non-GLP      GLP Tox        GLP Reporting
// Mixed(2):In vitro    Env Assess   Seed close     Type C Prep*  Type C Mtg*   IND Sub
// Fund(3): SBIR P1     P1→2 gap     SBIR P2        Phase 2B      Series A
//
// Shape: POC fans out → everything funnels into GLP Tox → squeezes through Type B → splits to IND + Series A

export const NODES: MapNode[] = [

  // ── Root nodes (col 0) ──────────────────────────────────────────────────────
  {
    id: "END-01",
    label: "POC complete",
    subtitle: "Yucatan colonization · chassis-native",
    lane: "sponsor",
    status: "done",
    col: 0, row: 1,
    ganttStart: 1, ganttDuration: 0.5,
  },
  {
    id: "END-00",
    label: "In vitro studies",
    subtitle: "mechanism · metabolic validation",
    lane: "sponsor",
    status: "done",
    col: 0, row: 2,
    ganttStart: 1, ganttDuration: 0.5,
  },
  {
    id: "FUND-01",
    label: "SBIR Phase 1",
    subtitle: "$300–350K · feasibility",
    lane: "funding",
    status: "active",
    col: 0, row: 3,
    ganttStart: 1, ganttDuration: 1,
  },

  // ── Wave 1 (col 1) ──────────────────────────────────────────────────────────
  {
    id: "END-IP",
    label: "INTERACT Prep",
    subtitle: "briefing doc · FDA request",
    lane: "fda",
    status: "planned",
    col: 1, row: 0,
    ganttStart: 1.5, ganttDuration: 0.25,
  },
  {
    id: "END-02",
    label: "Non-GLP in vivo",
    subtitle: "dose-response · off-switch",
    lane: "sponsor",
    status: "in-progress",
    col: 1, row: 1,
    ganttStart: 1.5, ganttDuration: 0.75,
  },
  {
    id: "END-08",
    label: "Environmental Assess.",
    subtitle: "parallel · runs Q1→Q4",
    lane: "sponsor",
    status: "planned",
    col: 1, row: 2,
    // Special Gantt rendering: full-width long bar
    ganttStart: 1, ganttDuration: 3.25,
    ganttIsLongBar: true,
  },
  {
    id: "FUND-GAP",
    label: "Phase 1→2 gap",
    subtitle: "runway risk · no capital",
    lane: "funding",
    status: "runway-risk",
    col: 1, row: 3,
    ganttStart: 2, ganttDuration: 0.5,
    ganttIsGap: true,
  },

  // ── Wave 2 (col 2) ──────────────────────────────────────────────────────────
  {
    id: "END-03",
    label: "INTERACT Meeting",
    subtitle: "before definitive tox",
    lane: "fda",
    status: "planned",
    isMilestone: true,
    col: 2, row: 0,
    ganttStart: 1.75, ganttDuration: 0.25,
  },
  {
    id: "END-04",
    label: "GLP Tox",
    subtitle: "3 doses · IND-enabling",
    lane: "sponsor",
    status: "backlog",
    col: 2, row: 1,
    ganttStart: 2.5, ganttDuration: 1,
    ganttShiftOnTypeC: 0.25,
  },
  {
    id: "FUND-02",
    label: "Seed close",
    subtitle: "colonization data + story",
    lane: "funding",
    status: "planned",
    col: 2, row: 2,
    ganttStart: 1.5, ganttDuration: 0.25,
  },
  {
    id: "FUND-03",
    label: "SBIR Phase 2",
    subtitle: "$1–2.5M · IND-enabling",
    lane: "funding",
    status: "backlog",
    col: 2, row: 3,
    ganttStart: 2.5, ganttDuration: 1,
  },

  // ── Wave 3 (col 3) ──────────────────────────────────────────────────────────
  {
    id: "END-07",
    label: "ODD Submission",
    subtitle: "7-yr exclusivity · rare disease",
    lane: "fda",
    status: "backlog",
    col: 3, row: 0,
    ganttStart: 2, ganttDuration: 0.5,
  },
  {
    id: "END-GR",
    label: "GLP Reporting",
    subtitle: "final report · IND package",
    lane: "sponsor",
    status: "backlog",
    col: 3, row: 1,
    ganttStart: 3.5, ganttDuration: 0.25,
    ganttShiftOnTypeC: 0.25,
  },
  {
    id: "FUND-04",
    label: "Phase 2B",
    subtitle: "bridge round · pre-Series A",
    lane: "funding",
    status: "backlog",
    col: 3, row: 3,
    ganttStart: 3, ganttDuration: 0.5,
    ganttShiftOnTypeC: 0.25,
  },

  // ── Wave 4 (col 4) ──────────────────────────────────────────────────────────
  {
    id: "END-BP",
    label: "Type B Prep",
    subtitle: "pre-IND briefing package",
    lane: "fda",
    status: "backlog",
    col: 4, row: 0,
    ganttStart: 3.5, ganttDuration: 0.25,
    ganttShiftOnTypeC: 0.25,
  },
  {
    id: "FUND-05",
    label: "Series A",
    subtitle: "clear path to IND",
    lane: "funding",
    status: "backlog",
    col: 4, row: 3,
    ganttStart: 3.75, ganttDuration: 0.25,
    ganttShiftOnTypeC: 0.25,
  },

  // ── Wave 5 (col 5) ──────────────────────────────────────────────────────────
  {
    id: "END-05",
    label: "Type B Meeting",
    subtitle: "pre-IND · safety + design",
    lane: "fda",
    status: "backlog",
    isMilestone: true,
    col: 5, row: 0,
    ganttStart: 3.75, ganttDuration: 0.25,
    ganttShiftOnTypeC: 0.25,
  },
  {
    id: "END-06",
    label: "IND Submission",
    subtitle: "contingent on Type B",
    lane: "fda",
    status: "backlog",
    isMilestone: true,
    col: 5, row: 2,
    ganttStart: 4, ganttDuration: 0.25,
    ganttShiftOnTypeC: 0.25,
  },

  // ── Type C scenario nodes (only shown when toggle is on) ────────────────────
  {
    id: "END-CP",
    label: "Type C Prep",
    subtitle: "CMC focus · optional",
    lane: "fda",
    status: "planned",
    isMilestone: true,
    scenario: "typeC",
    col: 3, row: 2,
    ganttStart: 2.5, ganttDuration: 0.25,
  },
  {
    id: "END-0C",
    label: "Type C Meeting",
    subtitle: "FDA-requested · delays Type B",
    lane: "fda",
    status: "planned",
    isMilestone: true,
    scenario: "typeC",
    col: 4, row: 2,
    ganttStart: 2.75, ganttDuration: 0.25,
  },
];

// ─── Edges ────────────────────────────────────────────────────────────────────

export const EDGES: MapEdge[] = [
  // ── Three bold story edges ───────────────────────────────────────────────────
  { from: "END-01", to: "END-IP",   label: "informs",      bold: true },
  { from: "END-01", to: "FUND-02",  label: "unlocks seed", bold: true },
  { from: "FUND-03", to: "END-04",  label: "funds",        bold: true },
  { from: "END-05", to: "FUND-05",  label: "clear-to-file",bold: true },

  // ── Funding chain ────────────────────────────────────────────────────────────
  { from: "FUND-01", to: "FUND-GAP", label: "runs out" },
  { from: "FUND-GAP", to: "FUND-03", label: "bridges" },
  { from: "FUND-02", to: "FUND-03", label: "precedes" },
  { from: "FUND-03", to: "FUND-04", label: "precedes" },

  // ── POC fans out ─────────────────────────────────────────────────────────────
  { from: "END-01", to: "END-02",   label: "unlocks" },
  { from: "END-00", to: "END-04",   label: "informs design" },

  // ── INTERACT sequence ─────────────────────────────────────────────────────────
  { from: "END-IP", to: "END-03",   label: "precedes" },

  // ── Everything funnels into GLP Tox ──────────────────────────────────────────
  { from: "END-02", to: "END-04",   label: "informs duration" },
  { from: "END-03", to: "END-04",   label: "informs design" },

  // ── GLP Tox → narrow waist ───────────────────────────────────────────────────
  { from: "END-04", to: "END-GR",   label: "produces" },
  { from: "END-GR", to: "END-BP",   label: "unlocks" },
  { from: "END-BP", to: "END-05",   label: "precedes" },

  // ── Type B splits right ───────────────────────────────────────────────────────
  { from: "END-05", to: "END-06",   label: "gates" },

  // ── Env Assess long arc → IND ────────────────────────────────────────────────
  { from: "END-08", to: "END-06",   label: "needs EA done" },

  // ── Optional: Type C detour ───────────────────────────────────────────────────
  { from: "END-03", to: "END-CP",   label: "precedes",      scenario: "typeC", dashed: true },
  { from: "END-CP", to: "END-0C",   label: "precedes",      scenario: "typeC", dashed: true },
  { from: "END-0C", to: "END-BP",   label: "pushes B back", scenario: "typeC", dashed: true },
];

// ─── Gantt config ─────────────────────────────────────────────────────────────

export const GANTT_QUARTERS = [
  { q: 1, label: "Q1 2026", sublabel: "POC → Phase 1" },
  { q: 2, label: "Q2 2026", sublabel: "INTERACT + seed" },
  { q: 3, label: "Q3 2026", sublabel: "GLP Tox" },
  { q: 4, label: "Q4 2026", sublabel: "Pre-IND" },
];

// ─── Styling ──────────────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<
  NodeStatus,
  { label: string; bg: string; text: string }
> = {
  done:           { label: "Done",         bg: "bg-ws-teal/20",      text: "text-ws-teal" },
  "in-progress":  { label: "In Progress",  bg: "bg-blue-500/20",     text: "text-blue-400" },
  active:         { label: "Active",       bg: "bg-emerald-500/20",  text: "text-emerald-400" },
  planned:        { label: "Planned",      bg: "bg-amber-500/20",    text: "text-amber-400" },
  backlog:        { label: "Backlog",      bg: "bg-ws-highest/60",   text: "text-ws-text/40" },
  "runway-risk":  { label: "Runway Risk",  bg: "bg-amber-500/10",    text: "text-amber-400" },
};

export const LANE_COLOR: Record<NodeLane, string> = {
  funding: "#22c55e",
  sponsor: "#54dcbc",
  fda:     "#60a5fa",
};

// ─── Copilot canned response ──────────────────────────────────────────────────

export const COPILOT_RESPONSE = {
  analysis: `Across the loaded nodes, the controlling nonclinical literature for a live biotherapeutic product is the FDA 2022 LBP draft guidance and ICH S6(R1). Both describe toxicology expectations in terms of the proposed clinical population and route, rather than prescribing a fixed study for every modality.

The applicability of a given tox study turns on whether its species, duration, and endpoints match the persistence and biodistribution profile characterized in the upstream colonization data. Where a chassis-specific organism is involved, published guidance does not resolve the species-justification standard — the documents treat it as an open question to be settled through FDA interaction.

This summary reports what the sources state; it does not advise whether to run, waive, or redesign any study. That determination remains the user's.`,
  sources: [
    {
      id: "s1",
      title: "FDA 2022 Draft Guidance — Early Clinical Trials with LBPs (Nonclinical)",
      cite: "FDA, 2022",
      relevance: "Primary framework for nonclinical LBP requirements",
    },
    {
      id: "s2",
      title: "ICH S6(R1) — Preclinical Safety Evaluation of Biotechnology-Derived Pharmaceuticals",
      cite: "ICH, 2011",
      relevance: "Species selection and study design principles",
    },
    {
      id: "s3",
      title: "21 CFR 312.23(a)(8) — IND content & format, nonclinical",
      cite: "FDA CFR",
      relevance: "Regulatory filing requirements for nonclinical data",
    },
  ],
  recommendation: `**Mechanism identified:** Live biotherapeutic persistence and biodistribution depend on chassis-organism characteristics specific to this program.

**Evidence supporting concern:** FDA 2022 LBP guidance does not prescribe a fixed species for chassis-based LBPs. ICH S6(R1) anchors species selection to pharmacological activity and clinical population.

**Regulatory precedent:** No IND precedent exists for a native-chassis LBP in PKU; Synlogic and Novome (lab-strain approaches) are not controlling.

**Open question flagged:** Species justification for chassis-based GLP Tox remains unsettled in published guidance — this must be resolved through INTERACT meeting dialogue before GLP Tox design is finalized.

**What the agent does not know:** Your specific colonization persistence data, proposed species, and INTERACT meeting minutes. Human verification required before acting on this output.`,
};
