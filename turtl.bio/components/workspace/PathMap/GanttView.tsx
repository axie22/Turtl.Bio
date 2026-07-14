"use client";

import { useMemo } from "react";
import {
  MapNode,
  NODES,
  GANTT_QUARTERS,
  LANE_COLOR,
} from "./data";

const Q_COUNT = 4;
const Q_W = 195;
const ROW_H = 30;
const LABEL_W = 200;
const STAGE_W = 68;
const HEADER_H = 46;

const STAGE_CONFIG: Record<string, { label: string; sublabel: string }> = {
  fda:     { label: "FDA Facing",              sublabel: "Stage 1" },
  sponsor: { label: "Sponsor Responsibilities", sublabel: "Stage 2" },
  funding: { label: "Funding",                 sublabel: "Stage 3" },
};

function effectiveStart(node: MapNode, typeCEnabled: boolean) {
  return node.ganttStart + (typeCEnabled && node.ganttShiftOnTypeC ? node.ganttShiftOnTypeC : 0);
}

function getBarLeft(node: MapNode, typeCEnabled: boolean) {
  return (effectiveStart(node, typeCEnabled) - 1) * Q_W;
}

// ─── ENV ASSESS long bar ──────────────────────────────────────────────────────

function EnvAssessBar({ node }: { node: MapNode }) {
  const color = LANE_COLOR[node.lane];
  return (
    <div
      className="relative border-b border-ws-highest/15 flex items-center"
      style={{ height: ROW_H }}
    >
      <div className="shrink-0 flex items-center gap-2 px-3 z-10" style={{ width: LABEL_W }}>
        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <span className="font-label text-[10px] text-ws-text/60 truncate italic">{node.label}</span>
        <span className="ml-auto font-label text-[7.5px] text-ws-text/25 shrink-0 bg-ws-high px-1 rounded-sm">parallel</span>
      </div>
      <div className="relative flex-1 h-full" style={{ minWidth: Q_COUNT * Q_W }}>
        {[0, 1, 2, 3].map((q) => (
          <div key={q} className="absolute top-0 bottom-0 border-l border-ws-highest/12" style={{ left: q * Q_W }} />
        ))}
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-sm flex items-center px-3"
          style={{
            left: 0,
            right: 0,
            height: ROW_H * 0.45,
            backgroundColor: color + "20",
            border: `1px solid ${color}40`,
          }}
        >
          <span className="font-label text-[8.5px] italic" style={{ color: color + "bb" }}>
            Q1 → Q4 · runs in parallel
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Regular row ──────────────────────────────────────────────────────────────

interface GanttRowProps {
  node: MapNode;
  typeCEnabled: boolean;
}

function GanttRow({ node, typeCEnabled }: GanttRowProps) {
  const laneColor = LANE_COLOR[node.lane];
  const left = getBarLeft(node, typeCEnabled);
  const width = Math.max(node.ganttDuration * Q_W, 24);
  const isShifted = typeCEnabled && !!node.ganttShiftOnTypeC;
  const isTypeC = node.scenario === "typeC";

  return (
    <div
      className="relative flex items-center border-b border-ws-highest/12"
      style={{ height: ROW_H }}
    >
      <div className="shrink-0 flex items-center gap-2 px-3" style={{ width: LABEL_W }}>
        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: laneColor + (isTypeC ? "80" : "ff") }} />
        <span className={`font-label text-[10px] truncate ${isTypeC ? "text-ws-text/45 italic" : "text-ws-text/75"}`}>
          {node.isMilestone && <span className="mr-0.5 opacity-40">◇</span>}
          {node.label}
        </span>
      </div>

      <div className="relative flex-1 h-full" style={{ minWidth: Q_COUNT * Q_W }}>
        {[0, 1, 2, 3].map((q) => (
          <div key={q} className="absolute top-0 bottom-0 border-l border-ws-highest/12" style={{ left: q * Q_W }} />
        ))}

        {/* Solid bar */}
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-sm flex items-center px-2 overflow-hidden transition-all duration-500"
          style={{
            left,
            width,
            height: ROW_H * 0.62,
            backgroundColor: isTypeC ? laneColor + "30" : laneColor + "cc",
            border: isTypeC ? `1.5px dashed ${laneColor}60` : `1px solid ${laneColor}`,
            boxShadow: isTypeC ? "none" : `0 1px 3px ${laneColor}22`,
            outline: isShifted ? `1px solid rgba(251,191,36,0.7)` : "none",
            outlineOffset: 1,
          }}
        >
          {isShifted && (
            <span className="font-label text-[7px] text-amber-300 mr-1 shrink-0">+Q</span>
          )}
          <span
            className="font-label text-[8.5px] font-semibold truncate"
            style={{ color: isTypeC ? laneColor : "rgba(255,255,255,0.92)" }}
          >
            {node.label}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Cumulative funding bar ───────────────────────────────────────────────────

const SUB_ROW_H = 26;

// Lane-packing: place each bar in the first sub-row where it doesn't overlap
// an already-placed bar, so all funding opportunities layer into a compact stack.
function packFundingLanes(
  nodes: MapNode[],
  typeCEnabled: boolean
): { node: MapNode; lane: number }[] {
  const items = nodes
    .map((node) => {
      const start = effectiveStart(node, typeCEnabled);
      return { node, start, end: start + node.ganttDuration };
    })
    .sort((a, b) => a.start - b.start);

  const laneEnds: number[] = [];
  const result: { node: MapNode; lane: number }[] = [];

  for (const item of items) {
    let placed = false;
    for (let i = 0; i < laneEnds.length; i++) {
      if (item.start >= laneEnds[i] - 1e-6) {
        result.push({ node: item.node, lane: i });
        laneEnds[i] = item.end;
        placed = true;
        break;
      }
    }
    if (!placed) {
      result.push({ node: item.node, lane: laneEnds.length });
      laneEnds.push(item.end);
    }
  }
  return result;
}

interface CumulativeFundingBarProps {
  nodes: MapNode[];
  typeCEnabled: boolean;
}

function CumulativeFundingBar({ nodes, typeCEnabled }: CumulativeFundingBarProps) {
  const color = LANE_COLOR["funding"];
  const packed = useMemo(() => packFundingLanes(nodes, typeCEnabled), [nodes, typeCEnabled]);
  const laneCount = Math.max(1, ...packed.map((p) => p.lane + 1));
  const totalHeight = laneCount * SUB_ROW_H + 12;

  return (
    <div
      className="relative border-b border-ws-highest/20 flex items-stretch bg-ws-highest/[0.03]"
      style={{ minHeight: totalHeight }}
    >
      <div className="shrink-0 flex items-center gap-2 px-3 z-10 py-2.5" style={{ width: LABEL_W }}>
        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <span className="font-label text-[10px] text-ws-text/70 truncate font-semibold">Funding rounds</span>
        <span className="ml-auto font-label text-[7.5px] text-ws-text/30 shrink-0 bg-ws-high px-1 rounded-sm">cumulative</span>
      </div>
      <div className="relative flex-1" style={{ minWidth: Q_COUNT * Q_W }}>
        {[0, 1, 2, 3].map((q) => (
          <div key={q} className="absolute top-0 bottom-0 border-l border-ws-highest/12" style={{ left: q * Q_W }} />
        ))}
        {packed.map(({ node, lane }) => {
          const left = getBarLeft(node, typeCEnabled);
          // Enforce a minimum width so short items (Series A, Seed close) fit their label
          const width = Math.max(node.ganttDuration * Q_W, 78);
          const isGap = node.ganttIsGap;
          return (
            <div
              key={node.id}
              className="absolute rounded-md flex items-center justify-center px-2 overflow-hidden"
              style={{
                left,
                width,
                top: lane * SUB_ROW_H + 5,
                height: SUB_ROW_H - 4,
                // Gap renders as a lighter, solid shade of the funding color (not a warning)
                backgroundColor: isGap ? color + "38" : color + "cc",
                border: `1px solid ${isGap ? color + "55" : color}`,
                boxShadow: isGap ? "none" : `0 1px 3px ${color}22`,
              }}
            >
              <span
                className="font-label text-[8.5px] font-semibold truncate text-center"
                style={{ color: isGap ? "#166534" : "rgba(255,255,255,0.94)" }}
              >
                {node.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Stage lane block ─────────────────────────────────────────────────────────

interface LaneGroupProps {
  laneId: "fda" | "sponsor" | "funding";
  children: React.ReactNode;
}

function LaneGroup({ laneId, children }: LaneGroupProps) {
  const color = LANE_COLOR[laneId];
  const { label, sublabel } = STAGE_CONFIG[laneId];

  return (
    <div className="relative flex">
      {/* Stage block */}
      <div
        className="shrink-0 flex flex-col items-center justify-center border-r"
        style={{
          width: STAGE_W,
          backgroundColor: color + "12",
          borderColor: color + "25",
        }}
      >
        <span
          className="font-label font-bold"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontSize: 7.5,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: color,
            opacity: 0.8,
          }}
        >
          {sublabel}
        </span>
        <div className="my-1.5 w-4 h-px" style={{ backgroundColor: color + "40" }} />
        <span
          className="font-label"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontSize: 7,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: color,
            opacity: 0.5,
          }}
        >
          {label}
        </span>
      </div>
      {/* Lane rows */}
      <div className="flex-1">{children}</div>
    </div>
  );
}

// ─── Main GanttView ───────────────────────────────────────────────────────────

interface GanttViewProps {
  typeCEnabled: boolean;
}

export function GanttView({ typeCEnabled }: GanttViewProps) {
  const allNodes = useMemo(
    () => NODES.filter((n) => !n.scenario || (n.scenario === "typeC" && typeCEnabled)),
    [typeCEnabled]
  );

  const fdaNodes   = allNodes.filter((n) => n.lane === "fda" && !n.ganttIsLongBar && !n.ganttIsGap);
  const sponsorNodes = allNodes.filter((n) => n.lane === "sponsor" && !n.ganttIsLongBar && !n.ganttIsGap);
  const envNode    = NODES.find((n) => n.ganttIsLongBar);
  // Funding lane renders as a single stacked/packed timeline of all funding opportunities
  const allFundingNodes = allNodes.filter((n) => n.lane === "funding");

  return (
    <div className="flex-1 overflow-auto" style={{ backgroundColor: "var(--color-ws-bg)" }}>
      <div style={{ minWidth: STAGE_W + LABEL_W + Q_COUNT * Q_W + 40 }}>

        {/* Quarter headers */}
        <div
          className="sticky top-0 z-10 flex border-b border-ws-highest/30"
          style={{ backgroundColor: "var(--color-ws-mid)", height: HEADER_H }}
        >
          {/* Stage + label header */}
          <div
            className="shrink-0 border-r border-ws-highest/20 flex items-end px-3 pb-2"
            style={{ width: STAGE_W + LABEL_W }}
          >
            <span className="font-label text-[8.5px] uppercase tracking-widest text-ws-text/25">Node</span>
          </div>
          {GANTT_QUARTERS.map((q) => (
            <div
              key={q.q}
              className="border-r border-ws-highest/20 flex flex-col justify-end px-3 pb-2"
              style={{ width: Q_W }}
            >
              <div className="font-label text-[11px] font-bold text-ws-text/75">{q.label}</div>
              <div className="font-label text-[8.5px] text-ws-text/30 mt-0.5">{q.sublabel}</div>
            </div>
          ))}
        </div>

        {/* FDA lane */}
        <LaneGroup laneId="fda">
          {fdaNodes.map((node) => <GanttRow key={node.id} node={node} typeCEnabled={typeCEnabled} />)}
        </LaneGroup>

        {/* Sponsor lane */}
        <LaneGroup laneId="sponsor">
          {sponsorNodes.map((node) => <GanttRow key={node.id} node={node} typeCEnabled={typeCEnabled} />)}
          {envNode && <EnvAssessBar node={envNode} />}
        </LaneGroup>

        {/* Funding lane — single stacked timeline of all funding opportunities */}
        <LaneGroup laneId="funding">
          <CumulativeFundingBar nodes={allFundingNodes} typeCEnabled={typeCEnabled} />
        </LaneGroup>

      </div>

      {typeCEnabled && (
        <div className="sticky bottom-0 px-4 py-2 text-right" style={{ backgroundColor: "rgba(244,245,247,0.92)" }}>
          <span className="font-label text-[9px] text-amber-400/70">
            ↕ Type C scenario active — Type B, GLP Reporting, IND, Series A shifted +1 quarter
          </span>
        </div>
      )}
    </div>
  );
}
