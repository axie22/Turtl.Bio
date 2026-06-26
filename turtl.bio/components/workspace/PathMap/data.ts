export type NodeStatus = "done" | "in-progress" | "active" | "planned" | "backlog";
export type NodeLane = "funding" | "sponsor" | "fda";

export interface MapNode {
  id: string;
  label: string;
  subtitle: string;
  lane: NodeLane;
  status: NodeStatus;
  isMilestone?: boolean;
  col: number; // 0-3
  row: number; // 0-3
  ganttStart: number; // quarter (1-4, fractional)
  ganttDuration: number; // in quarters
  scenario?: "typeC"; // only shown in typeC scenario
}

export interface MapEdge {
  from: string;
  to: string;
  label: string;
  bold?: boolean;
  scenario?: "typeC";
}

export const PROGRAM_NAME = "Path to Market — END-101";
export const PROGRAM_SUBTITLE = "auto-plotted from TPP + submission docs";
export const PROGRAM_DATE = "06-25-2026";

// Grid layout constants
export const CARD_W = 162;
export const CARD_H = 76;
export const COL_X = [20, 222, 444, 666];
export const ROW_Y = [22, 148, 264, 362];
export const CANVAS_W = 850;
export const CANVAS_H = 458;

export const NODES: MapNode[] = [
  // Funding lane (row 0)
  {
    id: "FUND-01",
    label: "SBIR/STTR Phase 1",
    subtitle: "$300–$350K feasibility",
    lane: "funding",
    status: "active",
    col: 0, row: 0,
    ganttStart: 1, ganttDuration: 1,
  },
  {
    id: "FUND-02",
    label: "Seed close",
    subtitle: "colonization + the story",
    lane: "funding",
    status: "planned",
    col: 1, row: 0,
    ganttStart: 1.5, ganttDuration: 0.5,
  },
  {
    id: "FUND-03",
    label: "SBIR Phase 2",
    subtitle: "$1–2.5M · IND-enabling",
    lane: "funding",
    status: "backlog",
    col: 2, row: 0,
    ganttStart: 2, ganttDuration: 1,
  },
  {
    id: "FUND-04",
    label: "Series A",
    subtitle: "clear path to IND",
    lane: "funding",
    status: "backlog",
    col: 3, row: 0,
    ganttStart: 3.5, ganttDuration: 0.5,
  },

  // Sponsor lane (row 1)
  {
    id: "END-01",
    label: "POC complete",
    subtitle: "mouse + Yucatan colonization",
    lane: "sponsor",
    status: "done",
    col: 0, row: 1,
    ganttStart: 1, ganttDuration: 0.5,
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
    id: "END-04",
    label: "GLP Tox",
    subtitle: "3 doses · IND-enabling",
    lane: "sponsor",
    status: "backlog",
    col: 2, row: 1,
    ganttStart: 2.5, ganttDuration: 1,
  },
  {
    id: "END-05",
    label: "Pre-IND · Type B",
    subtitle: "FDA must-tox +",
    lane: "fda",
    status: "backlog",
    isMilestone: true,
    col: 3, row: 1,
    ganttStart: 3.5, ganttDuration: 0.25,
  },

  // Mixed row 2
  {
    id: "END-03",
    label: "INTERACT meeting",
    subtitle: "before definitive tox",
    lane: "fda",
    status: "planned",
    isMilestone: true,
    col: 1, row: 2,
    ganttStart: 1.5, ganttDuration: 0.25,
  },
  {
    id: "END-07",
    label: "Orphan Drug Desig.",
    subtitle: "7-yr exclusivity",
    lane: "fda",
    status: "backlog",
    col: 2, row: 2,
    ganttStart: 2, ganttDuration: 0.5,
  },
  {
    id: "END-06",
    label: "IND submission",
    subtitle: "contingent on Type B",
    lane: "fda",
    status: "backlog",
    isMilestone: true,
    col: 3, row: 2,
    ganttStart: 4, ganttDuration: 0.25,
  },

  // Bottom row 3
  {
    id: "END-08",
    label: "Environmental Assess.",
    subtitle: "parallel · runs throughout",
    lane: "sponsor",
    status: "backlog",
    col: 1, row: 3,
    ganttStart: 1.5, ganttDuration: 2.5,
  },

  // Type C scenario node (only visible in typeC mode, replaces END-07 position)
  {
    id: "END-0C",
    label: "Pre-IND · Type C",
    subtitle: "CMC focus · FDA-requested",
    lane: "fda",
    status: "planned",
    isMilestone: true,
    scenario: "typeC",
    col: 2, row: 2,
    ganttStart: 2.75, ganttDuration: 0.25,
  },
];

export const EDGES: MapEdge[] = [
  // Bold story edges
  { from: "END-01", to: "FUND-02", label: "unlocks seed", bold: true },
  { from: "FUND-03", to: "END-04", label: "funds", bold: true },
  { from: "END-05", to: "FUND-04", label: "unlocks raise", bold: true },

  // Funding chain
  { from: "FUND-01", to: "FUND-02", label: "precedes" },
  { from: "FUND-02", to: "FUND-03", label: "bridges" },

  // POC fans out
  { from: "END-01", to: "END-02", label: "unlocks" },
  { from: "END-01", to: "END-03", label: "informs" },

  // Converging into GLP Tox
  { from: "END-02", to: "END-04", label: "informs duration" },
  { from: "END-03", to: "END-04", label: "informs design" },

  // GLP Tox → right
  { from: "END-04", to: "END-05", label: "is blocked by" },

  // Type B gates
  { from: "END-05", to: "END-06", label: "gates" },
  { from: "END-08", to: "END-06", label: "runs parallel" },

  // Type C scenario
  { from: "END-03", to: "END-0C", label: "precedes", scenario: "typeC" },
  { from: "END-0C", to: "END-05", label: "moves B back", scenario: "typeC" },
];

// Gantt quarter labels
export const GANTT_QUARTERS = [
  { q: 1, label: "Q1 2026", sublabel: "POC → Phase 1" },
  { q: 2, label: "Q2 2026", sublabel: "INTERACT + seed" },
  { q: 3, label: "Q3 2026", sublabel: "GLP Tox" },
  { q: 4, label: "Q4 2026", sublabel: "Pre-IND" },
];

export const STATUS_CONFIG: Record<
  NodeStatus,
  { label: string; bg: string; text: string }
> = {
  done: { label: "Done", bg: "bg-ws-teal/20", text: "text-ws-teal" },
  "in-progress": { label: "In Progress", bg: "bg-blue-500/20", text: "text-blue-400" },
  active: { label: "Active", bg: "bg-emerald-500/20", text: "text-emerald-400" },
  planned: { label: "Planned", bg: "bg-amber-500/20", text: "text-amber-400" },
  backlog: { label: "Backlog", bg: "bg-ws-highest/60", text: "text-ws-text/40" },
};

export const LANE_COLOR: Record<NodeLane, string> = {
  funding: "#22c55e",
  sponsor: "#54dcbc",
  fda: "#60a5fa",
};

// Canned copilot response for demo
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
