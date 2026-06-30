"use client";

import { ProgramDoc } from "./data";

// ─── Stub document content ───────────────────────────────────────────────────

interface Section { heading: string; body: string; tag?: string; }

const DOC_CONTENT: Record<string, { title: string; meta: string; sections: Section[] }> = {
  "doc-tpp": {
    title: "END-101 Target Product Profile",
    meta: "Version 2.3 · Confidential · END Biosciences",
    sections: [
      {
        heading: "Indication & Target Population",
        body: "Patients with classic PKU (phenylalanine hydroxylase deficiency) with sustained hyperphenylalaninemia (Phe > 360 µmol/L) despite dietary management. Estimated U.S. prevalence: ~16,000 patients.",
        tag: "Indication",
      },
      {
        heading: "Mechanism of Action",
        body: "Chassis-native intestinal bacterium engineered to express phenylalanine ammonia lyase (PAL). Colonizes the GI tract and converts dietary Phe to trans-cinnamic acid before systemic absorption. Metabolic effect is sustained through stable colonization — not periodic re-dosing. Mechanistically distinct from Synlogic (SYNB1020) and Novome (NOV001), which used introduced lab strains that failed to persist.",
        tag: "MOA",
      },
      {
        heading: "Route & Dosing",
        body: "Oral capsule. Proposed single colonization event, with once-monthly maintenance capsule if required. Long-term persistence supported by Yucatan pig colonization data showing 4.2% ± 0.8% fecal relative abundance at 12 weeks.",
        tag: "Dosing",
      },
      {
        heading: "Minimum Efficacy Goals",
        body: "≥30% reduction in blood Phe from baseline. Sustained response > 3 months in Phase 2. Secondary endpoint: patient-reported dietary flexibility score.",
        tag: "Efficacy",
      },
      {
        heading: "Safety Requirements",
        body: "GLP 90-day repeat-dose tox in a species justified by pharmacological relevance (species selection to be resolved via INTERACT meeting). Environmental Assessment (EA) per FDA 2015 guidance — runs Q1→Q4 in parallel with IND-enabling studies. No meaningful increase in antibiotic resistance markers.",
        tag: "Safety",
      },
      {
        heading: "IND-Enabling Studies Required",
        body: "1. Non-GLP dose-response study (in progress — Yucatan minipig)\n2. GLP 90-day repeat-dose tox (planned — species pending INTERACT)\n3. Environmental Assessment (Q1→Q4, parallel)\n4. GLP metabolic characterization\n5. CMC: strain characterization, manufacturing process, release specifications",
        tag: "IND Package",
      },
      {
        heading: "Regulatory Strategy",
        body: "INTERACT meeting requested pre-GLP Tox to resolve species justification. ODD designation targeted (PKU: ~16K U.S. patients, qualifies for rare disease). Type B pre-IND meeting planned after GLP package is complete to align on IND content.",
        tag: "Regulatory",
      },
    ],
  },
  "doc-nglp": {
    title: "Yucatan Non-GLP In Vivo Summary",
    meta: "Study ID: END-NGL-001 · Non-GLP Feasibility · Confidential",
    sections: [
      {
        heading: "Study Overview",
        body: "Species: Yucatan minipig (Sus scrofa domesticus)\nDuration: 12 weeks\nAnimals: n=24 (6/group × 4 dose cohorts: vehicle, 1×, 3×, 10× dose)\nGLP status: Non-GLP (feasibility & dose-ranging)",
        tag: "Design",
      },
      {
        heading: "YOUR COLONIZATION DATA — Key Result",
        body: "Sustained engraftment of chassis-native organism confirmed at Week 12 in all active dose cohorts. Mean fecal relative abundance: 4.2% ± 0.8% (10× cohort: 5.1% ± 0.6%). No significant decline from Week 6 to Week 12.",
        tag: "Primary Result",
      },
      {
        heading: "Colonization Kinetics",
        body: "Week 1–2: Rapid establishment in all cohorts\nWeek 3–6: Plateau at 4–6% relative fecal abundance\nWeek 6–12: Sustained, no statistically significant decline (p=0.41, mixed-effects model)\n\nThis directly contradicts the Litvak 2019 and Zmora 2019 findings, which concluded introduced strains cannot achieve persistent colonization. The chassis-native distinction is the operative variable.",
        tag: "Kinetics",
      },
      {
        heading: "Off-Switch Characterization",
        body: "Amoxicillin 50 mg/kg orally × 5 days: ≥ 3-log reduction in fecal counts by Day 3. No re-colonization at 4 weeks post-antibiotic in 5/6 animals (1 animal showed partial recovery at low level). Off-switch performance supports GLP study design.",
        tag: "Safety Feature",
      },
      {
        heading: "Safety Observations",
        body: "No adverse events at any dose level. No mortality. No evidence of systemic dissemination (blood cultures negative at all timepoints). Environmental swab samples negative at 4 weeks post-treatment. Body weight and clinical chemistry within normal ranges.",
        tag: "Safety",
      },
      {
        heading: "Implications for IND",
        body: "1. Colonization persistence data supports GLP study design without mandatory re-dosing paradigm\n2. Yucatan pig emerges as a candidate species for GLP tox — pending INTERACT discussion\n3. The colonization data differentiates END-101 from failed lab-strain LBPs and is the primary mechanistic argument for this program\n4. EA study design informed by absence of systemic dissemination",
        tag: "Next Steps",
      },
    ],
  },
  "doc-sbir": {
    title: "SBIR Phase 1 Application",
    meta: "NIH R43 · Program: END-101 · Budget: $350,000 / 12 months",
    sections: [
      {
        heading: "Specific Aims",
        body: "Aim 1: Demonstrate dose-response colonization in Yucatan minipig model (primary: establish minimal effective dose, confirm persistence at 12 weeks)\n\nAim 2: Characterize off-switch (antibiotic clearance) kinetics at effective dose\n\nAim 3: Establish chassis-native organism collection, biobanking, and molecular characterization protocols for GLP manufacture",
        tag: "Aims",
      },
      {
        heading: "Significance",
        body: "PKU affects ~16,000 U.S. patients. Current standard of care — dietary protein restriction plus sapropterin (BH4) — has compliance limitations and fails in ~50% of PKU genotypes. No approved LBP therapy exists for PKU.\n\nThe fundamental limitation of current LBP programs (Synlogic SYNB1020, Novome NOV001) is colonization failure due to colonization resistance — introduced lab strains compete with native flora and fail to persist. A chassis-native approach eliminates this failure mode.",
        tag: "Significance",
      },
      {
        heading: "Innovation",
        body: "Use of chassis-native intestinal bacterium sourced directly from the host species addresses the mechanistic root cause of prior LBP failures. This approach has not been tested clinically and represents a fundamentally different paradigm from engineered lab strains.",
        tag: "Innovation",
      },
      {
        heading: "Budget Justification",
        body: "Personnel (PI + 1 Research Associate): $210,000\nAnimal costs — Yucatan minipig study (n=24): $95,000\n16S sequencing, metabolomics, analytics: $30,000\nMaterials, supplies, overhead: $15,000\n\nTotal Direct Costs: $350,000",
        tag: "Budget",
      },
      {
        heading: "Phase 2 Milestones",
        body: "Successful Phase 1 completion unlocks SBIR Phase 2 application ($1.5–2.5M) targeting IND-enabling GLP studies. Phase 2 success criteria: colonization data package sufficient to support INTERACT meeting and GLP tox study design with FDA alignment.",
        tag: "Future",
      },
    ],
  },
  "doc-fda-lbp": {
    title: "FDA 2022 Draft Guidance — Early Clinical Trials with LBPs",
    meta: "Nonclinical Recommendations · FDA, 2022 · Draft (not final)",
    sections: [
      {
        heading: "Scope",
        body: "Applies to live biotherapeutic products (LBPs) — defined as biological products containing live organisms (bacteria, fungi, archaea) administered to prevent, treat, or cure disease. Covers IND content requirements for nonclinical studies supporting early Phase 1 trials.",
        tag: "Scope",
      },
      {
        heading: "Toxicology Study Requirements",
        body: "Species selection must be justified by pharmacological relevance — the organism should be capable of colonization and physiologically similar to humans for the relevant endpoint. No single species is mandated.\n\nFor chassis-native LBPs, species justification is an open question not fully resolved in this guidance — FDA recommends discussion at INTERACT meeting.",
        tag: "Tox",
      },
      {
        heading: "Colonization & Persistence",
        body: "Sponsors should characterize colonization kinetics, maximum burden, and persistence in the proposed species. For organisms with inherent colonization potential, persistence studies are expected to address both duration and off-switch (clearance) kinetics.",
        tag: "Colonization",
      },
      {
        heading: "Environmental Assessment",
        body: "LBP INDs are generally not eligible for categorical exclusion from EA requirements. A full Environmental Assessment addressing organism viability, environmental persistence, and ecological risk is expected. Runs concurrently with IND-enabling studies.",
        tag: "EA",
      },
      {
        heading: "Relevance to END-101",
        body: "This guidance is the primary regulatory framework governing the END-101 tox program. The species-justification open question for chassis-native organisms is the central agenda item for the planned INTERACT meeting.",
        tag: "Program Relevance",
      },
    ],
  },
  "doc-ich-s6": {
    title: "ICH S6(R1) — Preclinical Safety Evaluation",
    meta: "Biotechnology-Derived Pharmaceuticals · ICH, 2011",
    sections: [
      {
        heading: "Species Selection Principle",
        body: "The preferred species is the one in which the test material is pharmacologically active. Use of a non-relevant species is not recommended. For biologics where only one relevant species exists, single-species testing may be acceptable.",
        tag: "Species",
      },
      {
        heading: "Study Design",
        body: "Relevant species should be identified before initiating tox studies. Minimum 4-week repeat-dose studies generally support Phase 1; 13-week studies for longer clinical exposures. Recovery groups to assess reversibility are encouraged where relevant.",
        tag: "Design",
      },
      {
        heading: "Relevance to LBPs",
        body: "ICH S6(R1) principles apply to biotechnology-derived products including LBPs. For chassis-native LBPs where the pharmacological relevance is tied to the host's native microbiome context, species selection logic anchors to colonization and metabolic activity — not purely receptor binding.",
        tag: "LBP Context",
      },
    ],
  },
  "doc-fda-ea": {
    title: "FDA 2015 Guidance — Environmental Assessment for Biological INDs",
    meta: "Guidance for Industry · FDA, 2015",
    sections: [
      {
        heading: "When EA is Required",
        body: "INDs involving live organisms — including LBPs — are generally not eligible for categorical exclusion (21 CFR 25.31). A site-specific EA is required addressing release probability, environmental fate, and ecological risk.",
        tag: "Applicability",
      },
      {
        heading: "EA Content Requirements",
        body: "1. Organism characterization: taxonomy, genetic modifications, viability\n2. Environmental release probability: dosing regimen, containment measures\n3. Environmental fate: survival, growth, and dispersal in the environment\n4. Ecological risk: effects on non-target organisms, horizontal gene transfer potential\n5. Mitigation measures: patient instructions, off-switch characterization",
        tag: "Content",
      },
      {
        heading: "Timeline",
        body: "EA must be included in the IND filing. Studies supporting the EA (e.g., environmental survival, off-switch validation) should be conducted in parallel with other IND-enabling work. For END-101, the Environmental Assessment study is planned Q1→Q4, running in parallel with GLP Tox.",
        tag: "Timeline",
      },
    ],
  },
};

// ─── DocumentView ────────────────────────────────────────────────────────────

interface DocumentViewProps {
  doc: ProgramDoc;
  onPopOut?: () => void;
}

export function DocumentView({ doc, onPopOut }: DocumentViewProps) {
  const content = DOC_CONTENT[doc.id];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-ws-bg">
      {/* Doc toolbar */}
      <div
        className="h-8 flex items-center px-3 gap-2 border-b border-ws-highest/20 shrink-0"
        style={{ backgroundColor: "var(--color-ws-low)" }}
      >
        <span
          className="material-symbols-outlined text-[13px]"
          style={{ color: doc.color }}
        >
          {doc.icon}
        </span>
        <span className="font-label text-[10px] text-ws-text/60 truncate flex-1">{doc.filename}</span>
        <button
          onClick={onPopOut}
          className="text-ws-text/30 hover:text-ws-text/60 transition-colors ml-1"
          title="Pop out into new tab"
        >
          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
        </button>
      </div>

      {/* Document body */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto px-10 py-8">
          {/* Header */}
          <div className="mb-6 pb-4 border-b border-ws-highest/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: doc.color }} />
              <span className="font-label text-[9px] uppercase tracking-widest" style={{ color: doc.color + "99" }}>
                {doc.label}
              </span>
            </div>
            <h1 className="font-headline text-xl font-bold text-ws-text mb-1">
              {content?.title ?? doc.filename}
            </h1>
            <p className="font-label text-[10px] text-ws-text/40">{content?.meta}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {doc.tags.map((tag) => (
                <span
                  key={tag}
                  className={`font-label text-[8.5px] px-2 py-0.5 rounded-sm ${
                    tag === "YOUR COLONIZATION DATA"
                      ? "text-amber-500 bg-amber-400/10 border border-amber-400/20"
                      : "text-ws-text/40 bg-ws-highest/40"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Sections */}
          {content ? (
            <div className="space-y-6">
              {content.sections.map((section, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="font-label text-[11px] font-semibold text-ws-text/80">
                      {section.heading}
                    </h2>
                    {section.tag && (
                      <span
                        className="font-label text-[8px] px-1.5 py-0.5 rounded-sm text-ws-text/30 bg-ws-high"
                      >
                        {section.tag}
                      </span>
                    )}
                  </div>
                  <p className="font-label text-[11px] text-ws-text/65 leading-relaxed whitespace-pre-line">
                    {section.body}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-ws-text/25">
              <span className="material-symbols-outlined text-[32px] mb-2">description</span>
              <p className="font-label text-[11px]">Document preview not available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
