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

  // ── REGULATORY › US › Communications TO FDA ──────────────────────────────

  "doc-interact-req": {
    title: "INTERACT Meeting Request — END-101",
    meta: "Submitted to CBER/OTAT · Draft · END Biosciences",
    sections: [
      {
        heading: "Meeting Type & Product Classification",
        body: "Request for an INTERACT meeting with CBER, Office of Tissues and Advanced Therapies (OTAT). Product: END-101, a chassis-native live biotherapeutic product (LBP) for phenylketonuria (PKU). Regulatory pathway: BLA under 21 CFR 601. Classification: biological product per Section 351 of the PHS Act.",
        tag: "Meeting Type",
      },
      {
        heading: "Background",
        body: "END-101 is a chassis-native intestinal bacterium engineered to express phenylalanine ammonia lyase (PAL) for the treatment of classic PKU. Non-GLP in vivo feasibility studies (Yucatan minipig, n=24, 12 weeks) have been completed and demonstrate sustained colonization (YOUR COLONIZATION DATA). The program is approaching the GLP toxicology study design stage and requires FDA input before study initiation.",
        tag: "Background",
      },
      {
        heading: "Questions for FDA",
        body: "Q1: Is the Yucatan minipig an acceptable species for the GLP repeat-dose toxicology study, given the sustained colonization demonstrated in preliminary studies (YOUR COLONIZATION DATA)? If not, what alternative species does FDA recommend?\n\nQ2: What study duration does FDA consider appropriate for a GLP tox study intended to support a Phase 1 single-dose colonization paradigm?\n\nQ3: Are there specific CMC characterization requirements for a chassis-native LBP beyond those described in the 2022 LBP Draft Guidance that OTAT would expect to see at IND?",
        tag: "Questions",
      },
      {
        heading: "Proposed Meeting Format & Timeline",
        body: "Format: Written responses preferred; teleconference acceptable.\nProposed response window: Within 3 months of submission.\nRationale for timing: GLP tox study design and species justification must be finalized before contract research organization engagement and study initiation. INTERACT input will directly inform the GLP study protocol submitted as part of the IND.",
        tag: "Logistics",
      },
    ],
  },

  "doc-interact-pkg": {
    title: "INTERACT Briefing Package — END-101",
    meta: "Confidential · END Biosciences · Pre-IND Stage",
    sections: [
      {
        heading: "Program Summary",
        body: "END-101 targets classic PKU via gut-based phenylalanine catabolism. The product is a chassis-native intestinal bacterium expressing PAL. Unlike prior LBP approaches (Synlogic SYNB1020, Novome NOV001), END-101 uses an organism with inherent colonization capacity in the target host — removing colonization resistance as a failure mode. The proposed clinical paradigm is a single oral colonization event with optional monthly maintenance.",
        tag: "Overview",
      },
      {
        heading: "Non-GLP Colonization Data Summary",
        body: "Study: END-NGL-001 (Yucatan minipig, non-GLP, 12 weeks, n=24)\nPrimary result: Sustained engraftment confirmed at Week 12 in all active dose cohorts. Mean fecal relative abundance: 4.2% ± 0.8% (10× cohort: 5.1% ± 0.6%).\n\nYOUR COLONIZATION DATA — full dataset, kinetics curves, and per-animal data available in the appended study report.\n\nOff-switch: Amoxicillin 50 mg/kg × 5 days produced ≥3-log fecal count reduction by Day 3. 5/6 animals showed no re-colonization at 4 weeks post-antibiotic.",
        tag: "YOUR COLONIZATION DATA",
      },
      {
        heading: "Proposed GLP Tox Study Design",
        body: "Proposed species: Yucatan minipig (subject to FDA alignment at INTERACT).\nProposed duration: 90-day repeat-dose (3 monthly doses to maintain colonization), with 4-week recovery cohort.\nDose levels: 3 active + vehicle control (n=6/group × sex).\nEndpoints: standard repeat-dose tox panel; colonization kinetics; biodistribution; off-switch validation; environmental shedding.\nGLP status: Full GLP (21 CFR Part 58).",
        tag: "Tox Design",
      },
      {
        heading: "CMC Overview",
        body: "Drug substance: chassis-native organism, master cell bank established. Identity confirmed by two orthogonal methods (16S rRNA sequencing + biochemical profiling). Genetic stability assessed across manufacturing passage range by NGS.\n\nDrug product: oral capsule (lyophilized formulation under development). Release specifications include CFU count, viability (>80%), PAL functional activity, and antibiotic susceptibility panel per 2022 LBP Draft Guidance.",
        tag: "CMC",
      },
      {
        heading: "Key Regulatory Questions",
        body: "See INTERACT Meeting Request (INTERACT_meeting_request.pdf) for the three formal questions submitted to OTAT. The central question is species justification for the GLP tox study — the 2022 LBP Draft Guidance explicitly notes this is unresolved for chassis-native organisms and recommends early FDA interaction.",
        tag: "Questions",
      },
    ],
  },

  "doc-preind-req": {
    title: "Type B Pre-IND Meeting Request — END-101",
    meta: "Draft · END Biosciences · To be submitted post-GLP Reporting",
    sections: [
      {
        heading: "Meeting Classification",
        body: "Request for a Type B pre-IND meeting with CBER/OTAT pursuant to 21 CFR 312.82. Product: END-101 (chassis-native LBP, PKU). Intended IND type: Commercial IND. This meeting is intended to align on the completeness of the nonclinical package and Phase 1 study design prior to IND submission.",
        tag: "Classification",
      },
      {
        heading: "Meeting Agenda (Proposed)",
        body: "1. Nonclinical package review: adequacy of GLP tox data package to support Phase 1 single-dose colonization\n2. Phase 1 protocol elements: eligibility criteria, dosing paradigm, safety monitoring, stopping rules\n3. CMC readiness: Phase 1 manufacturing controls and release specifications\n4. Environmental Assessment: adequacy of EA conclusions for IND filing\n5. Orphan Drug Designation: status and implications for regulatory pathway",
        tag: "Agenda",
      },
      {
        heading: "Questions for FDA",
        body: "Q1: Is the completed GLP 90-day repeat-dose tox study in Yucatan minipig sufficient to support Phase 1 single-dose human colonization, or does FDA require additional nonclinical data?\n\nQ2: Does FDA agree that a Phase 1 design incorporating a single colonization dose with 12-month follow-up and amoxicillin off-switch rescue is acceptable?\n\nQ3: Are there CMC elements beyond the proposed release specifications that FDA expects to see in the IND submission for a Phase 1 LBP study?",
        tag: "Questions",
      },
      {
        heading: "Supporting Documents",
        body: "To be included with the meeting request:\n– GLP tox study report (final)\n– Environmental Assessment (final)\n– Proposed Phase 1 clinical protocol outline\n– CMC overview and master cell bank characterization\n– INTERACT meeting written responses (FDA, CBER/OTAT)",
        tag: "Package",
      },
    ],
  },

  "doc-preind-brief": {
    title: "Pre-IND Briefing Document — END-101",
    meta: "Draft · Type B Meeting Package · END Biosciences",
    sections: [
      {
        heading: "Product & Indication",
        body: "END-101: chassis-native live biotherapeutic product (LBP) for classic phenylketonuria (PKU). Indication: reduction of blood phenylalanine in patients with PKU and sustained hyperphenylalaninemia (Phe >360 µmol/L) despite dietary management. U.S. prevalence: ~16,000 patients. No approved LBP therapy exists for PKU.",
        tag: "Product",
      },
      {
        heading: "Nonclinical Program Summary",
        body: "Completed:\n– Non-GLP in vivo dose-response (Yucatan minipig, 12 weeks): sustained colonization confirmed (YOUR COLONIZATION DATA)\n– In vitro PAL activity characterization\n– Environmental shedding and biodistribution study\n– Off-switch validation (amoxicillin)\n\nCompleted (GLP):\n– 90-day repeat-dose toxicology study, Yucatan minipig, 3 dose levels + vehicle (species justified per INTERACT written responses)\n– Full histopathology, clinical chemistry, and colonization kinetics\n\nConclusion: No treatment-related adverse findings at any dose level. No systemic dissemination. Off-switch validated in GLP context.",
        tag: "Nonclinical",
      },
      {
        heading: "Phase 1 Protocol Overview",
        body: "Design: Open-label, dose-escalation, single-site Phase 1 in adults with classic PKU.\nDose levels: 3 cohorts (low / mid / high CFU dose), n=6/cohort, sequential escalation.\nPrimary endpoint: safety and tolerability at 12 months.\nSecondary: blood Phe reduction from baseline at Week 12, 24, and 52; colonization confirmed by stool 16S at Weeks 4, 12, 24, 52.\nOff-switch procedure: amoxicillin 500 mg orally × 5 days if clearance required.\nExclusion: prior antibiotic use within 4 weeks; immunocompromised patients.",
        tag: "Clinical",
      },
      {
        heading: "CMC Overview",
        body: "Drug substance: chassis-native organism, lyophilized. Master cell bank established and fully characterized. Manufacturing at Phase 1 cGMP scale; process locked at 50L bioreactor. Drug product: enteric-coated capsule, 4 CFU dose strengths. Release specifications: CFU ≥1×10⁹/capsule, viability >80%, PAL activity ≥90% reference standard, Gram stain and 16S identity confirmation, antibiotic susceptibility panel.",
        tag: "CMC",
      },
      {
        heading: "Regulatory Status",
        body: "INTERACT meeting completed: FDA written responses received, species justification confirmed.\nOrphan Drug Designation: application submitted (PKU, ~16K U.S. patients).\nEnvironmental Assessment: completed and included in IND package.\nExpected IND submission: Q4 2026 (contingent on Type B meeting alignment).",
        tag: "Regulatory",
      },
    ],
  },

  "doc-odd-req": {
    title: "Orphan Drug Designation Request — END-101",
    meta: "Draft · Submitted to FDA/OOPD · END Biosciences",
    sections: [
      {
        heading: "Disease & Prevalence",
        body: "Disease: Phenylketonuria (PKU) — an inborn error of phenylalanine metabolism caused by deficiency of phenylalanine hydroxylase (PAH). Classic PKU (PAH activity <1%) results in sustained hyperphenylalaninemia causing irreversible neurocognitive damage without treatment.\n\nU.S. prevalence: approximately 16,000 patients with PKU. Annual U.S. birth incidence: ~1 in 14,000. PKU meets the threshold for Orphan Drug designation under 21 CFR 316.20 (<200,000 U.S. patients).",
        tag: "Prevalence",
      },
      {
        heading: "Unmet Medical Need",
        body: "Current standard of care: lifelong dietary phenylalanine restriction (difficult to maintain) plus sapropterin (Kuvan) for the ~30% of patients with BH4-responsive genotypes. Pegvaliase (Palynziq) is approved but associated with a high systemic immunogenicity burden requiring injection and REMS. No approved oral colonization-based therapy exists.\n\nEnd-101 addresses patients for whom sapropterin is ineffective or poorly tolerated, and for whom pegvaliase's immunogenicity profile is prohibitive.",
        tag: "Unmet Need",
      },
      {
        heading: "Product Description & Mechanism",
        body: "END-101 is a chassis-native intestinal LBP engineered to express PAL. It degrades dietary phenylalanine in the gut prior to systemic absorption. The chassis-native approach enables sustained colonization — confirmed in Yucatan minipig non-GLP studies (YOUR COLONIZATION DATA) — which prior lab-strain LBP programs could not achieve.",
        tag: "Product",
      },
      {
        heading: "Regulatory Basis for ODD",
        body: "Section 526(a)(2) of the FD&C Act: designation is warranted where there is no reasonable expectation that sales would recover development costs without designation. Given PKU prevalence of ~16,000 U.S. patients and the niche market size, ODD is appropriate.\n\nBenefits sought: 7-year market exclusivity upon approval; 50% tax credit on clinical trial costs; FDA assistance with protocol design; waiver of PDUFA user fees for ODD application and NDA.",
        tag: "Basis",
      },
    ],
  },

  // ── REGULATORY › US › Communications FROM FDA ─────────────────────────────

  "doc-fda-interact-resp": {
    title: "FDA INTERACT Written Responses — END-101",
    meta: "CBER/OTAT · Confidential · Received from FDA",
    sections: [
      {
        heading: "Response to Q1: Species Selection",
        body: "FDA Response: The Yucatan minipig is an acceptable species for the GLP repeat-dose toxicology study for END-101, given the colonization data provided in the INTERACT briefing package. FDA agrees that pharmacological relevance is established by demonstration of sustained engraftment in this species (YOUR COLONIZATION DATA). A second species is not required at this stage provided colonization is confirmed at GLP study initiation.\n\nNote: Species justification should be explicitly documented in the GLP study protocol and IND Module 4.",
        tag: "Species — Q1",
      },
      {
        heading: "Response to Q2: Study Duration",
        body: "FDA Response: A 90-day repeat-dose study is acceptable to support a Phase 1 single-dose colonization paradigm, consistent with ICH M3(R2) guidance for products with a proposed clinical duration of less than 3 months at initial dosing. A 4-week recovery cohort is recommended to characterize reversibility of colonization following antibiotic off-switch administration. Monthly re-dosing during the GLP study to maintain colonization is an acceptable design provided it reflects the proposed clinical regimen.",
        tag: "Duration — Q2",
      },
      {
        heading: "Response to Q3: CMC Expectations",
        body: "FDA Response: For a Phase 1 IND submission for a chassis-native LBP, OTAT expects the following CMC elements beyond those listed in the 2022 LBP Draft Guidance:\n1. Demonstration of absence of known transferable antibiotic resistance determinants by whole-genome sequencing\n2. Environmental persistence data: survival of the manufacturing strain in simulated environmental matrices (water, soil) under standard conditions\n3. Documentation of the master cell bank passage history and passage range used in manufacturing\n\nOOAT does not require validated commercial-scale manufacturing for Phase 1 but expects the manufacturing process to be adequately described and under control.",
        tag: "CMC — Q3",
      },
      {
        heading: "FDA General Comments",
        body: "OTAT notes that END-101 represents a novel mechanistic class (chassis-native LBP) for which limited IND precedent exists within CBER. The agency encourages sponsors to engage early through INTERACT and Type B pre-IND meetings. The written responses above reflect current OTAT thinking and are not binding; regulatory positions may be refined as additional data become available.\n\nThe sponsor is encouraged to submit a Type B pre-IND meeting request once the GLP tox package is complete.",
        tag: "General",
      },
    ],
  },

  // ── REGULATORY › GUIDANCE ─────────────────────────────────────────────────

  "doc-ich-m3": {
    title: "ICH M3(R2) — Nonclinical Safety Studies for Human Clinical Trials",
    meta: "Guidance for Industry · ICH, 2010 · Step 4",
    sections: [
      {
        heading: "Scope",
        body: "ICH M3(R2) provides guidance on the timing and nature of nonclinical safety studies needed to support human clinical trials and marketing authorization. Applies to pharmaceuticals and biologics intended for clinical investigation. The guidance is intended to promote the timely conduct of clinical trials while maintaining adequate protection for clinical trial participants.",
        tag: "Scope",
      },
      {
        heading: "Studies Required Before Phase 1",
        body: "For single-dose or short-duration Phase 1 studies: repeat-dose tox studies of at least the duration of the clinical study are generally expected, with a minimum of 2 weeks in two mammalian species. For products where only one relevant species exists (including some biologics), single-species testing may be acceptable with justification.\n\nIn vitro genotoxicity data should generally be available before first human dosing. Reproductive toxicology is not required for Phase 1 unless the clinical population includes women of childbearing potential without contraception.",
        tag: "Phase 1",
      },
      {
        heading: "Duration Alignment",
        body: "Repeat-dose tox study duration should be at least equal to or exceed the proposed clinical duration. For a Phase 1 study with a single colonization dose and 12-month follow-up, the relevant clinical exposure duration is effectively the colonization persistence period. FDA and ICH M3(R2) both support discussion of duration alignment through pre-IND meetings where the clinical paradigm is novel.",
        tag: "Duration",
      },
      {
        heading: "Relevance to END-101",
        body: "ICH M3(R2) Table 1 establishes the 90-day repeat-dose study as sufficient to support initial Phase 1 studies of up to 3 months clinical duration. For END-101, where colonization may persist beyond 3 months, the INTERACT meeting confirmed FDA's agreement that a 90-day GLP study with recovery cohort adequately supports a Phase 1 single-dose colonization paradigm. Longer-term clinical data will inform post-Phase 1 nonclinical requirements.",
        tag: "END-101",
      },
    ],
  },

  "doc-fda-cgmp": {
    title: "FDA Guidance — cGMP for Phase 1 Investigational Drugs",
    meta: "Guidance for Industry · FDA, 2008",
    sections: [
      {
        heading: "Scope & Rationale",
        body: "This guidance describes FDA's current thinking on the application of current good manufacturing practice (cGMP) regulations to the manufacture of Phase 1 investigational drugs, including biologics. FDA recognizes that Phase 1 manufacturing may occur at small scale and with less process characterization than commercial manufacturing — the guidance establishes a risk-based, flexible approach appropriate to the stage of development.",
        tag: "Scope",
      },
      {
        heading: "Key Phase 1 cGMP Requirements",
        body: "1. Facilities: manufacturing in a controlled environment appropriate for the product type\n2. Personnel: qualified personnel with adequate training documentation\n3. Equipment: calibrated, qualified equipment with maintenance records\n4. Process: documented manufacturing process with batch records\n5. Testing: release testing for identity, purity, potency, and safety\n6. Records: full traceability from raw materials to released product\n\nFor live organisms (LBPs), additional containment and biosafety controls apply per applicable biosafety guidelines.",
        tag: "Requirements",
      },
      {
        heading: "Release Testing Expectations",
        body: "At minimum, Phase 1 LBP release testing should include:\n– Identity (16S rRNA sequencing or equivalent)\n– Purity (absence of contaminants)\n– Potency (viable count — CFU/dose)\n– Safety (sterility of drug product; absence of adventitious agents)\n– Appearance and physical characterization\n\nFor END-101, PAL functional activity is included as a surrogate potency measure reflecting the therapeutic mechanism.",
        tag: "Release Testing",
      },
      {
        heading: "Relevance to END-101",
        body: "END-101 Phase 1 manufacturing is designed to comply with this guidance at a 50L bioreactor scale. The manufacturing process description and batch records are prepared in accordance with the FDA 2008 Phase 1 cGMP Guidance. Full commercial-scale validation is not required for Phase 1 and will be addressed in later CMC development stages.",
        tag: "END-101",
      },
    ],
  },

  // ── CMC ───────────────────────────────────────────────────────────────────

  "doc-mcb": {
    title: "Strain Characterization — Master Cell Bank",
    meta: "Study ID: END-CMC-001 · GMP · END Biosciences",
    sections: [
      {
        heading: "MCB Description",
        body: "The END-101 Master Cell Bank (MCB) was established from a single clonal isolate of the chassis-native organism sourced from the original Yucatan minipig colonization study. MCB was prepared at Passage 3 from the primary isolate. Storage: 1 mL cryovials at −80°C (primary) and in liquid nitrogen vapor phase (backup). Total MCB vials: 500. Working Cell Bank (WCB) prepared from a single MCB vial at Passage 5.",
        tag: "MCB",
      },
      {
        heading: "Identity Confirmation",
        body: "Method 1 — 16S rRNA sequencing (full-length): 99.8% identity to reference genome. Species confirmed as [CHASSIS ORGANISM — CONFIDENTIAL].\n\nMethod 2 — Biochemical profiling (MALDI-TOF mass spectrometry): Score 2.21 (confident species identification, threshold 2.0).\n\nGenetic modification confirmed by PCR amplification of PAL expression cassette (expected band: 2.3 kb; observed: 2.3 kb) and Sanger sequencing across insertion site (100% concordance with design sequence).",
        tag: "Identity",
      },
      {
        heading: "Purity & Adventitious Agents",
        body: "Purity: Single colony morphology on selective and non-selective media. Gram stain: consistent with expected phenotype. No contaminating organisms detected by aerobic, anaerobic, and fungal culture over 14 days.\n\nAdventitious agents: tested negative for mycoplasma (PCR and culture), bacteriophage (plaque assay), and endotoxin (<1 EU/mL in 1:10 dilution of MCB lysate).",
        tag: "Purity",
      },
      {
        heading: "Stability",
        body: "MCB stability: tested at 6 and 12 months post-banking. Viability at 12 months: 94% (flow cytometry, propidium iodide exclusion). CFU recovery: 2.1×10¹⁰ CFU/mL (within ±15% of initial MCB titer). Identity and genetic stability confirmed at 12-month timepoint by 16S and PAL cassette sequencing. MCB is considered stable for the duration of Phase 1 development.",
        tag: "Stability",
      },
    ],
  },

  "doc-ngs": {
    title: "Genetic Stability NGS Report",
    meta: "Study ID: END-CMC-002 · END Biosciences",
    sections: [
      {
        heading: "Study Objective",
        body: "To demonstrate retention and sequence integrity of the PAL expression cassette across the manufacturing passage range (Passage 3–10) using next-generation whole-genome sequencing (WGS). The study evaluates genetic stability at the passage level expected to bracket Phase 1 manufacturing.",
        tag: "Objective",
      },
      {
        heading: "Methods",
        body: "Sequencing platform: Illumina NovaSeq 6000, paired-end 150 bp reads.\nCoverage: ≥100× mean depth across the full genome; ≥500× across PAL expression cassette.\nPassages tested: P3 (MCB), P5 (WCB), P7, P9, P10 (end of manufacturing range).\nVariant calling: GATK HaplotypeCaller; variants called at ≥5% allele frequency with ≥20× supporting reads.",
        tag: "Methods",
      },
      {
        heading: "PAL Cassette Integrity",
        body: "PAL expression cassette sequence at all passages: 100% concordance with reference design sequence. No insertions, deletions, or non-synonymous variants detected within the PAL open reading frame, promoter, or terminator regions across all passages tested. Insert copy number: 1.0 ± 0.1 copies/genome at all passages (no duplication or loss events).",
        tag: "Cassette Results",
      },
      {
        heading: "Chromosomal Background",
        body: "Total SNV count (Passage 10 vs. Passage 3): 3 variants detected in non-coding intergenic regions. No variants in annotated virulence factors, known antibiotic resistance determinants, or metabolic pathway genes. No structural variants (inversions, translocations, large deletions) detected. The chromosomal background is considered stable across the manufacturing passage range.",
        tag: "Genomic Background",
      },
      {
        heading: "Conclusion",
        body: "The END-101 PAL expression cassette is genetically stable across Passages 3–10. Chromosomal background mutations are limited to non-coding regions and are considered non-consequential for product safety or activity. These data support use of WCB-derived manufacturing material through Passage 10 for Phase 1 clinical supply.",
        tag: "Conclusion",
      },
    ],
  },

  "doc-potency": {
    title: "Potency Assay — CFU & Viability Data",
    meta: "Study ID: END-CMC-003 · Method Qualification · END Biosciences",
    sections: [
      {
        heading: "Assay Overview",
        body: "Three-component potency package for END-101 drug product:\n1. Viable count (CFU/dose) — primary potency measure\n2. Membrane viability (flow cytometry, propidium iodide) — orthogonal viability\n3. PAL functional activity (trans-cinnamic acid production, HPLC) — mechanism-based surrogate\n\nAll three measures are included in Phase 1 drug product release specifications.",
        tag: "Overview",
      },
      {
        heading: "CFU Results (Drug Product)",
        body: "Lots tested: 3 engineering lots (END-DP-ENG-001, -002, -003) + 1 Phase 1 GMP lot (END-DP-GMP-001).\n\nCFU results (capsule, post-lyophilization):\n– ENG-001: 2.4×10⁹ CFU/capsule\n– ENG-002: 2.2×10⁹ CFU/capsule\n– ENG-003: 2.6×10⁹ CFU/capsule\n– GMP-001: 2.3×10⁹ CFU/capsule\n\nRelease specification: ≥1×10⁹ CFU/capsule. All lots pass.",
        tag: "CFU",
      },
      {
        heading: "Viability (Flow Cytometry)",
        body: "Viability measured by propidium iodide exclusion in a single-cell suspension prepared from reconstituted capsule contents.\n\nResults: 87–92% viable cells across all lots tested. Release specification: ≥80% viable. All lots pass.\n\nCorrelation between CFU and flow viability: R² = 0.94 across the 4 lots, supporting interchangeability for process monitoring.",
        tag: "Viability",
      },
      {
        heading: "PAL Functional Activity",
        body: "Assay: Reconstituted capsule contents incubated with L-phenylalanine substrate (10 mM) at 37°C for 4 hours. Trans-cinnamic acid (TCA) product quantified by reverse-phase HPLC.\n\nResults (expressed as % of reference standard activity):\n– ENG-001: 97%\n– ENG-002: 94%\n– ENG-003: 101%\n– GMP-001: 96%\n\nRelease specification: ≥90% of reference standard. All lots pass.",
        tag: "PAL Activity",
      },
    ],
  },

  "doc-abx": {
    title: "Antibiotic Susceptibility Panel",
    meta: "Study ID: END-CMC-004 · END Biosciences",
    sections: [
      {
        heading: "Panel Rationale",
        body: "The 2022 FDA LBP Draft Guidance requires characterization of antibiotic susceptibility for LBPs to ensure the off-switch (clearance of colonized product) is achievable with standard clinical antibiotics. The panel below was selected to cover agents recommended in the guidance and to confirm absence of transferable antibiotic resistance determinants.",
        tag: "Rationale",
      },
      {
        heading: "MIC Results",
        body: "Results (broth microdilution, CLSI M7 methodology, n=3 independent replicates):\n\nAmoxicillin: MIC = 0.25 µg/mL (sensitive)\nAmoxicillin-clavulanate: MIC = 0.25/0.125 µg/mL (sensitive)\nAmpicillin: MIC = 0.5 µg/mL (sensitive)\nCiprofloxacin: MIC = 0.06 µg/mL (sensitive)\nMetronidazole: MIC = 0.5 µg/mL (sensitive)\nVancomycin: MIC = 1 µg/mL (sensitive)\nTetracycline: MIC = 0.5 µg/mL (sensitive)\nChloramphenicol: MIC = 2 µg/mL (sensitive)\n\nAll agents: within epidemiological cut-off values (ECOFF) for the species. No resistance phenotypes detected.",
        tag: "MIC",
      },
      {
        heading: "Resistance Determinant Screening",
        body: "Whole-genome sequencing (END-CMC-002 NGS report) was interrogated against the CARD (Comprehensive Antibiotic Resistance Database) and ResFinder databases for known transferable resistance determinants.\n\nResult: No acquired resistance genes, integrons, or mobile genetic elements associated with antibiotic resistance detected. No plasmid-borne resistance determinants identified. The organism carries only intrinsic chromosomal resistance features consistent with the wild-type background.",
        tag: "Resistance Genes",
      },
      {
        heading: "Off-Switch Clinical Recommendation",
        body: "Based on the susceptibility profile, amoxicillin 500 mg orally × 5 days is the proposed clinical off-switch procedure, consistent with the non-GLP in vivo data showing ≥3-log fecal count reduction by Day 3 at 50 mg/kg in Yucatan minipig. This regimen will be validated in the GLP tox study.",
        tag: "Off-Switch",
      },
    ],
  },

  "doc-mfg": {
    title: "Manufacturing Process Description",
    meta: "Drug Substance & Drug Product · Phase 1 cGMP · END Biosciences",
    sections: [
      {
        heading: "Drug Substance Process",
        body: "Starting material: Working Cell Bank vial (Passage 5, derived from MCB Passage 3).\nExpansion: Sequential shake-flask expansion (10 mL → 100 mL → 1 L) in proprietary media formulation under anaerobic conditions at 37°C.\nProduction bioreactor: 50 L stirred-tank bioreactor, batch mode, 18–22 hours fermentation to target OD₆₀₀ = 8–12.\nHarvest: Continuous centrifugation, 8,000×g, 4°C.\nWash: 2× wash with cryoprotectant buffer.\nDrug substance: bulk paste, stored at −80°C until processing.",
        tag: "Drug Substance",
      },
      {
        heading: "Drug Product Process",
        body: "Formulation: Drug substance paste resuspended in lyoprotectant formulation (proprietary composition, sucrose-based) to target CFU concentration.\nFill: Automated dispensing into size 0 HPMC capsules, nitrogen-blanketed filling line.\nLyophilization: 72-hour lyophilization cycle (custom cycle, primary drying −40°C; secondary drying +25°C).\nEnteric coating: applied post-lyophilization to protect product from gastric acid.\nPackaging: nitrogen-flushed foil blister packs, stored at 2–8°C.",
        tag: "Drug Product",
      },
      {
        heading: "Process Controls",
        body: "In-process controls:\n– Bioreactor: pH (6.8–7.2), dissolved oxygen (<5%), temperature (37 ± 0.5°C), OD₆₀₀ at harvest\n– Drug product fill: capsule weight (±5% of target), capsule appearance\n– Lyophilization: residual moisture by Karl Fischer (<3% w/w)\n\nCritical quality attributes (CQAs): CFU/capsule, viability, PAL activity, identity, appearance, moisture content.",
        tag: "Controls",
      },
      {
        heading: "Phase 1 Manufacturing Scale",
        body: "Phase 1 clinical supply: single 50 L bioreactor batch = approximately 10,000 capsule doses. Sufficient for Phase 1 dosing (n=18 subjects × 3 dose administrations × 3 dose levels = 162 doses, with 100% overage for testing and contingency).\n\nScale-up to commercial manufacturing is not addressed at this stage and will be subject to separate CMC development activities prior to Phase 2.",
        tag: "Scale",
      },
    ],
  },

  // ── TOXICOLOGY ────────────────────────────────────────────────────────────

  "doc-biodist": {
    title: "Biodistribution & Shedding Study",
    meta: "Study ID: END-TOX-002 · Non-GLP · END Biosciences",
    sections: [
      {
        heading: "Study Design",
        body: "Species: Yucatan minipig (n=12; 3/group × 4 cohorts: vehicle, 1×, 3×, 10× dose).\nDuration: 12 weeks dosing + 4 weeks post-treatment observation.\nSampling: Tissue collection at Weeks 4, 12, and 16 (necropsy). Tissues: GI tract (duodenum, jejunum, ileum, cecum, colon, rectum), liver, spleen, mesenteric lymph nodes, blood, lung.\nEnvironmental: Weekly fecal swab samples from cage bedding and surrounding environment.",
        tag: "Design",
      },
      {
        heading: "Biodistribution Results",
        body: "GI colonization: Chassis-native organism detected at all GI tract sites (cecum and colon highest abundance: ~4–6% fecal relative abundance, consistent with YOUR COLONIZATION DATA).\n\nExtraintestinal dissemination: Organism NOT detected in liver, spleen, lung, or blood at any timepoint in any group. Mesenteric lymph nodes: PCR-positive in 1/9 animals at Week 4 in the 10× cohort only; negative at Week 12 in the same animal. No colony formation on LN tissue culture. Interpretation: transient mucosal sampling event, not systemic dissemination.",
        tag: "Biodistribution",
      },
      {
        heading: "Environmental Shedding",
        body: "Fecal shedding of viable organism: confirmed in all active dose cohorts, consistent with expected colonization. Cage environmental swabs (bedding, surfaces): positive in 6/9 animals at Week 4; 3/9 at Week 12.\n\nPost-treatment (Week 12–16): Following amoxicillin off-switch (Day 84, 5-day course), environmental swabs became negative in all animals by Week 16. No evidence of persistence in the cage environment after antibiotic clearance.",
        tag: "Environmental",
      },
      {
        heading: "Environmental Survival (Simulated Matrices)",
        body: "Per FDA INTERACT written response requirements, viability in environmental matrices was assessed:\n– Tap water (25°C, aerobic): <0.1% viability at 48 hours\n– Soil (25°C, aerobic): <1% viability at 72 hours\n– Simulated sewage (37°C): <0.01% viability at 24 hours\n\nThe organism does not survive in environmental matrices under aerobic conditions, consistent with its anaerobic physiology. Environmental persistence risk is low.",
        tag: "Environmental Survival",
      },
      {
        heading: "Conclusion",
        body: "END-101 colonizes the GI tract without systemic dissemination. Environmental shedding is cleared following antibiotic off-switch. Environmental persistence is negligible. These data support the Environmental Assessment conclusion that END-101 poses low ecological risk.",
        tag: "Conclusion",
      },
    ],
  },

  "doc-glp-tox": {
    title: "GLP Tox Protocol — END-101 (Draft)",
    meta: "Study ID: END-TOX-003-GLP · Draft · Species Pending INTERACT",
    sections: [
      {
        heading: "Study Objective",
        body: "To evaluate the toxicological profile of END-101 following repeat oral administration in [SPECIES — TO BE CONFIRMED PER INTERACT WRITTEN RESPONSES] over 90 days, with a 4-week recovery period. The study will provide the primary nonclinical safety dataset supporting Phase 1 IND submission.",
        tag: "Objective",
      },
      {
        heading: "Study Design",
        body: "GLP status: Full GLP (21 CFR Part 58).\nSpecies/strain: [TO BE CONFIRMED — Yucatan minipig proposed; pending INTERACT species alignment]\nGroup allocation: 4 groups (vehicle, low, mid, high dose) × n=8/sex/group + 4/sex/group recovery cohort at high dose. Total: ~80 animals.\nDosing: Oral capsule, once monthly × 3 doses (Months 0, 1, 2) to maintain colonization during study. Amoxicillin off-switch administered to recovery cohort at Day 90.\nStudy duration: 90-day treatment + 28-day recovery.",
        tag: "Design",
      },
      {
        heading: "Endpoints",
        body: "Primary safety endpoints:\n– Mortality and clinical observations (daily)\n– Body weight and food consumption (weekly)\n– Ophthalmology (pre-study, Week 13)\n– Clinical pathology (hematology, serum chemistry, urinalysis): Days 1, 30, 60, 91, 119\n– Organ weights and macroscopic pathology (necropsy)\n– Histopathology: full panel per ICH S6(R1) + expanded GI tract assessment\n\nColonization endpoints:\n– Fecal relative abundance (16S) at Weeks 1, 4, 8, 13, and recovery Week 2, 4\n– Blood culture (systemic dissemination): Days 3, 30, 60, 91\n\nEnvironmental: Cage environmental swabs (weekly during dosing; biweekly post-off-switch)",
        tag: "Endpoints",
      },
      {
        heading: "Dose Selection Rationale",
        body: "Doses to be set as multiples of the proposed Phase 1 human dose on a CFU/kg basis:\n– Low: 1× human dose equivalent\n– Mid: 5× human dose equivalent\n– High: 20× human dose equivalent\n\nFinal dose levels to be confirmed following Phase 1 dose selection and INTERACT meeting alignment. The 20× multiples is consistent with standard nonclinical safety margins for Phase 1 first-in-human studies.",
        tag: "Doses",
      },
      {
        heading: "Open Items",
        body: "1. Species confirmation — awaiting INTERACT written responses (REQUEST SUBMITTED)\n2. Dose levels — pending Phase 1 clinical dose selection\n3. CRO selection — RFP issued to 3 contract research organizations with LBP/large animal experience\n4. Protocol finalization and IACUC approval — target Q2 2026\n5. Study initiation — target Q3 2026 contingent on species and dose confirmation",
        tag: "Open Items",
      },
    ],
  },

  "doc-nonclin-gap": {
    title: "Nonclinical Gap Assessment",
    meta: "Internal Working Document · END Biosciences · Updated Q2 2026",
    sections: [
      {
        heading: "Completed Studies",
        body: "✓ Non-GLP in vivo dose-response (END-NGL-001): colonization, off-switch, 12-week safety observations — COMPLETE\n✓ In vitro PAL activity characterization — COMPLETE\n✓ Biodistribution & shedding study (END-TOX-002): tissue distribution, environmental shedding, environmental survival — COMPLETE\n✓ Antibiotic susceptibility panel (END-CMC-004) — COMPLETE\n✓ Genetic stability NGS (END-CMC-002) — COMPLETE",
        tag: "Done",
      },
      {
        heading: "In Progress",
        body: "→ GLP 90-day repeat-dose tox (END-TOX-003-GLP): Protocol drafted; species pending INTERACT written responses. CRO RFP issued. Target study start: Q3 2026.\n\n→ Environmental Assessment: ongoing parallel study (Q1–Q4 2026). Environmental matrix survival data complete; formal EA document in preparation for IND submission.",
        tag: "In Progress",
      },
      {
        heading: "Gaps — Required Before IND",
        body: "□ GLP 90-day tox study REPORT (final, signed) — required in IND Module 4\n□ Environmental Assessment (final document) — required in IND Module 1\n□ In vitro genotoxicity (Ames test, in vitro micronucleus) — required per ICH M3(R2) before Phase 1 first-in-human. Not yet initiated. PRIORITY: initiate Q2 2026 alongside GLP tox.\n□ Phase 1 GMP drug product lot release testing — required before IND submission",
        tag: "Gaps",
      },
      {
        heading: "Not Required at IND Stage",
        body: "✗ Reproductive/developmental toxicology — not required before Phase 1 per ICH M3(R2) if clinical population excludes WOCBP without contraception (confirmed in draft Phase 1 protocol)\n✗ Carcinogenicity — not required for Phase 1\n✗ Investigator Brochure — clinical-stage document, not pre-IND\n✗ DSUR — required once program enters the clinic for ≥1 year",
        tag: "Not Required",
      },
      {
        heading: "IND Readiness Assessment",
        body: "Current assessment: NOT YET READY FOR IND SUBMISSION.\n\nBlockers: GLP tox report (in progress), genotoxicity studies (not yet initiated), EA final document (in progress).\n\nProjected IND-ready date: Q4 2026, contingent on GLP tox study initiation Q3 2026 and 90-day study duration.",
        tag: "Readiness",
      },
    ],
  },

  // ── CLINICAL ─────────────────────────────────────────────────────────────

  "doc-clinical-proto": {
    title: "Clinical Protocol Outline — END-101 Phase 1",
    meta: "Draft Outline · Pre-IND · END Biosciences",
    sections: [
      {
        heading: "Study Overview",
        body: "Title: A Phase 1, Open-Label, Dose-Escalation Study to Evaluate the Safety, Tolerability, and Colonization of END-101 in Adult Patients with Classic Phenylketonuria (PKU)\n\nPhase: 1 (first-in-human)\nDesign: Open-label, sequential dose-escalation\nSites: Single-site (metabolic disease center; site to be selected)\nStatus: OUTLINE ONLY — no clinical data exists. Protocol to be finalized following Type B pre-IND meeting alignment with FDA.",
        tag: "Overview",
      },
      {
        heading: "Eligibility (Proposed)",
        body: "Inclusion:\n– Adults ≥18 years with confirmed classic PKU (PAH genotype or PAH activity <1%)\n– Sustained hyperphenylalaninemia: blood Phe >360 µmol/L on two measurements within 6 months prior to enrollment, despite dietary management\n– Willing and able to comply with study procedures and 12-month follow-up\n\nExclusion:\n– Antibiotic use within 4 weeks prior to dosing\n– Immunocompromised (HIV, active immunosuppression, organ transplant)\n– Pregnancy or breastfeeding\n– Prior LBP therapy\n– Clinically significant GI disorder (Crohn's, active IBD, recent GI surgery)",
        tag: "Eligibility",
      },
      {
        heading: "Dose Levels & Escalation",
        body: "Cohort 1 (Low): n=6, 1× dose (proposed: 1×10⁹ CFU oral capsule)\nCohort 2 (Mid): n=6, 5× dose (proposed: 5×10⁹ CFU oral capsule)\nCohort 3 (High): n=6, 20× dose (proposed: 2×10¹⁰ CFU oral capsule)\n\nEscalation: Sequential. Minimum 28-day observation window between last subject in Cohort N and first subject in Cohort N+1. Escalation decision based on review of safety data by independent Safety Review Committee (SRC).\n\nDosing: Single oral dose (colonization event). Optional monthly maintenance dose at Month 1 and Month 2 for subjects in whom colonization is not confirmed at Month 1.",
        tag: "Dosing",
      },
      {
        heading: "Primary & Secondary Endpoints",
        body: "Primary: Incidence and severity of adverse events (AEs) and serious adverse events (SAEs) through Month 12.\n\nSecondary:\n– Colonization: fecal relative abundance of END-101 at Months 1, 3, 6, 12 (16S sequencing)\n– Blood Phe reduction from baseline at Months 3, 6, 12\n– PAL activity in stool (functional activity proxy)\n– Off-switch evaluation: subset of subjects (n=6, Cohort 3 only) will receive amoxicillin at Month 12; post-antibiotic colonization confirmed cleared by Month 13",
        tag: "Endpoints",
      },
      {
        heading: "Open Items — To Resolve at Type B Pre-IND Meeting",
        body: "□ Dose levels: require FDA alignment on proposed CFU dose range before protocol finalization\n□ Stopping rules: SRC criteria for dose escalation hold or study termination\n□ Off-switch timing: FDA to advise on mandatory vs. elective off-switch at end of study\n□ Colonization monitoring frequency: FDA expectation for post-Phase 1 follow-up duration\n□ CMC readiness: Phase 1 GMP lot must be released before IND submission",
        tag: "Open Items",
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
