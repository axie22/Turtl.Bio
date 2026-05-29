import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  AbsoluteFill,
} from "remotion";
import { FONT } from "./fonts";
import { C } from "./colors";

// Reasoning chain nodes — mirrors the landing page ReasoningChain component
const NODES = [
  { n: "01", label: "Question",  body: "Histopathology\nscope + rodent\nstudy required?", type: "free-text" },
  { n: "02", label: "Intake",    body: "pathway: 505(b)(2)\nroute: rectal\nindication: novel", type: "structured" },
  { n: "03", label: "Routing",   body: "ICH M3(R2) §4\n21 CFR 312.23\n505(b)(2) guidance", type: "conditional" },
  { n: "04", label: "Precedent", body: "Qutenza NDA\n022395\nnovel route cases", type: "comparator" },
  { n: "05", label: "Output",    body: "NO — full panel\nLIKELY YES — rodent\nWritten waiver needed", type: "auditable" },
];

export const LandingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  function fi(start: number, end: number) {
    return interpolate(frame, [start, end], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    });
  }

  const eyebrowOp = fi(fps * 0.1, fps * 0.5);
  const headlineOp = fi(fps * 0.3, fps * 0.9);
  const headlineY  = interpolate(frame, [fps * 0.3, fps * 0.9], [18, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const subOp   = fi(fps * 0.7, fps * 1.3);
  const ctaOp   = fi(fps * 1.0, fps * 1.6);
  const ctaY    = interpolate(frame, [fps * 1.0, fps * 1.6], [12, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const stripOp = fi(fps * 1.6, fps * 2.0);
  const chainOp = fi(fps * 2.0, fps * 2.6);

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT.body }}>
      {/* Top nav bar — mirrors the Navbar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          background: C.bg,
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 80px",
          justifyContent: "space-between",
          opacity: eyebrowOp,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
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
            <span
              style={{
                fontFamily: FONT.label,
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: C.textFaint,
              }}
            >
              Alpha
            </span>
          </div>
          {["Index", "About"].map((item, i) => (
            <span
              key={item}
              style={{
                fontFamily: FONT.label,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: i === 0 ? C.text : C.textDim,
              }}
            >
              {item}
            </span>
          ))}
        </div>
        <div
          style={{
            background: C.text,
            color: C.bg,
            padding: "8px 18px",
            fontFamily: FONT.label,
            fontSize: 12,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          Workspace <span style={{ fontFamily: FONT.label, fontSize: 10 }}>→</span>
        </div>
      </div>

      {/* Main hero content */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 80px",
          maxWidth: 1920,
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            opacity: eyebrowOp,
            fontFamily: FONT.label,
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: C.textFaint,
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ color: C.textFaint }}>01</span>
          <span
            style={{
              display: "inline-block",
              width: 24,
              height: 1,
              background: C.borderMid,
            }}
          />
          <span>Index</span>
        </div>

        {/* Headline */}
        <div
          style={{
            opacity: headlineOp,
            transform: `translateY(${headlineY}px)`,
            maxWidth: 900,
            marginBottom: 28,
          }}
        >
          <h1
            style={{
              fontFamily: FONT.headline,
              fontSize: 68,
              fontWeight: 400,
              lineHeight: 1.03,
              letterSpacing: "-0.02em",
              color: C.text,
              margin: 0,
            }}
          >
            The reasoning layer{" "}
            <span style={{ color: C.accent }}>pre-IND biotech teams</span>{" "}
            can&rsquo;t afford to hire.
          </h1>
        </div>

        {/* Subtitle */}
        <p
          style={{
            opacity: subOp,
            fontFamily: FONT.body,
            fontSize: 17,
            lineHeight: 1.65,
            color: C.textDim,
            maxWidth: 600,
            margin: "0 0 36px 0",
          }}
        >
          A structured workspace for interpreting FDA guidance and precedent
          against a specific product profile. Sourced and auditable by
          construction.
        </p>

        {/* CTA buttons */}
        <div
          style={{
            opacity: ctaOp,
            transform: `translateY(${ctaY}px)`,
            display: "flex",
            gap: 12,
            marginBottom: 56,
          }}
        >
          <div
            style={{
              background: C.text,
              color: C.bg,
              padding: "12px 22px",
              fontFamily: FONT.body,
              fontSize: 14,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            See the workspace{" "}
            <span style={{ fontFamily: FONT.label, fontSize: 12 }}>→</span>
          </div>
          <div
            style={{
              background: "transparent",
              color: C.text,
              padding: "12px 22px",
              fontFamily: FONT.body,
              fontSize: 14,
              fontWeight: 500,
              border: `1px solid ${C.borderMid}`,
            }}
          >
            Request alpha access
          </div>
        </div>

        {/* Meta strip — mirrors MetaStrip component */}
        <div
          style={{
            opacity: stripOp,
            display: "flex",
            alignItems: "center",
            gap: 24,
            paddingTop: 16,
            paddingBottom: 16,
            borderTop: `1px solid ${C.border}`,
            borderBottom: `1px solid ${C.border}`,
            marginBottom: 36,
          }}
        >
          {[
            { label: "Modality", value: "capsaicin suppository" },
            { label: "Pathway",  value: "505(b)(2) NDA" },
            { label: "Stage",    value: "pre-IND" },
            { label: "Question", value: "nonclinical package scope" },
          ].map((item, i) => (
            <span
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontFamily: FONT.label,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
              }}
            >
              <span style={{ color: C.textFaint }}>{item.label}</span>
              <span style={{ color: C.text }}>{item.value}</span>
              {i < 3 && (
                <span style={{ color: C.borderMid, marginLeft: 2 }}>·</span>
              )}
            </span>
          ))}
        </div>

        {/* Reasoning chain nodes — mirrors ReasoningChain component */}
        <div
          style={{
            opacity: chainOp,
            display: "flex",
            gap: 0,
          }}
        >
          {NODES.map((node, i) => (
            <div key={node.n} style={{ display: "flex", alignItems: "stretch", flex: 1 }}>
              <div
                style={{
                  flex: 1,
                  border: `1px solid ${C.border}`,
                  borderRight: i < NODES.length - 1 ? "none" : `1px solid ${C.border}`,
                  background: C.bg,
                  padding: "16px 18px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 130,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT.label,
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: "0.14em",
                        color: C.textFaint,
                      }}
                    >
                      {node.n} · {node.label}
                    </span>
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background:
                          i === NODES.length - 1 ? C.accent : C.borderMid,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontFamily: FONT.body,
                      fontSize: 12,
                      lineHeight: 1.45,
                      color: i === NODES.length - 1 ? C.text : C.textSub,
                      fontWeight: i === NODES.length - 1 ? 500 : 400,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {node.body}
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 10,
                    paddingTop: 10,
                    borderTop: `1px solid ${C.border}`,
                    fontFamily: FONT.label,
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: C.textFaint,
                  }}
                >
                  {node.type}
                </div>
              </div>
              {/* Arrow connector between cards */}
              {i < NODES.length - 1 && (
                <div
                  style={{
                    width: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: C.textFaint,
                    fontFamily: FONT.label,
                    fontSize: 12,
                    background: C.bg,
                    borderTop: `1px solid ${C.border}`,
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
