"use client";

import { useMemo } from "react";
import {
  MapNode,
  MapEdge,
  NODES,
  EDGES,
  CARD_W,
  CARD_H,
  COL_X,
  ROW_Y,
  CANVAS_W,
  CANVAS_H,
  STATUS_CONFIG,
  LANE_COLOR,
} from "./data";

// ─── Helpers ────────────────────────────────────────────────────────────────

function nodeX(n: MapNode) { return COL_X[n.col]; }
function nodeY(n: MapNode) { return ROW_Y[n.row]; }
function nodeCX(n: MapNode) { return nodeX(n) + CARD_W / 2; }
function nodeCY(n: MapNode) { return nodeY(n) + CARD_H / 2; }

const ARC_OVERHANG = 90;
const ARC_Y = CANVAS_H + 45;

function getEdgePath(src: MapNode, tgt: MapNode): string {
  const sx = nodeX(src); const sy = nodeY(src);
  const tx = nodeX(tgt); const ty = nodeY(tgt);
  const scy = nodeCY(src); const tcy = nodeCY(tgt);
  const scx = nodeCX(src); const tcx = nodeCX(tgt);

  if (src.col === tgt.col && src.row < tgt.row) {
    const y1 = sy + CARD_H; const y2 = ty;
    const my = (y1 + y2) / 2;
    return `M ${scx},${y1} C ${scx},${my} ${tcx},${my} ${tcx},${y2}`;
  }
  if (src.col === tgt.col && src.row > tgt.row) {
    const y1 = sy; const y2 = ty + CARD_H;
    const my = (y1 + y2) / 2;
    return `M ${scx},${y1} C ${scx},${my} ${tcx},${my} ${tcx},${y2}`;
  }
  if (tgt.col - src.col >= 3 && Math.abs(src.row - tgt.row) <= 1) {
    const x1 = sx + CARD_W; const x2 = tx;
    return `M ${x1},${scy} C ${x1 + 80},${ARC_Y} ${x2 - 80},${ARC_Y} ${x2},${tcy}`;
  }
  const x1 = sx + CARD_W; const x2 = tx;
  const mx = (x1 + x2) / 2;
  return `M ${x1},${scy} C ${mx},${scy} ${mx},${tcy} ${x2},${tcy}`;
}

function getEdgeLabelPoint(src: MapNode, tgt: MapNode): { x: number; y: number } {
  if (tgt.col - src.col >= 3 && Math.abs(src.row - tgt.row) <= 1) {
    return { x: (nodeCX(src) + nodeCX(tgt)) / 2, y: ARC_Y + 14 };
  }
  return { x: (nodeCX(src) + nodeCX(tgt)) / 2, y: (nodeCY(src) + nodeCY(tgt)) / 2 };
}

// ─── NodeCard ────────────────────────────────────────────────────────────────

interface NodeCardProps {
  node: MapNode;
  isSelected: boolean;
  isOptionalUnactivated: boolean;
  onClick: (id: string) => void;
  onActivate: (id: string) => void;
}

function NodeCard({ node, isSelected, isOptionalUnactivated, onClick, onActivate }: NodeCardProps) {
  const st = STATUS_CONFIG[node.status];
  const laneColor = LANE_COLOR[node.lane];

  const handleClick = () => {
    if (isOptionalUnactivated) onActivate(node.id);
    else onClick(node.id);
  };

  return (
    <div
      className="absolute select-none cursor-pointer group"
      style={{
        left: nodeX(node), top: nodeY(node), width: CARD_W, height: CARD_H,
        opacity: isOptionalUnactivated ? 0.55 : 1,
        transition: "opacity 0.2s ease",
      }}
      onClick={handleClick}
    >
      <div
        className="h-full rounded-sm flex flex-col justify-between transition-all duration-150"
        style={{
          backgroundColor: isOptionalUnactivated ? "var(--color-ws-low)" : "var(--color-ws-lowest)",
          border: isOptionalUnactivated
            ? `1.5px dashed ${laneColor}88`
            : `1px solid ${isSelected ? laneColor : "rgba(180,185,196,0.8)"}`,
          boxShadow: isSelected && !isOptionalUnactivated
            ? `0 0 0 1px ${laneColor}44, 0 0 12px ${laneColor}22`
            : "none",
        }}
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-sm"
          style={{ backgroundColor: isOptionalUnactivated ? laneColor + "30" : laneColor + "60" }}
        />
        <div className="px-3 pt-2.5 pb-1">
          <div className="font-label text-[11.5px] font-semibold text-ws-text leading-tight truncate">
            {node.isMilestone && <span className="mr-1 text-[10px] opacity-60">◇</span>}
            {node.label}
          </div>
          <div className="font-label text-[10px] mt-0.5 truncate" style={{ color: "rgba(17,24,39,0.55)" }}>
            {node.subtitle}
          </div>
        </div>
        <div className="px-3 pb-2 flex items-center justify-between">
          <span
            className="font-label text-[9px] px-1.5 py-0.5 rounded-sm"
            style={{ backgroundColor: "rgba(0,0,0,0.05)", color: "rgba(17,24,39,0.45)" }}
          >
            {node.id}
          </span>
          {isOptionalUnactivated ? (
            <span className="font-label text-[9px] px-1.5 py-0.5 rounded-sm text-amber-500 bg-amber-400/10 border border-amber-400/25">
              Optional
            </span>
          ) : (
            <span className={`font-label text-[9px] px-1.5 py-0.5 rounded-sm ${st.bg} ${st.text}`}>
              {st.label}
            </span>
          )}
        </div>
        {isOptionalUnactivated && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-sm">
            <span className="font-label text-[8px] text-ws-teal bg-ws-lowest/90 px-2 py-0.5 rounded-sm border border-ws-teal/20">
              + Add to scenario
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── EdgeLayer ───────────────────────────────────────────────────────────────

interface EdgeLayerProps {
  nodes: MapNode[];
  edges: MapEdge[];
  activatedOptionalNodes: Set<string>;
}

function EdgeLayer({ nodes, edges, activatedOptionalNodes }: EdgeLayerProps) {
  const nodeMap = useMemo(() => {
    const m: Record<string, MapNode> = {};
    nodes.forEach((n) => (m[n.id] = n));
    return m;
  }, [nodes]);

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={CANVAS_W}
      height={CANVAS_H + ARC_OVERHANG}
      style={{ overflow: "visible", zIndex: 1 }}
    >
      <defs>
        <marker id="arr" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill="#94a3b8" />
        </marker>
        <marker id="arr-bold" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill="#0d9488" />
        </marker>
        <marker id="arr-tc" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill="#f59e0b" />
        </marker>
      </defs>

      {edges.map((edge, i) => {
        const src = nodeMap[edge.from];
        const tgt = nodeMap[edge.to];
        if (!src || !tgt) return null;

        const isTypeC = edge.scenario === "typeC";
        const srcGhost = src.scenario === "typeC" && !activatedOptionalNodes.has(src.id);
        const tgtGhost = tgt.scenario === "typeC" && !activatedOptionalNodes.has(tgt.id);
        const isGhost = isTypeC && srcGhost && tgtGhost;

        const path = getEdgePath(src, tgt);
        const mid = getEdgeLabelPoint(src, tgt);
        const strokeColor = isTypeC ? "#d97706" : edge.bold ? "#0d9488" : "#94a3b8";
        const markerId = isTypeC ? "arr-tc" : edge.bold ? "arr-bold" : "arr";
        const labelFill = isTypeC ? "#b45309" : edge.bold ? "#0d7a70" : "#475569";

        return (
          <g key={i} opacity={isGhost ? 0.3 : 1}>
            <path
              d={path}
              fill="none"
              stroke={strokeColor}
              strokeWidth={edge.bold ? 2 : 1.2}
              strokeDasharray={isTypeC ? "4 3" : undefined}
              markerEnd={`url(#${markerId})`}
            />
            {edge.label && (
              <text
                x={mid.x}
                y={mid.y}
                textAnchor="middle"
                style={{
                  fontSize: 9,
                  fontFamily: "'Space Grotesk', sans-serif",
                  fill: labelFill,
                  paintOrder: "stroke fill",
                  stroke: "rgba(244,245,247,0.95)",
                  strokeWidth: 4,
                  strokeLinejoin: "round",
                }}
              >
                {edge.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── GraphView ───────────────────────────────────────────────────────────────

interface GraphViewProps {
  typeCEnabled: boolean;
  activatedOptionalNodes: Set<string>;
  onActivateNode: (id: string) => void;
  selectedNodes: Set<string>;
  onNodeClick: (id: string) => void;
}

export function GraphView({
  typeCEnabled,
  activatedOptionalNodes,
  onActivateNode,
  selectedNodes,
  onNodeClick,
}: GraphViewProps) {
  return (
    <div className="flex-1 overflow-auto relative" style={{ backgroundColor: "var(--color-ws-bg)" }}>
      <div
        className="relative"
        style={{ width: CANVAS_W, height: CANVAS_H + ARC_OVERHANG, minWidth: CANVAS_W }}
      >
        <div className="absolute pointer-events-none" style={{ width: CANVAS_W, height: CANVAS_H }}>
          <div style={{ position: "absolute", top: ROW_Y[0] - 10, height: ROW_Y[1] - ROW_Y[0], width: "100%", backgroundColor: "rgba(37,99,235,0.03)", borderBottom: "1px solid rgba(37,99,235,0.08)" }} />
          <div style={{ position: "absolute", top: ROW_Y[1] - 2, height: ROW_Y[3] - ROW_Y[1], width: "100%", backgroundColor: "rgba(13,148,136,0.025)", borderBottom: "1px solid rgba(13,148,136,0.07)" }} />
          <div style={{ position: "absolute", top: ROW_Y[3] - 2, height: CANVAS_H - ROW_Y[3] + 4, width: "100%", backgroundColor: "rgba(22,163,74,0.025)" }} />
          <div style={{ position: "absolute", top: ROW_Y[0] + 2, left: 4, fontSize: 8, color: "rgba(37,99,235,0.45)", fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>FDA</div>
          <div style={{ position: "absolute", top: ROW_Y[1] + 2, left: 4, fontSize: 8, color: "rgba(13,148,136,0.45)", fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>Sponsor</div>
          <div style={{ position: "absolute", top: ROW_Y[3] + 2, left: 4, fontSize: 8, color: "rgba(22,163,74,0.45)", fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>Funding</div>
        </div>

        <svg className="absolute inset-0 pointer-events-none" width={CANVAS_W} height={CANVAS_H}>
          <defs>
            <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="rgba(0,0,0,0.07)" />
            </pattern>
          </defs>
          <rect width={CANVAS_W} height={CANVAS_H} fill="url(#dots)" />
        </svg>

        <EdgeLayer
          nodes={NODES}
          edges={EDGES}
          activatedOptionalNodes={activatedOptionalNodes}
        />

        {NODES.map((node) => {
          const isOptionalUnactivated =
            node.scenario === "typeC" && !typeCEnabled && !activatedOptionalNodes.has(node.id);
          return (
            <NodeCard
              key={node.id}
              node={node}
              isSelected={selectedNodes.has(node.id)}
              isOptionalUnactivated={isOptionalUnactivated}
              onClick={onNodeClick}
              onActivate={onActivateNode}
            />
          );
        })}
      </div>
    </div>
  );
}
