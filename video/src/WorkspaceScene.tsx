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

// ─── Material Symbols font loader ───

const MATERIAL_SYMBOLS_CSS =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block";

function useMaterialSymbols() {
  const [handle] = useState(() => delayRender("Loading Material Symbols"));
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = MATERIAL_SYMBOLS_CSS;
    link.onload = () => {
      // Give the font time to apply after CSS loads
      document.fonts.ready.then(() => continueRender(handle));
    };
    link.onerror = () => continueRender(handle);
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [handle]);
}

// ─── Data ───

const EVIDENCE_CARDS = [
  {
    id: "ich-s6r1",
    source: "ICH S6(R1)",
    quote: `"Safety studies should generally be conducted in both sexes. However, if a product is intended for use in only one gender, single-sex studies may be appropriate."`,
    summary:
      "Supports male-only tox studies when the indication is sex-restricted. Biological justification must be documented.",
  },
  {
    id: "ich-s9",
    source: "ICH S9",
    quote: `"Reproductive toxicology studies are generally not required prior to Phase I trials in cancer patients. Requirements should reflect the intended patient population."`,
    summary:
      "Reproductive tox flexibility applies for oncology. Male-only populations reduce female animal study requirements.",
  },
  {
    id: "fda-guidance",
    source: "FDA Guidance",
    quote: `"The need for studies in both sexes should be considered based on the proposed clinical indication and target population."`,
    summary:
      "Indication-specific population drives sex selection. Male-only indications have established precedent for single-sex packages.",
  },
];

const PRECEDENT_CASES = [
  {
    id: "pluvicto",
    name: "Pluvicto",
    company: "Novartis",
    indication: "mCRPC",
    statusLabel: "FDA APPROVED",
    summary: "Male-only studies accepted",
    fdaResponse: `"Accepted protocol based on male-specific indication."`,
  },
  {
    id: "xtandi",
    name: "Xtandi",
    company: "Astellas",
    indication: "CRPC",
    statusLabel: "VALIDATED",
    summary: "Single-sex tox",
    fdaResponse: `"Validated male-only study design for prostate oncology indications."`,
  },
];

const EXPLORER_FOLDERS = [
  { name: "m1-administrative", open: false },
  { name: "m2-summaries", open: false },
  { name: "m3-quality", open: false },
  {
    name: "m4-nonclinical",
    open: true,
    active: true,
    files: [
      { name: "tox-study-male-cynomolgus.pdf", active: true },
      { name: "biodistribution-study.pdf", active: false },
      { name: "pharmacology-primary.pdf", active: false },
      { name: "genotoxicity-assessment.pdf", active: false },
    ],
  },
  { name: "m5-clinical", open: false },
];

// ─── Helpers ───

type Phase = "idle" | "analyzing" | "complete";

function getPhase(frame: number, fps: number): Phase {
  // Shot 2 (enter workspace): frames 0-90 → idle view
  // Shot 3 (query input): frames 90-330 → still idle (camera on copilot)
  // Frame 330: submit → analyzing
  // Frame 630: complete
  const submitFrame = 11 * fps; // ~330
  const completeFrame = 21 * fps; // ~630
  if (frame < submitFrame) return "idle";
  if (frame < completeFrame) return "analyzing";
  return "complete";
}

function getVisibleCards(frame: number, fps: number): number {
  const submitFrame = 11 * fps;
  if (frame < submitFrame) return 0;
  const elapsed = frame - submitFrame;
  const interval = 1.5 * fps; // 45 frames between cards
  return Math.min(Math.floor(elapsed / interval) + 1, EVIDENCE_CARDS.length);
}

// ─── Sub-Components (all inline styles, no Tailwind) ───

const ActivityBar: React.FC = () => {
  const icons = ["folder_open", "search", "account_tree", "pest_control", "smart_toy"];
  return (
    <div
      style={{
        width: 56,
        background: C.lowest,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 16,
        gap: 8,
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
            padding: "8px 0",
            borderLeft: i === 0 ? `2px solid ${C.teal}` : "2px solid transparent",
            background: i === 0 ? C.mid : "transparent",
            color: i === 0 ? C.teal : "rgba(223,226,235,0.4)",
            fontFamily: "Material Symbols Outlined",
            fontSize: 22,
          }}
        >
          {icon}
        </div>
      ))}
      <div style={{ marginTop: "auto", paddingBottom: 16 }}>
        <div
          style={{
            width: 32,
            height: 32,
            background: C.highest,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid rgba(60,74,69,0.3)`,
            fontFamily: "Material Symbols Outlined",
            fontSize: 16,
            color: "rgba(223,226,235,0.6)",
          }}
        >
          account_circle
        </div>
      </div>
    </div>
  );
};

const ExplorerPanel: React.FC = () => (
  <div
    style={{
      width: 240,
      background: C.lowest,
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      borderRight: `1px solid rgba(49,53,60,0.3)`,
    }}
  >
    <div
      style={{
        height: 36,
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid rgba(49,53,60,0.2)`,
      }}
    >
      <span
        style={{
          fontFamily: FONT.label,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 2,
          color: C.textDim,
          textTransform: "uppercase",
        }}
      >
        Explorer
      </span>
      <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 14, color: C.textDim }}>
        more_horiz
      </span>
    </div>
    <div style={{ padding: "8px 0", flex: 1, overflow: "hidden" }}>
      <div
        style={{
          padding: "4px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 14, color: C.textDim }}>
          chevron_right
        </span>
        <span
          style={{
            fontFamily: FONT.label,
            fontSize: 11,
            color: C.textDim,
            textTransform: "uppercase",
            letterSpacing: -0.5,
          }}
        >
          REG-SYS-01 / PSMA-RLT-001
        </span>
      </div>
      <div style={{ paddingLeft: 16 }}>
        {EXPLORER_FOLDERS.map((folder) => (
          <div key={folder.name}>
            <div
              style={{
                padding: "2px 8px",
                paddingLeft: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: folder.active ? C.mid : "transparent",
                borderLeft: folder.active ? `1px solid rgba(84,220,188,0.2)` : "none",
                color: folder.active ? "rgba(223,226,235,0.8)" : "rgba(223,226,235,0.4)",
              }}
            >
              <span
                style={{
                  fontFamily: "Material Symbols Outlined",
                  fontSize: 14,
                  transform: folder.open ? "rotate(90deg)" : "none",
                }}
              >
                chevron_right
              </span>
              <span
                style={{
                  fontFamily: "Material Symbols Outlined",
                  fontSize: 16,
                  color: folder.open ? C.teal : "inherit",
                }}
              >
                {folder.open ? "folder_open" : "folder"}
              </span>
              <span
                style={{
                  fontFamily: FONT.label,
                  fontSize: 11,
                  textTransform: "uppercase",
                }}
              >
                {folder.name}
              </span>
            </div>
            {folder.open &&
              folder.files?.map((file) => (
                <div
                  key={file.name}
                  style={{
                    padding: "2px 8px",
                    paddingLeft: 48,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: file.active ? "rgba(84,220,188,0.1)" : "transparent",
                    borderLeft: file.active ? `2px solid ${C.teal}` : "2px solid transparent",
                    color: file.active ? C.teal : "rgba(223,226,235,0.6)",
                  }}
                >
                  <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 14 }}>
                    description
                  </span>
                  <span style={{ fontFamily: FONT.label, fontSize: 10 }}>{file.name}</span>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TopNavBar: React.FC<{ phase: Phase }> = ({ phase }) => {
  const tabs =
    phase === "idle"
      ? []
      : phase === "analyzing"
        ? ["Explorer", "Evidence", "Protocols", "Archive"]
        : ["Explorer", "Search", "Regulatory AI"];

  return (
    <div
      style={{
        height: 48,
        background: C.mid,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 16px",
        borderBottom: `1px solid ${C.highest}`,
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <span
          style={{
            fontFamily: FONT.headline,
            fontSize: 16,
            fontWeight: 800,
            color: C.teal,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          Turtl.Bio
        </span>
        {tabs.length > 0 && (
          <nav style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {tabs.map((tab, i) => (
              <span
                key={tab}
                style={{
                  fontFamily: FONT.headline,
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: i === 0 ? C.teal : "rgba(223,226,235,0.6)",
                  borderBottom: i === 0 ? `2px solid ${C.teal}` : "none",
                  paddingBottom: i === 0 ? 2 : 0,
                  letterSpacing: 0.5,
                }}
              >
                {tab}
              </span>
            ))}
          </nav>
        )}
        {phase === "idle" && (
          <div style={{ display: "flex", gap: 12, marginLeft: 16 }}>
            {["menu", "search", "terminal"].map((icon) => (
              <span
                key={icon}
                style={{
                  fontFamily: "Material Symbols Outlined",
                  fontSize: 20,
                  color: "rgba(223,226,235,0.6)",
                  padding: 4,
                }}
              >
                {icon}
              </span>
            ))}
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {phase !== "idle" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: C.lowest,
              padding: "6px 12px",
              border: `1px solid rgba(60,74,69,0.2)`,
            }}
          >
            <span
              style={{
                fontFamily: "Material Symbols Outlined",
                fontSize: 14,
                color: "rgba(223,226,235,0.4)",
                marginRight: 8,
              }}
            >
              search
            </span>
            <span style={{ fontFamily: FONT.label, fontSize: 12, color: "rgba(223,226,235,0.3)" }}>
              Search knowledge base...
            </span>
            <span
              style={{
                fontFamily: FONT.label,
                fontSize: 10,
                color: "rgba(223,226,235,0.2)",
                marginLeft: 12,
              }}
            >
              ⌘K
            </span>
          </div>
        )}
        <div
          style={{
            background: C.tealDark,
            color: C.onTealDark,
            padding: "6px 12px",
            fontFamily: FONT.label,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 14 }}>
            folder_open
          </span>
          OPEN FOLDER
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["terminal", "settings", "help", "account_circle"].map((icon) => (
            <span
              key={icon}
              style={{
                fontFamily: "Material Symbols Outlined",
                fontSize: 20,
                color: "rgba(223,226,235,0.6)",
              }}
            >
              {icon}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const IdleCenter: React.FC = () => (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Interpretation Zone header bar */}
    <div
      style={{
        background: C.low,
        padding: "8px 16px",
        borderBottom: `1px solid rgba(60,74,69,0.1)`,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 14, color: C.teal }}>
        data_exploration
      </span>
      <span
        style={{
          fontFamily: FONT.label,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: C.text,
        }}
      >
        Interpretation Zone
      </span>
    </div>
    {/* Center content */}
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 48,
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          background: C.mid,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid rgba(60,74,69,0.1)`,
          marginBottom: 24,
        }}
      >
        <span
          style={{
            fontFamily: "Material Symbols Outlined",
            fontSize: 36,
            color: C.outlineDim,
          }}
        >
          find_in_page
        </span>
      </div>
      <h3
        style={{
          fontFamily: FONT.headline,
          fontSize: 20,
          color: C.text,
          margin: "0 0 8px 0",
        }}
      >
        Workspace Idle
      </h3>
      <p
        style={{
          color: C.textDim,
          maxWidth: 380,
          fontSize: 13,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        Submit a query to surface applicable guidance and precedent within the
        PSMA-RLT framework.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginTop: 32,
          width: "100%",
          maxWidth: 420,
        }}
      >
        <div
          style={{
            background: C.low,
            padding: 16,
            textAlign: "left",
            border: `1px solid rgba(60,74,69,0.05)`,
          }}
        >
          <span
            style={{
              fontFamily: FONT.label,
              fontSize: 9,
              textTransform: "uppercase",
              color: C.teal,
              display: "block",
              marginBottom: 4,
            }}
          >
            Shortcut
          </span>
          <span style={{ fontSize: 12, color: C.textDim }}>Press ⌘ + Enter to submit</span>
        </div>
        <div
          style={{
            background: C.low,
            padding: 16,
            textAlign: "left",
            border: `1px solid rgba(60,74,69,0.05)`,
          }}
        >
          <span
            style={{
              fontFamily: FONT.label,
              fontSize: 9,
              textTransform: "uppercase",
              color: C.teal,
              display: "block",
              marginBottom: 4,
            }}
          >
            Mode
          </span>
          <span style={{ fontSize: 12, color: C.textDim }}>
            Regulatory Interpretation v2.4
          </span>
        </div>
      </div>
      {/* Ghost watermark */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          opacity: 0.02,
        }}
      >
        <span style={{ fontSize: 280, fontWeight: 700, color: C.text }}>TURTL</span>
      </div>
    </div>
  </div>
);

const EvidenceCardUI: React.FC<{
  card: (typeof EVIDENCE_CARDS)[number];
  variant: "active" | "complete";
  cardOpacity: number;
}> = ({ card, variant, cardOpacity }) => {
  if (variant === "complete") {
    return (
      <div
        style={{
          background: C.low,
          borderTop: `2px solid ${C.tealDark}`,
          padding: 20,
          opacity: cardOpacity,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontFamily: FONT.label,
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: 2,
              color: "rgba(223,226,235,0.4)",
            }}
          >
            SOURCE: {card.source}
          </span>
          <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 14, color: C.tealDark }}>
            verified
          </span>
        </div>
        <p
          style={{
            color: C.textDim,
            fontSize: 13,
            lineHeight: 1.6,
            fontStyle: "italic",
            marginBottom: 16,
            margin: "0 0 16px 0",
          }}
        >
          {card.quote}
        </p>
        <div
          style={{
            background: "rgba(38,42,49,0.5)",
            padding: 12,
            borderLeft: `2px solid ${C.tealDark}`,
          }}
        >
          <p style={{ color: C.teal, fontSize: 13, fontWeight: 500, margin: 0 }}>
            <span
              style={{
                fontFamily: FONT.label,
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                marginRight: 8,
              }}
            >
              SUMMARY:
            </span>
            {card.summary}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: C.low,
        borderTop: `2px solid ${C.tealDark}`,
        padding: 20,
        opacity: cardOpacity,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <span
          style={{
            fontFamily: FONT.label,
            fontSize: 11,
            color: "rgba(84,220,188,0.8)",
            fontWeight: 700,
            background: "rgba(84,220,188,0.05)",
            padding: "2px 8px",
            border: `1px solid rgba(84,220,188,0.1)`,
          }}
        >
          {card.source}
        </span>
        <span
          style={{
            fontFamily: "Material Symbols Outlined",
            fontSize: 18,
            color: "rgba(223,226,235,0.2)",
          }}
        >
          verified
        </span>
      </div>
      <div
        style={{
          borderLeft: `1px solid rgba(60,74,69,0.3)`,
          paddingLeft: 16,
          paddingTop: 4,
          paddingBottom: 4,
          fontStyle: "italic",
          color: "rgba(223,226,235,0.7)",
          fontSize: 13,
          lineHeight: 1.6,
          marginBottom: 16,
        }}
      >
        {card.quote}
      </div>
      <div
        style={{
          background: "rgba(10,14,20,0.5)",
          padding: 12,
          border: `1px solid rgba(60,74,69,0.1)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 14, color: C.teal }}>
            insights
          </span>
          <span
            style={{
              fontFamily: FONT.label,
              fontSize: 10,
              fontWeight: 700,
              color: C.teal,
              textTransform: "uppercase",
            }}
          >
            Console Summary
          </span>
        </div>
        <p style={{ color: C.teal, fontSize: 13, fontWeight: 500, margin: 0 }}>
          {card.summary}
        </p>
      </div>
    </div>
  );
};

const InterpretationZone: React.FC<{
  phase: "analyzing" | "complete";
  visibleCards: number;
  frame: number;
  fps: number;
}> = ({ phase, visibleCards, frame, fps }) => {
  const isComplete = phase === "complete";
  const cards = isComplete ? EVIDENCE_CARDS : EVIDENCE_CARDS.slice(0, visibleCards);
  const submitFrame = 11 * fps;

  return (
    <div
      style={{
        flex: 1,
        overflow: "hidden",
        background: C.bg,
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            borderBottom: `1px solid rgba(60,74,69,0.15)`,
            paddingBottom: 24,
            marginBottom: 32,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span
              style={{
                fontFamily: FONT.label,
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: 2,
                color: C.teal,
                fontWeight: 700,
              }}
            >
              Regulatory Intelligence
            </span>
            <span style={{ color: "rgba(223,226,235,0.2)" }}>/</span>
            <span
              style={{
                fontFamily: FONT.label,
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: 2,
                color: "rgba(223,226,235,0.4)",
              }}
            >
              Interpretation Zone
            </span>
          </div>
          <h1
            style={{
              fontFamily: FONT.headline,
              fontSize: 28,
              fontWeight: 800,
              color: C.text,
              margin: "0 0 8px 0",
              letterSpacing: -0.5,
            }}
          >
            {isComplete
              ? "Regulatory Interpretation"
              : "Nonclinical Study Requirements Evaluation"}
          </h1>
          <p style={{ color: "rgba(223,226,235,0.6)", fontSize: 13, margin: 0, maxWidth: 640, lineHeight: 1.6 }}>
            {isComplete
              ? "Analysis of sex-specific toxicity requirements"
              : "System-wide analysis of ICH and FDA guidance regarding sex-specific toxicological studies for targeted oncology radioligands."}
          </p>
        </div>
        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {cards.map((card, i) => {
            const cardAppearFrame = submitFrame + i * 1.5 * fps;
            const cardOpacity = interpolate(
              frame,
              [cardAppearFrame, cardAppearFrame + fps * 0.5],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <EvidenceCardUI
                key={card.id}
                card={card}
                variant={isComplete ? "complete" : "active"}
                cardOpacity={cardOpacity}
              />
            );
          })}
          {phase === "analyzing" && visibleCards < EVIDENCE_CARDS.length && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "16px 0",
                color: "rgba(223,226,235,0.4)",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: C.teal,
                  opacity: 0.7,
                }}
              />
              <span
                style={{
                  fontFamily: FONT.label,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                }}
              >
                Analyzing regulatory sources...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CopilotPanel: React.FC<{
  phase: Phase;
  typingProgress: number;
}> = ({ phase, typingProgress }) => {
  const isIdle = phase === "idle";

  const indication = "Prostate Cancer (mCRPC)";
  const modality = "Radioligand Therapy (PSMA-targeted)";
  const fullQuery =
    "Our indication is male-only. Do we need tox studies in female animals?";

  // Typing effect for query
  const visibleQuery = isIdle
    ? fullQuery.slice(0, Math.floor(typingProgress * fullQuery.length))
    : fullQuery;

  const showCursor = isIdle && typingProgress < 1;

  return (
    <div
      style={{
        width: 320,
        background: C.low,
        borderLeft: `1px solid rgba(49,53,60,0.3)`,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 36,
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderBottom: `1px solid rgba(49,53,60,0.2)`,
        }}
      >
        <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 14, color: C.teal }}>
          auto_awesome
        </span>
        <span
          style={{
            fontFamily: FONT.label,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 2,
            color: C.text,
            textTransform: "uppercase",
          }}
        >
          AI Copilot
        </span>
      </div>
      {/* Body */}
      <div style={{ flex: 1, overflow: "hidden", padding: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Drug Indication */}
          <div>
            <label
              style={{
                fontFamily: FONT.label,
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: 2,
                color: "rgba(223,226,235,0.4)",
                display: "block",
                marginBottom: 6,
              }}
            >
              Drug Indication
            </label>
            <div
              style={{
                background: C.lowest,
                border: `1px solid rgba(60,74,69,0.2)`,
                padding: "8px 12px",
                fontSize: 12,
                color: isIdle ? C.text : "rgba(223,226,235,0.8)",
              }}
            >
              {indication}
            </div>
          </div>
          {/* Modality */}
          <div>
            <label
              style={{
                fontFamily: FONT.label,
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: 2,
                color: "rgba(223,226,235,0.4)",
                display: "block",
                marginBottom: 6,
              }}
            >
              Modality
            </label>
            <div
              style={{
                background: C.lowest,
                border: `1px solid rgba(60,74,69,0.2)`,
                padding: "8px 12px",
                fontSize: 12,
                color: isIdle ? C.text : "rgba(223,226,235,0.8)",
              }}
            >
              {modality}
            </div>
          </div>
          {/* Query */}
          <div>
            <label
              style={{
                fontFamily: FONT.label,
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: 2,
                color: "rgba(223,226,235,0.4)",
                display: "block",
                marginBottom: 6,
              }}
            >
              Query
            </label>
            <div
              style={{
                background: C.lowest,
                border: `1px solid rgba(60,74,69,0.2)`,
                padding: "8px 12px",
                fontSize: 12,
                color: isIdle ? C.text : "rgba(223,226,235,0.8)",
                minHeight: 72,
                lineHeight: 1.5,
              }}
            >
              {visibleQuery}
              {showCursor && (
                <span style={{ borderRight: `2px solid ${C.teal}`, marginLeft: 1 }}>
                  &nbsp;
                </span>
              )}
            </div>
          </div>
          {/* Submit Button */}
          <div
            style={{
              background: phase === "analyzing" ? "rgba(0,175,145,0.5)" : C.tealDark,
              color: C.onTealDark,
              padding: "10px 0",
              textAlign: "center",
              fontFamily: FONT.label,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            SUBMIT QUERY
          </div>
        </div>

        {/* Info box (idle only) */}
        {isIdle && (
          <div
            style={{
              marginTop: 24,
              background: "rgba(84,220,188,0.05)",
              border: `1px solid rgba(84,220,188,0.2)`,
              padding: 12,
              display: "flex",
              gap: 8,
            }}
          >
            <span style={{ fontFamily: "Material Symbols Outlined", fontSize: 16, color: C.teal }}>
              info
            </span>
            <p
              style={{
                fontSize: 11,
                color: C.teal,
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              Copilot will cross-reference ICH S6(R1) and S9 guidelines against
              your current file selection.
            </p>
          </div>
        )}

        {/* Precedent Cases (analyzing/complete) */}
        {phase !== "idle" && (
          <div style={{ marginTop: 24 }}>
            <h4
              style={{
                fontFamily: FONT.label,
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: 2,
                color: C.textDim,
                fontWeight: 700,
                borderBottom: `1px solid rgba(60,74,69,0.1)`,
                paddingBottom: 8,
                marginBottom: 16,
                marginTop: 0,
              }}
            >
              Precedent Cases
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {PRECEDENT_CASES.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: C.mid,
                    padding: 12,
                    border: `1px solid rgba(60,74,69,0.1)`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>
                      {c.name}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT.label,
                        fontSize: 8,
                        padding: "2px 6px",
                        background: "rgba(84,220,188,0.1)",
                        color: C.teal,
                        border: `1px solid rgba(84,220,188,0.2)`,
                        textTransform: "uppercase",
                      }}
                    >
                      {c.statusLabel}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(223,226,235,0.6)", marginBottom: 4 }}>
                    {c.company} · {c.indication}
                  </div>
                  <div style={{ fontSize: 10, color: C.teal, fontWeight: 500, marginBottom: 8 }}>
                    {c.summary}
                  </div>
                  <div
                    style={{
                      paddingTop: 8,
                      borderTop: `1px solid rgba(60,74,69,0.2)`,
                    }}
                  >
                    <p style={{ fontSize: 10, color: "rgba(223,226,235,0.8)", lineHeight: 1.5, margin: 0 }}>
                      <span style={{ fontWeight: 700, color: C.text }}>FDA Response:</span>{" "}
                      {c.fdaResponse}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusBarUI: React.FC<{ phase: Phase }> = ({ phase }) => {
  if (phase === "idle") {
    return (
      <div
        style={{
          height: 28,
          background: C.lowest,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 12px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: C.highest,
              }}
            />
            <span
              style={{
                fontFamily: FONT.label,
                fontSize: 11,
                fontWeight: 500,
                color: "rgba(223,226,235,0.5)",
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              No active query
            </span>
          </div>
          <span
            style={{
              fontFamily: FONT.label,
              fontSize: 11,
              color: "rgba(223,226,235,0.5)",
            }}
          >
            v2.4.0-stable
          </span>
          <span
            style={{
              fontFamily: FONT.label,
              fontSize: 11,
              color: "rgba(223,226,235,0.5)",
            }}
          >
            UTF-8
          </span>
        </div>
        <span
          style={{
            fontFamily: FONT.label,
            fontSize: 11,
            fontWeight: 500,
            color: C.teal,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          System Status: Ready
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        height: 28,
        background: C.lowest,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 12px",
        flexShrink: 0,
        borderTop: `1px solid rgba(49,53,60,0.4)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontFamily: FONT.label,
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: -0.5,
              color: "rgba(223,226,235,0.4)",
            }}
          >
            FDA REFERENCE SOURCE
          </span>
          <span style={{ color: C.teal, fontWeight: 700, fontSize: 14 }}>|</span>
          <span style={{ fontFamily: FONT.label, fontSize: 10, color: C.teal }}>
            ICH S6(R1) · Male-Specific Indication Studies
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(84,220,188,0.1)",
            padding: "2px 6px",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: C.teal,
            }}
          />
          <span
            style={{
              fontFamily: FONT.label,
              fontSize: 8,
              fontWeight: 700,
              color: C.teal,
              textTransform: "uppercase",
            }}
          >
            VERIFIED
          </span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontFamily: FONT.label,
              fontSize: 10,
              textTransform: "uppercase",
              color: "rgba(223,226,235,0.4)",
            }}
          >
            LOGIC_PATH:
          </span>
          <span
            style={{
              fontFamily: FONT.label,
              fontSize: 10,
              color: "rgba(223,226,235,0.7)",
            }}
          >
            Male-only tox studies accepted for male-specific indications.
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: FONT.label, fontSize: 10, color: "rgba(223,226,235,0.4)" }}>
            UTF-8
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span
              style={{
                fontFamily: FONT.label,
                fontSize: 10,
                textTransform: "uppercase",
                color: "rgba(223,226,235,0.4)",
              }}
            >
              STABILITY:
            </span>
            <span style={{ fontFamily: FONT.label, fontSize: 10, color: C.teal, fontWeight: 700 }}>
              0.9942
            </span>
          </div>
          <span style={{ fontFamily: FONT.label, fontSize: 10, color: "rgba(223,226,235,0.4)" }}>
            v2.4.0-STABLE
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── Main Workspace Scene ───

export const WorkspaceScene: React.FC = () => {
  useMaterialSymbols();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phase = getPhase(frame, fps);
  const visibleCards = getVisibleCards(frame, fps);

  // Camera system
  // We compute a focal point (fx, fy) in workspace coords and a scale.
  // Transform: translate so focal point is at viewport center, then scale around it.
  // tx = 960 - fx, ty = 540 - fy (at scale 1, workspace already fills viewport)
  // At scale S with transformOrigin at (fx, fy): the point stays put, everything scales around it
  // But since transformOrigin changes per-shot, we use a different approach:
  // transform: translate(tx, ty) scale(S) where tx = (1-S)*fx + (960-fx), ty = (1-S)*fy + (540-fy)
  // Simplified: tx = 960 - fx*S + (fx - 960)*(1-1) ... let's just use the correct formula:
  // To show point (fx,fy) at viewport center (960,540) at scale S with transformOrigin '0 0':
  // After scale: point is at (fx*S, fy*S). We need translate to move it to (960,540).
  // So: tx = 960 - fx*S, ty = 540 - fy*S
  // At scale=1, default view: fx=960, fy=540 → tx=0, ty=0 ✓

  // Focal points for each shot (workspace coordinates)
  const COPILOT_FOCUS = { x: 1700, y: 300 };
  const DEFAULT_FOCUS = { x: 960, y: 540 };
  // Bottom bar: status bar is at y=1052..1080, center ≈ 1066
  // But we want to see the FULL status bar + some context above it
  // At scale 2.5, viewport shows 1920/2.5 = 768px wide, 1080/2.5 = 432px tall
  // Focus on the lower portion: y should be ~1080 - 432/2 = ~864 to see bottom
  const BOTTOM_BAR_FOCUS = { x: 960, y: 880 };
  const BOTTOM_BAR_SCALE = 2.5;

  const lerpFocus = (
    f: number,
    startFrame: number,
    endFrame: number,
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) => {
    const t = interpolate(f, [startFrame, endFrame], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    });
    return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
  };

  const { scale, focus } = (() => {
    // Shot 2: Full workspace idle (0-3s)
    if (frame < 3 * fps) {
      return { scale: 1, focus: DEFAULT_FOCUS };
    }
    // Zoom to copilot (3s-5s)
    if (frame < 5 * fps) {
      const s = interpolate(frame, [3 * fps, 5 * fps], [1, 2.2], {
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.quad),
      });
      const f = lerpFocus(frame, 3 * fps, 5 * fps, DEFAULT_FOCUS, COPILOT_FOCUS);
      return { scale: s, focus: f };
    }
    // Hold on copilot (5s-10s)
    if (frame < 10 * fps) {
      return { scale: 2.2, focus: COPILOT_FOCUS };
    }
    // Pull back (10s-12s)
    if (frame < 12 * fps) {
      const s = interpolate(frame, [10 * fps, 12 * fps], [2.2, 1], {
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.quad),
      });
      const f = lerpFocus(frame, 10 * fps, 12 * fps, COPILOT_FOCUS, DEFAULT_FOCUS);
      return { scale: s, focus: f };
    }
    // Full view for evidence cards + money shot (12s-27s)
    if (frame < 27 * fps) {
      return { scale: 1, focus: DEFAULT_FOCUS };
    }
    // Zoom to bottom bar (27s-29s)
    if (frame < 29 * fps) {
      const s = interpolate(frame, [27 * fps, 29 * fps], [1, BOTTOM_BAR_SCALE], {
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.quad),
      });
      const f = lerpFocus(frame, 27 * fps, 29 * fps, DEFAULT_FOCUS, BOTTOM_BAR_FOCUS);
      return { scale: s, focus: f };
    }
    // Hold on bottom bar (29s-39s)
    if (frame < 39 * fps) {
      return { scale: BOTTOM_BAR_SCALE, focus: BOTTOM_BAR_FOCUS };
    }
    // Pull back (39s-43s)
    if (frame < 43 * fps) {
      const s = interpolate(frame, [39 * fps, 43 * fps], [BOTTOM_BAR_SCALE, 1], {
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.quad),
      });
      const f = lerpFocus(frame, 39 * fps, 43 * fps, BOTTOM_BAR_FOCUS, DEFAULT_FOCUS);
      return { scale: s, focus: f };
    }
    // Final hold
    return { scale: 1, focus: DEFAULT_FOCUS };
  })();

  // Compute translate: put focus point at viewport center
  const tx = 960 - focus.x * scale;
  const ty = 540 - focus.y * scale;

  // Typing progress for copilot query (during frames 150-300, i.e. 5s-10s)
  const typingProgress = interpolate(frame, [5 * fps, 9 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade to black at the end (last ~2s)
  const fadeToBlack = interpolate(frame, [49 * fps, 51 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scroll the evidence cards area during Shot 4
  const scrollY = interpolate(frame, [17 * fps, 22 * fps], [0, -280], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT.body }}>
      {/* The full workspace, transformed by camera */}
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
        <div
          style={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
          }}
        >
          <ActivityBar />
          <ExplorerPanel />
          {/* Center */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
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

      {/* Fade to black overlay */}
      {fadeToBlack > 0 && (
        <AbsoluteFill
          style={{
            background: "black",
            opacity: fadeToBlack,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
