"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { NODES, COPILOT_RESPONSE } from "./data";

type CopilotStep =
  | "idle"
  | "decomposing"
  | "retrieving"
  | "translating"
  | "generating"
  | "done";

type ResponseTab = "sources" | "analysis" | "recommendation";

const STEP_LABELS: Record<CopilotStep, string> = {
  idle: "",
  decomposing: "Decomposing mechanism...",
  retrieving: "Retrieving targeted evidence...",
  translating: "Applying regulatory framework...",
  generating: "Generating output...",
  done: "",
};

const STEP_ORDER: CopilotStep[] = [
  "decomposing",
  "retrieving",
  "translating",
  "generating",
  "done",
];

interface CopilotPanelProps {
  selectedNodes: Set<string>;
  collapsed: boolean;
  onToggle: () => void;
}

export function CopilotPanel({
  selectedNodes,
  collapsed,
  onToggle,
}: CopilotPanelProps) {
  const [query, setQuery] = useState("Does this tox study apply here?");
  const [step, setStep] = useState<CopilotStep>("idle");
  const [activeTab, setActiveTab] = useState<ResponseTab>("analysis");
  const stepRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const selectedNodeObjects = NODES.filter((n) => selectedNodes.has(n.id));

  const handleAsk = useCallback(() => {
    if (step !== "idle" && step !== "done") return;
    setStep("decomposing");

    STEP_ORDER.forEach((s, i) => {
      stepRef.current = setTimeout(() => {
        setStep(s);
      }, i * 700);
    });
  }, [step]);

  useEffect(() => {
    return () => clearTimeout(stepRef.current);
  }, []);

  const isLoading = step !== "idle" && step !== "done";
  const hasResponse = step === "done";

  if (collapsed) {
    return (
      <div className="w-10 bg-ws-lowest border-l border-ws-highest/30 flex flex-col items-center py-3 gap-4 shrink-0">
        <button
          onClick={onToggle}
          className="text-ws-text/40 hover:text-ws-teal transition-colors"
          title="Expand AI Co-Pilot"
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>
        <span
          className="font-label text-[9px] text-ws-text/20 uppercase tracking-widest"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          AI Co-Pilot
        </span>
      </div>
    );
  }

  return (
    <aside className="w-[296px] shrink-0 bg-ws-lowest border-l border-ws-highest/30 flex flex-col">
      {/* Header */}
      <div className="h-9 px-3 flex items-center justify-between border-b border-ws-highest/20 shrink-0">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-ws-teal text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            auto_awesome
          </span>
          <span className="font-label text-[10px] font-bold tracking-widest text-ws-text uppercase">
            AI Co-Pilot
          </span>
        </div>
        <button
          onClick={onToggle}
          className="text-ws-text/30 hover:text-ws-text/70 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>

      {/* Context nodes */}
      <div className="px-3 pt-3 pb-2 border-b border-ws-highest/15 shrink-0">
        <div className="font-label text-[9px] uppercase tracking-widest text-ws-text/30 mb-2">
          Context Nodes
          {selectedNodeObjects.length > 0 && (
            <span className="ml-2 text-ws-teal">{selectedNodeObjects.length} loaded</span>
          )}
        </div>
        {selectedNodeObjects.length === 0 ? (
          <p className="font-label text-[10px] text-ws-text/25 italic">
            Click nodes on the map to load as context
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selectedNodeObjects.map((n) => (
              <span
                key={n.id}
                className="inline-flex items-center gap-1 font-label text-[9px] px-1.5 py-0.5 bg-ws-teal/10 border border-ws-teal/20 text-ws-teal rounded-sm"
              >
                {n.id} · {n.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Query input */}
      <div className="px-3 py-3 border-b border-ws-highest/15 shrink-0">
        <label className="font-label text-[9px] uppercase tracking-widest text-ws-text/30 mb-1.5 block">
          Ask
        </label>
        <textarea
          className="w-full bg-ws-bg border border-ws-outline-dim/20 px-2.5 py-2 text-[11px] text-ws-text placeholder:text-ws-text/20 rounded-sm min-h-[56px] focus:ring-1 focus:ring-ws-teal focus:border-ws-teal focus:outline-none transition-all resize-none font-label"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
        />
        <button
          onClick={handleAsk}
          disabled={isLoading || selectedNodeObjects.length === 0}
          className="mt-2 w-full bg-ws-teal-dark text-ws-on-teal-dark py-2 rounded-sm font-label text-[9px] font-bold tracking-widest uppercase hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
        >
          {isLoading ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              Processing...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined !text-[12px]">add</span>
              Ask
            </>
          )}
        </button>
      </div>

      {/* Loading steps */}
      {isLoading && (
        <div className="px-3 py-3 border-b border-ws-highest/15 shrink-0">
          <div className="space-y-2">
            {STEP_ORDER.slice(0, -1).map((s, i) => {
              const currentIdx = STEP_ORDER.indexOf(step);
              const thisIdx = i;
              const isDone = thisIdx < currentIdx;
              const isActive = thisIdx === currentIdx;
              return (
                <div key={s} className="flex items-center gap-2">
                  {isDone ? (
                    <span className="material-symbols-outlined text-ws-teal text-[12px]">
                      check_circle
                    </span>
                  ) : isActive ? (
                    <span className="w-3 h-3 rounded-full border-2 border-ws-teal border-t-transparent animate-spin" />
                  ) : (
                    <span className="w-3 h-3 rounded-full border border-ws-highest" />
                  )}
                  <span
                    className={`font-label text-[10px] ${
                      isDone
                        ? "text-ws-text/40 line-through"
                        : isActive
                        ? "text-ws-teal"
                        : "text-ws-text/20"
                    }`}
                  >
                    {STEP_LABELS[s]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Response */}
      {hasResponse && (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-ws-highest/20 shrink-0">
            {(["sources", "analysis", "recommendation"] as ResponseTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 font-label text-[9px] uppercase tracking-widest py-2 transition-colors ${
                  activeTab === tab
                    ? "text-ws-teal border-b-2 border-ws-teal"
                    : "text-ws-text/30 hover:text-ws-text/60"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto ws-scrollbar p-3">
            {activeTab === "analysis" && (
              <div className="space-y-3">
                {COPILOT_RESPONSE.analysis.split("\n\n").map((para, i) => (
                  <p key={i} className="font-label text-[10.5px] text-ws-text/75 leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            )}

            {activeTab === "sources" && (
              <div className="space-y-2">
                {COPILOT_RESPONSE.sources.map((src) => (
                  <div
                    key={src.id}
                    className="bg-ws-bg border border-ws-highest/30 rounded-sm p-2.5"
                  >
                    <div className="font-label text-[10px] text-ws-text/80 font-semibold leading-snug mb-1">
                      {src.title}
                    </div>
                    <div className="font-label text-[9px] text-ws-teal mb-1">{src.cite}</div>
                    <div className="font-label text-[9px] text-ws-text/40">{src.relevance}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "recommendation" && (
              <div className="space-y-3">
                {COPILOT_RESPONSE.recommendation.split("\n\n").map((block, i) => {
                  const [heading, ...rest] = block.split(": ");
                  if (block.startsWith("**")) {
                    return (
                      <div key={i} className="bg-ws-bg border border-ws-highest/30 rounded-sm p-2.5">
                        <div className="font-label text-[9px] text-ws-teal uppercase tracking-widest mb-1">
                          {heading.replace(/\*\*/g, "")}
                        </div>
                        <div className="font-label text-[10px] text-ws-text/70 leading-relaxed">
                          {rest.join(": ")}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <p key={i} className="font-label text-[10px] text-ws-text/60 leading-relaxed">
                      {block}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Idle hint */}
      {step === "idle" && (
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <span className="material-symbols-outlined text-ws-text/10 text-3xl">
              psychology
            </span>
            <p className="font-label text-[10px] text-ws-text/20 mt-2 leading-relaxed">
              Select nodes on the map,
              <br />
              then ask a question.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
