import Link from "next/link";
import { ReasoningChain } from "@/components/marketing/ReasoningChain";
import {
  Section,
  SectionHeader,
} from "@/components/marketing/primitives";

/**
 * Sections 02–08 — identical across all landing page variants.
 * This is a server component; do not add client-side logic here.
 */
export function SharedContent() {
  return (
    <>
      {/* 02 — THE PROBLEM AS CASE STUDY */}
      <Section
        number="02"
        label="Case Study"
        className="py-20 md:py-28 border-t border-zinc-200"
      >
        <SectionHeader
          eyebrow="The problem, concretely"
          title="A prostate cancer drug. Do we need female-animal tox studies?"
          description="The answer lives in conditional FDA language and scattered precedent, not in a spreadsheet or a generic model."
        />

        <div className="mt-12 grid md:grid-cols-2 gap-0 border border-zinc-200">
          <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-zinc-200">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400">
                Without Turtl.Bio
              </span>
              <span className="h-px flex-1 bg-zinc-200" />
            </div>
            <ol className="space-y-5 text-[15px] leading-relaxed text-zinc-700">
              <li className="flex gap-4">
                <span className="font-mono text-[11px] text-zinc-400 pt-1 w-8 shrink-0">
                  D+0
                </span>
                <span>
                  RA lead hits conditional FDA language in ICH S6(R1). No clear
                  answer.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="font-mono text-[11px] text-zinc-400 pt-1 w-8 shrink-0">
                  D+2
                </span>
                <span>
                  Digs through PDFs. Finds a competitor label but can&rsquo;t
                  access the full review document.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="font-mono text-[11px] text-zinc-400 pt-1 w-8 shrink-0">
                  D+4
                </span>
                <span>
                  Calls a consultant at{" "}
                  <span className="text-zinc-950">$300&ndash;500/hr</span>. Gets
                  &ldquo;here are the considerations,&rdquo; not a direct
                  answer.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="font-mono text-[11px] text-zinc-400 pt-1 w-8 shrink-0">
                  D+7
                </span>
                <span className="text-zinc-950">
                  Decision delayed. Study planning stalls. Timeline slips.
                </span>
              </li>
            </ol>
          </div>

          <div className="p-8 md:p-10 bg-[#fafafa]">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#0f8f77]">
                With Turtl.Bio
              </span>
              <span className="h-px flex-1 bg-[#0f8f77]/20" />
            </div>
            <p className="text-[15px] leading-relaxed text-zinc-950">
              Auditable interpretation. Sourced reasoning chain attached.
              Bring it to pre-IND.
            </p>
          </div>
        </div>
      </Section>

      {/* 03 — PULLQUOTE */}
      <Section className="py-24 md:py-32 border-t border-zinc-200">
        <figure className="max-w-4xl">
          <blockquote className="font-serif text-[36px] md:text-[56px] leading-[1.08] tracking-[-0.01em] text-zinc-950">
            &ldquo;90% of what&rsquo;s done is grey zone.&rdquo;
          </blockquote>
          <figcaption className="mt-8 pt-6 border-t border-zinc-200 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
            SVP Regulatory Affairs
            <span className="mx-2 text-zinc-300">/</span>
            30+ years, BMS, MacroGenics
          </figcaption>
        </figure>
      </Section>

      {/* 05 — NOT GENERIC AI */}
      <Section
        number="05"
        label="Delta"
        className="py-20 md:py-28 border-t border-zinc-200"
      >
        <p className="text-[22px] md:text-[28px] leading-relaxed text-zinc-950 max-w-[640px]">
          A generic model will always give you an answer. It won&rsquo;t tell
          you when it&rsquo;s guessing.
        </p>
      </Section>

      {/* 06 — WHERE WE SIT */}
      <Section
        number="06"
        label="Positioning"
        className="py-20 md:py-28 border-t border-zinc-200"
      >
        <SectionHeader
          eyebrow="Where we sit"
          title="Too frequent for a consultant. Too consequential for a general model."
        />

        <div className="mt-14">
          <div className="relative h-24 border-y border-zinc-200">
            <div className="absolute inset-y-0 left-0 right-0 flex">
              <div className="flex-1 border-r border-dashed border-zinc-200" />
              <div className="flex-1 border-r border-dashed border-zinc-200" />
              <div className="flex-1" />
            </div>
            <div className="absolute inset-y-0 left-[46%] right-[46%] bg-[#0f8f77]/10 border-x border-[#0f8f77]/40 flex items-center justify-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#0f8f77]">
                Turtl.Bio
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 mt-4">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                Consultants
              </div>
            </div>
            <div className="text-center">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#0f8f77]">
                Turtl.Bio
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                Generic AI
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 07 — WHO THIS IS FOR */}
      <Section
        number="07"
        label="Customer"
        className="py-20 md:py-28 border-t border-zinc-200"
      >
        <SectionHeader
          eyebrow="Who this is for"
          title="Founder-scientist or sole RA/CMC lead at a first-IND US biotech."
          description="The person who is simultaneously the scientist, the strategist, and the regulatory lead, patching the gap with Google searches, scattered PDFs, and expensive consultant calls."
        />

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-200 border border-zinc-200">
          {[
            ["Company size", "< 50 people"],
            ["Stage", "Pre-IND through first filing"],
            ["Regulatory staff", "0–1 dedicated hire"],
            ["Budget today", "$300–500/hr consultants"],
          ].map(([label, value]) => (
            <div key={label} className="bg-white p-6 md:p-7">
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400 mb-3">
                {label}
              </div>
              <div className="text-[16px] text-zinc-950 leading-snug">
                {value}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 08 — CTA */}
      <Section
        number="08"
        label="Alpha"
        className="py-24 md:py-32 border-t border-zinc-200"
      >
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8">
            <h2 className="text-[40px] md:text-[64px] leading-[1.02] tracking-[-0.02em] font-normal">
              Working on your first IND?{" "}
              <span className="text-[#0f8f77]">Talk to us.</span>
            </h2>
          </div>
          <div className="md:col-span-4">
            <p className="text-[15px] leading-relaxed text-zinc-600 mb-6">
              We have a learning agenda, not a growth agenda. Honest product
              feedback is more useful than a sales pitch.
            </p>
            <Link
              href="mailto:anthony@turtltechnologies.net"
              className="inline-flex items-center gap-2 bg-zinc-950 text-white px-6 py-4 text-sm font-medium hover:bg-[#0f8f77] transition-colors"
            >
              Request alpha access
              <span aria-hidden className="font-mono text-xs">
                &rarr;
              </span>
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
