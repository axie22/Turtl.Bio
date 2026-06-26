"use client";

import { useState } from "react";

const DEMO_DOCS = [
  {
    id: "tpp",
    name: "END-101_TPP_v2.3.pdf",
    label: "Target Product Profile",
    size: "148 KB",
    icon: "description",
    color: "#60a5fa",
    tags: ["PKU indication", "live biotherapeutic", "oral route"],
  },
  {
    id: "noglp",
    name: "Yucatan_NonGLP_InVivo_Summary.pdf",
    label: "Non-GLP In Vivo Study",
    size: "2.1 MB",
    icon: "biotech",
    color: "#54dcbc",
    tags: ["YOUR COLONIZATION DATA", "Yucatan pig", "sustained colonization"],
  },
  {
    id: "sbir",
    name: "SBIR_Phase1_Application.pdf",
    label: "SBIR Phase 1 Grant Application",
    size: "892 KB",
    icon: "attach_money",
    color: "#22c55e",
    tags: ["NIH", "$300K feasibility", "microbiome"],
  },
];

interface NavTabsProps {
  onNavigate: (view: string) => void;
}

function NavBar({ onNavigate }: NavTabsProps) {
  return (
    <header className="h-11 bg-ws-mid border-b border-ws-highest/40 flex items-center justify-between px-4 shrink-0 z-50">
      <div className="flex items-center gap-6">
        <span className="text-base font-black text-ws-teal font-headline uppercase tracking-wider">
          Turtl.Bio
        </span>
        <nav className="flex items-center gap-1">
          {["explorer", "path-map", "regulatory-ai"].map((tab) => (
            <button
              key={tab}
              onClick={() => onNavigate(tab)}
              className="px-3 py-1.5 font-label text-[11px] font-medium rounded-sm transition-colors text-ws-text/50 hover:text-ws-text/80 hover:bg-ws-highest/40 capitalize"
            >
              {tab === "path-map" ? "Path Map" : tab === "regulatory-ai" ? "Regulatory AI" : "Explorer"}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <button className="text-ws-text/30 hover:text-ws-text/70 transition-colors">
          <span className="material-symbols-outlined text-[18px]">settings</span>
        </button>
        <button className="text-ws-text/30 hover:text-ws-text/70 transition-colors">
          <span className="material-symbols-outlined text-[18px]">account_circle</span>
        </button>
      </div>
    </header>
  );
}

interface UploadPageProps {
  onAnalyze: () => void;
  onNavigate: (view: string) => void;
}

export function UploadPage({ onAnalyze, onNavigate }: UploadPageProps) {
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(onAnalyze, 1200);
  };

  return (
    <div className="h-screen w-screen bg-ws-bg text-ws-text flex flex-col overflow-hidden">
      <NavBar onNavigate={onNavigate} />

      {/* Breadcrumb */}
      <div className="h-8 bg-ws-low border-b border-ws-highest/10 flex items-center px-4 gap-3 shrink-0">
        <span className="font-label text-[9px] uppercase tracking-widest text-ws-text/25">New Program</span>
        <span className="text-ws-text/15">/</span>
        <span className="font-label text-[10.5px] font-semibold text-ws-text/60">Upload Documents</span>
        <span className="font-label text-[9px] px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "rgba(84,220,188,0.08)", color: "rgba(84,220,188,0.5)" }}>
          Step 1 of 3
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-ws-teal text-[16px]">folder_open</span>
              <span className="font-label text-[10px] uppercase tracking-widest text-ws-teal">Program Documents</span>
            </div>
            <h1 className="font-headline text-2xl font-bold text-ws-text mb-2">
              What should we read?
            </h1>
            <p className="font-label text-[12px] text-ws-text/45 leading-relaxed max-w-lg">
              Upload your TPP, study data, and any documents you'd hand a consultant to get them up to speed.
              The system qualifies retrieved literature against your actual program state.
            </p>
          </div>

          {/* Program name field */}
          <div className="mb-6 p-4 bg-ws-low border border-ws-highest/20 rounded-sm">
            <div className="flex items-center gap-3">
              <div className="flex flex-col flex-1">
                <span className="font-label text-[9px] uppercase tracking-widest text-ws-text/30 mb-1">Program</span>
                <span className="font-label text-[13px] font-semibold text-ws-text">END-101 · PKU (phenylketonuria)</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-label text-[9px] uppercase tracking-widest text-ws-text/30 mb-1">Modality</span>
                <span className="font-label text-[11px] text-ws-text/70">Live Biotherapeutic (LBP)</span>
              </div>
            </div>
          </div>

          {/* Document cards */}
          <div className="space-y-3 mb-8">
            {DEMO_DOCS.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-4 p-4 bg-ws-low border border-ws-highest/20 rounded-sm hover:border-ws-highest/40 transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0"
                  style={{ backgroundColor: doc.color + "18" }}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ color: doc.color }}
                  >
                    {doc.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-label text-[11px] font-semibold text-ws-text/90 truncate">
                      {doc.name}
                    </span>
                    <span className="font-label text-[9px] text-ws-text/30 shrink-0">{doc.size}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-label text-[9.5px] text-ws-text/50">{doc.label}</span>
                    <span className="text-ws-text/20">·</span>
                    {doc.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`font-label text-[8.5px] px-1.5 py-0.5 rounded-sm ${
                          tag === "YOUR COLONIZATION DATA"
                            ? "text-amber-400 bg-amber-400/10 border border-amber-400/20"
                            : "text-ws-text/35 bg-ws-highest/40"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="material-symbols-outlined text-[14px] text-ws-teal/60 shrink-0">check_circle</span>
              </div>
            ))}

            {/* Drop zone (visual only) */}
            <div className="flex items-center gap-3 p-4 border border-dashed border-ws-highest/25 rounded-sm hover:border-ws-highest/45 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[18px] text-ws-text/20">add_circle</span>
              <span className="font-label text-[11px] text-ws-text/30">Add another document</span>
            </div>
          </div>

          {/* Analyze button */}
          <div className="flex items-center justify-between">
            <p className="font-label text-[10px] text-ws-text/25 max-w-xs leading-relaxed">
              The system pulls past approvals, regulatory precedent, and primary papers against your documents.
            </p>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-sm font-label text-[11px] font-bold tracking-widest uppercase transition-all ${
                analyzing
                  ? "bg-ws-teal-dark/50 text-ws-on-teal-dark/50 cursor-not-allowed"
                  : "bg-ws-teal-dark text-ws-on-teal-dark hover:shadow-[0_0_20px_0_rgba(0,175,145,0.35)] hover:bg-ws-teal"
              }`}
            >
              {analyzing ? (
                <>
                  <span className="material-symbols-outlined text-[14px] animate-spin">refresh</span>
                  Analyzing…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  Analyze Program
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <footer className="h-7 bg-ws-lowest border-t border-ws-highest/20 flex items-center justify-between px-4 shrink-0">
        <span className="font-label text-[9.5px] text-ws-text/30 uppercase tracking-widest">3 documents ready</span>
        <span className="font-label text-[9.5px] text-ws-text/20">END-101 · PKU · Live Biotherapeutic</span>
      </footer>
    </div>
  );
}
