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
// Main area tab: "map" is the pinned graph/gantt tab; anything else is a doc ID
type MainTab = "map" | string;

// ─── Scenario Dropdown ───────────────────────────────────────────────────────

const SCENARIOS = [
  {
    id: "typeC" as const,
    label: "+ Type C Meeting",
    description: "CMC focus · optional FDA meeting track",
    detail: "Delays Type B Prep by ~1 quarter. Use when FDA requests additional CMC alignment before pre-IND.",
  },
];

interface ScenarioDropdownProps {
  typeCEnabled: boolean;
  onToggle: () => void;
}

function ScenarioDropdown({ typeCEnabled, onToggle }: ScenarioDropdownProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-2.5 py-1.5 bg-ws-lowest border rounded-sm transition-colors ${
          open ? "border-ws-teal/40" : "border-ws-highest/30 hover:border-ws-highest/50"
        }`}
      >
        <span className="material-symbols-outlined text-[13px] text-ws-text/35">tune</span>
        <span className="font-label text-[10px] text-ws-text/60">Scenarios</span>
        {typeCEnabled && (
          <span className="font-label text-[8px] px-1.5 py-0.5 rounded-full bg-amber-400/15 text-amber-500 border border-amber-400/25">
            1 active
          </span>
        )}
        <span
          className={`material-symbols-outlined text-[12px] text-ws-text/30 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          expand_more
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-1.5 z-50 bg-ws-lowest border border-ws-highest/30 rounded-sm shadow-xl"
            style={{ minWidth: 256 }}
          >
            <div className="px-3 pt-2.5 pb-1">
              <span className="font-label text-[8px] uppercase tracking-widest text-ws-text/30">
                Available Scenarios
              </span>
            </div>
            {SCENARIOS.map((s) => (
              <div
                key={s.id}
                className="flex items-start gap-3 px-3 py-2.5 mx-1 mb-1 rounded-sm hover:bg-ws-bg cursor-pointer transition-colors"
                onClick={() => onToggle()}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-label text-[10.5px] font-semibold text-ws-text/80 mb-0.5">
                    {s.label}
                  </div>
                  <div className="font-label text-[8.5px] text-ws-text/40 leading-relaxed">
                    {s.description}
                  </div>
                  {typeCEnabled && (
                    <div className="font-label text-[8px] text-amber-500/70 mt-1 leading-relaxed">
                      {s.detail}
                    </div>
                  )}
                </div>
                <div
                  onClick={(e) => { e.stopPropagation(); onToggle(); }}
                  className={`relative w-8 h-4 rounded-full transition-colors duration-200 shrink-0 mt-0.5 ${
                    typeCEnabled ? "bg-ws-teal-dark" : "bg-ws-highest"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform duration-200 ${
                      typeCEnabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
            ))}
            <div className="border-t border-ws-highest/15 px-3 py-2">
              <span className="font-label text-[8px] text-ws-text/20">
                More scenarios coming soon
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Top Nav ─────────────────────────────────────────────────────────────────

interface TopNavProps {
  typeCEnabled: boolean;
  onToggleTypeC: () => void;
}

function TopNav({ typeCEnabled, onToggleTypeC }: TopNavProps) {
  return (
    <header className="h-11 bg-ws-mid border-b border-ws-highest/40 flex items-center justify-between px-4 shrink-0 z-50">
      <span className="text-base font-black text-ws-teal font-headline uppercase tracking-wider">Turtl.Bio</span>
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
        <ScenarioDropdown typeCEnabled={typeCEnabled} onToggle={onToggleTypeC} />
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

// ─── Map view bar (inside tab content — toggle + legend) ─────────────────────

interface MapViewBarProps {
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
}

function MapViewBar({ viewMode, setViewMode }: MapViewBarProps) {
  return (
    <div className="h-9 bg-ws-low border-b border-ws-highest/20 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center bg-ws-lowest border border-ws-highest/30 rounded-sm">
        <button
          onClick={() => setViewMode("gantt")}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-label text-[10px] rounded-l-sm transition-colors ${viewMode === "gantt" ? "bg-ws-teal/15 text-ws-teal" : "text-ws-text/40 hover:text-ws-text/70"}`}
        >
          <span className="material-symbols-outlined !text-[12px]">view_timeline</span>
          Gantt
        </button>
        <div className="w-px h-4 bg-ws-highest/40" />
        <button
          onClick={() => setViewMode("graph")}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-label text-[10px] rounded-r-sm transition-colors ${viewMode === "graph" ? "bg-ws-teal/15 text-ws-teal" : "text-ws-text/40 hover:text-ws-text/70"}`}
        >
          <span className="material-symbols-outlined !text-[12px]">schema</span>
          Graph
        </button>
      </div>
      <div className="flex items-center gap-3">
        {[
          { color: "#60a5fa", label: "FDA" },
          { color: "#54dcbc", label: "study" },
          { color: "#22c55e", label: "Funding" },
          { color: "#a78bfa", label: "Optional" },
          { color: "#94a3b8", label: "dependency" },
        ].map((item) => (
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

type ActivityIcon = "files" | "map" | "search" | "history";

interface ActivityBarProps {
  active: ActivityIcon;
  onSelect: (id: ActivityIcon) => void;
}

function ActivityBar({ active, onSelect }: ActivityBarProps) {
  const items: { icon: string; id: ActivityIcon; label: string }[] = [
    { icon: "description", id: "files", label: "Files" },
    { icon: "account_tree", id: "map", label: "Path Map" },
    { icon: "manage_search", id: "search", label: "Search" },
    { icon: "history", id: "history", label: "History" },
  ];
  return (
    <aside className="w-10 bg-ws-lowest border-r border-ws-highest/20 flex flex-col items-center py-3 shrink-0">
      <div className="flex flex-col items-center gap-1 w-full">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              title={item.label}
              onClick={() => onSelect(item.id)}
              className={`w-full flex justify-center py-2.5 transition-colors ${
                isActive
                  ? "text-ws-teal border-l-2 border-ws-teal bg-ws-teal/5"
                  : "text-ws-text/25 hover:text-ws-text/60 border-l-2 border-transparent"
              }`}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

// ─── Breadcrumb ──────────────────────────────────────────────────────────────

function MapTitleBar({ right }: { right?: React.ReactNode }) {
  return (
    <div className="h-8 bg-ws-bg border-b border-ws-highest/10 flex items-center px-4 gap-3 shrink-0">
      <span className="font-label text-[9px] uppercase tracking-widest text-ws-text/25">Generated Map</span>
      <span className="text-ws-text/15">/</span>
      <span className="font-label text-[10.5px] font-semibold text-ws-text/70">{PROGRAM_NAME}</span>
      <span className="font-label text-[9px] px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "rgba(84,220,188,0.08)", color: "rgba(84,220,188,0.5)" }}>
        auto-plotted from TPP + submission docs
      </span>
      {right && <div className="ml-auto">{right}</div>}
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
  embedded?: boolean;
}

export function PathMapLayout({ onNavigate, embedded = false }: PathMapLayoutProps) {
  const [activeActivityIcon, setActiveActivityIcon] = useState<ActivityIcon>("map");
  const [viewMode, setViewMode] = useState<ViewMode>("gantt");
  const [typeCEnabled, setTypeCEnabled] = useState(false);
  const [activatedOptionalNodes, setActivatedOptionalNodes] = useState<Set<string>>(new Set());
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
  const [copilotCollapsed, setCopilotCollapsed] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState<MainTab>("map");
  const [openDocIds, setOpenDocIds] = useState<string[]>([]);

  const handleToggleTypeC = useCallback(() => {
    setTypeCEnabled((v) => {
      if (!v) setActivatedOptionalNodes(new Set());
      return !v;
    });
  }, []);

  const openDoc = useCallback((docId: string) => {
    setOpenDocIds((prev) => prev.includes(docId) ? prev : [...prev, docId]);
    setActiveMainTab(docId);
  }, []);

  const closeDoc = useCallback((docId: string) => {
    setOpenDocIds((prev) => prev.filter((id) => id !== docId));
    setActiveMainTab((prev) => (prev === docId ? "map" : prev));
  }, []);

  const handleNodeClick = useCallback((id: string) => {
    setSelectedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    if (copilotCollapsed) setCopilotCollapsed(false);
    const docId = NODE_DOC_MAP[id];
    if (docId) openDoc(docId);
  }, [copilotCollapsed, openDoc]);

  const handleActivateNode = useCallback((id: string) => {
    setActivatedOptionalNodes((prev) => { const next = new Set(prev); next.add(id); return next; });
    setSelectedNodes((prev) => { const next = new Set(prev); next.add(id); return next; });
    const docId = NODE_DOC_MAP[id];
    if (docId) openDoc(docId);
  }, [openDoc]);

  const openDocs = openDocIds
    .map((id) => PROGRAM_DOCS.find((d) => d.id === id))
    .filter((d): d is ProgramDoc => !!d);

  const visibleNodes = NODES.filter((n) => !n.scenario || typeCEnabled || activatedOptionalNodes.has(n.id));
  const visibleEdges = EDGES.filter((e) => !e.scenario || typeCEnabled || activatedOptionalNodes.has(e.from) || activatedOptionalNodes.has(e.to));

  const activeDoc = openDocs.find((d) => d.id === activeMainTab) ?? null;

  // ── Shared inner content ──────────────────────────────────────────────────
  const innerContent = (
    <>
      <MapTitleBar
        right={embedded
          ? <ScenarioDropdown typeCEnabled={typeCEnabled} onToggle={handleToggleTypeC} />
          : undefined}
      />
      <div className="flex flex-1 overflow-hidden">
        {!embedded && (
          <ActivityBar
            active={activeActivityIcon}
            onSelect={(id) => {
              setActiveActivityIcon(id);
              // The "map" icon acts as the graph button — focus the graph tab
              if (id === "map") setActiveMainTab("map");
            }}
          />
        )}
        <FileTree activeDocId={activeMainTab !== "map" ? activeMainTab : null} onOpenDoc={openDoc} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TabBar
            activeTab={activeMainTab}
            openDocs={openDocs}
            onSelectTab={setActiveMainTab}
            onCloseDoc={closeDoc}
          />
          <div className="flex-1 overflow-hidden flex flex-col">
            {activeMainTab === "map" ? (
              <>
                <MapViewBar viewMode={viewMode} setViewMode={setViewMode} />
                {viewMode === "graph" ? (
                  <GraphView
                    typeCEnabled={typeCEnabled}
                    activatedOptionalNodes={activatedOptionalNodes}
                    onActivateNode={handleActivateNode}
                    selectedNodes={selectedNodes}
                    onNodeClick={handleNodeClick}
                  />
                ) : (
                  <GanttView typeCEnabled={typeCEnabled} />
                )}
              </>
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
    </>
  );

  // ── Embedded mode: no outer shell, fills whatever container it's in ────────
  if (embedded) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        {innerContent}
      </div>
    );
  }

  // ── Standalone mode: full-screen with TopNav + ActivityBar + StatusBar ─────
  return (
    <div className="h-screen w-screen bg-ws-bg text-ws-text flex flex-col overflow-hidden selection:bg-ws-teal/30">
      <TopNav typeCEnabled={typeCEnabled} onToggleTypeC={handleToggleTypeC} />
      {innerContent}
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
