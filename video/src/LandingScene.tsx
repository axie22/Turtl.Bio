import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  AbsoluteFill,
} from "remotion";
import { FONT } from "./fonts";

export const LandingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in the whole page
  const pageOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Badge slides up
  const badgeY = interpolate(frame, [fps * 0.2, fps * 0.8], [20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const badgeOpacity = interpolate(frame, [fps * 0.2, fps * 0.8], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Title slides up
  const titleY = interpolate(frame, [fps * 0.4, fps * 1.2], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const titleOpacity = interpolate(frame, [fps * 0.4, fps * 1.0], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Subtitle
  const subOpacity = interpolate(frame, [fps * 0.8, fps * 1.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  // CTA button
  const ctaOpacity = interpolate(frame, [fps * 1.2, fps * 1.8], [0, 1], {
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(frame, [fps * 1.2, fps * 1.8], [20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        fontFamily: FONT.body,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: pageOpacity,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: 1200,
          padding: "0 60px",
        }}
      >
        {/* Alpha badge */}
        <div
          style={{
            opacity: badgeOpacity,
            transform: `translateY(${badgeY}px)`,
            background: "rgba(59, 130, 246, 0.15)",
            color: "#93c5fd",
            fontSize: 14,
            fontWeight: 600,
            padding: "6px 16px",
            borderRadius: 20,
            marginBottom: 32,
            letterSpacing: 0.5,
          }}
        >
          In Alpha Stage
        </div>

        {/* Headline */}
        <h1
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontFamily: FONT.body,
            fontSize: 82,
            fontWeight: 800,
            lineHeight: 1.1,
            color: "white",
            margin: 0,
          }}
        >
          Pre-IND Interpretation,
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #3b82f6, #14b8a6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Without the Ambiguity
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            opacity: subOpacity,
            fontSize: 22,
            color: "#94a3b8",
            maxWidth: 800,
            lineHeight: 1.6,
            marginTop: 28,
          }}
        >
          The structured workspace for preclinical biotech teams to understand
          what FDA guidance and precedent{" "}
          <em style={{ color: "#cbd5e1" }}>actually</em> mean for your specific
          product.
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
            display: "flex",
            gap: 16,
            marginTop: 48,
          }}
        >
          <div
            style={{
              background: "#3b82f6",
              color: "white",
              fontSize: 18,
              fontWeight: 600,
              padding: "14px 36px",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Try Workspace →
          </div>
          <div
            style={{
              background: "transparent",
              color: "#94a3b8",
              fontSize: 18,
              fontWeight: 500,
              padding: "14px 36px",
              borderRadius: 8,
              border: "1px solid #334155",
            }}
          >
            Learn More
          </div>
        </div>
      </div>

      {/* Subtle grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
