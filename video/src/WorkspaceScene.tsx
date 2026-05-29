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

// ─── Data ────────────────────────────────────────────────────────────────────

const EVIDENCE_CARDS = [
  {
    id: "ich-m3r2",
    source: "ICH M3(R2)",
    ref: "Table 1 — Repeat-dose tox",
    quote: `"A full organ histopathological examination should be performed on animals from the high-dose and control groups in studies of one month or greater duration."`,
    summary:
      "Full organ panel required for repeat-dose tox supporting Phase 1. Partial histopathology (rectum/colon only) requires explicit FDA written agreement.",
  },
  {
    id: "21cfr-312",
    source: "21 CFR 312.23(a)(8)",
    ref: "IND Pharm/Tox requirements",
    quote: `"The IND must contain adequate information about pharmacological and toxicological studies... to permit an assessment of the reasonable safety of the drug for testing in humans."`,
    summary:
      "Route-specific and indication-specific requirements apply. A new rectal route for a novel indication triggers a fresh nonclinical review.",
  },
  {
    id: "505b2",
    source: "505(b)(2) FDA Guidance",
    ref: "Applications Covered by §505(b)(2)",
    quote: `"An applicant must submit all the information required for an NDA. Reliance on published literature does not relieve the applicant of this obligation."`,
    summary:
      "505(b)(2) does not automatically waive nonclinical requirements. Written FDA concurrence is required before any study is omitted.",
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
    fdaResponse: `"Full systemic safety required despite existing capsaicin literature. 'Ubiquitous use' not accepted as nonclinical safety waiver."`,
  },
  {
    id: "novel-route",
    name: "505(b)(2) Novel Routes",
    company: "Multiple applicants",
    indication: "Various (alternate route)",
    statusLabel: "Consistent pattern",
    summary: "New nonclinical data required",
    fdaResponse: `"New nonclinical data required when route substantially changes absorption, even for well-characterized compounds."`,
  },
];

const EXPLORER_FOLDERS: {
  name: string;
  open: boolean;
  active?: boolean;
  files?: { name: string; active: boolean; dim?: boolean }[];
}[] = [
  {
    name: "regulatory-refs",
    open: true,
    files: [
      { name: "ICH-M3R2_Source1.pdf",       active: true },
      { name: "21CFR-312.23_Source2.pdf",    active: false },
      { name: "505b2-guidance_Source5.pdf",  active: false },
    ],
  },
  {
    name: "preclinical",
    open: true,
    active: true,
    files: [
      { name: "dog-glp-4wk_v1.pdf", active: false, dim: true },
      { name: "dog-glp-4wk_v2.pdf", active: false, dim: true },
      { name: "dog-glp-4wk_v3.pdf", active: true },
    ],
  },
  { name: "ind-sections",  open: false },
  { name: "pre-ind-prep",  open: false },
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

// Mono label style (mirrors landing page "font-mono uppercase tracking-[0.14em]")
const monoLabel = (size = 10, color: string = C.textFaint): React.CSSProperties => ({
  fontFamily: FONT.label,
  fontSize: size,
  textTransform: "uppercase" as const,
  letterSpacing: "0.14em",
  color,
});

// ─── Activity bar ─────────────────────────────────────────────────────────────

const ActivityBar: React.FC = () => {
  const icons = ["folder_open", "search", "account_tree", "pest_control", "smart_toy"];
  return (
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
      {icons.map((icon, i) => (
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
            width: 28,
            height: 28,
            background: C.border,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Material Symbols Outlined",
            fontSize: 15,
            color: C.textDim,
          }}
        >
          account_circle
        </div>
      </div>
    </div>
  );
};

// ─── Explorer panel ───────────────────────────────────────────────────────────

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
    {/* Header */}
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

    <div style={{ padding: "8px 0", flex: 1, overflow: "hidden" }}>
      {/* Project root */}
      <div
        style={{
          padding: "3px 14px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 13, color: C.textFaint }}>
          chevron_right
        </span>
        <span style={monoLabel(9, C.textDim)}>CAPS-IND-001 / SUPP-505B2</span>
      </div>

      <div style={{ paddingLeft: 6 }}>
        {EXPLORER_FOLDERS.map((folder) => (
          <div key={folder.name}>
            {/* Folder row */}
            <div
              style={{
                padding: "3px 8px",
                paddingLeft: 14,
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: folder.active ? C.accentBg : "transparent",
                borderLeft: folder.active
                  ? `2px solid ${C.accentBorder}`
                  : "2px solid transparent",
              }}
            >
              <span
                style={{
                  fontFamily: "Material Symbols Outlined",
                  fontSize: 12,
                  color: C.textFaint,
                  transform: folder.open ? "rotate(90deg)" : "none",
                }}
              >
                chevron_right
              </span>
              <span
                style={{
                  fontFamily: "Material Symbols Outlined",
                  fontSize: 14,
                  color: folder.open ? C.accent : C.textDim,
                }}
              >
                {folder.open ? "folder_open" : "folder"}
              </span>
              <span
                style={{
                  ...monoLabel(9, folder.active ? C.accentStrong : C.textDim),
                  textTransform: "uppercase",
                }}
              >
                {folder.name}
              </span>
            </div>

            {/* Files */}
            {folder.open &&
              folder.files?.map((file) => (
                <div
                  key={file.name}
                  style={{
                    padding: "2px 8px",
                    paddingLeft: 38,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: file.active ? C.accentBg : "transparent",
                    borderLeft: file.active
                      ? `2px solid ${C.accent}`
                      : "2px solid transparent",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Material Symbols Outlined",
                      fontSize: 12,
                      color: file.active ? C.accent : file.dim ? C.borderMid : C.textFaint,
                    }}
                  >
                    description
                  </span>
                  <span
                    style={{
                      fontFamily: FONT.label,
                      fontSize: 9,
                      letterSpacing: 0,
                      color: file.active ? C.accentStrong : file.dim ? C.borderMid : C.textDim,
                      fontWeight: file.active ? 600 : 400,
                    }}
                  >
                    {file.name}
                  </span>
                </div>
              ))}
          </div>
        ))}
      </div>
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
      {/* Left: brand + tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
          <span
            style={{
              fontFamily: FONT.headline,
              fontSize: 15,
              fontWeight: 600,
              color: C.text,
              letterSpacing: -0.3,
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

      {/* Right: search + open folder */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {phase !== "idle" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: C.surface,
              border: `1px solid ${C.border}`,
              padding: "5px 12px",
              gap: 8,
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
            background: C.text,
            color: C.bg,
            padding: "6px 14px",
            fontFamily: FONT.label,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 13 }}>folder_open</span>
          Open Folder
        </div>
      </div>
    </div>
  );
};

// ─── Idle center ──────────────────────────────────────────────────────────────

const IdleCenter: React.FC = () => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
    {/* Zone header bar */}
    <div
      style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: "7px 16px",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 13, color: C.accent }}>
        data_exploration
      </span>
      <span style={monoLabel(10, C.textDim)}>Interpretation Zone</span>
    </div>

    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 64,
        background: C.bg,
        position: "relative",
      }}
    >
      {/* Empty state icon */}
      <div
        style={{
          width: 80,
          height: 80,
          border: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 32, color: C.textFaint }}>
          find_in_page
        </span>
      </div>

      <h3
        style={{
          fontFamily: FONT.headline,
          fontSize: 18,
          fontWeight: 500,
          color: C.text,
          margin: "0 0 8px 0",
          letterSpacing: -0.3,
        }}
      >
        Workspace Idle
      </h3>
      <p
        style={{
          fontFamily: FONT.body,
          fontSize: 13,
          color: C.textDim,
          maxWidth: 340,
          lineHeight: 1.65,
          margin: "0 0 32px 0",
        }}
      >
        Submit a query to surface applicable guidance and precedent for your IND nonclinical package.
      </p>

      {/* Hint grid */}
      <div style={{ display: "flex", gap: 0, border: `1px solid ${C.border}` }}>
        {[
          { label: "Shortcut",  value: "⌘ + Enter to submit" },
          { label: "Mode",      value: "Regulatory Interpretation v2.4" },
        ].map(({ label, value }, i) => (
          <div
            key={label}
            style={{
              padding: "14px 20px",
              textAlign: "left",
              borderLeft: i > 0 ? `1px solid ${C.border}` : "none",
              background: C.bg,
            }}
          >
            <span style={{ ...monoLabel(9, C.accent), display: "block", marginBottom: 5 }}>
              {label}
            </span>
            <span style={{ fontFamily: FONT.body, fontSize: 12, color: C.textDim }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Watermark */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          opacity: 0.025,
        }}
      >
        <span
          style={{ fontSize: 240, fontWeight: 700, color: C.text, letterSpacing: -4 }}
        >
          TURTL
        </span>
      </div>
    </div>
  </div>
);

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
      padding: "18px 20px",
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
        fontFamily: FONT.body,
        fontSize: 12,
        lineHeight: 1.65,
        fontStyle: "italic",
        color: C.textDim,
        margin: "0 0 14px 0",
        borderLeft: `2px solid ${C.border}`,
        paddingLeft: 12,
      }}
    >
      {card.quote}
    </p>
    <div
      style={{
        background: C.surface,
        padding: "10px 12px",
        borderLeft: `2px solid ${C.accent}`,
      }}
    >
      <span style={{ ...monoLabel(9, C.accent), display: "block", marginBottom: 4 }}>
        Turtl Analysis
      </span>
      <p style={{ fontFamily: FONT.body, fontSize: 12, color: C.textSub, margin: 0, lineHeight: 1.6 }}>
        {card.summary}
      </p>
    </div>
  </div>
);

// ─── Ruling cards ─────────────────────────────────────────────────────────────

const RULING_A = {
  label: "RULING A — Histopathology",
  question: "Can we limit histopathology to rectum and colon?",
  verdict: "NO",
  topBorder: C.red,
  verdictColor: C.red,
  verdictBg: C.redBg,
  verdictBorder: C.redBorder,
  reasoning:
    "ICH M3(R2) Table 1 requires a full organ histopathology panel for repeat-dose tox studies supporting Phase 1. The 505(b)(2) pathway does not waive this unless FDA explicitly agrees in writing. A new rectal route + novel SCI indication are typically sufficient to trigger a full nonclinical review.",
  actions: [
    "Request FDA written concurrence at pre-IND BEFORE running the study.",
    "Do not assume 505(b)(2) extends to nonclinical studies without explicit FDA agreement.",
  ],
};

const RULING_B = {
  label: "RULING B — Rodent study",
  question: "Do we need a rodent GLP study on top of the dog study?",
  verdict: "LIKELY YES",
  topBorder: C.amber,
  verdictColor: C.amber,
  verdictBg: C.amberBg,
  verdictBorder: C.amberBorder,
  reasoning:
    "FDA's standard nonclinical package for a novel indication requires at least two species — one rodent and one non-rodent. The dog study covers the non-rodent arm only. Without a rodent study the IND nonclinical section has a gap FDA will flag in their 30-day review.",
  actions: [
    "Do not submit without (a) a complete rodent GLP study or (b) written FDA waiver from pre-IND.",
    "Plan 6–9 months for rodent study if FDA does not grant the waiver.",
  ],
};

interface RulingData {
  label: string; question: string; verdict: string;
  topBorder: string; verdictColor: string; verdictBg: string; verdictBorder: string;
  reasoning: string; actions: string[];
}
const RulingCard: React.FC<{ ruling: RulingData; opacity: number }> = ({
  ruling,
  opacity,
}) => (
  <div
    style={{
      flex: 1,
      background: C.bg,
      border: `1px solid ${C.border}`,
      borderTop: `3px solid ${ruling.topBorder}`,
      padding: "20px 22px",
      opacity,
    }}
  >
    <span style={{ ...monoLabel(9, C.textFaint), display: "block", marginBottom: 8 }}>
      {ruling.label}
    </span>
    <p
      style={{
        fontFamily: FONT.body,
        fontSize: 12,
        color: C.textDim,
        lineHeight: 1.5,
        margin: "0 0 14px 0",
      }}
    >
      {ruling.question}
    </p>
    {/* Verdict badge */}
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: ruling.verdictBg,
        border: `1px solid ${ruling.verdictBorder}`,
        padding: "5px 16px",
        marginBottom: 14,
      }}
    >
      <span
        style={{
          fontFamily: FONT.headline,
          fontSize: 22,
          fontWeight: 700,
          color: ruling.verdictColor,
          letterSpacing: -0.5,
        }}
      >
        {ruling.verdict}
      </span>
    </div>
    <p
      style={{
        fontFamily: FONT.body,
        fontSize: 12,
        color: C.textDim,
        lineHeight: 1.7,
        margin: "0 0 14px 0",
      }}
    >
      {ruling.reasoning}
    </p>
    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
      <span style={{ ...monoLabel(9, C.accent), display: "block", marginBottom: 8 }}>
        What you need to do:
      </span>
      {ruling.actions.map((action, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
          <span style={{ color: C.accent, fontWeight: 600, flexShrink: 0, fontSize: 12 }}>→</span>
          <span
            style={{ fontFamily: FONT.body, fontSize: 12, color: C.textSub, lineHeight: 1.6 }}
          >
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

// ─── Interpretation zone ──────────────────────────────────────────────────────

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
    interpolate(frame, [start, end], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const rulingAOp  = fi(completeFrame, completeFrame + fps * 0.6);
  const rulingBOp  = fi(completeFrame + fps * 4, completeFrame + fps * 4.6);
  const preIndOp   = fi(completeFrame + fps * 8, completeFrame + fps * 8.6);

  return (
    <div
      style={{
        flex: 1,
        overflow: "hidden",
        background: C.bg,
        padding: "20px 24px",
      }}
    >
      {/* Section header */}
      <div
        style={{
          borderBottom: `1px solid ${C.border}`,
          paddingBottom: 14,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={monoLabel(10, C.accent)}>Regulatory Intelligence</span>
          <span style={{ color: C.border }}>·</span>
          <span style={monoLabel(10, C.textFaint)}>
            {isComplete ? "Applicability Rulings" : "Nonclinical Evaluation"}
          </span>
        </div>
        <h1
          style={{
            fontFamily: FONT.headline,
            fontSize: 22,
            fontWeight: 500,
            color: C.text,
            margin: "0 0 5px 0",
            letterSpacing: -0.4,
          }}
        >
          {isComplete
            ? "Applicability Rulings"
            : "Capsaicin Suppository IND — Nonclinical Safety"}
        </h1>
        <p style={{ fontFamily: FONT.body, fontSize: 12, color: C.textDim, margin: 0 }}>
          {isComplete
            ? "505(b)(2) pathway · Rectal route · Novel SCI indication"
            : "Cross-referencing dog-glp-4wk_v3.pdf against ICH M3(R2), 21 CFR 312.23, and 505(b)(2) guidance..."}
        </p>
      </div>

      {/* Analyzing phase */}
      {!isComplete && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Framework identification box */}
          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              padding: "14px 18px",
              opacity: fi(submitFrame, submitFrame + 15),
            }}
          >
            <span style={{ ...monoLabel(9, C.accent), display: "block", marginBottom: 10 }}>
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
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 7,
                  opacity: fi(submitFrame + i * fps * 0.75, submitFrame + i * fps * 0.75 + 14),
                }}
              >
                <div
                  style={{
                    width: 15,
                    height: 15,
                    border: `1px solid ${C.accent}`,
                    background: C.accentBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: C.accent, fontSize: 10, fontWeight: 700 }}>✓</span>
                </div>
                <span style={{ fontFamily: FONT.body, fontSize: 12, color: C.textSub }}>{fw}</span>
              </div>
            ))}

            {/* Grey zone classification */}
            <div
              style={{
                marginTop: 10,
                paddingTop: 10,
                borderTop: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                gap: 10,
                opacity: fi(submitFrame + 4 * fps * 0.75, submitFrame + 4 * fps * 0.75 + 14),
              }}
            >
              <span style={{ fontFamily: FONT.label, fontSize: 10, color: C.amber, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>
                ⚡ Grey Zone: HIGH
              </span>
              <span style={{ ...monoLabel(10, C.textDim), textTransform: "none" as const, letterSpacing: 0 }}>
                — 505(b)(2) waiver scope + route novelty + indication novelty
              </span>
            </div>
          </div>

          {/* Evidence cards */}
          {EVIDENCE_CARDS.slice(0, visibleCards).map((card, i) => {
            const cardStart = submitFrame + i * 1.5 * fps;
            return (
              <EvidenceCardUI
                key={card.id}
                card={card}
                cardOpacity={fi(cardStart, cardStart + fps * 0.5)}
              />
            );
          })}

          {visibleCards < EVIDENCE_CARDS.length && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0" }}>
              <div
                style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, opacity: 0.6 }}
              />
              <span style={monoLabel(10, C.textDim)}>Analyzing regulatory sources...</span>
            </div>
          )}
        </div>
      )}

      {/* Complete phase */}
      {isComplete && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Two rulings side by side */}
          <div style={{ display: "flex", gap: 14 }}>
            <RulingCard ruling={RULING_A} opacity={rulingAOp} />
            <RulingCard ruling={RULING_B} opacity={rulingBOp} />
          </div>

          {/* Pre-IND questions */}
          <div style={{ opacity: preIndOp }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={monoLabel(9, C.accent)}>Pre-IND Meeting Prep</span>
              <span style={{ flex: 1, height: 1, background: C.border }} />
              <span style={monoLabel(9, C.textFaint)}>copy-paste ready</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PRE_IND_QUESTIONS.map((q, i) => (
                <div
                  key={i}
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderLeft: `3px solid ${C.accent}`,
                    padding: "12px 16px",
                    display: "flex",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT.label,
                      fontSize: 11,
                      fontWeight: 700,
                      color: C.accent,
                      flexShrink: 0,
                    }}
                  >
                    Q{i + 1}
                  </span>
                  <span
                    style={{
                      fontFamily: FONT.body,
                      fontSize: 12,
                      color: C.textSub,
                      lineHeight: 1.7,
                    }}
                  >
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
  phase,
  typingProgress,
}) => {
  const isIdle = phase === "idle";
  const indication = "Bowel Dysfunction (Spinal Cord Injury)";
  const modality = "Capsaicin Suppository, 505(b)(2)";
  const fullQuery =
    "We've completed a 4-week GLP dog study (rectum, colon). Novel indication — bowel dysfunction in SCI patients. Do we need full histopathology on all organs? Do we need a rodent GLP study on top of the dog study?";
  const visibleQuery = isIdle
    ? fullQuery.slice(0, Math.floor(typingProgress * fullQuery.length))
    : fullQuery;
  const showCursor = isIdle && typingProgress > 0 && typingProgress < 1;

  return (
    <div
      style={{
        width: 300,
        background: C.surface,
        borderLeft: `1px solid ${C.border}`,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 36,
          padding: "0 14px",
          display: "flex",
          alignItems: "center",
          gap: 7,
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
                background: C.bg,
                border: `1px solid ${C.border}`,
                padding: "7px 10px",
                fontFamily: FONT.body,
                fontSize: 12,
                color: C.textSub,
              }}
            >
              {indication}
            </div>
          </div>

          {/* Modality */}
          <div>
            <label style={{ ...monoLabel(9, C.textFaint), display: "block", marginBottom: 5 }}>
              Modality / Pathway
            </label>
            <div
              style={{
                background: C.bg,
                border: `1px solid ${C.border}`,
                padding: "7px 10px",
                fontFamily: FONT.body,
                fontSize: 12,
                color: C.textSub,
              }}
            >
              {modality}
            </div>
          </div>

          {/* Query */}
          <div>
            <label style={{ ...monoLabel(9, C.textFaint), display: "block", marginBottom: 5 }}>
              Query
            </label>
            <div
              style={{
                background: C.bg,
                border: `1px solid ${C.border}`,
                padding: "8px 10px",
                fontFamily: FONT.body,
                fontSize: 11,
                color: C.textSub,
                minHeight: 80,
                lineHeight: 1.6,
              }}
            >
              {visibleQuery || (
                <span style={{ color: C.textFaint }}>
                  Describe your regulatory situation...
                </span>
              )}
              {showCursor && (
                <span
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: "0.9em",
                    background: C.accent,
                    marginLeft: 1,
                    verticalAlign: "text-bottom",
                  }}
                />
              )}
            </div>
          </div>

          {/* Submit */}
          <div
            style={{
              background: phase === "analyzing" ? "rgba(15,143,119,0.55)" : C.text,
              color: C.bg,
              padding: "9px 0",
              textAlign: "center",
              ...monoLabel(10, C.bg),
              fontWeight: 600,
            }}
          >
            SUBMIT QUERY
          </div>
        </div>

        {/* Info (idle only) */}
        {isIdle && (
          <div
            style={{
              marginTop: 18,
              background: C.accentBg,
              border: `1px solid ${C.accentBorder}`,
              padding: "10px 12px",
              display: "flex",
              gap: 8,
            }}
          >
            <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 14, color: C.accent }}>
              info
            </span>
            <p style={{ fontFamily: FONT.body, fontSize: 11, color: C.accentStrong, lineHeight: 1.45, margin: 0 }}>
              Copilot will cross-reference your preclinical data against ICH M3(R2), 21 CFR
              312.23(a)(8), and 505(b)(2) guidance.
            </p>
          </div>
        )}

        {/* Precedent cases */}
        {phase !== "idle" && (
          <div style={{ marginTop: 18 }}>
            <div
              style={{
                ...monoLabel(9, C.textDim),
                borderBottom: `1px solid ${C.border}`,
                paddingBottom: 8,
                marginBottom: 12,
              }}
            >
              Precedent Cases
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PRECEDENT_CASES.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    padding: "10px 12px",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}
                  >
                    <span style={{ fontFamily: FONT.body, fontSize: 12, fontWeight: 600, color: C.text }}>
                      {c.name}
                    </span>
                    <span
                      style={{
                        ...monoLabel(8, C.accent),
                        background: C.accentBg,
                        border: `1px solid ${C.accentBorder}`,
                        padding: "1px 5px",
                      }}
                    >
                      {c.statusLabel}
                    </span>
                  </div>
                  <div style={monoLabel(9, C.textFaint)}>{c.company} · {c.indication}</div>
                  <div
                    style={{
                      fontFamily: FONT.body,
                      fontSize: 10,
                      color: C.accent,
                      fontWeight: 500,
                      margin: "4px 0 7px",
                    }}
                  >
                    {c.summary}
                  </div>
                  <p
                    style={{
                      fontFamily: FONT.body,
                      fontSize: 10,
                      color: C.textDim,
                      lineHeight: 1.5,
                      margin: 0,
                      paddingTop: 7,
                      borderTop: `1px solid ${C.border}`,
                      fontStyle: "italic",
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
      height: 26,
      background: C.surfaceAlt,
      borderTop: `1px solid ${C.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 12px",
      flexShrink: 0,
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
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: C.accentBg,
              padding: "1px 6px",
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

// ─── Camera system ────────────────────────────────────────────────────────────

export const WorkspaceScene: React.FC = () => {
  useMaterialSymbols();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phase = getPhase(frame, fps);
  const visibleCards = getVisibleCards(frame, fps);

  // Focal points
  const COPILOT_FOCUS   = { x: 1660, y: 300 };
  const DEFAULT_FOCUS   = { x: 960,  y: 540 };
  const RULING_A_FOCUS  = { x: 630,  y: 420 };
  const RULING_B_FOCUS  = { x: 1290, y: 420 };
  const FILETREE_FOCUS  = { x: 250,  y: 300 };
  const RULING_SCALE    = 1.4;
  const FILETREE_SCALE  = 2.0;

  const ease = Easing.inOut(Easing.quad);
  function lerpV(f: number, s: number, e: number, from: number, to: number) {
    return interpolate(f, [s, e], [from, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: ease,
    });
  }
  function lerpFocus(
    f: number, s: number, e: number,
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) {
    const t = interpolate(f, [s, e], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
    });
    return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
  }

  const { scale, focus } = (() => {
    if (frame < 3 * fps)  return { scale: 1,   focus: DEFAULT_FOCUS };
    if (frame < 5 * fps)  return {
      scale: lerpV(frame, 3*fps, 5*fps, 1, 2.2),
      focus: lerpFocus(frame, 3*fps, 5*fps, DEFAULT_FOCUS, COPILOT_FOCUS),
    };
    if (frame < 10 * fps) return { scale: 2.2, focus: COPILOT_FOCUS };
    if (frame < 12 * fps) return {
      scale: lerpV(frame, 10*fps, 12*fps, 2.2, 1),
      focus: lerpFocus(frame, 10*fps, 12*fps, COPILOT_FOCUS, DEFAULT_FOCUS),
    };
    if (frame < 22 * fps) return { scale: 1,   focus: DEFAULT_FOCUS };
    if (frame < 25 * fps) return {
      scale: lerpV(frame, 22*fps, 23*fps, 1, RULING_SCALE),
      focus: lerpFocus(frame, 22*fps, 23*fps, DEFAULT_FOCUS, RULING_A_FOCUS),
    };
    if (frame < 27 * fps) return {
      scale: lerpV(frame, 25*fps, 26*fps, RULING_SCALE, 1),
      focus: lerpFocus(frame, 25*fps, 26*fps, RULING_A_FOCUS, DEFAULT_FOCUS),
    };
    if (frame < 30 * fps) return {
      scale: lerpV(frame, 27*fps, 28*fps, 1, RULING_SCALE),
      focus: lerpFocus(frame, 27*fps, 28*fps, DEFAULT_FOCUS, RULING_B_FOCUS),
    };
    if (frame < 32 * fps) return {
      scale: lerpV(frame, 30*fps, 31*fps, RULING_SCALE, 1),
      focus: lerpFocus(frame, 30*fps, 31*fps, RULING_B_FOCUS, DEFAULT_FOCUS),
    };
    if (frame < 38 * fps) return { scale: 1,   focus: DEFAULT_FOCUS };
    if (frame < 41 * fps) return {
      scale: lerpV(frame, 38*fps, 39.5*fps, 1, FILETREE_SCALE),
      focus: lerpFocus(frame, 38*fps, 39.5*fps, DEFAULT_FOCUS, FILETREE_FOCUS),
    };
    if (frame < 45 * fps) return { scale: FILETREE_SCALE, focus: FILETREE_FOCUS };
    if (frame < 47 * fps) return {
      scale: lerpV(frame, 45*fps, 46.5*fps, FILETREE_SCALE, 1),
      focus: lerpFocus(frame, 45*fps, 46.5*fps, FILETREE_FOCUS, DEFAULT_FOCUS),
    };
    return { scale: 1, focus: DEFAULT_FOCUS };
  })();

  const tx = 960  - focus.x * scale;
  const ty = 540  - focus.y * scale;

  const typingProgress = interpolate(frame, [5 * fps, 9 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const fadeToBlack = interpolate(frame, [49 * fps, 51 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const scrollY = interpolate(frame, [33 * fps, 40 * fps], [0, -320], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT.body }}>
      <div
        style={{
          width: 1920,
          height: 1080,
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          transformOrigin: "0 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TopNavBar phase={phase} />
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <ActivityBar />
          <ExplorerPanel />
          {/* Main content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Zone header */}
            <div
              style={{
                background: C.surface,
                borderBottom: `1px solid ${C.border}`,
                padding: "6px 16px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 13, color: C.accent }}>
                data_exploration
              </span>
              <span style={monoLabel(10, C.textDim)}>Interpretation Zone</span>
            </div>
            {phase === "idle" ? (
              <IdleCenter />
            ) : (
              <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
                <div
                  style={{
                    transform: `translateY(${scrollY}px)`,
                    position: "absolute",
                    inset: 0,
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
