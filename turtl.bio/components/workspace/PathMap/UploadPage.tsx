"use client";

import { useState } from "react";
import { PROGRAM_DOCS } from "./data";

// FILE_TREE order: CLINICAL → REGULATORY/US/TO FDA → FROM FDA → GUIDANCE → CMC → TOXICOLOGY → PROGRAM
const TREE_ORDER = [
  "doc-clinical-proto",
  "doc-interact-req", "doc-interact-pkg", "doc-preind-req", "doc-preind-brief", "doc-odd-req",
  "doc-fda-interact-resp",
  "doc-fda-lbp", "doc-ich-s6", "doc-fda-ea", "doc-ich-m3", "doc-fda-cgmp",
  "doc-mcb", "doc-ngs", "doc-potency", "doc-abx", "doc-mfg",
  "doc-nglp", "doc-biodist", "doc-glp-tox", "doc-nonclin-gap",
  "doc-tpp", "doc-sbir",
];

const DEMO_DOCS = TREE_ORDER
  .map((id) => PROGRAM_DOCS.find((d) => d.id === id))
  .filter((d): d is (typeof PROGRAM_DOCS)[number] => !!d)
  .map((d, i) => ({ ...d, delay: i * 80 }));

function NavBar() {
  return (
    <header className="h-11 bg-ws-mid border-b border-ws-highest/40 flex items-center justify-between px-4 shrink-0 z-50">
      <span className="text-base font-black text-ws-teal font-headline uppercase tracking-wider">
        Turtl.Bio
      </span>
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
  const [docsVisible, setDocsVisible] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const allLoaded = docsVisible.size === DEMO_DOCS.length;
  const totalDocs = DEMO_DOCS.length;

  const handleImport = () => {
    if (importing || allLoaded) return;
    setImporting(true);
    DEMO_DOCS.forEach((doc) => {
      setTimeout(() => {
        setDocsVisible((prev) => new Set([...prev, doc.id]));
      }, doc.delay + 200);
    });
    setTimeout(() => setImporting(false), DEMO_DOCS[DEMO_DOCS.length - 1].delay + 600);
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(onAnalyze, 1200);
  };

  return (
    <div className="h-screen w-screen bg-ws-bg text-ws-text flex flex-col overflow-hidden">
      <NavBar />

      {/* Breadcrumb */}
      <div className="h-8 bg-ws-low border-b border-ws-highest/10 flex items-center px-4 gap-3 shrink-0">
        <span className="font-label text-[9px] uppercase tracking-widest text-ws-text/25">New Program</span>
        <span className="text-ws-text/15">/</span>
        <span className="font-label text-[10.5px] font-semibold text-ws-text/60">Context</span>
        <span className="font-label text-[9px] px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "rgba(84,220,188,0.08)", color: "rgba(84,220,188,0.5)" }}>
          Step 1 of 3
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
        <div className="w-full max-w-2xl flex flex-col min-h-0">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-ws-teal text-[16px]">folder_open</span>
              <span className="font-label text-[10px] uppercase tracking-widest text-ws-teal">Program Context</span>
            </div>
            <h1 className="font-headline text-2xl font-bold text-ws-text mb-2">
              What should we read?
            </h1>
            <p className="font-label text-[12px] text-ws-text/45 leading-relaxed max-w-lg">
              Import your program documents — TPP, study data, anything you&apos;d hand a consultant.
              Turtl qualifies retrieved literature and regulatory precedent against your actual program state.
            </p>
          </div>

          {/* Import zone — always shown */}
          <div
            onClick={!allLoaded ? handleImport : undefined}
            className={`mb-3 flex items-center gap-4 px-5 py-4 border rounded-sm transition-all duration-200 ${
              allLoaded
                ? "border-ws-highest/20 bg-ws-low cursor-default"
                : importing
                ? "border-ws-teal/30 bg-ws-teal/5 cursor-wait"
                : "border-dashed border-ws-highest/30 bg-ws-low hover:border-ws-teal/40 hover:bg-ws-teal/5 cursor-pointer"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-sm flex items-center justify-center shrink-0 transition-colors ${
                allLoaded ? "bg-ws-teal/15" : importing ? "bg-ws-teal/10" : "bg-ws-highest/30"
              }`}
            >
              {importing ? (
                <span className="material-symbols-outlined text-[18px] text-ws-teal animate-spin">refresh</span>
              ) : allLoaded ? (
                <span className="material-symbols-outlined text-[18px] text-ws-teal">check_circle</span>
              ) : (
                <span className="material-symbols-outlined text-[18px] text-ws-text/30">upload_file</span>
              )}
            </div>
            <div className="flex-1">
              <div className="font-label text-[11px] font-semibold text-ws-text/70 mb-0.5">
                {allLoaded
                  ? `${totalDocs} program documents imported`
                  : importing
                  ? `Importing documents… ${docsVisible.size} of ${totalDocs}`
                  : "Import program documents"}
              </div>
              <div className="font-label text-[9.5px] text-ws-text/30">
                {allLoaded
                  ? "Regulatory · CMC · Toxicology · Program files"
                  : "Click to import END-101 data room"}
              </div>
            </div>
            {!allLoaded && !importing && (
              <span className="font-label text-[9px] text-ws-teal px-2.5 py-1 border border-ws-teal/25 rounded-sm shrink-0">
                Import
              </span>
            )}
          </div>

          {/* Document cards — scrollable list */}
          {docsVisible.size > 0 && (
          <div className="overflow-y-auto min-h-0 flex-1 pr-1 mt-0">
          <div className="space-y-0">
          {DEMO_DOCS.map((doc) => {
            const visible = docsVisible.has(doc.id);
            if (!visible) return null;
            return (
              <div
                key={doc.id}
                className="flex items-center gap-3 px-4 py-2.5 mb-2 bg-ws-low border border-ws-highest/20 rounded-sm animate-[fadeIn_0.3s_ease]"
              >
                <div
                  className="w-7 h-7 rounded-sm flex items-center justify-center shrink-0"
                  style={{ backgroundColor: doc.color + "18" }}
                >
                  <span className="material-symbols-outlined text-[15px]" style={{ color: doc.color }}>
                    {doc.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-label text-[10px] font-semibold text-ws-text/85 truncate">
                      {doc.filename}
                    </span>
                    <span className="font-label text-[8.5px] text-ws-text/25 shrink-0">{doc.size}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                    <span className="font-label text-[8.5px] text-ws-text/45">{doc.label}</span>
                    {doc.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className={`font-label text-[8px] px-1.5 py-0.5 rounded-sm ${
                          tag === "YOUR COLONIZATION DATA"
                            ? "text-amber-400 bg-amber-400/10 border border-amber-400/20"
                            : "text-ws-text/30 bg-ws-highest/40"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="material-symbols-outlined text-[13px] text-ws-teal/60 shrink-0">check_circle</span>
              </div>
            );
          })}
          </div>
          </div>
          )}

          {/* Analyze button — only shown after docs loaded */}
          {allLoaded && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-ws-highest/15">
              <p className="font-label text-[10px] text-ws-text/25 max-w-xs leading-relaxed">
                Turtl will pull past approvals, regulatory precedent, and primary literature against your documents.
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
          )}
        </div>
      </div>

      {/* Status bar */}
      <footer className="h-7 bg-ws-lowest border-t border-ws-highest/20 flex items-center justify-between px-4 shrink-0">
        <span className="font-label text-[9.5px] text-ws-text/30 uppercase tracking-widest">
          {allLoaded ? `${totalDocs} documents ready` : docsVisible.size > 0 ? `${docsVisible.size} of ${totalDocs} loaded` : "No documents"}
        </span>
        <span className="font-label text-[9.5px] text-ws-text/20">END-101 · PKU · Live Biotherapeutic</span>
      </footer>
    </div>
  );
}
