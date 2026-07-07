"use client";

import { useState, useEffect } from "react";

// ─── Demo data ────────────────────────────────────────────────────────────────

const LOADING_STEPS = [
  { label: "Ingesting program documents…", duration: 700 },
  { label: "Pulling regulatory precedent…", duration: 900 },
  { label: "Retrieving primary literature…", duration: 800 },
  { label: "Qualifying against YOUR COLONIZATION DATA…", duration: 1100 },
  { label: "Ranking competitors by mechanism…", duration: 700 },
];

type QualStatus = "applies" | "superseded" | "disqualified" | "caution" | "open";

interface LitItem {
  id: string;
  title: string;
  cite: string;
  type: string;
  status: QualStatus;
  statusLabel: string;
  reason: string;
  anchor?: string;
}

interface CompetitorItem {
  id: string;
  company: string;
  program: string;
  approach: string;
  outcome: string;
  status: QualStatus;
  statusLabel: string;
  reason: string;
  anchor?: string;
}

const LITERATURE: LitItem[] = [
  {
    id: "l1",
    title: "FDA 2022 Draft Guidance — Early Clinical Trials with LBPs (Nonclinical Recommendations)",
    cite: "FDA, 2022",
    type: "Regulatory Guidance",
    status: "applies",
    statusLabel: "Applies",
    reason: "Primary framework for nonclinical LBP requirements. Directly governs tox study design and IND content for this modality.",
  },
  {
    id: "l2",
    title: "ICH S6(R1) — Preclinical Safety Evaluation of Biotechnology-Derived Pharmaceuticals",
    cite: "ICH, 2011",
    type: "Guidance",
    status: "applies",
    statusLabel: "Applies",
    reason: "Species selection and study design principles for biologics. Applicable to chassis-based LBP toxicology.",
  },
  {
    id: "l3",
    title: "Colonization resistance prevents stable engraftment of introduced bacterial strains in the human gut",
    cite: "Litvak et al., Cell Host & Microbe, 2019",
    type: "Primary Literature",
    status: "superseded",
    statusLabel: "Superseded by your data",
    reason: "Concludes introduced strains cannot achieve persistent colonization. YOUR COLONIZATION DATA demonstrates sustained chassis-native engraftment — this result does not apply to your approach.",
    anchor: "YOUR COLONIZATION DATA",
  },
  {
    id: "l4",
    title: "Microbiome therapeutics: challenges and recent advances in clinical translation",
    cite: "Zmora et al., Nat. Med., 2019",
    type: "Review",
    status: "superseded",
    statusLabel: "Superseded by your data",
    reason: "Frames persistent colonization as infeasible for all LBP approaches. Your Yucatan pig data directly contradicts this consensus for chassis-native organisms.",
    anchor: "YOUR COLONIZATION DATA",
  },
  {
    id: "l5",
    title: "Environmental Assessment for Biological INDs — FDA Guidance for Industry",
    cite: "FDA, 2015",
    type: "Regulatory Guidance",
    status: "applies",
    statusLabel: "Applies",
    reason: "Required for IND submission with live organisms. Sets categorical exclusion criteria and EA content requirements.",
  },
  {
    id: "l6",
    title: "ODD eligibility for rare metabolic diseases: FDA review criteria",
    cite: "FDA, 2021",
    type: "Regulatory Precedent",
    status: "applies",
    statusLabel: "Applies",
    reason: "PKU is a rare disease (<200K US patients). Establishes ODD eligibility and 7-year market exclusivity pathway.",
  },
];

const COMPETITORS: CompetitorItem[] = [
  {
    id: "c1",
    company: "Synlogic",
    program: "SYNB1020 (PKU)",
    approach: "Engineered E. coli Nissle — lab-strain, introduced organism",
    outcome: "Phase 2 failed. Insufficient ammonia metabolism; colonization not sustained.",
    status: "disqualified",
    statusLabel: "Disqualified — different mechanism",
    reason: "Introduced lab strain (E. coli Nissle) competed with native flora and failed to persist. Failure is a colonization-resistance failure, not a metabolic failure. YOUR COLONIZATION DATA shows sustained chassis-native engraftment — the mechanistic distinction is real.",
    anchor: "YOUR COLONIZATION DATA",
  },
  {
    id: "c2",
    company: "Novome Biotechnologies",
    program: "NOV001 (GI conditions)",
    approach: "Engineered Akkermansia muciniphila — lab-cultivated, introduced",
    outcome: "Discontinued. Persistence and efficacy endpoints not met in clinical studies.",
    status: "disqualified",
    statusLabel: "Disqualified — different mechanism",
    reason: "Lab-cultivated introduced strain; same colonization-resistance failure mode as Synlogic. Neither company used a chassis native to the target host. This distinction is why they failed and why their outcomes do not constitute precedent for END-101.",
    anchor: "YOUR COLONIZATION DATA",
  },
  {
    id: "c3",
    company: "Pivotal Biosciences",
    program: "PVT-101 (IBD, early stage)",
    approach: "Chassis-native commensal, similar colonization approach",
    outcome: "Preclinical — Phase 1 IND filed Q1 2025",
    status: "caution",
    statusLabel: "Partial precedent — monitor",
    reason: "Same chassis-native approach. IND filing establishes a tox study design precedent worth tracking. Not a failure case; watch for FDA feedback on species justification in INTERACT.",
  },
];

const STATUS_STYLE: Record<QualStatus, { border: string; bg: string; text: string; dot: string }> = {
  applies:      { border: "border-ws-teal/25",   bg: "bg-ws-teal/5",    text: "text-ws-teal",   dot: "bg-ws-teal" },
  superseded:   { border: "border-amber-400/30", bg: "bg-amber-400/5",  text: "text-amber-400", dot: "bg-amber-400" },
  disqualified: { border: "border-red-400/30",   bg: "bg-red-400/5",    text: "text-red-400",   dot: "bg-red-400" },
  caution:      { border: "border-yellow-400/30",bg: "bg-yellow-400/5", text: "text-yellow-400",dot: "bg-yellow-400" },
  open:         { border: "border-ws-highest/30",bg: "bg-ws-highest/5", text: "text-ws-text/50", dot: "bg-ws-text/30" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ColonizationAnchor() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-amber-400 bg-amber-400/10 border border-amber-400/25 font-label text-[8.5px] font-bold">
      <span className="material-symbols-outlined !text-[10px]">science</span>
      YOUR COLONIZATION DATA
    </span>
  );
}

function LitCard({ item }: { item: LitItem }) {
  const s = STATUS_STYLE[item.status];
  return (
    <div className={`p-3.5 rounded-sm border ${s.border} ${s.bg} space-y-2`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-label text-[10.5px] font-semibold text-ws-text/90 leading-snug mb-0.5">
            {item.title}
          </p>
          <div className="flex items-center gap-2">
            <span className="font-label text-[8.5px] text-ws-text/35">{item.cite}</span>
            <span className="text-ws-text/15">·</span>
            <span className="font-label text-[8.5px] text-ws-text/30 bg-ws-highest/40 px-1 py-0.5 rounded-sm">{item.type}</span>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-sm border ${s.border} ${s.bg}`}>
          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
          <span className={`font-label text-[8.5px] font-medium ${s.text}`}>{item.statusLabel}</span>
        </div>
      </div>
      <p className="font-label text-[10px] text-ws-text/55 leading-relaxed">
        {item.reason}
      </p>
      {item.anchor && <ColonizationAnchor />}
    </div>
  );
}

function CompetitorCard({ item }: { item: CompetitorItem }) {
  const s = STATUS_STYLE[item.status];
  return (
    <div className={`p-3.5 rounded-sm border ${s.border} ${s.bg} space-y-2`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-label text-[11px] font-bold text-ws-text/90">{item.company}</p>
            <span className="font-label text-[9px] text-ws-text/40 bg-ws-highest/40 px-1.5 py-0.5 rounded-sm">{item.program}</span>
          </div>
          <p className="font-label text-[9.5px] text-ws-text/45 italic">{item.approach}</p>
        </div>
        <div className={`flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-sm border ${s.border} ${s.bg}`}>
          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
          <span className={`font-label text-[8.5px] font-medium ${s.text}`}>{item.statusLabel}</span>
        </div>
      </div>
      <div className="p-2 bg-ws-high/40 rounded-sm border border-ws-highest/30">
        <span className="font-label text-[8.5px] uppercase tracking-widest text-ws-text/25 mr-1">Outcome:</span>
        <span className="font-label text-[9.5px] text-ws-text/50">{item.outcome}</span>
      </div>
      <p className="font-label text-[10px] text-ws-text/55 leading-relaxed">
        {item.reason}
      </p>
      {item.anchor && <ColonizationAnchor />}
    </div>
  );
}

// ─── Loading screen ───────────────────────────────────────────────────────────

function LoadingScreen({ step }: { step: number }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6">
      <div className="w-12 h-12 rounded-full border-2 border-ws-teal/20 border-t-ws-teal animate-spin" />
      <div className="space-y-2 w-72">
        {LOADING_STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
              i < step ? "bg-ws-teal" : i === step ? "bg-ws-teal animate-pulse" : "bg-ws-highest"
            }`} />
            <span className={`font-label text-[10px] transition-colors ${
              i === step ? "text-ws-text/80" : i < step ? "text-ws-teal/60" : "text-ws-text/20"
            }`}>
              {s.label}
            </span>
            {i < step && (
              <span className="material-symbols-outlined text-[12px] text-ws-teal ml-auto">check</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ContextPage ─────────────────────────────────────────────────────────

interface ContextPageProps {
  onGenerate: () => void;
  onNavigate: (view: string) => void;
}

export function ContextPage({ onGenerate, onNavigate }: ContextPageProps) {
  const [loadStep, setLoadStep] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    let s = 0;
    const tick = () => {
      if (s >= LOADING_STEPS.length) {
        setLoaded(true);
        return;
      }
      setLoadStep(s);
      setTimeout(() => { s++; tick(); }, LOADING_STEPS[s]?.duration ?? 800);
    };
    const t = setTimeout(tick, 300);
    return () => clearTimeout(t);
  }, []);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(onGenerate, 900);
  };

  return (
    <div className="h-screen w-screen bg-ws-bg text-ws-text flex flex-col overflow-hidden">
      {/* Nav */}
      <header className="h-11 bg-ws-mid border-b border-ws-highest/40 flex items-center justify-between px-4 shrink-0">
        <span className="text-base font-black text-ws-teal font-headline uppercase tracking-wider">Turtl.Bio</span>
        <div className="flex items-center gap-2">
          <button className="text-ws-text/30 hover:text-ws-text/70 transition-colors">
            <span className="material-symbols-outlined text-[18px]">settings</span>
          </button>
          <button className="text-ws-text/30 hover:text-ws-text/70 transition-colors">
            <span className="material-symbols-outlined text-[18px]">account_circle</span>
          </button>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="h-8 bg-ws-low border-b border-ws-highest/10 flex items-center px-4 gap-3 shrink-0">
        <span className="font-label text-[9px] uppercase tracking-widest text-ws-text/25">END-101 · PKU</span>
        <span className="text-ws-text/15">/</span>
        <span className="font-label text-[10.5px] font-semibold text-ws-text/60">Retrieval / Context</span>
        <span className="font-label text-[9px] px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "rgba(84,220,188,0.08)", color: "rgba(84,220,188,0.5)" }}>
          Step 2 of 3
        </span>
        {loaded && (
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-ws-teal" />
            <span className="font-label text-[9px] text-ws-teal/70">
              {LITERATURE.length} papers · {COMPETITORS.length} competitors qualified
            </span>
          </div>
        )}
      </div>

      {!loaded ? (
        <LoadingScreen step={loadStep} />
      ) : (
        <>
          {/* Results */}
          <div className="flex-1 overflow-hidden flex">
            {/* Literature column */}
            <div className="flex-1 flex flex-col overflow-hidden border-r border-ws-highest/20">
              <div className="px-5 py-3 border-b border-ws-highest/15 shrink-0 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="material-symbols-outlined text-[14px] text-ws-teal">article</span>
                    <span className="font-label text-[10px] font-bold uppercase tracking-widest text-ws-text/70">Literature</span>
                    <span className="font-label text-[8.5px] px-1.5 py-0.5 bg-ws-teal/10 text-ws-teal rounded-sm">{LITERATURE.length} retrieved</span>
                  </div>
                  <p className="font-label text-[9px] text-ws-text/30">Past approvals · primary papers · regulatory guidance</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="font-label text-[8.5px] text-amber-400/80">2 superseded by your data</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {LITERATURE.map((item) => (
                  <LitCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Competitors column */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-5 py-3 border-b border-ws-highest/15 shrink-0 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="material-symbols-outlined text-[14px] text-red-400">business</span>
                    <span className="font-label text-[10px] font-bold uppercase tracking-widest text-ws-text/70">Competitors</span>
                    <span className="font-label text-[8.5px] px-1.5 py-0.5 bg-red-400/10 text-red-400 rounded-sm">{COMPETITORS.length} found</span>
                  </div>
                  <p className="font-label text-[9px] text-ws-text/30">Qualified against your mechanism and chassis approach</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span className="font-label text-[8.5px] text-red-400/80">2 disqualified · 1 monitor</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {COMPETITORS.map((item) => (
                  <CompetitorCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Generate CTA */}
          <div className="shrink-0 border-t border-ws-highest/20 bg-ws-low px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-label text-[10px] font-semibold text-ws-text/70 mb-0.5">Context qualified against your program state</p>
              <p className="font-label text-[9px] text-ws-text/30">
                Synlogic and Novome disqualified · 2 literature claims superseded by YOUR COLONIZATION DATA
              </p>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-sm font-label text-[11px] font-bold tracking-widest uppercase transition-all ${
                generating
                  ? "bg-ws-teal-dark/50 text-ws-on-teal-dark/50 cursor-not-allowed"
                  : "bg-ws-teal-dark text-ws-on-teal-dark hover:shadow-[0_0_20px_0_rgba(0,175,145,0.35)] hover:bg-ws-teal"
              }`}
            >
              {generating ? (
                <>
                  <span className="material-symbols-outlined text-[14px] animate-spin">refresh</span>
                  Entering…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[14px]">login</span>
                  Enter Workspace
                </>
              )}
            </button>
          </div>
        </>
      )}

      {/* Status bar */}
      <footer className="h-7 bg-ws-lowest border-t border-ws-highest/20 flex items-center justify-between px-4 shrink-0">
        <span className="font-label text-[9.5px] text-ws-text/30 uppercase tracking-widest">
          {loaded ? "Retrieval complete" : "Retrieving context…"}
        </span>
        <span className="font-label text-[9.5px] text-ws-text/20">END-101 · PKU · Live Biotherapeutic</span>
      </footer>
    </div>
  );
}
