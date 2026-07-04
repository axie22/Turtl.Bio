"use client";

import { useWorkspace, EVIDENCE_CARDS, WorkspacePhase } from "./useWorkspace";
import { EvidenceCard } from "./EvidenceCard";
import { ExplorerPanel } from "./ExplorerPanel";
import { CopilotPanel } from "./CopilotPanel";
import { StatusBar } from "./StatusBar";
import { PathMapLayout } from "./PathMap/PathMapLayout";

/* ─── Activity Bar (left icon strip) ─── */

const ACTIVITY_ICONS = [
  { icon: "folder_open", id: "explorer", label: "Explorer" },
  { icon: "search", id: "search", label: "Search" },
  { icon: "smart_toy", id: "ai", label: "Regulatory AI" },
];

interface ActivityBarProps {
  activeView: string;
  onNavigate?: (view: string) => void;
}

function ActivityBar({ activeView, onNavigate }: ActivityBarProps) {
  const isPathMap = activeView === "path-map";
  return (
    <aside className="bg-ws-lowest flex flex-col items-center py-4 w-16 shrink-0 z-40">
      <div className="flex flex-col items-center gap-1 w-full">
        {ACTIVITY_ICONS.map((item) => {
          const isActive = item.id === "explorer" && !isPathMap;
          return (
            <div
              key={item.id}
              title={item.label}
              onClick={() => onNavigate?.("explorer")}
              className={`w-full flex justify-center py-3 transition-all cursor-pointer ${
                isActive
                  ? "border-l-2 border-ws-teal bg-ws-mid text-ws-teal"
                  : "border-l-2 border-transparent text-ws-text/40 hover:text-ws-text/80 hover:bg-ws-mid"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
            </div>
          );
        })}
      </div>

      {/* Path Map icon — separated below the main icons */}
      <div className="w-full mt-4 border-t border-ws-highest/20 pt-3">
        <div
          title="Path Map"
          onClick={() => onNavigate?.(isPathMap ? "explorer" : "path-map")}
          className={`w-full flex justify-center py-3 transition-all cursor-pointer ${
            isPathMap
              ? "border-l-2 border-ws-teal bg-ws-mid text-ws-teal"
              : "border-l-2 border-transparent text-ws-text/40 hover:text-ws-text/80 hover:bg-ws-mid"
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={isPathMap ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            account_tree
          </span>
        </div>
      </div>

      <div className="mt-auto flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-sm bg-ws-highest flex items-center justify-center border border-ws-outline-dim/30">
          <span className="material-symbols-outlined text-ws-text/60 text-sm">
            account_circle
          </span>
        </div>
      </div>
    </aside>
  );
}

/* ─── Top Nav Bar ─── */

interface NavTab {
  id: string;
  label: string;
}

const IDLE_TABS: NavTab[] = [];
const ANALYZING_TABS: NavTab[] = [
  { id: "explorer", label: "Explorer" },
  { id: "evidence", label: "Evidence" },
  { id: "protocols", label: "Protocols" },
  { id: "archive", label: "Archive" },
];
const COMPLETE_TABS: NavTab[] = [
  { id: "explorer", label: "Explorer" },
  { id: "search", label: "Search" },
  { id: "regulatory-ai", label: "Regulatory AI" },
];

function getNavTabs(phase: WorkspacePhase): NavTab[] {
  if (phase === "idle") return IDLE_TABS;
  if (phase === "analyzing") return ANALYZING_TABS;
  return COMPLETE_TABS;
}

function TopNavBar({
  phase,
  activeTab,
  setActiveTab,
}: {
  phase: WorkspacePhase;
  activeTab: string;
  setActiveTab: (t: string) => void;
}) {
  const phaseTabs = getNavTabs(phase);

  return (
    <header className="bg-ws-mid text-ws-teal font-headline font-bold text-sm tracking-tight uppercase border-b border-ws-highest flex justify-between items-center px-4 w-full h-12 z-50 shrink-0">
      <div className="flex items-center gap-1">
        <span className="text-lg font-black text-ws-teal font-headline uppercase tracking-wider mr-4">
          Turtl.Bio
        </span>
        {/* Phase-specific secondary tabs */}
        {phaseTabs.length > 0 && (
          <nav className="hidden md:flex gap-4 items-center pl-2">
            {phaseTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`transition-colors duration-150 font-label text-[11px] ${
                  activeTab === tab.id
                    ? "text-ws-teal border-b-2 border-ws-teal pb-1"
                    : "text-ws-text/50 hover:text-ws-text/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        )}
      </div>
      <div className="flex items-center gap-4">
        {phase !== "idle" && (
          <div className="hidden lg:flex items-center bg-ws-lowest px-3 py-1.5 rounded-sm border border-ws-outline-dim/20">
            <span className="material-symbols-outlined text-ws-text/40 text-sm mr-2">
              search
            </span>
            <input
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-xs w-48 p-0 text-ws-text font-label"
              placeholder="Search knowledge base..."
              type="text"
            />
            <span className="text-[10px] text-ws-text/20 font-label ml-2">
              &#8984;K
            </span>
          </div>
        )}
        <button className="bg-ws-teal-dark text-ws-on-teal-dark px-3 py-1.5 rounded-sm font-label text-[10px] font-bold tracking-widest hover:shadow-[0_0_12px_0_rgba(0,175,145,0.4)] transition-all flex items-center gap-2">
          <span className="material-symbols-outlined !text-[14px]">
            folder_open
          </span>
          OPEN FOLDER
        </button>
        <div className="flex gap-2">
          <span className="material-symbols-outlined text-ws-text/60 cursor-pointer hover:text-ws-teal transition-colors">
            terminal
          </span>
          <span className="material-symbols-outlined text-ws-text/60 cursor-pointer hover:text-ws-teal transition-colors">
            settings
          </span>
          <span className="material-symbols-outlined text-ws-text/60 cursor-pointer hover:text-ws-teal transition-colors">
            help
          </span>
          <span className="material-symbols-outlined text-ws-text/60 cursor-pointer hover:text-ws-teal transition-colors">
            account_circle
          </span>
        </div>
      </div>
    </header>
  );
}

/* ─── Idle View (Pre-submit center content) ─── */

function IdleView() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
      <div className="w-24 h-24 mb-6 rounded-full bg-ws-mid flex items-center justify-center border border-ws-outline-dim/10">
        <span className="material-symbols-outlined text-4xl text-ws-outline-dim">
          find_in_page
        </span>
      </div>
      <h3 className="font-headline text-xl text-ws-text mb-2">
        Workspace Idle
      </h3>
      <p className="text-ws-text-dim max-w-sm text-sm leading-relaxed">
        Submit a query to surface applicable guidance and precedent within the
        PSMA-RLT framework.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-md">
        <div className="bg-ws-low p-4 text-left border border-ws-outline-dim/5 rounded-sm">
          <span className="font-label text-[9px] uppercase text-ws-teal block mb-1">
            Shortcut
          </span>
          <span className="text-xs text-ws-text-dim">
            Press{" "}
            <kbd className="bg-ws-highest px-1 rounded text-[10px]">&#8984;</kbd>{" "}
            +{" "}
            <kbd className="bg-ws-highest px-1 rounded text-[10px]">Enter</kbd>{" "}
            to submit
          </span>
        </div>
        <div className="bg-ws-low p-4 text-left border border-ws-outline-dim/5 rounded-sm">
          <span className="font-label text-[9px] uppercase text-ws-teal block mb-1">
            Mode
          </span>
          <span className="text-xs text-ws-text-dim">
            Regulatory Interpretation v2.4
          </span>
        </div>
      </div>
      {/* Ghost watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center">
        <span className="text-[20rem] font-bold select-none text-ws-text">
          TURTL
        </span>
      </div>
    </div>
  );
}

/* ─── Interpretation Zone (Active/Complete center content) ─── */

function InterpretationZone({
  phase,
  visibleCards,
}: {
  phase: "analyzing" | "complete";
  visibleCards: number;
}) {
  const isComplete = phase === "complete";
  const cards = isComplete ? EVIDENCE_CARDS : EVIDENCE_CARDS.slice(0, visibleCards);

  return (
    <main className="flex-1 overflow-y-auto ws-scrollbar bg-ws-bg p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="border-b border-ws-outline-dim/15 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-label text-[10px] uppercase tracking-widest text-ws-teal font-bold">
              Regulatory Intelligence
            </span>
            <span className="text-ws-text/20">/</span>
            <span className="font-label text-[10px] uppercase tracking-widest text-ws-text/40">
              Interpretation Zone
            </span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold text-ws-text tracking-tight">
            {isComplete
              ? "Regulatory Interpretation"
              : "Nonclinical Study Requirements Evaluation"}
          </h1>
          <p className="text-ws-text/60 text-sm mt-2 max-w-2xl leading-relaxed">
            {isComplete
              ? "Analysis of sex-specific toxicity requirements"
              : "System-wide analysis of ICH and FDA guidance regarding sex-specific toxicological studies for targeted oncology radioligands."}
          </p>
        </header>
        <div className="grid gap-6">
          {cards.map((card) => (
            <EvidenceCard
              key={card.id}
              card={card}
              variant={isComplete ? "complete" : "active"}
            />
          ))}
          {phase === "analyzing" && visibleCards < EVIDENCE_CARDS.length && (
            <div className="flex items-center gap-3 py-4 text-ws-text/40">
              <span className="w-2 h-2 rounded-full bg-ws-teal animate-pulse" />
              <span className="font-label text-[11px] uppercase tracking-widest">
                Analyzing regulatory sources...
              </span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

/* ─── Main Layout ─── */

interface WorkspaceLayoutProps {
  activeView?: string;
  onNavigate?: (view: string) => void;
}

export function WorkspaceLayout({ activeView = "explorer", onNavigate }: WorkspaceLayoutProps) {
  const ws = useWorkspace();
  const isPathMap = activeView === "path-map";

  return (
    <div className="h-screen w-screen bg-ws-bg text-ws-text font-body flex flex-col overflow-hidden selection:bg-ws-teal/30">
      <TopNavBar
        phase={ws.phase}
        activeTab={ws.activeNavTab}
        setActiveTab={ws.setActiveNavTab}
      />
      <div className="flex flex-1 overflow-hidden relative">
        <ActivityBar activeView={activeView} onNavigate={onNavigate} />

        {isPathMap ? (
          /* ── Path Map embedded in the workspace shell ── */
          <PathMapLayout embedded={true} />
        ) : (
          /* ── Regular explorer content ── */
          <>
            <div className="w-64 shrink-0 border-r border-ws-highest/30">
              <ExplorerPanel />
            </div>
            <section className="flex-1 bg-ws-bg flex flex-col relative overflow-hidden">
              {ws.phase === "idle" ? (
                <>
                  <div className="bg-ws-low px-4 py-2 border-b border-ws-outline-dim/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-ws-teal">
                        data_exploration
                      </span>
                      <h1 className="font-label text-[10px] uppercase tracking-[0.2em] font-bold text-ws-text">
                        Interpretation Zone
                      </h1>
                    </div>
                  </div>
                  <IdleView />
                </>
              ) : (
                <InterpretationZone
                  phase={ws.phase as "analyzing" | "complete"}
                  visibleCards={ws.visibleCards}
                />
              )}
            </section>
            <CopilotPanel
              phase={ws.phase}
              indication={ws.indication}
              setIndication={ws.setIndication}
              modality={ws.modality}
              setModality={ws.setModality}
              query={ws.query}
              setQuery={ws.setQuery}
              onSubmit={ws.submitQuery}
            />
          </>
        )}
      </div>
      <StatusBar phase={ws.phase} />
    </div>
  );
}
