"use client";

import { EvidenceCardData } from "./useWorkspace";

interface EvidenceCardProps {
  card: EvidenceCardData;
  variant?: "active" | "complete";
}

export function EvidenceCard({ card, variant = "active" }: EvidenceCardProps) {
  if (variant === "complete") {
    return (
      <div className="bg-ws-low border-t-2 border-ws-teal-dark p-5 rounded-sm relative group">
        <div className="flex justify-between items-start mb-4">
          <span className="font-label text-[10px] uppercase tracking-widest text-ws-text/40">
            SOURCE: {card.source}
          </span>
          <span
            className="material-symbols-outlined text-ws-teal-dark text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
        </div>
        <p className="text-ws-text-dim text-sm leading-relaxed mb-4 italic">
          {card.quote}
        </p>
        <div className="bg-ws-high/50 p-3 rounded-sm border-l-2 border-ws-teal-dark">
          <p className="text-ws-teal text-sm font-medium">
            <span className="font-label text-[10px] uppercase font-bold mr-2">
              SUMMARY:
            </span>
            {card.summary}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ws-low rounded-sm border-t-2 border-ws-teal-dark p-5 transition-all hover:bg-ws-mid overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <span className="font-label text-[11px] text-ws-teal/80 font-bold bg-ws-teal/5 px-2 py-0.5 rounded border border-ws-teal/10">
          {card.source}
        </span>
        <span className="material-symbols-outlined text-ws-text/20 group-hover:text-ws-teal transition-colors">
          verified
        </span>
      </div>
      <div className="space-y-4">
        <div className="border-l border-ws-outline-dim/30 pl-4 py-1 italic text-ws-text/70 text-sm leading-relaxed">
          {card.quote}
        </div>
        <div className="bg-ws-lowest/50 p-3 rounded-sm border border-ws-outline-dim/10">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="material-symbols-outlined text-ws-teal text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              insights
            </span>
            <span className="font-label text-[10px] font-bold text-ws-teal uppercase">
              Console Summary
            </span>
          </div>
          <p className="text-ws-teal text-sm font-medium">{card.summary}</p>
        </div>
      </div>
    </div>
  );
}
