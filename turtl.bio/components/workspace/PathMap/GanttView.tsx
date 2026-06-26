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
const Q_W = 200; // px per quarter
const ROW_H = 42;
const LABEL_W = 180;
const HEADER_H = 56;

function getBarStyle(node: MapNode): React.CSSProperties {
  const left = LABEL_W + (node.ganttStart - 1) * Q_W;
  const width = Math.max(node.ganttDuration * Q_W, 24);
  const color = LANE_COLOR[node.lane];
  return {
    left,
    width,
    backgroundColor: color + "22",
    borderColor: color + "55",
    borderWidth: 1,
    borderStyle: "solid",
  };
}

interface GanttRowProps {
  node: MapNode;
}

function GanttRow({ node }: GanttRowProps) {
  const st = STATUS_CONFIG[node.status];
  const laneColor = LANE_COLOR[node.lane];

  return (
    <div
      className="relative flex items-center border-b border-ws-highest/20"
      style={{ height: ROW_H }}
    >
      {/* Label */}
      <div
        className="shrink-0 flex items-center gap-2 px-3"
        style={{ width: LABEL_W }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: laneColor }}
        />
        <span className="font-label text-[10.5px] text-ws-text/80 truncate">
          {node.isMilestone && <span className="mr-0.5 opacity-50">◇</span>}
          {node.label}
        </span>
        <span className={`ml-auto shrink-0 font-label text-[8px] px-1 py-0.5 rounded-sm ${st.bg} ${st.text}`}>
          {node.id}
        </span>
      </div>

      {/* Timeline area */}
      <div className="relative flex-1 h-full" style={{ minWidth: Q_COUNT * Q_W }}>
        {/* Quarter grid lines */}
        {[0, 1, 2, 3].map((q) => (
          <div
            key={q}
            className="absolute top-0 bottom-0 border-l border-ws-highest/20"
            style={{ left: q * Q_W }}
          />
        ))}

        {/* Bar */}
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-sm flex items-center px-2"
          style={{ ...getBarStyle(node), height: ROW_H * 0.5 }}
        >
          <span
            className={`font-label text-[8.5px] truncate font-semibold ${st.text}`}
          >
            {st.label}
          </span>
        </div>
      </div>
    </div>
  );
}

interface GanttViewProps {
  typeCEnabled: boolean;
}

export function GanttView({ typeCEnabled }: GanttViewProps) {
  const visibleNodes = useMemo(
    () => NODES.filter((n) => !n.scenario || (n.scenario === "typeC" && typeCEnabled)),
    [typeCEnabled]
  );

  return (
    <div className="flex-1 overflow-auto" style={{ backgroundColor: "#10141a" }}>
      <div style={{ minWidth: LABEL_W + Q_COUNT * Q_W + 40 }}>
        {/* Quarter headers */}
        <div
          className="sticky top-0 z-10 flex border-b border-ws-highest/30"
          style={{ backgroundColor: "#151a21", height: HEADER_H }}
        >
          <div
            className="shrink-0 border-r border-ws-highest/20 flex items-end px-3 pb-2"
            style={{ width: LABEL_W }}
          >
            <span className="font-label text-[9px] uppercase tracking-widest text-ws-text/30">
              Node
            </span>
          </div>
          {GANTT_QUARTERS.map((q) => (
            <div
              key={q.q}
              className="border-r border-ws-highest/20 flex flex-col justify-end px-3 pb-2"
              style={{ width: Q_W }}
            >
              <div className="font-label text-[11px] font-bold text-ws-text/80">
                {q.label}
              </div>
              <div className="font-label text-[9px] text-ws-text/30 mt-0.5">
                {q.sublabel}
              </div>
            </div>
          ))}
        </div>

        {/* Rows */}
        <div>
          {visibleNodes.map((node) => (
            <GanttRow key={node.id} node={node} />
          ))}
        </div>

      </div>
    </div>
  );
}
