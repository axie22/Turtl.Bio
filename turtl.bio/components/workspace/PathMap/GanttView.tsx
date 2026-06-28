"use client";

import { useMemo } from "react";
import {
  MapNode,
  NODES,
  GANTT_QUARTERS,
  STATUS_CONFIG,
  LANE_COLOR,
} from "./data";

const Q_COUNT = 4;
const Q_W = 195;
const ROW_H = 40;
const LABEL_W = 196;
const HEADER_H = 54;

function effectiveStart(node: MapNode, typeCEnabled: boolean) {
  return node.ganttStart + (typeCEnabled && node.ganttShiftOnTypeC ? node.ganttShiftOnTypeC : 0);
}

function getBarLeft(node: MapNode, typeCEnabled: boolean) {
  return LABEL_W + (effectiveStart(node, typeCEnabled) - 1) * Q_W;
}

// ─── ENV ASSESS long bar (special background bar spanning Q1→Q4) ─────────────

function EnvAssessBar({ node }: { node: MapNode }) {
  const color = LANE_COLOR[node.lane];
  return (
    <div
      className="relative border-b border-ws-highest/20 flex items-center"
      style={{ height: ROW_H }}
    >
      {/* Label */}
      <div className="shrink-0 flex items-center gap-2 px-3 z-10 relative" style={{ width: LABEL_W }}>
        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <span className="font-label text-[10px] text-ws-text/70 truncate italic">{node.label}</span>
        <span className="ml-auto font-label text-[7.5px] text-ws-text/25 shrink-0">parallel</span>
      </div>
      {/* Full-width bar */}
      <div className="relative flex-1 h-full" style={{ minWidth: Q_COUNT * Q_W }}>
        {/* Quarter grid lines */}
        {[0, 1, 2, 3].map((q) => (
          <div key={q} className="absolute top-0 bottom-0 border-l border-ws-highest/15" style={{ left: q * Q_W }} />
        ))}
        {/* Long spanning bar */}
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-sm"
          style={{
            left: 0,
            right: 0,
            height: ROW_H * 0.35,
            backgroundColor: color + "12",
            borderTop: `1px solid ${color}30`,
            borderBottom: `1px solid ${color}30`,
          }}
        >
          <div className="h-full flex items-center px-3">
            <span className="font-label text-[8px] text-ws-text/25 italic">Q1 → Q4 · runs in parallel</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RUNWAY RISK gap bar (hatched amber) ─────────────────────────────────────

function GapBar({ node }: { node: MapNode }) {
  return (
    <div
      className="relative border-b border-ws-highest/20 flex items-center"
      style={{ height: ROW_H }}
    >
      <div className="shrink-0 flex items-center gap-2 px-3 z-10 relative" style={{ width: LABEL_W }}>
        <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-amber-400" />
        <span className="font-label text-[10px] text-amber-400/70 truncate">{node.label}</span>
        <span className="ml-auto font-label text-[7.5px] text-amber-400/40 shrink-0 bg-amber-400/10 px-1 rounded-sm">RISK</span>
      </div>
      <div className="relative flex-1 h-full" style={{ minWidth: Q_COUNT * Q_W }}>
        {[0, 1, 2, 3].map((q) => (
          <div key={q} className="absolute top-0 bottom-0 border-l border-ws-highest/15" style={{ left: q * Q_W }} />
        ))}
        {/* Hatched amber gap */}
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-sm overflow-hidden"
          style={{
            left: (node.ganttStart - 1) * Q_W,
            width: node.ganttDuration * Q_W,
            height: ROW_H * 0.55,
            border: "1px solid rgba(251,191,36,0.4)",
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(251,191,36,0.12) 0px, rgba(251,191,36,0.12) 4px, transparent 4px, transparent 10px)",
            backgroundColor: "rgba(251,191,36,0.04)",
          }}
        >
          <div className="h-full flex items-center justify-center">
            <span className="font-label text-[7.5px] text-amber-400/60 font-bold tracking-wider">NO FUNDING</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Regular row ─────────────────────────────────────────────────────────────

interface GanttRowProps {
  node: MapNode;
  typeCEnabled: boolean;
}

function GanttRow({ node, typeCEnabled }: GanttRowProps) {
  const st = STATUS_CONFIG[node.status];
  const laneColor = LANE_COLOR[node.lane];
  const left = getBarLeft(node, typeCEnabled);
  const width = Math.max(node.ganttDuration * Q_W, 20);

  const isShifted = typeCEnabled && !!node.ganttShiftOnTypeC;

  return (
    <div
      className="relative flex items-center border-b border-ws-highest/20"
      style={{ height: ROW_H }}
    >
      <div className="shrink-0 flex items-center gap-2 px-3" style={{ width: LABEL_W }}>
        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: laneColor }} />
        <span className="font-label text-[10px] text-ws-text/75 truncate">
          {node.isMilestone && <span className="mr-0.5 opacity-40">◇</span>}
          {node.label}
        </span>
        <span className={`ml-auto shrink-0 font-label text-[7.5px] px-1 py-0.5 rounded-sm ${st.bg} ${st.text}`}>
          {st.label}
        </span>
      </div>

      <div className="relative flex-1 h-full" style={{ minWidth: Q_COUNT * Q_W }}>
        {[0, 1, 2, 3].map((q) => (
          <div key={q} className="absolute top-0 bottom-0 border-l border-ws-highest/15" style={{ left: q * Q_W }} />
        ))}
        {/* Bar */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 rounded-sm flex items-center px-2 transition-all duration-500 ${
            isShifted ? "ring-1 ring-amber-400/40" : ""
          }`}
          style={{
            left,
            width,
            height: ROW_H * 0.52,
            backgroundColor: laneColor + "22",
            borderColor: laneColor + "55",
            borderWidth: 1,
            borderStyle: "solid",
          }}
        >
          {isShifted && (
            <span className="font-label text-[7px] text-amber-400/70 mr-1">+Q</span>
          )}
          <span className={`font-label text-[8px] truncate font-semibold ${st.text}`}>
            {st.label}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Lane separator ───────────────────────────────────────────────────────────

function LaneSeparator({ label, color }: { label: string; color: string }) {
  return (
    <div
      className="flex items-center border-b border-ws-highest/20"
      style={{ height: 22, backgroundColor: "var(--color-ws-low)" }}
    >
      <div className="shrink-0 flex items-center gap-2 px-3" style={{ width: LABEL_W }}>
        <div className="w-2 h-px" style={{ backgroundColor: color }} />
        <span className="font-label text-[8px] uppercase tracking-widest" style={{ color: color + "80" }}>
          {label}
        </span>
      </div>
      <div className="flex-1 h-px" style={{ backgroundColor: color + "12", minWidth: Q_COUNT * Q_W }} />
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

  const fdaNodes   = allNodes.filter((n) => n.lane === "fda"     && !n.ganttIsLongBar && !n.ganttIsGap);
  const sponsorNodes = allNodes.filter((n) => n.lane === "sponsor" && !n.ganttIsLongBar && !n.ganttIsGap);
  const envNode    = allNodes.find((n) => n.ganttIsLongBar);
  const gapNode    = allNodes.find((n) => n.ganttIsGap);
  const fundingNodes = allNodes.filter((n) => n.lane === "funding" && !n.ganttIsGap);

  return (
    <div className="flex-1 overflow-auto" style={{ backgroundColor: "var(--color-ws-bg)" }}>
      <div style={{ minWidth: LABEL_W + Q_COUNT * Q_W + 40 }}>

        {/* Quarter headers */}
        <div
          className="sticky top-0 z-10 flex border-b border-ws-highest/30"
          style={{ backgroundColor: "var(--color-ws-mid)", height: HEADER_H }}
        >
          <div
            className="shrink-0 border-r border-ws-highest/20 flex items-end px-3 pb-2"
            style={{ width: LABEL_W }}
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
        <LaneSeparator label="FDA" color="#60a5fa" />
        {fdaNodes.map((node) => <GanttRow key={node.id} node={node} typeCEnabled={typeCEnabled} />)}

        {/* Sponsor lane */}
        <LaneSeparator label="Sponsor" color="#54dcbc" />
        {sponsorNodes.map((node) => <GanttRow key={node.id} node={node} typeCEnabled={typeCEnabled} />)}
        {/* Env Assess as a long bar below sponsor rows */}
        {envNode && <EnvAssessBar node={envNode} />}

        {/* Funding lane */}
        <LaneSeparator label="Funding" color="#22c55e" />
        {fundingNodes.map((node) => <GanttRow key={node.id} node={node} typeCEnabled={typeCEnabled} />)}
        {/* Phase 1→2 gap as hatched bar */}
        {gapNode && <GapBar node={gapNode} />}

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
