"use client";

import { useState } from "react";

interface FolderItemProps {
  name: string;
  defaultOpen?: boolean;
  active?: boolean;
  depth?: number;
  children?: React.ReactNode;
}

function FolderItem({
  name,
  defaultOpen = false,
  active = false,
  depth = 0,
  children,
}: FolderItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const pl = depth === 0 ? "px-4" : "px-2";

  return (
    <div className={active ? "bg-ws-mid/30 border-l border-ws-teal/20" : ""}>
      <div
        className={`py-0.5 ${pl} flex items-center gap-2 cursor-pointer transition-colors ${
          active
            ? "text-ws-text/80 bg-ws-mid"
            : "text-ws-text/40 hover:bg-ws-mid"
        }`}
        style={{ paddingLeft: depth > 0 ? `${depth * 8 + 8}px` : undefined }}
        onClick={() => setOpen(!open)}
      >
        <span
          className={`material-symbols-outlined text-[14px] transition-transform ${open ? "rotate-90" : ""}`}
        >
          chevron_right
        </span>
        {open ? (
          <span
            className="material-symbols-outlined text-[16px] text-ws-teal"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            folder_open
          </span>
        ) : (
          <span className="material-symbols-outlined text-[16px]">folder</span>
        )}
        <span className="font-label text-[11px] truncate uppercase">
          {name}
        </span>
      </div>
      {open && children && <div className="pl-6 space-y-0.5 py-1">{children}</div>}
    </div>
  );
}

interface FileItemProps {
  name: string;
  active?: boolean;
  depth?: number;
}

function FileItem({ name, active = false }: FileItemProps) {
  return (
    <div
      className={`py-0.5 px-2 flex items-center gap-2 cursor-pointer transition-colors ${
        active
          ? "bg-ws-teal/10 border-l-2 border-ws-teal text-ws-teal"
          : "text-ws-text/60 hover:bg-ws-mid"
      }`}
    >
      <span className="material-symbols-outlined text-[14px]">
        description
      </span>
      <span className="font-label text-[10px] truncate">{name}</span>
    </div>
  );
}

export function ExplorerPanel() {
  return (
    <div className="h-full bg-ws-lowest flex flex-col">
      <div className="h-9 px-4 flex items-center justify-between border-b border-ws-highest/20">
        <span className="font-label text-[10px] font-bold tracking-widest text-ws-text-dim uppercase">
          Explorer
        </span>
        <span className="material-symbols-outlined text-xs text-ws-text-dim cursor-pointer">
          more_horiz
        </span>
      </div>
      <div className="flex-1 overflow-y-auto ws-scrollbar py-2">
        <div className="px-4 py-1 flex items-center gap-2 group cursor-pointer hover:bg-ws-mid">
          <span className="material-symbols-outlined text-[14px] text-ws-text-dim">
            chevron_right
          </span>
          <span className="font-label text-[11px] text-ws-text-dim uppercase tracking-tighter">
            REG-SYS-01 / PSMA-RLT-001
          </span>
        </div>
        <div className="pl-4">
          <FolderItem name="m1-administrative" depth={1} />
          <FolderItem name="m2-summaries" depth={1} />
          <FolderItem name="m3-quality" depth={1} />
          <FolderItem name="m4-nonclinical" depth={1} defaultOpen active>
            <FileItem name="tox-study-male-cynomolgus.pdf" active />
            <FileItem name="biodistribution-study.pdf" />
            <FileItem name="pharmacology-primary.pdf" />
            <FileItem name="genotoxicity-assessment.pdf" />
          </FolderItem>
          <FolderItem name="m5-clinical" depth={1} />
        </div>
      </div>
    </div>
  );
}
