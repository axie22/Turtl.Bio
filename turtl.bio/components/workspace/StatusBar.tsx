"use client";

import { WorkspacePhase } from "./useWorkspace";

interface StatusBarProps {
  phase: WorkspacePhase;
}

export function StatusBar({ phase }: StatusBarProps) {
  if (phase === "idle") {
    return (
      <footer className="bg-ws-lowest flex justify-between items-center px-3 h-7 shrink-0 z-50">
        <div className="flex items-center gap-4 text-ws-text/50 font-label text-[11px] font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-ws-highest animate-pulse" />
            <span className="uppercase tracking-widest">No active query</span>
          </div>
          <span className="hover:text-ws-teal transition-colors cursor-default">
            v2.4.0-stable
          </span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-4 text-ws-teal font-label text-[11px] font-medium">
          <span className="uppercase tracking-widest">
            System Status: Ready
          </span>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-ws-lowest flex justify-between items-center px-3 h-7 shrink-0 z-50 border-t border-ws-highest/40">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-ws-text/40 font-label text-[10px] uppercase tracking-tighter">
            FDA REFERENCE SOURCE
          </span>
          <span className="text-ws-teal font-bold">|</span>
          <span className="text-ws-teal font-label text-[10px]">
            ICH S6(R1) &middot; Male-Specific Indication Studies
          </span>
        </div>
        <div className="flex items-center gap-1 bg-ws-teal/10 px-1.5 py-0.5 rounded-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-ws-teal animate-pulse" />
          <span className="text-[8px] font-bold text-ws-teal uppercase font-label">
            VERIFIED
          </span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 max-w-md truncate">
          <span className="text-ws-text/40 font-label text-[10px] uppercase">
            LOGIC_PATH:
          </span>
          <span className="text-ws-text/70 font-label text-[10px] truncate">
            Male-only tox studies accepted for male-specific indications.
          </span>
        </div>
        <div className="flex items-center gap-3 font-label text-[10px]">
          <span className="text-ws-text/40">UTF-8</span>
          <div className="flex items-center gap-1">
            <span className="text-ws-text/40 uppercase">STABILITY:</span>
            <span className="text-ws-teal font-bold">0.9942</span>
          </div>
          <span className="text-ws-text/40">v2.4.0-STABLE</span>
        </div>
      </div>
    </footer>
  );
}
