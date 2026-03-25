"use client";

import {
  WorkspacePhase,
  PRECEDENT_CASES,
  PrecedentCase,
} from "./useWorkspace";

interface CopilotPanelProps {
  phase: WorkspacePhase;
  indication: string;
  setIndication: (v: string) => void;
  modality: string;
  setModality: (v: string) => void;
  query: string;
  setQuery: (v: string) => void;
  onSubmit: () => void;
}

function PrecedentCard({ c }: { c: PrecedentCase }) {
  return (
    <div className="bg-ws-mid px-3 py-3 rounded-sm border border-ws-outline-dim/10 cursor-default">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-ws-text tracking-tight">
          {c.name}
        </span>
        <span className="font-label text-[8px] px-1.5 py-0.5 bg-ws-teal/10 text-ws-teal border border-ws-teal/20 rounded uppercase">
          {c.statusLabel}
        </span>
      </div>
      <div className="text-[10px] text-ws-text/60 mb-1">
        {c.company} &middot; {c.indication}
      </div>
      <div className="text-[10px] text-ws-teal font-medium mb-2">
        {c.summary}
      </div>
      <div className="pt-2 border-t border-ws-outline-dim/20">
        <p className="text-[10px] text-ws-text/80 leading-relaxed">
          <span className="font-bold text-ws-text">FDA Response:</span>{" "}
          {c.fdaResponse}
        </p>
      </div>
    </div>
  );
}

export function CopilotPanel({
  phase,
  indication,
  setIndication,
  modality,
  setModality,
  query,
  setQuery,
  onSubmit,
}: CopilotPanelProps) {
  const isIdle = phase === "idle";

  return (
    <aside className="w-80 bg-ws-low border-l border-ws-highest/30 flex flex-col shrink-0">
      <div className="h-9 px-4 flex items-center gap-2 border-b border-ws-highest/20">
        <span
          className="material-symbols-outlined text-ws-teal text-sm"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          auto_awesome
        </span>
        <span className="font-label text-[10px] font-bold tracking-widest text-ws-text uppercase">
          AI Copilot
        </span>
      </div>
      <div className="flex-1 overflow-y-auto ws-scrollbar p-4 space-y-6">
        {/* Query Form */}
        <div className="space-y-3">
          <div>
            <label className="font-label text-[9px] uppercase tracking-widest text-ws-text/40 mb-1.5 block">
              Drug Indication
            </label>
            {isIdle ? (
              <input
                className="w-full bg-ws-lowest border border-ws-outline-dim/20 px-3 py-2 text-xs text-ws-text rounded-sm focus:ring-1 focus:ring-ws-teal focus:border-ws-teal focus:outline-none transition-all"
                value={indication}
                onChange={(e) => setIndication(e.target.value)}
              />
            ) : (
              <div className="bg-ws-lowest border border-ws-outline-dim/20 px-3 py-2 text-xs text-ws-text/80 rounded-sm">
                {indication}
              </div>
            )}
          </div>
          <div>
            <label className="font-label text-[9px] uppercase tracking-widest text-ws-text/40 mb-1.5 block">
              Modality
            </label>
            {isIdle ? (
              <input
                className="w-full bg-ws-lowest border border-ws-outline-dim/20 px-3 py-2 text-xs text-ws-text rounded-sm focus:ring-1 focus:ring-ws-teal focus:border-ws-teal focus:outline-none transition-all"
                value={modality}
                onChange={(e) => setModality(e.target.value)}
              />
            ) : (
              <div className="bg-ws-lowest border border-ws-outline-dim/20 px-3 py-2 text-xs text-ws-text/80 rounded-sm">
                {modality}
              </div>
            )}
          </div>
          <div>
            <label className="font-label text-[9px] uppercase tracking-widest text-ws-text/40 mb-1.5 block">
              Query
            </label>
            {isIdle ? (
              <textarea
                className="w-full bg-ws-lowest border border-ws-outline-dim/20 px-3 py-2 text-xs text-ws-text placeholder:text-ws-text/20 rounded-sm min-h-[80px] focus:ring-1 focus:ring-ws-teal focus:border-ws-teal focus:outline-none transition-all resize-none"
                placeholder="Enter clinical rationale query..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            ) : (
              <div className="bg-ws-lowest border border-ws-outline-dim/20 px-3 py-2 text-xs text-ws-text/80 rounded-sm">
                {query}
              </div>
            )}
          </div>
          <button
            onClick={onSubmit}
            disabled={phase === "analyzing"}
            className="w-full bg-ws-teal-dark text-ws-on-teal-dark py-2.5 rounded-sm font-label text-[10px] font-bold tracking-widest uppercase hover:brightness-110 transition-all shadow-lg shadow-ws-teal-dark/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            SUBMIT QUERY
          </button>
        </div>

        {/* Info box (idle) */}
        {isIdle && (
          <div className="bg-ws-teal/5 border border-ws-teal/20 p-3 rounded-sm">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-ws-teal text-base">
                info
              </span>
              <p className="text-[11px] text-ws-teal leading-snug">
                Copilot will cross-reference ICH S6(R1) and S9 guidelines
                against your current file selection.
              </p>
            </div>
          </div>
        )}

        {/* Precedent Cases (analyzing/complete) */}
        {phase !== "idle" && (
          <div className="space-y-4">
            <h4 className="font-label text-[10px] uppercase tracking-widest text-ws-text-dim font-bold border-b border-ws-outline-dim/10 pb-2">
              Precedent Cases
            </h4>
            {PRECEDENT_CASES.map((c) => (
              <PrecedentCard key={c.id} c={c} />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
