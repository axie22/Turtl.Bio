// Light editorial palette — matches the Turtl.Bio landing page
export const C = {
  // Backgrounds
  bg:          "#ffffff",
  surface:     "#fafafa",   // sidebars, secondary panels
  surfaceAlt:  "#f4f4f5",   // status bar, tertiary surfaces

  // Borders
  border:      "#e5e7eb",   // zinc-200 — default
  borderMid:   "#d1d5db",   // zinc-300
  borderStrong:"#0b0e13",

  // Text
  text:        "#0b0e13",   // near-black (ink)
  textSub:     "#374151",   // zinc-700
  textDim:     "#6b7280",   // zinc-500
  textFaint:   "#9ca3af",   // zinc-400

  // Accent — landing page green
  accent:       "#0f8f77",
  accentBg:     "rgba(15,143,119,0.06)",
  accentBorder: "rgba(15,143,119,0.22)",
  accentStrong: "#065f4a",

  // Ruling verdicts — crisp, editorial (not neon)
  red:         "#dc2626",
  redBg:       "rgba(220,38,38,0.05)",
  redBorder:   "rgba(220,38,38,0.18)",
  amber:       "#b45309",   // amber-700, readable on white
  amberBg:     "rgba(180,83,9,0.05)",
  amberBorder: "rgba(180,83,9,0.18)",
} as const;
