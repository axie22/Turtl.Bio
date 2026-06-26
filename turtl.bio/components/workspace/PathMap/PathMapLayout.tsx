"use client";

import { useState, useCallback } from "react";
import { GraphView } from "./GraphView";
import { GanttView } from "./GanttView";
import { CopilotPanel } from "./CopilotPanel";
import {
  NODES,
  EDGES,
  PROGRAM_NAME,
  PROGRAM_DATE,
} from "./data";

type ViewMode = "graph" | "gantt";
type NavTab = "explorer" | "path-map" | "regulatory-ai";

// ─── Activity Bar ────────────────────────────────────────────────────────────

function ActivityBar() {
  return (
    <aside className="w-10 bg-ws-lowest border-r border-ws-highest/20 flex flex-col items-center py-3 gap-5 shrink-0">
      {[
        { icon: "description", label: "Files" },
        { icon: "account_tree", label: "Map" },
        { icon: "manage_search", label: "Search" },
        { icon: "history", label: "History" },
      ].map((item) => (
        <button
          key={item.label}
          title={item.label}
          className="text-ws-text/25 hover:text-ws-text/60 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
        </button>
      ))}
    </aside>
  );
}

// ─── Top Nav ─────────────────────────────────────────────────────────────────

interface TopNavProps {
  activeTab: NavTab;
  setActiveTab: (t: NavTab) => void;
  typeCEnabled: boolean;
  onToggleTypeC: () => void;
  onNavigate?: (view: string) => void;
}

function TopNav({ activeTab, setActiveTab, typeCEnabled, onToggleTypeC, onNavigate }: TopNavProps) {
  const tabs: { id: NavTab; label: string }[] = [
    { id: "explorer", label: "Explorer" },
    { id: "path-map", label: "Path Map" },
    { id: "regulatory-ai", label: "Regulatory AI" },
  ];

  const handleTabClick = (tab: { id: NavTab; label: string }) => {
    if (tab.id === "path-map") {
      setActiveTab(tab.id);
    } else {
      onNavigate?.(tab.id);
    }
  };

  return (
    <header className="h-11 bg-ws-mid border-b border-ws-highest/40 flex items-center justify-between px-4 shrink-0 z-50">
      {/* Left */}
      <div className="flex items-center gap-6">
        <span className="text-base font-black text-ws-teal font-headline uppercase tracking-wider">
          Turtl.Bio
        </span>
        <nav className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`px-3 py-1.5 font-label text-[11px] font-medium rounded-sm transition-colors ${
                activeTab === tab.id
                  ? "text-ws-teal bg-ws-teal/10"
                  : "text-ws-text/50 hover:text-ws-text/80 hover:bg-ws-highest/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center bg-ws-lowest px-2.5 py-1.5 rounded-sm border border-ws-outline-dim/20">
          <span className="material-symbols-outlined text-ws-text/30 text-[14px] mr-1.5">
            search
          </span>
          <input
            className="bg-transparent border-none focus:ring-0 focus:outline-none text-[11px] w-36 p-0 text-ws-text font-label placeholder:text-ws-text/20"
            placeholder="Search knowledge base..."
            type="text"
          />
          <span className="font-label text-[9px] text-ws-text/20 ml-1.5">⌘K</span>
        </div>

        {/* Scenario toggle */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-ws-lowest border border-ws-highest/30 rounded-sm">
          <span className="font-label text-[10px] text-ws-text/50">Scenario:</span>
          <span className={`font-label text-[10px] font-medium ${typeCEnabled ? "text-ws-teal" : "text-ws-text/40"}`}>
            + Type C meeting
          </span>
          <button
            onClick={onToggleTypeC}
            className={`relative w-8 h-4 rounded-full transition-colors duration-200 ${
              typeCEnabled ? "bg-ws-teal-dark" : "bg-ws-highest"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform duration-200 ${
                typeCEnabled ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="text-ws-text/30 hover:text-ws-text/70 transition-colors">
            <span className="material-symbols-outlined text-[18px]">settings</span>
          </button>
          <button className="text-ws-text/30 hover:text-ws-text/70 transition-colors">
            <span className="material-symbols-outlined text-[18px]">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Sub-toolbar ─────────────────────────────────────────────────────────────

interface SubToolbarProps {
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
}

function SubToolbar({ viewMode, setViewMode }: SubToolbarProps) {
  return (
    <div className="h-9 bg-ws-low border-b border-ws-highest/20 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-1">
        {/* View toggle */}
        <div className="flex items-center bg-ws-lowest border border-ws-highest/30 rounded-sm mr-3">
          <button
            onClick={() => setViewMode("graph")}
            className={`flex items-center gap-1.5 px-2.5 py-1 font-label text-[10px] rounded-l-sm transition-colors ${
              viewMode === "graph"
                ? "bg-ws-teal/15 text-ws-teal"
                : "text-ws-text/40 hover:text-ws-text/70"
            }`}
          >
            <span className="material-symbols-outlined !text-[12px]">schema</span>
            Graph
          </button>
          <div className="w-px h-4 bg-ws-highest/40" />
          <button
            onClick={() => setViewMode("gantt")}
            className={`flex items-center gap-1.5 px-2.5 py-1 font-label text-[10px] rounded-r-sm transition-colors ${
              viewMode === "gantt"
                ? "bg-ws-teal/15 text-ws-teal"
                : "text-ws-text/40 hover:text-ws-text/70"
            }`}
          >
            <span className="material-symbols-outlined !text-[12px]">view_timeline</span>
            Gantt
          </button>
        </div>

        <button className="text-ws-text/30 hover:text-ws-text/60 transition-colors p-1">
          <span className="material-symbols-outlined text-[16px]">refresh</span>
        </button>

        <div className="w-px h-4 bg-ws-highest/30 mx-2" />

        {["Group by", "Filter", "Fields", "Links"].map((label) => (
          <button
            key={label}
            className="font-label text-[10px] text-ws-text/35 hover:text-ws-text/65 px-2 py-1 hover:bg-ws-highest/30 rounded-sm transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined !text-[11px]">
              {label === "Group by" ? "layers" : label === "Filter" ? "filter_list" : label === "Fields" ? "view_column" : "link"}
            </span>
            {label}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3">
        {[
          { color: "#60a5fa", label: "FDA" },
          { color: "#54dcbc", label: "study" },
          { color: "#22c55e", label: "Funding" },
          { color: "#a78bfa", label: "Parallel" },
          { color: "#3c4a45", label: "dependency" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-label text-[9px] text-ws-text/30">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Breadcrumb / map title bar ───────────────────────────────────────────────

function MapTitleBar() {
  return (
    <div className="h-8 bg-ws-bg border-b border-ws-highest/10 flex items-center px-4 gap-3 shrink-0">
      <span className="font-label text-[9px] uppercase tracking-widest text-ws-text/25">
        Generated Map
      </span>
      <span className="text-ws-text/15">/</span>
      <span className="font-label text-[10.5px] font-semibold text-ws-text/70">
        {PROGRAM_NAME}
      </span>
      <span
        className="font-label text-[9px] px-1.5 py-0.5 rounded-sm"
        style={{ backgroundColor: "rgba(84,220,188,0.08)", color: "rgba(84,220,188,0.5)" }}
      >
        auto-plotted from TPP + submission docs
      </span>
    </div>
  );
}

// ─── Status Bar ──────────────────────────────────────────────────────────────

interface MapStatusBarProps {
  viewMode: ViewMode;
  typeCEnabled: boolean;
  nodeCount: number;
  edgeCount: number;
}

function MapStatusBar({ viewMode, typeCEnabled, nodeCount, edgeCount }: MapStatusBarProps) {
  return (
    <footer className="h-7 bg-ws-lowest border-t border-ws-highest/20 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <span className="font-label text-[9.5px] text-ws-text/30 uppercase tracking-widest">
          {viewMode === "graph" ? "Dependency Graph" : "Gantt Timeline"}
        </span>
        <span className="font-label text-[9.5px] text-ws-text/20">·</span>
        <span className="font-label text-[9.5px] text-ws-text/25">{PROGRAM_DATE}</span>
        <span className="font-label text-[9.5px] text-ws-text/20">·</span>
        <span className="font-label text-[9.5px] text-ws-text/25">{nodeCount} nodes</span>
        <span className="font-label text-[9.5px] text-ws-text/20">·</span>
        <span className="font-label text-[9.5px] text-ws-text/25">{edgeCount} links</span>
      </div>
      <div className="flex items-center gap-4">
        <button
          className={`font-label text-[9.5px] uppercase tracking-widest transition-colors ${
            viewMode === "gantt" ? "text-ws-teal" : "text-ws-text/25 hover:text-ws-text/50"
          }`}
        >
          Time (quarters)
        </button>
        <span className="font-label text-[9.5px] text-ws-text/15">/</span>
        <button
          className={`font-label text-[9.5px] uppercase tracking-widest transition-colors ${
            viewMode === "graph" ? "text-ws-teal" : "text-ws-text/25 hover:text-ws-text/50"
          }`}
        >
          Dependency (Logic)
        </button>
        <span className="font-label text-[9.5px] text-ws-text/20">·</span>
        <span
          className={`font-label text-[9.5px] uppercase tracking-widest font-bold ${
            typeCEnabled ? "text-amber-400" : "text-ws-text/25"
          }`}
        >
          Scenarios: {typeCEnabled ? "Type C added" : "Baseline"}
        </span>
      </div>
    </footer>
  );
}

// ─── Main PathMapLayout ───────────────────────────────────────────────────────

interface PathMapLayoutProps {
  activeView?: string;
  onNavigate?: (view: string) => void;
}

export function PathMapLayout({ onNavigate }: PathMapLayoutProps) {
  const [activeTab, setActiveTab] = useState<NavTab>("path-map");
  const [viewMode, setViewMode] = useState<ViewMode>("graph");
  const [typeCEnabled, setTypeCEnabled] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
  const [copilotCollapsed, setCopilotCollapsed] = useState(false);

  const handleNodeClick = useCallback((id: string) => {
    setSelectedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    if (copilotCollapsed) setCopilotCollapsed(false);
  }, [copilotCollapsed]);

  const visibleNodes = NODES.filter(
    (n) => !n.scenario || (n.scenario === "typeC" && typeCEnabled)
  );
  const visibleEdges = EDGES.filter(
    (e) => !e.scenario || (e.scenario === "typeC" && typeCEnabled)
  );

  return (
    <div className="h-screen w-screen bg-ws-bg text-ws-text flex flex-col overflow-hidden selection:bg-ws-teal/30">
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        typeCEnabled={typeCEnabled}
        onToggleTypeC={() => setTypeCEnabled((v) => !v)}
        onNavigate={onNavigate}
      />
      <SubToolbar viewMode={viewMode} setViewMode={setViewMode} />
      <MapTitleBar />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <ActivityBar />

        {/* Center canvas */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {viewMode === "graph" ? (
            <GraphView
              typeCEnabled={typeCEnabled}
              selectedNodes={selectedNodes}
              onNodeClick={handleNodeClick}
            />
          ) : (
            <GanttView typeCEnabled={typeCEnabled} />
          )}
        </div>

        {/* Co-pilot */}
        <CopilotPanel
          selectedNodes={selectedNodes}
          collapsed={copilotCollapsed}
          onToggle={() => setCopilotCollapsed((v) => !v)}
        />
      </div>

      <MapStatusBar
        viewMode={viewMode}
        typeCEnabled={typeCEnabled}
        nodeCount={visibleNodes.length}
        edgeCount={visibleEdges.length}
      />
    </div>
  );
}
