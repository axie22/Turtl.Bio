"use client";

import { useState } from "react";
import { Section } from "@/components/marketing/primitives";

const RA_OPTIONS = [
  { value: "no-ra", label: "No dedicated RA hire yet" },
  { value: "building", label: "Building that function now" },
  { value: "other", label: "Something else" },
] as const;

const MAILTO_BASE = "mailto:anthony@turtltechnologies.net";

function buildMailto(selection: string) {
  if (!selection) return MAILTO_BASE;
  const label = RA_OPTIONS.find((o) => o.value === selection)?.label ?? selection;
  return `${MAILTO_BASE}?subject=${encodeURIComponent(
    `Alpha access request — ${label}`
  )}`;
}

function trackVote(variant: string, selection: string) {
  if (!selection) return;
  fetch("/api/track-vote", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ variant, selection }),
  }).catch(() => {});
}

/** Variant B — Consequence. Single CTA, no secondary button. */
export function HeroB() {
  const [raSelection, setRaSelection] = useState("");

  return (
    <Section
      number="01"
      label="Index"
      className="pt-20 md:pt-28 pb-16 md:pb-24"
    >
      <div className="max-w-[900px]">
        <h1 className="text-[44px] leading-[1.04] md:text-[72px] md:leading-[0.98] tracking-[-0.02em] font-normal">
          Every grey zone question you can&rsquo;t answer yourself ends up on a
          consultant&rsquo;s invoice.
        </h1>
        <p className="mt-8 max-w-[620px] text-[17px] leading-relaxed text-zinc-600">
          Turtl maps applicable FDA guidance and precedent to your specific
          product &mdash; so you&rsquo;re not choosing between a guess and a
          $400/hr call.
        </p>

        <div className="mt-10">
          <a
            href={buildMailto(raSelection)}
            className="inline-flex items-center gap-2 bg-zinc-950 text-white px-5 py-3 text-sm font-medium hover:bg-[#0f8f77] transition-colors"
          >
            Request alpha access
            <span aria-hidden className="font-mono text-xs">
              &rarr;
            </span>
          </a>
        </div>

        {/* Qualifying question */}
        <div className="mt-8 max-w-[480px]">
          <label
            htmlFor="ra-qualifier-b"
            className="block font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400 mb-2"
          >
            Where is your team on regulatory?
          </label>
          <div className="relative">
            <select
              id="ra-qualifier-b"
              value={raSelection}
              onChange={(e) => {
                setRaSelection(e.target.value);
                trackVote("b", e.target.value);
              }}
              className="w-full appearance-none border border-zinc-300 bg-white text-zinc-950 px-4 py-3 pr-10 text-[14px] cursor-pointer hover:border-zinc-950 transition-colors focus:outline-none focus:border-zinc-950"
            >
              <option value="">—</option>
              {RA_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <span
              aria-hidden
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-zinc-400"
            >
              ▾
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}
