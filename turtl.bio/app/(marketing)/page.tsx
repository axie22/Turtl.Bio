import Link from "next/link";
import { ReasoningChain } from "@/components/marketing/ReasoningChain";
import {
  Section,
  SectionHeader,
  MetaStrip,
  Cite,
} from "@/components/marketing/primitives";

export default function LandingPage() {
  return (
    <div>
      {/* 01 — HERO */}
      <Section number="01" label="Index" className="pt-20 md:pt-28 pb-16 md:pb-24">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-7">
            <h1 className="text-[44px] leading-[1.04] md:text-[72px] md:leading-[0.98] tracking-[-0.02em] font-normal">
              The reasoning layer{" "}
              <span className="font-serif italic text-[#0f8f77]">pre-IND</span>{" "}
              biotech teams{" "}
              <span className="font-serif italic">can&rsquo;t afford</span>{" "}
              to hire.
            </h1>
            <p className="mt-8 max-w-[560px] text-[17px] leading-relaxed text-zinc-600">
              A structured workspace for interpreting FDA guidance and
              precedent against a specific product profile. Sourced and
              auditable by construction &mdash; sitting between a{" "}
              <span className="text-zinc-950">$500/hr consultant</span>{" "}
              and a <span className="text-zinc-950">generic LLM</span>.
              Built for the first IND, with no dedicated regulatory hire.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/workspace"
                className="inline-flex items-center gap-2 bg-zinc-950 text-white px-5 py-3 text-sm font-medium hover:bg-[#0f8f77] transition-colors"
              >
                See the workspace
                <span aria-hidden className="font-mono text-xs">&rarr;</span>
              </Link>
              <Link
                href="mailto:hl4929@nyu.edu"
                className="inline-flex items-center gap-2 border border-zinc-300 text-zinc-950 px-5 py-3 text-sm font-medium hover:border-zinc-950 transition-colors"
              >
                Request alpha access
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 md:pl-8 md:border-l border-zinc-200">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400 mb-4">
              Positioning
            </div>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              <span className="text-zinc-950 font-medium">
                ~90% of regulatory affairs work is grey-zone interpretation.
              </span>{" "}
              Early teams lack the pattern recognition and precedent access to
              make confident applicability decisions before writing anything.
            </p>
            <Cite className="mt-4">
              Dan Mannix, SVP Regulatory Affairs, IO Biotech
              <span className="block text-zinc-400">
                30+ years &middot; BMS / MacroGenics / IO Biotech
              </span>
            </Cite>
          </div>
        </div>

        {/* Reasoning chain — the hero's anchor visual */}
        <div className="mt-16 md:mt-20">
          <MetaStrip
            items={[
              { label: "Modality", value: "small molecule" },
              { label: "Indication", value: "prostate cancer" },
              { label: "Population", value: "male only" },
              { label: "Stage", value: "pre-IND" },
            ]}
          />
          <ReasoningChain />
        </div>
      </Section>

      {/* 02 — THE PROBLEM AS CASE STUDY */}
      <Section
        number="02"
        label="Case Study"
        className="py-20 md:py-28 border-t border-zinc-200"
      >
        <SectionHeader
          eyebrow="The problem, concretely"
          title={
            <>
              A prostate cancer drug.{" "}
              <span className="font-serif italic">Do we need female-animal tox studies?</span>
            </>
          }
          description="Every IND team hits questions like this. The answer lives in conditional FDA language and scattered precedent — not the things a spreadsheet or a generic model solves."
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
                  RA lead hits conditional FDA language in ICH S6(R1). No clear answer.
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
                  Calls a consultant at <span className="text-zinc-950">$300&ndash;500/hr</span>. Gets
                  &ldquo;here are the considerations,&rdquo; not a direct answer.
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
            <ol className="space-y-5 text-[15px] leading-relaxed text-zinc-700">
              <li className="flex gap-4">
                <span className="font-mono text-[11px] text-[#0f8f77] pt-1 w-8 shrink-0">
                  00:01
                </span>
                <span>
                  Enters product profile: small-molecule, prostate cancer, male-only, pre-IND.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="font-mono text-[11px] text-[#0f8f77] pt-1 w-8 shrink-0">
                  00:03
                </span>
                <span>
                  Workspace surfaces{" "}
                  <span className="font-mono text-[13px] text-zinc-950">Pluvicto</span>{" "}
                  and{" "}
                  <span className="font-mono text-[13px] text-zinc-950">Xtandi</span>{" "}
                  as precedent with male-only tox packages.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="font-mono text-[11px] text-[#0f8f77] pt-1 w-8 shrink-0">
                  00:04
                </span>
                <span>
                  ICH S6(R1) and ICH S9 clauses surfaced with plain-English
                  applicability conditions.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="font-mono text-[11px] text-[#0f8f77] pt-1 w-8 shrink-0">
                  00:05
                </span>
                <span className="text-zinc-950">
                  Auditable interpretation. Sourced reasoning chain attached.
                  Bring it to pre-IND.
                </span>
              </li>
            </ol>
          </div>
        </div>
      </Section>

      {/* 03 — PULLQUOTE */}
      <Section className="py-24 md:py-32 border-t border-zinc-200">
        <figure className="max-w-4xl">
          <blockquote className="font-serif text-[36px] md:text-[56px] leading-[1.08] tracking-[-0.01em] text-zinc-950">
            &ldquo;90% of what&rsquo;s done is{" "}
            <span className="italic">grey zone</span>.&rdquo;
          </blockquote>
          <figcaption className="mt-8 pt-6 border-t border-zinc-200 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
            <span className="text-zinc-950">Dan Mannix</span>
            <span className="mx-2 text-zinc-300">/</span>
            SVP Regulatory Affairs, IO Biotech
            <span className="mx-2 text-zinc-300">/</span>
            30+ years, BMS / MacroGenics
          </figcaption>
        </figure>
      </Section>

      {/* 04 — REASONING ARCHITECTURE */}
      <Section
        number="04"
        label="Architecture"
        className="py-20 md:py-28 border-t border-zinc-200"
      >
        <SectionHeader
          eyebrow="How the workspace reasons"
          title={
            <>
              The structure <span className="font-serif italic">is</span>{" "}
              the product.
            </>
          }
          description="The differentiator is not proprietary data — FDA guidance, ICH guidelines, and approval packages are public. The differentiator is how that data is curated and applied."
        />

        <div className="mt-14 grid md:grid-cols-2 gap-px bg-zinc-200 border border-zinc-200">
          {[
            {
              n: "01",
              title: "Structured intake",
              body: "Before any model touches the question, the workspace captures product profile — modality, indication, patient population, development stage. This routes to the right conditional logic.",
              example: "INPUT: prostate cancer · small molecule · male-only · pre-IND",
            },
            {
              n: "02",
              title: "Curated reasoning logic",
              body: "Expert-validated decision paths for which ICH clauses are conditional, which comparators are relevant for which profiles, and what FDA has historically accepted.",
              example: "PATH: ICH S9 §3.1 → applies to oncology → males-only eligible",
            },
            {
              n: "03",
              title: "Precedent surfacing",
              body: "Comparable approved drugs, FDA review documents, and advisory committee outcomes surfaced by product-profile match — not keyword search.",
              example: "MATCH: Pluvicto, Xtandi — male-only tox accepted",
            },
            {
              n: "04",
              title: "Auditability by construction",
              body: "Sourcing is tied to the reasoning path structurally, not by asking the model to cite sources. Every step carries its citation with it.",
              example: "TRACE: clause → condition → comparator → outcome",
            },
          ].map((item) => (
            <div
              key={item.n}
              className="bg-white p-8 md:p-10 flex flex-col justify-between min-h-[260px] hover:bg-[#fafafa] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400">
                    {item.n}
                  </span>
                  <span className="h-px flex-1 mx-4 bg-zinc-200" />
                </div>
                <h3 className="text-[22px] md:text-[26px] tracking-tight font-medium text-zinc-950 mb-3">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-zinc-600">
                  {item.body}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-zinc-100 font-mono text-[11px] text-zinc-500 break-words">
                {item.example}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 05 — NOT GENERIC AI (comparison table) */}
      <Section
        number="05"
        label="Delta"
        className="py-20 md:py-28 border-t border-zinc-200"
      >
        <SectionHeader
          eyebrow="Why generic AI doesn't solve this"
          title={
            <>
              A <span className="font-serif italic">locally-run</span> model
              still doesn&rsquo;t know which ICH clauses are conditional.
            </>
          }
          description="Enterprise subscriptions and local models solve data privacy. They do not solve the knowledge problem. The moat is structured curation — not the model."
        />

        <div className="mt-12 border border-zinc-200 overflow-hidden">
          <div className="grid grid-cols-3 bg-zinc-950 text-white">
            <div className="p-4 md:p-5 font-mono text-[10px] uppercase tracking-[0.14em]">
              Dimension
            </div>
            <div className="p-4 md:p-5 font-mono text-[10px] uppercase tracking-[0.14em] border-l border-white/10">
              Generic AI
            </div>
            <div className="p-4 md:p-5 font-mono text-[10px] uppercase tracking-[0.14em] border-l border-white/10 text-[#54dcbc]">
              Turtl.Bio
            </div>
          </div>
          {[
            {
              dim: "Starting point",
              ai: "Free-text prompt from a user with no regulatory training",
              turtl: "Structured intake: modality, indication, population, question type",
            },
            {
              dim: "Knowledge applied",
              ai: "Training data — broad, unstructured, possibly stale",
              turtl: "Curated regulatory reasoning logic validated by domain experts",
            },
            {
              dim: "Precedent access",
              ai: "None — doesn't know Pluvicto had a male-only tox package",
              turtl: "Comparable approvals surfaced by profile match",
            },
            {
              dim: "Auditability",
              ai: "Model asked to cite sources — unreliable, can hallucinate",
              turtl: "Sources structurally tied to each reasoning step",
            },
            {
              dim: "Failure mode",
              ai: "Wrong answer delivered confidently — can misdirect for months",
              turtl: "Explicit gaps flagged; scope of uncertainty shown",
            },
          ].map((row, i) => (
            <div
              key={row.dim}
              className={`grid grid-cols-3 text-[14px] leading-relaxed ${
                i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"
              }`}
            >
              <div className="p-4 md:p-5 font-medium text-zinc-950 border-t border-zinc-200">
                {row.dim}
              </div>
              <div className="p-4 md:p-5 text-zinc-600 border-t border-l border-zinc-200">
                {row.ai}
              </div>
              <div className="p-4 md:p-5 text-zinc-950 border-t border-l border-zinc-200">
                {row.turtl}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 06 — WHERE WE SIT */}
      <Section
        number="06"
        label="Positioning"
        className="py-20 md:py-28 border-t border-zinc-200"
      >
        <SectionHeader
          eyebrow="Where we sit"
          title={
            <>
              Too frequent for a consultant. Too consequential for a{" "}
              <span className="font-serif italic">general model.</span>
            </>
          }
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
            <div className="pr-6">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                Consultants
              </div>
              <div className="mt-1 text-[13px] text-zinc-400 font-mono">
                $300–500/hr
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-zinc-600">
                Strategic and high-stakes. Too expensive for routine questions.
                Back away from committing to decisions.
              </p>
            </div>
            <div className="px-6 text-center">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#0f8f77]">
                Turtl.Bio
              </div>
              <div className="mt-1 text-[13px] text-zinc-400 font-mono">
                $250–500/mo
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-zinc-600">
                Structured, sourced reasoning for day-to-day applicability
                calls. Less than one hour of consultant time.
              </p>
            </div>
            <div className="pl-6 text-right">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                Generic AI
              </div>
              <div className="mt-1 text-[13px] text-zinc-400 font-mono">
                Free / flat
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-zinc-600">
                Broad answers, no product-specific reasoning, no precedent
                access, hallucinated citations.
              </p>
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
          title={
            <>
              Founder-scientist or sole RA/CMC lead at a{" "}
              <span className="font-serif italic">first-IND</span> US biotech.
            </>
          }
          description="The person who is simultaneously the scientist, the strategist, and the regulatory lead — patching the gap with Google searches, scattered PDFs, and expensive consultant calls for questions that shouldn't require a consultant."
        />

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200">
          {[
            ["Company size", "< 50 people"],
            ["Stage", "Pre-IND through first filing"],
            ["Regulatory staff", "0–1 dedicated hire"],
            ["Current budget", "$300–500/hr consultant rates"],
            ["Geography", "US-based (FDA)"],
            ["Decision maker", "RA/CMC lead or founder-scientist"],
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
              <span className="font-serif italic text-[#0f8f77]">
                We&rsquo;re talking to 15 teams this sprint.
              </span>
            </h2>
          </div>
          <div className="md:col-span-4">
            <p className="text-[15px] leading-relaxed text-zinc-600 mb-6">
              We&rsquo;re not pitching. We have a learning agenda — structured
              discovery, one willing pilot, and honest product feedback.
            </p>
            <Link
              href="mailto:hl4929@nyu.edu"
              className="inline-flex items-center gap-2 bg-zinc-950 text-white px-6 py-4 text-sm font-medium hover:bg-[#0f8f77] transition-colors"
            >
              Request alpha access
              <span aria-hidden className="font-mono text-xs">&rarr;</span>
            </Link>
          </div>
        </div>
      </Section>

      {/* 09 — SOURCES */}
      <Section
        number="09"
        label="Sources"
        className="py-16 md:py-20 border-t border-zinc-200"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400 mb-6">
          Grounding &amp; citations
        </div>
        <ul className="space-y-3 text-[13px] leading-relaxed text-zinc-600 max-w-3xl">
          <li className="flex gap-4">
            <span className="font-mono text-zinc-400 w-8 shrink-0">01</span>
            <span>
              <span className="text-zinc-950">Dan Mannix</span>, SVP Regulatory
              Affairs, IO Biotech. Discovery interview, 2026.
            </span>
          </li>
          <li className="flex gap-4">
            <span className="font-mono text-zinc-400 w-8 shrink-0">02</span>
            <span>
              <span className="text-zinc-950">ICH S6(R1)</span> &mdash; Preclinical
              Safety Evaluation of Biotechnology-Derived Pharmaceuticals.
            </span>
          </li>
          <li className="flex gap-4">
            <span className="font-mono text-zinc-400 w-8 shrink-0">03</span>
            <span>
              <span className="text-zinc-950">ICH S9</span> &mdash; Nonclinical
              Evaluation for Anticancer Pharmaceuticals.
            </span>
          </li>
          <li className="flex gap-4">
            <span className="font-mono text-zinc-400 w-8 shrink-0">04</span>
            <span>
              <span className="text-zinc-950">Pluvicto</span> &amp;{" "}
              <span className="text-zinc-950">Xtandi</span> FDA approval review
              packages — male-only tox precedent.
            </span>
          </li>
          <li className="flex gap-4">
            <span className="font-mono text-zinc-400 w-8 shrink-0">05</span>
            <span>
              <span className="text-zinc-950">Turtl.Bio Discovery Synthesis</span>{" "}
              — 10+ structured interviews with RA professionals, CMC leads,
              and first-IND founders.
            </span>
          </li>
        </ul>
      </Section>
    </div>
  );
}
