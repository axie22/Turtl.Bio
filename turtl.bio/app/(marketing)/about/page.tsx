import Link from "next/link";
import Image from "next/image";
import {
  Section,
  SectionHeader,
  Cite,
} from "@/components/marketing/primitives";
import { Linkedin } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  image?: string;
  initials?: string;
  linkedin?: string;
  pastExperience?: string[];
  bio?: string;
}

const TEAM: TeamMember[] = [
  {
    name: "Anthony Lee",
    role: "Product & Discovery",
    image: "/Anthony.jpeg",
    linkedin: "https://www.linkedin.com/in/hyunjun-lee-990021248/",
    pastExperience: ["New York University"],
    bio: "Anthony leads product discovery and user research at Turtl.Bio.",
  },
  {
    name: "Sabrina Wu",
    role: "Product",
    image: "/Sabrina.jpeg",
    linkedin: "https://www.linkedin.com/in/jingshu-wu2024/",
    pastExperience: ["UCLA", "The Mind Research Network"],
    bio: "Sabrina drives product strategy and execution at Turtl.Bio.",
  },
  {
    name: "Alexander Xie",
    role: "Engineering",
    image: "/Alex.jpeg",
    linkedin: "https://linkedin.com/in/alexanderxie04",
    pastExperience: ["Amazon", "Fortinet"],
    bio: "Alexander leads engineering and system architecture at Turtl.Bio.",
  },
  {
    name: "Sam",
    role: "Outreach & Strategy",
    image: "/Sam.jpeg",
    linkedin: "https://www.linkedin.com/in/sam-mathew-2b147526a/",
    pastExperience: ["HealthWorks for Northern Virginia"],
    bio: "Sam leads outreach and strategic partnerships at Turtl.Bio.",
  },
];

const PIVOT_ROWS: { dim: string; before: string; after: string }[] = [
  {
    dim: "Core user pain",
    before: "Finding guidance & writing faster",
    after:
      "Interpreting conditional requirements given limited internal regulatory depth",
  },
  {
    dim: "What the product does",
    before: "Automated drafting, streamlined submissions",
    after:
      "Helps teams interpret what FDA guidance means for their specific product",
  },
  {
    dim: "Role of precedent",
    before: "Reference material for drafting",
    after:
      "Critical input for interpretation. Currently fragmented and manually managed.",
  },
  {
    dim: "Competitor frame",
    before: "Veeva, Certara (submission tools)",
    after:
      "Consultants, spreadsheets, and generic LLMs for day-to-day decisions",
  },
  {
    dim: "Value delivered",
    before: "Time savings on document production",
    after: "Reducing early uncertainty and misapplication of guidance",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* 01 — PITCH */}
      <Section
        number="01"
        label="Mission"
        className="pt-20 md:pt-28 pb-20 md:pb-28"
      >
        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-8">
            <h1 className="text-[40px] md:text-[64px] leading-[1.03] tracking-[-0.02em] font-normal text-zinc-950">
              We give pre-IND biotech teams the{" "}
              <span className="text-[#0f8f77]">regulatory reasoning layer</span>{" "}
              they can&rsquo;t afford to hire.
            </h1>
            <p className="mt-8 max-w-[620px] text-[17px] leading-relaxed text-zinc-600">
              A 20-person team without a dedicated regulatory hire
              shouldn&rsquo;t need a $400/hr phone call to get a usable,
              auditable answer. Turtl.Bio is a structured interpretation
              workspace for FDA guidance and precedent, anchored to a specific
              product profile and sourced by construction.
            </p>
          </div>
          <div className="md:col-span-4 md:pl-8 md:border-l border-zinc-200">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400 mb-4">
              At a glance
            </div>
            <dl className="space-y-4 text-[14px]">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                  Customer
                </dt>
                <dd className="text-zinc-950 mt-1">
                  Pre-IND US biotechs, &lt; 50 people
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                  Stage
                </dt>
                <dd className="text-zinc-950 mt-1">
                  Customer Interviews, Product Direction
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                  Sprint goal
                </dt>
                <dd className="text-zinc-950 mt-1">
                  15 structured discovery conversations, one pilot team
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                  Based
                </dt>
                <dd className="text-zinc-950 mt-1">New York</dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      {/* 02 — PIVOT: BEFORE / AFTER */}
      <Section
        number="02"
        label="Pivot"
        className="py-20 md:py-28 border-t border-zinc-200"
      >
        <SectionHeader
          eyebrow="How we got here"
          title="We expected drafting to be the bottleneck. It wasn't."
          description="Our first framing was a broad Compliance and Regulatory Intelligence platform: pathway mapping, drafting, submissions, post-market surveillance. Discovery retired that framing."
        />

        <figure className="mt-12">
          <blockquote className="font-serif text-[28px] md:text-[40px] leading-[1.12] tracking-[-0.01em] text-zinc-950 max-w-3xl">
            &ldquo;We expected drafting to be the bottleneck. Interviews
            revealed teams aren&rsquo;t stuck writing. They&rsquo;re stuck
            deciding what applies before they write anything.&rdquo;
          </blockquote>
          <Cite className="mt-6">Turtl.Bio Discovery Synthesis, 2026</Cite>
        </figure>

        <div className="mt-16 border border-zinc-200 overflow-hidden">
          <div className="grid grid-cols-3 bg-zinc-950 text-white">
            <div className="p-4 md:p-5 font-mono text-[10px] uppercase tracking-[0.14em]">
              Dimension
            </div>
            <div className="p-4 md:p-5 font-mono text-[10px] uppercase tracking-[0.14em] border-l border-white/10 text-zinc-400">
              Before discovery
            </div>
            <div className="p-4 md:p-5 font-mono text-[10px] uppercase tracking-[0.14em] border-l border-white/10 text-[#54dcbc]">
              After discovery
            </div>
          </div>
          {PIVOT_ROWS.map((row, i) => (
            <div
              key={row.dim}
              className={`grid grid-cols-3 text-[14px] leading-relaxed ${
                i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"
              }`}
            >
              <div className="p-4 md:p-5 font-medium text-zinc-950 border-t border-zinc-200">
                {row.dim}
              </div>
              <div className="p-4 md:p-5 text-zinc-500 border-t border-l border-zinc-200 line-through decoration-zinc-300">
                {row.before}
              </div>
              <div className="p-4 md:p-5 text-zinc-950 border-t border-l border-zinc-200">
                {row.after}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 03 — OPERATING PRINCIPLES */}
      <Section
        number="03"
        label="Principles"
        className="py-20 md:py-28 border-t border-zinc-200"
      >
        <SectionHeader
          eyebrow="How we work"
          title="Intellectual honesty is a core operating principle."
        />
        <div className="mt-14 grid md:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200">
          {[
            {
              n: "01",
              t: "Show evidence, not summaries",
              b: "Every claim is tied to a specific interview, clause, or approval package. We show what we heard and from whom.",
            },
            {
              n: "02",
              t: "Name the scope, and the gap",
              b: "We don't promise generalization to modalities we haven't tested. Today that means small molecules and radioligand therapies.",
            },
            {
              n: "03",
              t: "No replacing consultants",
              b: "We sit between consultants and generic AI. Consultants own the high-stakes strategic work and are a distribution channel, not a target.",
            },
          ].map((p) => (
            <div key={p.n} className="bg-white p-8 md:p-10">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400">
                {p.n}
              </span>
              <h3 className="mt-5 text-[20px] md:text-[22px] tracking-tight text-zinc-950 font-medium">
                {p.t}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-zinc-600">
                {p.b}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* 04 — TEAM */}
      <Section
        number="04"
        label="Team"
        className="py-20 md:py-28 border-t border-zinc-200"
      >
        <SectionHeader
          eyebrow="Team"
          title="Built by a small team in New York."
          description="Product, engineering, and outreach. Working directly with regulatory leads, founder-scientists, and CMC consultants to shape what gets built next."
        />

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-px bg-zinc-200 border border-zinc-200">
          {TEAM.map((member) => (
            <div key={member.name} className="bg-white p-6 flex flex-col gap-4">
              <div className="aspect-square w-full overflow-hidden bg-zinc-100 relative">
                {member.image && (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                )}
              </div>
              <div>
                <div className="text-[15px] font-medium text-zinc-950">
                  {member.name}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                  {member.role}
                </div>
                {member.pastExperience && member.pastExperience.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-zinc-100 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400">
                    Prev &middot; {member.pastExperience.join(" / ")}
                  </div>
                )}
                {member.linkedin && (
                  <Link
                    href={member.linkedin}
                    target="_blank"
                    className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500 hover:text-zinc-950 transition-colors"
                  >
                    <Linkedin className="h-3 w-3" />
                    LinkedIn
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 05 — CONTACT */}
      <Section
        number="05"
        label="Contact"
        className="py-24 md:py-32 border-t border-zinc-200"
      >
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8">
            <h2 className="text-[36px] md:text-[56px] leading-[1.04] tracking-[-0.02em] font-normal text-zinc-950">
              Working on your first IND, or consulting for a team that is?{" "}
              <span className="text-[#0f8f77]">Let&rsquo;s talk.</span>
            </h2>
          </div>
          <div className="md:col-span-4">
            <p className="text-[15px] leading-relaxed text-zinc-600 mb-6">
              We have a learning agenda, not a growth agenda. Honest signal is
              more useful than a sales pitch.
            </p>
            <Link
              href="mailto:anthony@turtltechnologies.net"
              className="inline-flex items-center gap-2 bg-zinc-950 text-white px-6 py-4 text-sm font-medium hover:bg-[#0f8f77] transition-colors"
            >
              anthony@turtltechnologies.net
              <span aria-hidden className="font-mono text-xs">
                &rarr;
              </span>
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
