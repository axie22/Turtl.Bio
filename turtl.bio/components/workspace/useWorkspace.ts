"use client";

import { useState, useCallback } from "react";

export type WorkspacePhase = "idle" | "analyzing" | "complete";

export interface EvidenceCardData {
  id: string;
  source: string;
  quote: string;
  summary: string;
}

export interface PrecedentCase {
  id: string;
  name: string;
  company: string;
  indication: string;
  statusLabel: string;
  summary: string;
  fdaResponse: string;
}

export const EVIDENCE_CARDS: EvidenceCardData[] = [
  {
    id: "ich-s6r1",
    source: "ICH S6(R1)",
    quote: `"Safety studies should generally be conducted in both sexes. However, if a product is intended for use in only one gender, single-sex studies may be appropriate."`,
    summary:
      "Supports male-only tox studies when the indication is sex-restricted. Biological justification must be documented.",
  },
  {
    id: "ich-s9",
    source: "ICH S9",
    quote: `"Reproductive toxicology studies are generally not required prior to Phase I trials in cancer patients. Requirements should reflect the intended patient population."`,
    summary:
      "Reproductive tox flexibility applies for oncology. Male-only populations reduce female animal study requirements.",
  },
  {
    id: "fda-guidance",
    source: "FDA Guidance",
    quote: `"The need for studies in both sexes should be considered based on the proposed clinical indication and target population."`,
    summary:
      "Indication-specific population drives sex selection. Male-only indications have established precedent for single-sex packages.",
  },
];

export const PRECEDENT_CASES: PrecedentCase[] = [
  {
    id: "pluvicto",
    name: "Pluvicto",
    company: "Novartis",
    indication: "mCRPC",
    statusLabel: "FDA APPROVED",
    summary: "Male-only studies accepted",
    fdaResponse: `"Accepted protocol based on male-specific indication."`,
  },
  {
    id: "xtandi",
    name: "Xtandi",
    company: "Astellas",
    indication: "CRPC",
    statusLabel: "VALIDATED",
    summary: "Single-sex tox",
    fdaResponse: `"Validated male-only study design for prostate oncology indications."`,
  },
];

export function useWorkspace() {
  const [phase, setPhase] = useState<WorkspacePhase>("idle");
  const [indication, setIndication] = useState("Prostate Cancer (mCRPC)");
  const [modality, setModality] = useState(
    "Radioligand Therapy (PSMA-targeted)"
  );
  const [query, setQuery] = useState(
    "Our indication is male-only. Do we need tox studies in female animals?"
  );
  const [visibleCards, setVisibleCards] = useState(0);
  const [activeNavTab, setActiveNavTab] = useState("explorer");

  const submitQuery = useCallback(() => {
    setPhase("analyzing");
    setVisibleCards(0);

    EVIDENCE_CARDS.forEach((_, i) => {
      setTimeout(() => {
        setVisibleCards(i + 1);
      }, (i + 1) * 1500);
    });

    setTimeout(() => {
      setPhase("complete");
    }, (EVIDENCE_CARDS.length + 1) * 1500);
  }, []);

  const resetWorkspace = useCallback(() => {
    setPhase("idle");
    setVisibleCards(0);
    setActiveNavTab("explorer");
  }, []);

  return {
    phase,
    indication,
    setIndication,
    modality,
    setModality,
    query,
    setQuery,
    visibleCards,
    activeNavTab,
    setActiveNavTab,
    submitQuery,
    resetWorkspace,
  };
}
