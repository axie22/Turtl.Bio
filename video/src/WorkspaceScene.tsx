import React, { useEffect, useState } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  AbsoluteFill,
  continueRender,
  delayRender,
} from "remotion";
import { FONT } from "./fonts";
import { C } from "./colors";

// ─── Material Symbols loader ──────────────────────────────────────────────────

const MATERIAL_SYMBOLS_CSS =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block";

function useMaterialSymbols() {
  const [handle] = useState(() => delayRender("Loading Material Symbols"));
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = MATERIAL_SYMBOLS_CSS;
    link.onload = () => { document.fonts.ready.then(() => continueRender(handle)); };
    link.onerror = () => continueRender(handle);
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, [handle]);
}

// ─── Data: evidence cards ─────────────────────────────────────────────────────

const EVIDENCE_CARDS = [
  {
    id: "ich-m3r2",
    source: "ICH M3(R2)",
    ref: "Table 1 — Repeat-dose tox",
    quote: `"A full organ histopathological examination should be performed on animals from the high-dose and control groups in studies of one month or greater duration."`,
    summary:
      "Full organ panel required for repeat-dose tox supporting Phase 1. Limiting to rectum/colon only requires explicit FDA written concurrence.",
  },
  {
    id: "21cfr-312",
    source: "21 CFR 312.23(a)(8)",
    ref: "IND Pharm/Tox requirements",
    quote: `"The IND must contain adequate information about pharmacological and toxicological studies... to permit an assessment of the reasonable safety of the drug for testing in humans."`,
    summary:
      "A new rectal route for a novel SCI indication triggers a fresh nonclinical review. Route-specific and indication-specific requirements apply.",
  },
  {
    id: "505b2",
    source: "505(b)(2) FDA Guidance",
    ref: "Applications Covered by §505(b)(2)",
    quote: `"Reliance on published literature or an approved application does not relieve the applicant of the obligation to submit all information required."`,
    summary:
      "505(b)(2) does not automatically waive nonclinical requirements. Written FDA concurrence required before any study is omitted.",
  },
];

const PRECEDENT_CASES = [
  {
    id: "qutenza",
    name: "Qutenza",
    company: "Astellas Pharma",
    indication: "Neuropathic Pain",
    statusLabel: "NDA 022395",
    summary: "Full systemic safety required",
    fdaResponse: `"Full systemic safety data required despite existing capsaicin literature. 'Ubiquitous use' not accepted as a nonclinical safety waiver."`,
  },
  {
    id: "novel-route",
    name: "505(b)(2) Novel Routes",
    company: "Multiple applicants",
    indication: "Various (alternate route)",
    statusLabel: "Consistent pattern",
    summary: "New nonclinical data required",
    fdaResponse: `"New nonclinical data required when route substantially changes absorption profile, even for well-characterized compounds."`,
  },
];

// ─── Data: file tree ──────────────────────────────────────────────────────────

interface TreeItem {
  name: string;
  type: "folder" | "file";
  open?: boolean;
  active?: boolean;
  dim?: boolean;       // older versions (v1, v2)
  children?: TreeItem[];
}

const FILE_TREE: TreeItem[] = [
  { name: "TPP_CAPS-001_v2.xlsx",       type: "file", active: true },
  {
    name: "regulatory-refs",
    type: "folder",
    open: true,
    children: [
      { name: "ICH-M3R2_Source1.pdf",      type: "file"  },
      { name: "21CFR-312.23_Source2.pdf",   type: "file" },
      { name: "505b2-guidance_Source5.pdf", type: "file" },
      { name: "fda-excipient-guidance.pdf", type: "file" },
    ],
  },
  {
    name: "preclinical",
    type: "folder",
    open: true,
    children: [
      {
        name: "dog-glp-4wk",
        type: "folder",
        open: true,
        children: [
          { name: "protocol_v1.pdf",         type: "file", dim: true  },
          { name: "protocol_v2.pdf",         type: "file", dim: true  },
          { name: "protocol_v3.pdf",         type: "file"              },
        ],
      },
      {
        name: "histopathology",
        type: "folder",
        open: true,
        children: [
          { name: "scope-assessment_v1.pdf", type: "file", dim: true  },
          { name: "scope-assessment_v2.pdf", type: "file"             },
        ],
      },
      { name: "pk-absorption-profile.pdf",  type: "file" },
    ],
  },
  {
    name: "ind-sections",
    type: "folder",
    open: true,
    children: [
      { name: "nonclinical-overview_draft.md", type: "file" },
      { name: "pharmacology-summary.md",       type: "file" },
    ],
  },
  {
    name: "pre-ind-prep",
    type: "folder",
    open: false,
    children: [
      { name: "meeting-agenda.md",     type: "file" },
      { name: "questions-draft.md",    type: "file" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Phase = "idle" | "analyzing" | "complete";

function getPhase(frame: number, fps: number): Phase {
  if (frame < 11 * fps) return "idle";
  if (frame < 21 * fps) return "analyzing";
  return "complete";
}

function getVisibleCards(frame: number, fps: number): number {
  const submitFrame = 11 * fps;
  if (frame < submitFrame) return 0;
  return Math.min(Math.floor((frame - submitFrame) / (1.5 * fps)) + 1, EVIDENCE_CARDS.length);
}

const monoLabel = (size = 10, color: string = C.textFaint): React.CSSProperties => ({
  fontFamily: FONT.label,
  fontSize: size,
  textTransform: "uppercase" as const,
  letterSpacing: "0.14em",
  color,
});

// ─── Activity bar ─────────────────────────────────────────────────────────────

const ActivityBar: React.FC = () => (
  <div
    style={{
      width: 48,
      background: C.surfaceAlt,
      borderRight: `1px solid ${C.border}`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 12,
      gap: 4,
      flexShrink: 0,
    }}
  >
    {["folder_open", "search", "account_tree", "pest_control", "smart_toy"].map((icon, i) => (
      <div
        key={icon}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "9px 0",
          borderLeft: i === 0 ? `2px solid ${C.accent}` : "2px solid transparent",
          background: i === 0 ? C.surface : "transparent",
          color: i === 0 ? C.accent : C.textFaint,
          fontFamily: "Material Symbols Outlined",
          fontSize: 20,
        }}
      >
        {icon}
      </div>
    ))}
    <div style={{ marginTop: "auto", paddingBottom: 14 }}>
      <div
        style={{
          width: 28, height: 28, background: C.border,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Material Symbols Outlined", fontSize: 15, color: C.textDim,
        }}
      >
        account_circle
      </div>
    </div>
  </div>
);

// ─── File tree (recursive) ────────────────────────────────────────────────────

const TreeNode: React.FC<{ item: TreeItem; depth: number }> = ({ item, depth }) => {
  const indent = 10 + depth * 14;

  if (item.type === "folder") {
    return (
      <>
        <div
          style={{
            paddingLeft: indent,
            paddingRight: 8,
            paddingTop: 3,
            paddingBottom: 3,
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: item.active ? C.accentBg : "transparent",
            borderLeft: item.active ? `2px solid ${C.accentBorder}` : "2px solid transparent",
          }}
        >
          <span
            style={{
              fontFamily: "Material Symbols Outlined",
              fontSize: 12,
              color: C.textFaint,
              transform: item.open ? "rotate(90deg)" : "none",
              flexShrink: 0,
            }}
          >
            chevron_right
          </span>
          <span
            style={{
              fontFamily: "Material Symbols Outlined",
              fontSize: 13,
              color: item.open ? C.accent : C.textDim,
              flexShrink: 0,
            }}
          >
            {item.open ? "folder_open" : "folder"}
          </span>
          <span
            style={{
              ...monoLabel(9, item.active ? C.accentStrong : C.textDim),
            }}
          >
            {item.name}
          </span>
        </div>
        {item.open &&
          item.children?.map((child) => (
            <TreeNode key={child.name} item={child} depth={depth + 1} />
          ))}
      </>
    );
  }

  return (
    <div
      style={{
        paddingLeft: indent,
        paddingRight: 8,
        paddingTop: 2,
        paddingBottom: 2,
        display: "flex",
        alignItems: "center",
        gap: 5,
        background: item.active ? C.accentBg : "transparent",
        borderLeft: item.active
          ? `2px solid ${C.accent}`
          : "2px solid transparent",
      }}
    >
      <span
        style={{
          fontFamily: "Material Symbols Outlined",
          fontSize: 12,
          color: item.active ? C.accent : item.dim ? C.borderMid : C.textFaint,
          flexShrink: 0,
        }}
      >
        description
      </span>
      <span
        style={{
          fontFamily: FONT.label,
          fontSize: 9,
          letterSpacing: 0,
          color: item.active ? C.accentStrong : item.dim ? C.borderMid : C.textDim,
          fontWeight: item.active ? 600 : 400,
        }}
      >
        {item.name}
      </span>
    </div>
  );
};

const ExplorerPanel: React.FC = () => (
  <div
    style={{
      width: 240,
      background: C.surface,
      borderRight: `1px solid ${C.border}`,
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
    }}
  >
    <div
      style={{
        height: 36,
        padding: "0 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <span style={monoLabel(10, C.textDim)}>Explorer</span>
      <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 14, color: C.textFaint }}>
        more_horiz
      </span>
    </div>
    <div style={{ padding: "6px 0", flex: 1, overflow: "hidden" }}>
      {/* Project root */}
      <div
        style={{
          paddingLeft: 10,
          paddingRight: 8,
          paddingTop: 3,
          paddingBottom: 5,
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 12, color: C.textFaint }}>
          chevron_right
        </span>
        <span style={monoLabel(9, C.textDim)}>CAPS-IND-001 / SUPP-505B2</span>
      </div>
      {FILE_TREE.map((item) => (
        <TreeNode key={item.name} item={item} depth={1} />
      ))}
    </div>
  </div>
);

// ─── Top nav bar ──────────────────────────────────────────────────────────────

const TopNavBar: React.FC<{ phase: Phase }> = ({ phase }) => {
  const tabs =
    phase === "idle"
      ? []
      : phase === "analyzing"
        ? ["Explorer", "Evidence", "Protocols"]
        : ["Explorer", "Rulings", "Pre-IND Prep"];

  return (
    <div
      style={{
        height: 46,
        background: C.bg,
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
          <span
            style={{
              fontFamily: FONT.headline,
              fontSize: 15, fontWeight: 600, color: C.text, letterSpacing: -0.3,
            }}
          >
            Turtl.Bio
          </span>
          <span style={monoLabel(9, C.textFaint)}>Alpha</span>
        </div>
        {tabs.map((tab, i) => (
          <span
            key={tab}
            style={{
              ...monoLabel(11, i === 0 ? C.text : C.textDim),
              borderBottom: i === 0 ? `2px solid ${C.text}` : "none",
              paddingBottom: i === 0 ? 3 : 0,
              fontWeight: i === 0 ? 600 : 400,
            }}
          >
            {tab}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {phase !== "idle" && (
          <div
            style={{
              display: "flex", alignItems: "center",
              background: C.surface, border: `1px solid ${C.border}`,
              padding: "5px 12px", gap: 8,
            }}
          >
            <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 13, color: C.textFaint }}>
              search
            </span>
            <span style={monoLabel(11, C.textFaint)}>Search knowledge base...</span>
            <span style={{ ...monoLabel(10, C.borderMid), marginLeft: 8 }}>⌘K</span>
          </div>
        )}
        <div
          style={{
            background: C.text, color: C.bg,
            padding: "6px 14px",
            fontFamily: FONT.label, fontSize: 11, fontWeight: 600,
            letterSpacing: "0.1em", textTransform: "uppercase",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 13 }}>folder_open</span>
          Open Folder
        </div>
      </div>
    </div>
  );
};

// ─── Tab bar (inside main panel) ──────────────────────────────────────────────

const TabBar: React.FC<{ phase: Phase; tabOpacity: number }> = ({ phase, tabOpacity }) => {
  const hasAnalysisTab = phase !== "idle";
  return (
    <div
      style={{
        height: 34,
        background: C.surfaceAlt,
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "stretch",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* Tab 1: data sheet (always visible) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 14px",
          background: phase === "idle" ? C.bg : C.surface,
          borderRight: `1px solid ${C.border}`,
          borderBottom: phase === "idle" ? `2px solid ${C.accent}` : "none",
        }}
      >
        <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 12, color: C.accent }}>
          table_chart
        </span>
        <span style={{ fontFamily: FONT.label, fontSize: 10, color: phase === "idle" ? C.text : C.textDim }}>
          TPP_CAPS-001_v2.xlsx
        </span>
        <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 11, color: C.textFaint, marginLeft: 4 }}>
          close
        </span>
      </div>

      {/* Tab 2: Regulatory Analysis (appears after submit) */}
      {hasAnalysisTab && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "0 14px",
            background: C.bg,
            borderRight: `1px solid ${C.border}`,
            borderBottom: `2px solid ${C.accent}`,
            opacity: tabOpacity,
          }}
        >
          {/* Live indicator dot */}
          <div
            style={{
              width: 7, height: 7,
              borderRadius: "50%",
              background: C.accent,
              flexShrink: 0,
            }}
          />
          <span style={{ fontFamily: FONT.label, fontSize: 10, color: C.text }}>
            Regulatory Analysis
          </span>
          <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 11, color: C.textFaint, marginLeft: 4 }}>
            close
          </span>
        </div>
      )}

      {/* Add tab button */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 32, color: C.textFaint,
          fontFamily: "Material Symbols Outlined", fontSize: 16,
        }}
      >
        add
      </div>
    </div>
  );
};

// ─── TPP Document (shown when idle) ──────────────────────────────────────────

const TPP_SECTIONS = [
  {
    n: "01", title: "Product Description", hasTargets: false,
    rows: [
      { attr: "Product name / code",   value: "CAPS-001 / Capsaicin Rectal Suppository 5% w/w" },
      { attr: "Mechanism of action",   value: "TRPV1 agonist — selective desensitization of rectal sensory afferents; local action, minimal systemic absorption confirmed" },
      { attr: "Drug class",            value: "Capsaicinoid · topical rectal formulation · existing NDA precedent: Qutenza (NDA 022395)" },
      { attr: "Regulatory approach",   value: "505(b)(2) reliance on Qutenza safety data + novel route/indication-specific nonclinical package" },
    ],
  },
  {
    n: "02", title: "Proposed Indication & Population", hasTargets: false,
    rows: [
      { attr: "Disease area",           value: "Neurogenic Bowel Dysfunction (NBD) — Chronic Spinal Cord Injury (SCI)" },
      { attr: "Intended indication",    value: "Management of bowel dysfunction in adult patients with chronic SCI (C1–T10 level), ≥12 months post-injury" },
      { attr: "Target population",      value: "Adults 18–65 · chronic SCI ≥12 mo · NBDS ≥14 · failed ≥3 mo conservative bowel program" },
      { attr: "Line of therapy",        value: "Second-line following inadequate response to standard bowel management program" },
    ],
  },
  {
    n: "03", title: "Clinical Efficacy", hasTargets: true,
    rows: [
      { attr: "Primary endpoint",        value: "Change from baseline NBDS at Week 12",                                              ideal: "≥5-point reduction · p<0.001",     min: "≥3-point reduction · p<0.05" },
      { attr: "Key secondary endpoints", value: "GI-QoL Index · time-to-first-bowel-movement · colonic transit time (scintigraphy)", ideal: "",                                  min: "" },
      { attr: "Effect size vs. SoC",     value: "35–50% NBDS improvement vs. 5–15% with standard bowel program",                    ideal: "",                                  min: "" },
      { attr: "Onset / durability",      value: "Onset within 2–4 weeks · maintained through Week 24 (long-term cohort)",           ideal: "",                                  min: "" },
    ],
  },
  {
    n: "04", title: "Safety & Tolerability", hasTargets: true,
    rows: [
      { attr: "Key safety parameters",  value: "Rectal mucosal integrity (colonoscopy) · systemic TRPV1 effects · Cₘₐₓ < LOQ at all dose levels",       ideal: "No treatment-related mucosal changes · no systemic AEs",     min: "Grade 1–2 transient AEs · no SAEs at therapeutic dose",     highlight: false },
      { attr: "Nonclinical on file",    value: "GLP 4-wk dog study CAPS-TOX-2024-01 v3 Final (21 CFR Part 58) · Qutenza NDA 022395 precedent",            ideal: "",                                                            min: "",                                                           highlight: false },
      { attr: "Expected AEs / SAEs",   value: "Grade 1–2 transient rectal burning/discomfort (expected) · no systemic toxicity anticipated at therapeuticdose", ideal: "",                                                  min: "",                                                           highlight: false },
      { attr: "Key nonclinical gap",   value: "Full histopathology organ scope + rodent GLP study requirement — pending FDA pre-IND concurrence",          ideal: "",                                                            min: "",                                                           highlight: true  },
    ],
  },
];

const TPPDocument: React.FC = () => {
  // pre-compute base row indices for stagger
  const sectionBases = TPP_SECTIONS.map((_, si) => {
    let base = 0;
    for (let k = 0; k < si; k++) base += 1 + TPP_SECTIONS[k].rows.length;
    return base;
  });

  return (
    <div style={{ flex: 1, overflow: "hidden", background: C.bg, padding: "20px 24px" }}>
      {/* Document header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div>
            <h2 style={{ fontFamily: FONT.headline, fontSize: 17, fontWeight: 500, color: C.text, margin: "0 0 2px 0", letterSpacing: -0.3 }}>
              CAPS-001 / Capsaicin Rectal Suppository 5% w/w
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={monoLabel(9, C.textFaint)}>Target Product Profile</span>
              <span style={{ color: C.borderMid }}>·</span>
              <span style={{ ...monoLabel(9, C.accent), background: C.accentBg, border: `1px solid ${C.accentBorder}`, padding: "1px 7px" }}>505(b)(2) NDA</span>
              <span style={{ color: C.borderMid }}>·</span>
              <span style={monoLabel(9, C.textFaint)}>Pre-IND Stage</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ ...monoLabel(9, C.amber), background: C.amberBg, border: `1px solid ${C.amberBorder}`, padding: "2px 9px" }}>
            Nonclinical Gap: HIGH
          </span>
          <span style={monoLabel(9, C.textFaint)}>v2.1 · 2024-12-10</span>
        </div>
      </div>

      {/* Table header */}
      <div style={{ display: "grid", gridTemplateColumns: "170px 1fr 150px 150px", background: C.surfaceAlt, borderBottom: `2px solid ${C.borderStrong}`, border: `1px solid ${C.border}` }}>
        {["Attribute", "Description / Value", "Target — Ideal", "Target — Min"].map((h, i) => (
          <div key={h} style={{ padding: "5px 12px", borderRight: i < 3 ? `1px solid ${C.border}` : "none", ...monoLabel(9, C.textDim) }}>{h}</div>
        ))}
      </div>

      {/* Sections */}
      {TPP_SECTIONS.map((section, si) => {
        const base = sectionBases[si];
        return (
          <React.Fragment key={section.n}>
            {/* Section header row */}
            <div style={{
              display: "grid", gridTemplateColumns: "170px 1fr 150px 150px",
              background: C.surface,
              borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
            }}>
              <div style={{ gridColumn: "1 / -1", padding: "5px 12px" }}>
                <span style={{ ...monoLabel(9, C.accent) }}>{section.n} · {section.title}</span>
                {section.hasTargets && (
                  <span style={{ ...monoLabel(8, C.textFaint), marginLeft: 10 }}>Ideal / Minimum targets shown</span>
                )}
              </div>
            </div>
            {/* Data rows */}
            {section.rows.map((row, ri) => {
              const hl = "highlight" in row && row.highlight;
              return (
              <div key={ri} style={{
                display: "grid", gridTemplateColumns: "170px 1fr 150px 150px",
                borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
                background: hl ? C.amberBg : C.bg,
              }}>
                <div style={{ padding: "6px 12px", borderRight: `1px solid ${C.border}`, background: C.surface, ...monoLabel(9, hl ? C.amber : C.textDim) }}>
                  {row.attr}
                </div>
                <div style={{ padding: "6px 12px", borderRight: `1px solid ${C.border}`, fontFamily: FONT.body, fontSize: 11, color: hl ? C.amber : C.textSub, lineHeight: 1.45, fontWeight: hl ? 500 : 400 }}>
                  {row.value}
                </div>
                <div style={{ padding: "6px 12px", borderRight: `1px solid ${C.border}`, fontFamily: FONT.body, fontSize: 11, color: C.accent, lineHeight: 1.45 }}>
                  {"ideal" in row ? row.ideal : ""}
                </div>
                <div style={{ padding: "6px 12px", fontFamily: FONT.body, fontSize: 11, color: C.textDim, lineHeight: 1.45 }}>
                  {"min" in row ? row.min : ""}
                </div>
              </div>
              );
            })}
          </React.Fragment>
        );
      })}

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, marginTop: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
          <span style={monoLabel(9, C.accent)}>TPP current · CAPS-IND-001</span>
        </div>
        <span style={monoLabel(9, C.textFaint)}>Regulatory query pending · pre-IND submission Q2 2025</span>
      </div>
    </div>
  );
};

// ─── Evidence card ─────────────────────────────────────────────────────────────

const EvidenceCardUI: React.FC<{
  card: (typeof EVIDENCE_CARDS)[number];
  cardOpacity: number;
}> = ({ card, cardOpacity }) => (
  <div
    style={{
      background: C.bg,
      border: `1px solid ${C.border}`,
      borderTop: `2px solid ${C.accent}`,
      padding: "16px 20px",
      opacity: cardOpacity,
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
      <div>
        <span
          style={{
            ...monoLabel(9, C.accent),
            background: C.accentBg,
            border: `1px solid ${C.accentBorder}`,
            padding: "2px 8px",
            display: "inline-block",
            marginBottom: 3,
          }}
        >
          {card.source}
        </span>
        <div style={monoLabel(9, C.textFaint)}>{card.ref}</div>
      </div>
      <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 14, color: C.borderMid }}>
        verified
      </span>
    </div>
    <p
      style={{
        fontFamily: FONT.body, fontSize: 12, lineHeight: 1.65,
        fontStyle: "italic", color: C.textDim,
        margin: "0 0 12px 0",
        borderLeft: `2px solid ${C.border}`, paddingLeft: 12,
      }}
    >
      {card.quote}
    </p>
    <div style={{ background: C.surface, padding: "9px 12px", borderLeft: `2px solid ${C.accent}` }}>
      <span style={{ ...monoLabel(9, C.accent), display: "block", marginBottom: 4 }}>Turtl Analysis</span>
      <p style={{ fontFamily: FONT.body, fontSize: 12, color: C.textSub, margin: 0, lineHeight: 1.6 }}>
        {card.summary}
      </p>
    </div>
  </div>
);

// ─── Ruling cards ──────────────────────────────────────────────────────────────

interface RulingData {
  label: string; question: string; verdict: string; verdictFontSize: number;
  topBorder: string; verdictColor: string; verdictBg: string; verdictBorder: string;
  reasoning: string; actions: string[];
}

const RULING_A: RulingData = {
  label: "RULING A — Histopathology",
  question: "Can we limit histopathology to rectum and colon?",
  verdict: "NOT SUPPORTED BY CURRENT GUIDANCE",
  verdictFontSize: 12,
  topBorder: C.red, verdictColor: C.red, verdictBg: C.redBg, verdictBorder: C.redBorder,
  reasoning:
    "ICH M3(R2) Table 1 specifies a full organ histopathological examination for repeat-dose studies of ≥1 month duration supporting Phase 1 clinical trials. The 505(b)(2) pathway does not inherently exempt applicants from nonclinical study requirements; FDA written concurrence is required to deviate from standard guidance. A novel administration route and novel indication each constitute independent factors requiring full nonclinical review per applicable guidance.",
  actions: [
    "FDA written concurrence at pre-IND meeting is required prior to any limitation of organ sampling scope.",
    "Applicability of 505(b)(2) to nonclinical study design modification requires explicit FDA confirmation at pre-IND stage.",
  ],
};

const RULING_B: RulingData = {
  label: "RULING B — Rodent study",
  question: "Do we need a rodent GLP study on top of the dog study?",
  verdict: "LIKELY REQUIRED PER 21 CFR 312.23(a)(8)",
  verdictFontSize: 12,
  topBorder: C.amber, verdictColor: C.amber, verdictBg: C.amberBg, verdictBorder: C.amberBorder,
  reasoning:
    "Standard nonclinical packages per ICH M3(R2) and 21 CFR 312.23(a)(8) require toxicology data from a minimum of two species — one rodent and one non-rodent — for novel indications. The completed 4-week GLP dog study satisfies the non-rodent requirement. The absence of a rodent GLP study represents an identified gap under current guidance, subject to review during the IND 30-day safety evaluation period.",
  actions: [
    "Whether a rodent GLP study may be waived requires written FDA concurrence obtained at the pre-IND meeting.",
    "21 CFR 312.23(a)(8) establishes minimum pharmacology/toxicology data requirements; any deviation must be documented with FDA.",
  ],
};

const RulingCard: React.FC<{ ruling: RulingData; opacity: number }> = ({ ruling, opacity }) => (
  <div
    style={{
      flex: 1, background: C.bg,
      border: `1px solid ${C.border}`,
      borderTop: `3px solid ${ruling.topBorder}`,
      padding: "18px 20px", opacity,
    }}
  >
    <span style={{ ...monoLabel(9, C.textFaint), display: "block", marginBottom: 7 }}>
      {ruling.label}
    </span>
    <p style={{ fontFamily: FONT.body, fontSize: 12, color: C.textDim, lineHeight: 1.5, margin: "0 0 12px 0" }}>
      {ruling.question}
    </p>
    <div
      style={{
        display: "inline-flex", alignItems: "center",
        background: ruling.verdictBg,
        border: `1px solid ${ruling.verdictBorder}`,
        padding: "4px 14px", marginBottom: 12,
      }}
    >
      <span
        style={{
          fontFamily: FONT.label, fontSize: ruling.verdictFontSize, fontWeight: 700,
          color: ruling.verdictColor, letterSpacing: "0.04em", lineHeight: 1.3,
        }}
      >
        {ruling.verdict}
      </span>
    </div>
    <p style={{ fontFamily: FONT.body, fontSize: 12, color: C.textDim, lineHeight: 1.7, margin: "0 0 12px 0" }}>
      {ruling.reasoning}
    </p>
    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
      <span style={{ ...monoLabel(9, C.accent), display: "block", marginBottom: 7 }}>
        What to confirm:
      </span>
      {ruling.actions.map((action, i) => (
        <div key={i} style={{ display: "flex", gap: 7, marginBottom: 5 }}>
          <span style={{ color: C.accent, fontWeight: 600, flexShrink: 0, fontSize: 11 }}>→</span>
          <span style={{ fontFamily: FONT.body, fontSize: 11, color: C.textSub, lineHeight: 1.6 }}>
            {action}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// ─── Pre-IND questions ────────────────────────────────────────────────────────

const PRE_IND_QUESTIONS = [
  "We have completed a 4-week GLP dog study via rectal administration. We request FDA concurrence that this, combined with existing published capsaicin safety data, is sufficient to waive the rodent GLP study requirement.",
  "We request FDA concurrence that histopathology limited to rectum and colon is acceptable given the local delivery route and evidence of minimal systemic absorption. Please confirm acceptable organ sampling scope.",
  "If a rodent GLP study is required, please advise on acceptable study duration (14-day vs. 28-day) and whether existing capsaicin rodent literature justifies a reduced study design.",
];

// ─── Interpretation zone (analysis tab content) ───────────────────────────────

const InterpretationZone: React.FC<{
  phase: "analyzing" | "complete";
  visibleCards: number;
  frame: number;
  fps: number;
}> = ({ phase, visibleCards, frame, fps }) => {
  const isComplete = phase === "complete";
  const submitFrame = 11 * fps;
  const completeFrame = 21 * fps;

  const fi = (start: number, end: number) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const rulingAOp = fi(completeFrame, completeFrame + fps * 0.6);
  const rulingBOp = fi(completeFrame + fps * 4, completeFrame + fps * 4.6);
  const preIndOp  = fi(completeFrame + fps * 8, completeFrame + fps * 8.6);

  return (
    <div style={{ flex: 1, overflow: "hidden", background: C.bg, padding: "18px 22px" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 13, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
          <span style={monoLabel(10, C.accent)}>Regulatory Intelligence</span>
          <span style={{ color: C.border }}>·</span>
          <span style={monoLabel(10, C.textFaint)}>
            {isComplete ? "Applicability Rulings" : "Nonclinical Evaluation"}
          </span>
        </div>
        <h1
          style={{
            fontFamily: FONT.headline, fontSize: 20, fontWeight: 500,
            color: C.text, margin: "0 0 4px 0", letterSpacing: -0.3,
          }}
        >
          {isComplete ? "Applicability Rulings" : "Capsaicin Suppository IND — Nonclinical Safety"}
        </h1>
        <p style={{ fontFamily: FONT.body, fontSize: 12, color: C.textDim, margin: 0 }}>
          {isComplete
            ? "505(b)(2) · Rectal route · Novel SCI indication · Cross-ref: protocol_v3.pdf"
            : "Cross-referencing protocol_v3.pdf against ICH M3(R2), 21 CFR 312.23, and 505(b)(2) guidance..."}
        </p>
      </div>

      {/* Analyzing: framework + evidence cards */}
      {!isComplete && (
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <div
            style={{
              background: C.surface, border: `1px solid ${C.border}`,
              padding: "13px 16px",
              opacity: fi(submitFrame, submitFrame + 15),
            }}
          >
            <span style={{ ...monoLabel(9, C.accent), display: "block", marginBottom: 9 }}>
              Regulatory Framework Identified
            </span>
            {[
              "505(b)(2) NDA pathway",
              "ICH M3(R2) — Nonclinical Safety Studies for Human Clinical Trials",
              "21 CFR 312.23(a)(8) — IND Pharmacology/Toxicology",
              "FDA Guidance: Nonclinical Safety Evaluation of Pharmaceutical Excipients",
            ].map((fw, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: 7, marginBottom: 6,
                  opacity: fi(submitFrame + i * fps * 0.75, submitFrame + i * fps * 0.75 + 14),
                }}
              >
                <div
                  style={{
                    width: 15, height: 15,
                    border: `1px solid ${C.accent}`, background: C.accentBg,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}
                >
                  <span style={{ color: C.accent, fontSize: 10, fontWeight: 700 }}>✓</span>
                </div>
                <span style={{ fontFamily: FONT.body, fontSize: 12, color: C.textSub }}>{fw}</span>
              </div>
            ))}
            <div
              style={{
                marginTop: 9, paddingTop: 9, borderTop: `1px solid ${C.border}`,
                display: "flex", alignItems: "center", gap: 8,
                opacity: fi(submitFrame + 4 * fps * 0.75, submitFrame + 4 * fps * 0.75 + 14),
              }}
            >
              <span style={{ fontFamily: FONT.label, fontSize: 10, color: C.amber, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>
                ⚡ Grey Zone: HIGH
              </span>
              <span style={{ fontFamily: FONT.body, fontSize: 11, color: C.textDim }}>
                — 505(b)(2) waiver + route novelty + indication novelty
              </span>
            </div>
          </div>

          {EVIDENCE_CARDS.slice(0, visibleCards).map((card, i) => {
            const s = submitFrame + i * 1.5 * fps;
            return <EvidenceCardUI key={card.id} card={card} cardOpacity={fi(s, s + fps * 0.5)} />;
          })}

          {visibleCards < EVIDENCE_CARDS.length && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, opacity: 0.6 }} />
              <span style={monoLabel(10, C.textDim)}>Analyzing regulatory sources...</span>
            </div>
          )}
        </div>
      )}

      {/* Complete: rulings + pre-IND */}
      {isComplete && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <RulingCard ruling={RULING_A} opacity={rulingAOp} />
            <RulingCard ruling={RULING_B} opacity={rulingBOp} />
          </div>
          <div style={{ opacity: preIndOp }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={monoLabel(9, C.accent)}>Pre-IND Meeting Prep</span>
              <span style={{ flex: 1, height: 1, background: C.border }} />
              <span style={monoLabel(9, C.textFaint)}>copy-paste ready</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {PRE_IND_QUESTIONS.map((q, i) => (
                <div
                  key={i}
                  style={{
                    background: C.surface, border: `1px solid ${C.border}`,
                    borderLeft: `3px solid ${C.accent}`,
                    padding: "10px 14px", display: "flex", gap: 11,
                  }}
                >
                  <span style={{ fontFamily: FONT.label, fontSize: 11, fontWeight: 700, color: C.accent, flexShrink: 0 }}>
                    Q{i + 1}
                  </span>
                  <span style={{ fontFamily: FONT.body, fontSize: 12, color: C.textSub, lineHeight: 1.65 }}>
                    {q}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Copilot panel ────────────────────────────────────────────────────────────

const CopilotPanel: React.FC<{ phase: Phase; typingProgress: number }> = ({
  phase, typingProgress,
}) => {
  const isIdle = phase === "idle";
  const fullQuery =
    "We've completed a 4-week GLP dog study (rectum, colon). Novel indication — bowel dysfunction in SCI patients. Do we need full histopathology on all organs? Do we need a rodent GLP study on top of the dog study?";
  const visibleQuery = isIdle
    ? fullQuery.slice(0, Math.floor(typingProgress * fullQuery.length))
    : fullQuery;
  const showCursor = isIdle && typingProgress > 0 && typingProgress < 1;

  return (
    <div
      style={{
        width: 300, background: C.surface,
        borderLeft: `1px solid ${C.border}`,
        display: "flex", flexDirection: "column", flexShrink: 0,
      }}
    >
      <div
        style={{
          height: 36, padding: "0 14px",
          display: "flex", alignItems: "center", gap: 7,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 13, color: C.accent }}>
          auto_awesome
        </span>
        <span style={monoLabel(10, C.textDim)}>AI Copilot</span>
      </div>

      <div style={{ flex: 1, overflow: "hidden", padding: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Indication */}
          <div>
            <label style={{ ...monoLabel(9, C.textFaint), display: "block", marginBottom: 5 }}>
              Drug Indication
            </label>
            <div
              style={{
                background: C.bg, border: `1px solid ${C.border}`,
                padding: "7px 10px", fontFamily: FONT.body, fontSize: 12, color: C.textSub,
              }}
            >
              Bowel Dysfunction (Spinal Cord Injury)
            </div>
          </div>
          {/* Modality */}
          <div>
            <label style={{ ...monoLabel(9, C.textFaint), display: "block", marginBottom: 5 }}>
              Modality / Pathway
            </label>
            <div
              style={{
                background: C.bg, border: `1px solid ${C.border}`,
                padding: "7px 10px", fontFamily: FONT.body, fontSize: 12, color: C.textSub,
              }}
            >
              Capsaicin Suppository, 505(b)(2)
            </div>
          </div>
          {/* Query */}
          <div>
            <label style={{ ...monoLabel(9, C.textFaint), display: "block", marginBottom: 5 }}>
              Query
            </label>
            <div
              style={{
                background: C.bg, border: `1px solid ${C.border}`,
                padding: "8px 10px", fontFamily: FONT.body, fontSize: 11, color: C.textSub,
                minHeight: 80, lineHeight: 1.6,
              }}
            >
              {visibleQuery || (
                <span style={{ color: C.textFaint }}>Describe your regulatory situation...</span>
              )}
              {showCursor && (
                <span
                  style={{
                    display: "inline-block", width: 2, height: "0.9em",
                    background: C.accent, marginLeft: 1, verticalAlign: "text-bottom",
                  }}
                />
              )}
            </div>
          </div>
          {/* Submit */}
          <div
            style={{
              background: phase === "analyzing" ? "rgba(15,143,119,0.55)" : C.text,
              color: C.bg, padding: "9px 0", textAlign: "center",
              ...monoLabel(10, C.bg), fontWeight: 600,
            }}
          >
            SUBMIT QUERY
          </div>
        </div>

        {/* Idle info */}
        {isIdle && (
          <div
            style={{
              marginTop: 16, background: C.accentBg,
              border: `1px solid ${C.accentBorder}`,
              padding: "10px 12px", display: "flex", gap: 8,
            }}
          >
            <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 14, color: C.accent }}>info</span>
            <p style={{ fontFamily: FONT.body, fontSize: 11, color: C.accentStrong, lineHeight: 1.45, margin: 0 }}>
              Copilot will cross-reference protocol_v3.pdf against ICH M3(R2), 21 CFR 312.23(a)(8), and 505(b)(2) guidance.
            </p>
          </div>
        )}

        {/* Precedent cases */}
        {phase !== "idle" && (
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                ...monoLabel(9, C.textDim),
                borderBottom: `1px solid ${C.border}`, paddingBottom: 7, marginBottom: 11,
              }}
            >
              Precedent Cases
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {PRECEDENT_CASES.map((c) => (
                <div
                  key={c.id}
                  style={{ background: C.bg, border: `1px solid ${C.border}`, padding: "10px 12px" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontFamily: FONT.body, fontSize: 12, fontWeight: 600, color: C.text }}>
                      {c.name}
                    </span>
                    <span
                      style={{
                        ...monoLabel(8, C.accent),
                        background: C.accentBg, border: `1px solid ${C.accentBorder}`,
                        padding: "1px 5px",
                      }}
                    >
                      {c.statusLabel}
                    </span>
                  </div>
                  <div style={monoLabel(9, C.textFaint)}>{c.company} · {c.indication}</div>
                  <div style={{ fontFamily: FONT.body, fontSize: 10, color: C.accent, fontWeight: 500, margin: "4px 0 6px" }}>
                    {c.summary}
                  </div>
                  <p
                    style={{
                      fontFamily: FONT.body, fontSize: 10, color: C.textDim, lineHeight: 1.5, margin: 0,
                      paddingTop: 6, borderTop: `1px solid ${C.border}`, fontStyle: "italic",
                    }}
                  >
                    {c.fdaResponse}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Status bar ───────────────────────────────────────────────────────────────

const StatusBarUI: React.FC<{ phase: Phase }> = ({ phase }) => (
  <div
    style={{
      height: 26, background: C.surfaceAlt, borderTop: `1px solid ${C.border}`,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "0 12px", flexShrink: 0,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {phase === "idle" ? (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.borderMid }} />
            <span style={monoLabel(10, C.textDim)}>No active query</span>
          </div>
          <span style={monoLabel(10, C.textFaint)}>v2.4.0-stable</span>
        </>
      ) : (
        <>
          <span style={monoLabel(10, C.textFaint)}>FDA Reference Source</span>
          <span style={{ color: C.accent, fontWeight: 700, fontSize: 14 }}>|</span>
          <span style={monoLabel(10, C.accent)}>ICH M3(R2) · 21 CFR 312.23 · 505(b)(2)</span>
          <div
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: C.accentBg, padding: "1px 6px",
            }}
          >
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.accent }} />
            <span style={monoLabel(8, C.accent)}>Verified</span>
          </div>
        </>
      )}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {phase !== "idle" && (
        <span style={{ ...monoLabel(10, C.amber), fontWeight: 600 }}>
          Grey Zone: HIGH — Written FDA waiver required
        </span>
      )}
      <span style={monoLabel(10, C.textFaint)}>v2.4.0-stable</span>
    </div>
  </div>
);

// ─── Main workspace scene ─────────────────────────────────────────────────────

export const WorkspaceScene: React.FC = () => {
  useMaterialSymbols();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phase = getPhase(frame, fps);
  const visibleCards = getVisibleCards(frame, fps);

  // Tab appears at submit with a quick fade-in
  const tabOpacity = interpolate(frame, [11 * fps, 11 * fps + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Camera focal points ───────────────────────────────────────────────────
  // The workspace is 1920×1080. Copilot is at right (x≈1630–1920).
  // Main panel: x≈296–1620 (after activity bar 48 + explorer 240 = 288, copilot 300 wide).
  // File tree: x≈0–288 (activity 48 + explorer 240).
  // Tab bar is at y≈46 (nav) + 34 (tab bar) = 80px from top.
  const DEFAULT_FOCUS  = { x: 960,  y: 540 };
  const COPILOT_FOCUS  = { x: 1680, y: 280 }; // zoom into copilot panel
  const RULING_A_FOCUS = { x: 640,  y: 420 }; // left ruling card
  const RULING_B_FOCUS = { x: 1280, y: 420 }; // right ruling card
  const FILETREE_FOCUS = { x: 250,  y: 320 }; // file tree with nested v1/v2/v3
  const RULING_SCALE   = 1.4;
  const FILETREE_SCALE = 2.0;

  const ease = Easing.inOut(Easing.quad);
  function lerp(f: number, s: number, e: number, from: number, to: number) {
    return interpolate(f, [s, e], [from, to], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
    });
  }
  function lerpPt(f: number, s: number, e: number, from: {x:number;y:number}, to: {x:number;y:number}) {
    const t = interpolate(f, [s, e], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
    });
    return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
  }

  const { scale, focus } = (() => {
    // 0–2s: start zoomed on file tree (TPP file visible, "just clicked")
    if (frame < 2 * fps) return { scale: FILETREE_SCALE, focus: FILETREE_FOCUS };
    // 2–3.5s: pull back to full view — TPP document "opens" in main panel
    if (frame < 3.5 * fps) return {
      scale: lerp(frame, 2*fps, 3.5*fps, FILETREE_SCALE, 1),
      focus: lerpPt(frame, 2*fps, 3.5*fps, FILETREE_FOCUS, DEFAULT_FOCUS),
    };
    // 3.5–5.5s: hold full view — TPP visible
    if (frame < 5.5 * fps) return { scale: 1, focus: DEFAULT_FOCUS };
    // 5.5–7.5s: zoom to AI copilot
    if (frame < 7.5 * fps) return {
      scale: lerp(frame, 5.5*fps, 7.5*fps, 1, 2.2),
      focus: lerpPt(frame, 5.5*fps, 7.5*fps, DEFAULT_FOCUS, COPILOT_FOCUS),
    };
    // 7.5–11s: hold on copilot (typing)
    if (frame < 11 * fps) return { scale: 2.2, focus: COPILOT_FOCUS };
    // 11–13s: pull back to reveal new tab opening
    if (frame < 13 * fps) return {
      scale: lerp(frame, 11*fps, 13*fps, 2.2, 1),
      focus: lerpPt(frame, 11*fps, 13*fps, COPILOT_FOCUS, DEFAULT_FOCUS),
    };
    // 13–25s: full view — analysis appears in new tab
    if (frame < 25 * fps) return { scale: 1, focus: DEFAULT_FOCUS };
    // 25–27s: zoom onto Ruling A
    if (frame < 27 * fps) return {
      scale: lerp(frame, 25*fps, 26*fps, 1, RULING_SCALE),
      focus: lerpPt(frame, 25*fps, 26*fps, DEFAULT_FOCUS, RULING_A_FOCUS),
    };
    // 27–29s: hold Ruling A
    if (frame < 29 * fps) return { scale: RULING_SCALE, focus: RULING_A_FOCUS };
    // 29–31s: pull back
    if (frame < 31 * fps) return {
      scale: lerp(frame, 29*fps, 30.5*fps, RULING_SCALE, 1),
      focus: lerpPt(frame, 29*fps, 30.5*fps, RULING_A_FOCUS, DEFAULT_FOCUS),
    };
    // 31–33s: zoom onto Ruling B
    if (frame < 33 * fps) return {
      scale: lerp(frame, 31*fps, 32*fps, 1, RULING_SCALE),
      focus: lerpPt(frame, 31*fps, 32*fps, DEFAULT_FOCUS, RULING_B_FOCUS),
    };
    // 33–35s: hold Ruling B
    if (frame < 35 * fps) return { scale: RULING_SCALE, focus: RULING_B_FOCUS };
    // 35–37s: pull back
    if (frame < 37 * fps) return {
      scale: lerp(frame, 35*fps, 36.5*fps, RULING_SCALE, 1),
      focus: lerpPt(frame, 35*fps, 36.5*fps, RULING_B_FOCUS, DEFAULT_FOCUS),
    };
    // 37–43s: full view with pre-IND questions
    if (frame < 43 * fps) return { scale: 1, focus: DEFAULT_FOCUS };
    // 43–45s: zoom into file tree — v1/v2/v3 versions
    if (frame < 45 * fps) return {
      scale: lerp(frame, 43*fps, 44.5*fps, 1, FILETREE_SCALE),
      focus: lerpPt(frame, 43*fps, 44.5*fps, DEFAULT_FOCUS, FILETREE_FOCUS),
    };
    // 45–48.5s: hold on file tree
    if (frame < 48.5 * fps) return { scale: FILETREE_SCALE, focus: FILETREE_FOCUS };
    // 48.5–50s: pull back
    if (frame < 50 * fps) return {
      scale: lerp(frame, 48.5*fps, 50*fps, FILETREE_SCALE, 1),
      focus: lerpPt(frame, 48.5*fps, 50*fps, FILETREE_FOCUS, DEFAULT_FOCUS),
    };
    // 50s+: final full view
    return { scale: 1, focus: DEFAULT_FOCUS };
  })();

  const tx = 960 - focus.x * scale;
  const ty = 540 - focus.y * scale;

  // Typing starts once we're zoomed into copilot (7.5s), finishes before submit (11s)
  const typingProgress = interpolate(frame, [7.5 * fps, 10.5 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const fadeToBlack = interpolate(frame, [49.5 * fps, 51 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // Scroll to reveal pre-IND questions during the 37–43s full-view window
  const scrollY = interpolate(frame, [38 * fps, 43 * fps], [0, -320], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT.body }}>
      <div
        style={{
          width: 1920, height: 1080,
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          transformOrigin: "0 0",
          display: "flex", flexDirection: "column",
        }}
      >
        <TopNavBar phase={phase} />
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <ActivityBar />
          <ExplorerPanel />

          {/* Main content: tab bar + panel content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <TabBar phase={phase} tabOpacity={tabOpacity} />
            {phase === "idle" ? (
              <TPPDocument />
            ) : (
              <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
                <div
                  style={{
                    transform: `translateY(${scrollY}px)`,
                    position: "absolute", inset: 0,
                  }}
                >
                  <InterpretationZone
                    phase={phase as "analyzing" | "complete"}
                    visibleCards={visibleCards}
                    frame={frame}
                    fps={fps}
                  />
                </div>
              </div>
            )}
          </div>

          <CopilotPanel phase={phase} typingProgress={typingProgress} />
        </div>
        <StatusBarUI phase={phase} />
      </div>

      {fadeToBlack > 0 && (
        <AbsoluteFill style={{ background: "black", opacity: fadeToBlack }} />
      )}
    </AbsoluteFill>
  );
};
