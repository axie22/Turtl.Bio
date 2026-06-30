"use client";

import { useState, useCallback } from "react";
import { GraphView } from "./GraphView";
import { GanttView } from "./GanttView";
import { CopilotPanel } from "./CopilotPanel";
import { DocumentView } from "./DocumentView";
import {
  NODES,
  EDGES,
  PROGRAM_NAME,
  PROGRAM_DATE,
  PROGRAM_DOCS,
  NODE_DOC_MAP,
  ProgramDoc,
} from "./data";

type ViewMode = "graph" | "gantt";
type NavTab = "explorer" | "path-map" | "regulatory-ai";
// Main area tab: "map" is the pinned graph/gantt tab; anything else is a doc ID
type MainTab = "map" | string;

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
  const handleTabClick = (tab: { id: NavTab }) => {
    if (tab.id === "path-map") setActiveTab(tab.id);
    else onNavigate?.(tab.id);
  };
  return (
    <header className="h-11 bg-ws-mid border-b border-ws-highest/40 flex items-center justify-between px-4 shrink-0 z-50">
      <div className="flex items-center gap-6">
        <span className="text-base font-black text-ws-teal font-headline uppercase tracking-wider">Turtl.Bio</span>
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
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center bg-ws-lowest px-2.5 py-1.5 rounded-sm border border-ws-outline-dim/20">
          <span className="material-symbols-outlined text-ws-text/30 text-[14px] mr-1.5">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 focus:outline-none text-[11px] w-36 p-0 text-ws-text font-label placeholder:text-ws-text/20"
            placeholder="Search knowledge base..."
            type="text"
          />
          <span className="font-label text-[9px] text-ws-text/20 ml-1.5">⌘K</span>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-ws-lowest border border-ws-highest/30 rounded-sm">
          <span className="font-label text-[10px] text-ws-text/50">Scenario:</span>
          <span className={`font-label text-[10px] font-medium ${typeCEnabled ? "text-ws-teal" : "text-ws-text/40"}`}>
            + Type C meeting
          </span>
          <button
            onClick={onToggleTypeC}
            className={`relative w-8 h-4 rounded-full transition-colors duration-200 ${typeCEnabled ? "bg-ws-teal-dark" : "bg-ws-highest"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform duration-200 ${typeCEnabled ? "translate-x-4" : "translate-x-0"}`} />
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

// ─── Sub-toolbar (only on Map tab) ───────────────────────────────────────────

interface SubToolbarProps {
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
}

function SubToolbar({ viewMode, setViewMode }: SubToolbarProps) {
  return (
    <div className="h-9 bg-ws-low border-b border-ws-highest/20 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-1">
        <div className="flex items-center bg-ws-lowest border border-ws-highest/30 rounded-sm mr-3">
          <button
            onClick={() => setViewMode("gantt")}
            className={`flex items-center gap-1.5 px-2.5 py-1 font-label text-[10px] rounded-l-sm transition-colors ${viewMode === "gantt" ? "bg-ws-teal/15 text-ws-teal" : "text-ws-text/40 hover:text-ws-text/70"}`}
          >
            <span className="material-symbols-outlined !text-[12px]">view_timeline</span>
            Gantt
          </button>
          <div className="w-px h-4 bg-ws-highest/40" />
          <button
            onClick={() => setViewMode("graph")}
            className={`flex items-center gap-1.5 px-2.5 py-1 font-label text-[10px] rounded-r-sm transition-colors ${viewMode === "graph" ? "bg-ws-teal/15 text-ws-teal" : "text-ws-text/40 hover:text-ws-text/70"}`}
          >
            <span className="material-symbols-outlined !text-[12px]">schema</span>
            Graph
          </button>
        </div>
        <button className="text-ws-text/30 hover:text-ws-text/60 transition-colors p-1">
          <span className="material-symbols-outlined text-[16px]">refresh</span>
        </button>
        <div className="w-px h-4 bg-ws-highest/30 mx-2" />
        {["Group by", "Filter", "Fields", "Links"].map((label) => (
          <button key={label} className="font-label text-[10px] text-ws-text/35 hover:text-ws-text/65 px-2 py-1 hover:bg-ws-highest/30 rounded-sm transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined !text-[11px]">
              {label === "Group by" ? "layers" : label === "Filter" ? "filter_list" : label === "Fields" ? "view_column" : "link"}
            </span>
            {label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        {[{ color: "#60a5fa", label: "FDA" }, { color: "#54dcbc", label: "study" }, { color: "#22c55e", label: "Funding" }, { color: "#a78bfa", label: "Optional" }, { color: "#94a3b8", label: "dependency" }].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="font-label text-[9px] text-ws-text/30">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── File Tree ────────────────────────────────────────────────────────────────

interface FileTreeProps {
  activeDocId: string | null;
  onOpenDoc: (docId: string) => void;
}

function FileTree({ activeDocId, onOpenDoc }: FileTreeProps) {
  const programDocs = PROGRAM_DOCS.filter((d) => d.category === "program");
  const guidanceDocs = PROGRAM_DOCS.filter((d) => d.category === "guidance");

  return (
    <div className="w-52 bg-ws-low border-r border-ws-highest/20 flex flex-col overflow-hidden shrink-0">
      {/* Program files */}
      <div className="px-3 py-2 border-b border-ws-highest/15">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[11px] text-ws-text/30">folder_open</span>
          <span className="font-label text-[8.5px] uppercase tracking-widest text-ws-text/35">Program Files</span>
        </div>
      </div>
      <div className="py-0.5">
        {programDocs.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onOpenDoc(doc.id)}
            className={`w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors ${
              activeDocId === doc.id
                ? "bg-ws-teal/10 border-l-2 border-ws-teal"
                : "hover:bg-ws-highest/30 border-l-2 border-transparent"
            }`}
          >
            <span className="material-symbols-outlined text-[13px] shrink-0" style={{ color: doc.color }}>
              {doc.icon}
            </span>
            <div className="min-w-0">
              <div className="font-label text-[9.5px] text-ws-text/75 truncate leading-tight">{doc.filename}</div>
              <div className="font-label text-[8px] text-ws-text/30 truncate">{doc.label}</div>
            </div>
          </button>
        ))}
      </div>

      {/* FDA Guidance */}
      <div className="px-3 py-2 border-t border-b border-ws-highest/15">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[11px] text-ws-text/30">gavel</span>
          <span className="font-label text-[8.5px] uppercase tracking-widest text-ws-text/35">FDA Guidance</span>
        </div>
      </div>
      <div className="py-0.5 flex-1 overflow-auto">
        {guidanceDocs.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onOpenDoc(doc.id)}
            className={`w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors ${
              activeDocId === doc.id
                ? "bg-ws-teal/10 border-l-2 border-ws-teal"
                : "hover:bg-ws-highest/30 border-l-2 border-transparent"
            }`}
          >
            <span className="material-symbols-outlined text-[13px] shrink-0 text-indigo-400">{doc.icon}</span>
            <div className="min-w-0">
              <div className="font-label text-[9.5px] text-ws-text/65 truncate leading-tight">{doc.filename}</div>
              <div className="font-label text-[8px] text-ws-text/30 truncate">{doc.tags[0]}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Tab Bar ──────────────────────────────────────────────────────────────────

interface TabBarProps {
  activeTab: MainTab;
  openDocs: ProgramDoc[];
  onSelectTab: (id: MainTab) => void;
  onCloseDoc: (docId: string) => void;
}

function TabBar({ activeTab, openDocs, onSelectTab, onCloseDoc }: TabBarProps) {
  return (
    <div className="flex items-end h-8 border-b border-ws-highest/20 bg-ws-mid shrink-0 overflow-x-auto">
      {/* Pinned map tab */}
      <button
        onClick={() => onSelectTab("map")}
        className={`flex items-center gap-1.5 px-3 h-full font-label text-[10px] border-r border-ws-highest/20 shrink-0 transition-colors ${
          activeTab === "map"
            ? "bg-ws-bg text-ws-teal border-t-2 border-t-ws-teal"
            : "text-ws-text/45 hover:text-ws-text/70 hover:bg-ws-highest/20"
        }`}
        style={{ borderTop: activeTab === "map" ? "2px solid var(--color-ws-teal)" : "2px solid transparent" }}
      >
        <span className="material-symbols-outlined !text-[11px]">schema</span>
        Graph / Gantt
        <span className="font-label text-[7.5px] text-ws-text/20 ml-0.5">📌</span>
      </button>

      {/* Open document tabs */}
      {openDocs.map((doc) => (
        <div
          key={doc.id}
          className={`flex items-center gap-1.5 px-3 h-full font-label text-[10px] border-r border-ws-highest/20 cursor-pointer shrink-0 transition-colors group ${
            activeTab === doc.id
              ? "bg-ws-bg text-ws-text/80"
              : "text-ws-text/40 hover:text-ws-text/65 hover:bg-ws-highest/20"
          }`}
          style={{ borderTop: activeTab === doc.id ? "2px solid var(--color-ws-highest)" : "2px solid transparent" }}
          onClick={() => onSelectTab(doc.id)}
        >
          <span className="material-symbols-outlined !text-[11px]" style={{ color: activeTab === doc.id ? doc.color : undefined }}>
            {doc.icon}
          </span>
          <span className="max-w-[100px] truncate">{doc.filename}</span>
          <button
            className="opacity-0 group-hover:opacity-100 hover:text-ws-text/80 transition-opacity ml-1 -mr-1"
            onClick={(e) => { e.stopPropagation(); onCloseDoc(doc.id); }}
          >
            <span className="material-symbols-outlined !text-[10px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}

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
        <button key={item.label} title={item.label} className="text-ws-text/25 hover:text-ws-text/60 transition-colors">
          <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
        </button>
      ))}
    </aside>
  );
}

// ─── Breadcrumb ──────────────────────────────────────────────────────────────

function MapTitleBar() {
  return (
    <div className="h-8 bg-ws-bg border-b border-ws-highest/10 flex items-center px-4 gap-3 shrink-0">
      <span className="font-label text-[9px] uppercase tracking-widest text-ws-text/25">Generated Map</span>
      <span className="text-ws-text/15">/</span>
      <span className="font-label text-[10.5px] font-semibold text-ws-text/70">{PROGRAM_NAME}</span>
      <span className="font-label text-[9px] px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "rgba(84,220,188,0.08)", color: "rgba(84,220,188,0.5)" }}>
        auto-plotted from TPP + submission docs
      </span>
    </div>
  );
}

// ─── Status Bar ──────────────────────────────────────────────────────────────

interface StatusBarProps {
  viewMode: ViewMode;
  typeCEnabled: boolean;
  activatedCount: number;
  nodeCount: number;
  edgeCount: number;
}

function StatusBar({ viewMode, typeCEnabled, activatedCount, nodeCount, edgeCount }: StatusBarProps) {
  return (
    <footer className="h-7 bg-ws-lowest border-t border-ws-highest/20 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <span className="font-label text-[9.5px] text-ws-text/30 uppercase tracking-widest">
          {viewMode === "graph" ? "Dependency Graph" : "Gantt Timeline"}
        </span>
        <span className="font-label text-[9.5px] text-ws-text/20">·</span>
        <span className="font-label text-[9.5px] text-ws-text/25">{PROGRAM_DATE}</span>
        <span className="font-label text-[9.5px] text-ws-text/20">·</span>
        <span className="font-label text-[9.5px] text-ws-text/25">{nodeCount} nodes · {edgeCount} links</span>
        {activatedCount > 0 && (
          <>
            <span className="font-label text-[9.5px] text-ws-text/20">·</span>
            <span className="font-label text-[9.5px] text-amber-500">{activatedCount} optional added</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button className={`font-label text-[9.5px] uppercase tracking-widest transition-colors ${viewMode === "gantt" ? "text-ws-teal" : "text-ws-text/25 hover:text-ws-text/50"}`}>
          Time (quarters)
        </button>
        <span className="font-label text-[9.5px] text-ws-text/15">/</span>
        <button className={`font-label text-[9.5px] uppercase tracking-widest transition-colors ${viewMode === "graph" ? "text-ws-teal" : "text-ws-text/25 hover:text-ws-text/50"}`}>
          Dependency (Logic)
        </button>
        <span className="font-label text-[9.5px] text-ws-text/20">·</span>
        <span className={`font-label text-[9.5px] uppercase tracking-widest font-bold ${typeCEnabled ? "text-amber-400" : "text-ws-text/25"}`}>
          Scenarios: {typeCEnabled ? "Type C added" : "Baseline"}
        </span>
      </div>
    </footer>
  );
}

// ─── PathMapLayout ────────────────────────────────────────────────────────────

interface PathMapLayoutProps {
  activeView?: string;
  onNavigate?: (view: string) => void;
}

export function PathMapLayout({ onNavigate }: PathMapLayoutProps) {
  const [activeNavTab, setActiveNavTab] = useState<NavTab>("path-map");
  const [viewMode, setViewMode] = useState<ViewMode>("gantt");
  const [typeCEnabled, setTypeCEnabled] = useState(false);
  const [activatedOptionalNodes, setActivatedOptionalNodes] = useState<Set<string>>(new Set());
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
  const [copilotCollapsed, setCopilotCollapsed] = useState(false);

  // Tab system for main area
  const [activeMainTab, setActiveMainTab] = useState<MainTab>("map");
  const [openDocIds, setOpenDocIds] = useState<string[]>([]);

  const openDoc = useCallback((docId: string) => {
    setOpenDocIds((prev) => prev.includes(docId) ? prev : [...prev, docId]);
    setActiveMainTab(docId);
  }, []);

  const closeDoc = useCallback((docId: string) => {
    setOpenDocIds((prev) => {
      const next = prev.filter((id) => id !== docId);
      return next;
    });
    setActiveMainTab((prev) => (prev === docId ? "map" : prev));
  }, []);

  const handleNodeClick = useCallback((id: string) => {
    // Select node for copilot context
    setSelectedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    if (copilotCollapsed) setCopilotCollapsed(false);

    // Open the relevant document for this node
    const docId = NODE_DOC_MAP[id];
    if (docId) openDoc(docId);
  }, [copilotCollapsed, openDoc]);

  const handleActivateNode = useCallback((id: string) => {
    setActivatedOptionalNodes((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    // Also select it and open its doc
    setSelectedNodes((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    const docId = NODE_DOC_MAP[id];
    if (docId) openDoc(docId);
  }, [openDoc]);

  const openDocs = openDocIds
    .map((id) => PROGRAM_DOCS.find((d) => d.id === id))
    .filter((d): d is ProgramDoc => !!d);

  const visibleNodes = NODES.filter((n) => !n.scenario || typeCEnabled || activatedOptionalNodes.has(n.id));
  const visibleEdges = EDGES.filter((e) => !e.scenario || typeCEnabled || activatedOptionalNodes.has(e.from) || activatedOptionalNodes.has(e.to));

  const activeDoc = openDocs.find((d) => d.id === activeMainTab) ?? null;

  return (
    <div className="h-screen w-screen bg-ws-bg text-ws-text flex flex-col overflow-hidden selection:bg-ws-teal/30">
      <TopNav
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
        typeCEnabled={typeCEnabled}
        onToggleTypeC={() => {
          setTypeCEnabled((v) => !v);
          if (!typeCEnabled) {
            // Activating type C via toggle — clear individual activations (toggle takes precedence)
            setActivatedOptionalNodes(new Set());
          }
        }}
        onNavigate={onNavigate}
      />

      {/* Only show sub-toolbar when on the map tab */}
      {activeMainTab === "map" && (
        <SubToolbar viewMode={viewMode} setViewMode={setViewMode} />
      )}

      <MapTitleBar />

      <div className="flex flex-1 overflow-hidden">
        <ActivityBar />
        <FileTree activeDocId={activeMainTab !== "map" ? activeMainTab : null} onOpenDoc={openDoc} />

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <TabBar
            activeTab={activeMainTab}
            openDocs={openDocs}
            onSelectTab={setActiveMainTab}
            onCloseDoc={closeDoc}
          />

          {/* Tab content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {activeMainTab === "map" ? (
              viewMode === "graph" ? (
                <GraphView
                  typeCEnabled={typeCEnabled}
                  activatedOptionalNodes={activatedOptionalNodes}
                  onActivateNode={handleActivateNode}
                  selectedNodes={selectedNodes}
                  onNodeClick={handleNodeClick}
                />
              ) : (
                <GanttView typeCEnabled={typeCEnabled} />
              )
            ) : activeDoc ? (
              <DocumentView
                doc={activeDoc}
                onPopOut={() => window.open(`/workspace?doc=${activeDoc.id}`, "_blank")}
              />
            ) : null}
          </div>
        </div>

        <CopilotPanel
          selectedNodes={selectedNodes}
          collapsed={copilotCollapsed}
          onToggle={() => setCopilotCollapsed((v) => !v)}
        />
      </div>

      <StatusBar
        viewMode={viewMode}
        typeCEnabled={typeCEnabled}
        activatedCount={activatedOptionalNodes.size}
        nodeCount={visibleNodes.length}
        edgeCount={visibleEdges.length}
      />
    </div>
  );
}
