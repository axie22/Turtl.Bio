"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { NODES, PROGRAM_DOCS, NODE_CONTEXT_DOCS, NODE_DOC_MAP, COPILOT_RESPONSE } from "./data";

const NODE_QUESTIONS: Record<string, string> = {
  "END-01": "Does our Yucatan pig colonization data satisfy FDA's persistence expectation for LBP INDs per the 2022 draft guidance?",
  "END-02": "What GLP tox species is most defensible for END-101 given our Yucatan pig non-GLP data? What should we bring to INTERACT?",
  "END-04": "What GLP tox design elements (dose levels, duration, endpoints) should we align with FDA on at the INTERACT meeting?",
  "END-GR": "What are the species-justification arguments we should prepare for the INTERACT meeting given FDA's 2022 LBP guidance?",
  "END-05": "Does the 2022 FDA LBP draft guidance specify what environmental data is expected in an IND for a chassis-native organism?",
  "END-06": "What does the FDA 2022 LBP draft guidance say about GLP reporting requirements and what format is expected in the IND?",
  "END-08": "What environmental fate data do we need for the EA under FDA's 2015 guidance? Is our off-switch data sufficient?",
  "END-07": "Does our current package meet the minimum IND content requirements under 21 CFR 312.23 for a Phase 1 LBP trial?",
  "END-CP": "What does a Type C meeting add over a Type B pre-IND meeting for END-101's species justification gap?",
  "END-0C": "What are the IND content requirements specific to LBPs and how does END-101's current package map against them?",
  "END-IP": "What is the minimum efficacy bar we should put in the TPP to remain credible to FDA while setting achievable Phase 2 goals?",
  "END-03": "How does our TPP indication statement compare to what FDA has accepted for other rare metabolic disease LBPs?",
  "END-BP": "What are the key TPP claims we need to validate in Phase 1 to support a BLA pathway for PKU?",
  "FUND-01": "Does our SBIR Phase 1 data package support a compelling Phase 2 application for IND-enabling studies?",
  "FUND-02": "What milestones should the SBIR Phase 2 application target to align with an IND filing timeline?",
  "FUND-03": "What Series A biotech investors are currently active in LBP / live biotherapeutic programs?",
  "FUND-04": "At what preclinical milestone does a chassis-native LBP program typically close a seed round?",
  "FUND-05": "What Series A metrics — colonization data, species justification, EA — would de-risk this program for a biotech investor?",
};

const DEFAULT_QUESTION = "Does this tox study apply here?";

type CopilotStep =
  | "idle"
  | "decomposing"
  | "retrieving"
  | "translating"
  | "generating"
  | "done";

type ResponseTab = "sources" | "analysis" | "recommendation";
type VerificationStatus = "pending" | "accepted" | "modified" | "rejected";

const VERIFICATION_LOG_KEY = "turtl_copilot_verifications";

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
  const [query, setQuery] = useState(DEFAULT_QUESTION);
  const [step, setStep] = useState<CopilotStep>("idle");
  const [activeTab, setActiveTab] = useState<ResponseTab>("analysis");
  const [verification, setVerification] = useState<VerificationStatus>("pending");
  const [modifyNote, setModifyNote] = useState("");
  const [showModifyInput, setShowModifyInput] = useState(false);
  const stepRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const selectedNodeObjects = NODES.filter((n) => selectedNodes.has(n.id));

  // Prefill query with node-specific question when a node is selected
  useEffect(() => {
    if (selectedNodeObjects.length === 0) return;
    const lastNode = selectedNodeObjects[selectedNodeObjects.length - 1];
    const q = NODE_QUESTIONS[lastNode.id];
    if (q && step === "idle") setQuery(q);
  }, [selectedNodes]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAsk = useCallback(() => {
    if (step !== "idle" && step !== "done") return;
    setStep("decomposing");
    setVerification("pending");
    setShowModifyInput(false);
    setModifyNote("");

    STEP_ORDER.forEach((s, i) => {
      stepRef.current = setTimeout(() => {
        setStep(s);
      }, i * 700);
    });
  }, [step]);

  const handleVerify = (status: VerificationStatus, note?: string) => {
    setVerification(status);
    if (status !== "modified") setShowModifyInput(false);
    // Log to sessionStorage so corrections persist within the session
    try {
      const existing = JSON.parse(sessionStorage.getItem(VERIFICATION_LOG_KEY) || "[]");
      existing.push({ status, note: note ?? null, query, timestamp: Date.now() });
      sessionStorage.setItem(VERIFICATION_LOG_KEY, JSON.stringify(existing));
    } catch { /* ignore */ }
  };

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
        ) : (() => {
          // Collect union of relevant docs across all selected nodes
          const docIds = new Set(
            selectedNodeObjects.flatMap(
              (n) => NODE_CONTEXT_DOCS[n.id] ?? (NODE_DOC_MAP[n.id] ? [NODE_DOC_MAP[n.id]] : [])
            )
          );
          const contextDocs = PROGRAM_DOCS.filter((d) => docIds.has(d.id));
          return (
            <div className="space-y-2">
              {/* Node name chips */}
              <div className="flex flex-wrap gap-1">
                {selectedNodeObjects.map((n) => (
                  <span
                    key={n.id}
                    className="inline-flex items-center gap-1 font-label text-[9px] px-1.5 py-0.5 bg-ws-teal/10 border border-ws-teal/20 text-ws-teal rounded-sm"
                  >
                    {n.label}
                  </span>
                ))}
              </div>
              {/* Relevant docs list */}
              <div className="space-y-0.5">
                {contextDocs.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-2 py-1 rounded-sm hover:bg-ws-bg transition-colors px-1 -mx-1 cursor-default">
                    <span
                      className="material-symbols-outlined text-[18px] shrink-0"
                      style={{ color: doc.color }}
                    >
                      {doc.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="font-label text-[9.5px] text-ws-text/70 truncate leading-tight">
                        {doc.filename}
                      </div>
                      <div className="font-label text-[8px] text-ws-text/30 truncate">
                        {doc.tags[0]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
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

          {/* Step indicator */}
          <div className="px-3 py-1.5 border-b border-ws-highest/10 flex items-center gap-2 shrink-0">
            {(["sources", "analysis", "recommendation"] as ResponseTab[]).map((t, i) => (
              <div key={t} className="flex items-center gap-1.5">
                {i > 0 && <div className="w-3 h-px bg-ws-highest/30" />}
                <span className={`font-label text-[8px] ${activeTab === t ? "text-ws-teal" : "text-ws-text/20"}`}>
                  Step {i + 4}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 ml-auto">
              <div className="w-3 h-px bg-ws-highest/30" />
              <span className={`font-label text-[8px] ${verification !== "pending" ? "text-ws-teal" : "text-ws-text/20"}`}>
                Step 6
              </span>
            </div>
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

      {/* Step 6 — Human Verification */}
      {hasResponse && (
        <div className="shrink-0 border-t border-ws-highest/20 p-3 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label text-[8.5px] uppercase tracking-widest text-ws-text/30">
              Step 6 — Human Verification
            </span>
            {verification !== "pending" && (
              <span className={`font-label text-[8px] px-1.5 py-0.5 rounded-sm ${
                verification === "accepted" ? "text-ws-teal bg-ws-teal/10" :
                verification === "rejected" ? "text-red-400 bg-red-400/10" :
                "text-amber-400 bg-amber-400/10"
              }`}>
                {verification === "accepted" ? "✓ Accepted" : verification === "rejected" ? "✗ Rejected" : "~ Modified"}
              </span>
            )}
          </div>

          {verification === "pending" && (
            <div className="flex gap-2">
              <button
                onClick={() => handleVerify("accepted")}
                className="flex-1 py-1.5 rounded-sm border border-ws-teal/30 text-ws-teal font-label text-[9px] font-bold hover:bg-ws-teal/10 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => { setShowModifyInput(true); }}
                className="flex-1 py-1.5 rounded-sm border border-amber-400/30 text-amber-400 font-label text-[9px] font-bold hover:bg-amber-400/10 transition-colors"
              >
                Modify
              </button>
              <button
                onClick={() => handleVerify("rejected")}
                className="flex-1 py-1.5 rounded-sm border border-red-400/30 text-red-400 font-label text-[9px] font-bold hover:bg-red-400/10 transition-colors"
              >
                Reject
              </button>
            </div>
          )}

          {showModifyInput && verification === "pending" && (
            <div className="space-y-1.5">
              <textarea
                className="w-full bg-ws-bg border border-ws-highest/30 rounded-sm px-2 py-1.5 font-label text-[10px] text-ws-text placeholder:text-ws-text/20 focus:outline-none focus:ring-1 focus:ring-amber-400/40 resize-none"
                rows={2}
                placeholder="Describe your correction (logged as institutional memory)…"
                value={modifyNote}
                onChange={(e) => setModifyNote(e.target.value)}
              />
              <button
                onClick={() => handleVerify("modified", modifyNote)}
                disabled={!modifyNote.trim()}
                className="w-full py-1.5 rounded-sm bg-amber-400/15 text-amber-400 font-label text-[9px] font-bold disabled:opacity-40 hover:bg-amber-400/25 transition-colors"
              >
                Log correction
              </button>
            </div>
          )}

          {verification !== "pending" && (
            <p className="font-label text-[9px] text-ws-text/25 leading-relaxed">
              {verification === "accepted" && "Logged. Accepted output becomes institutional memory for this program."}
              {verification === "rejected" && "Logged. Rejection flagged — next query will not use this output as prior context."}
              {verification === "modified" && `Logged with note: "${modifyNote}"`}
            </p>
          )}
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
