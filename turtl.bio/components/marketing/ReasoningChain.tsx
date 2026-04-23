const NODES = [
  {
    n: "01",
    label: "Question",
    title: "Do we need tox\nstudies in female\nanimals?",
    type: "free-text",
  },
  {
    n: "02",
    label: "Intake",
    title: "modality: small mol.\nindication: prostate\npopulation: male-only",
    type: "structured",
  },
  {
    n: "03",
    label: "Routing",
    title: "ICH S6(R1) §2.3\nICH S9 §3.1",
    type: "conditional",
  },
  {
    n: "04",
    label: "Precedent",
    title: "Pluvicto\nXtandi\nmale-only tox",
    type: "comparator",
  },
  {
    n: "05",
    label: "Output",
    title: "Male-only tox\nsupported. Sourced\ninterpretation.",
    type: "auditable",
  },
];

export function ReasoningChain() {
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-0">
      {NODES.map((node, i) => (
        <div
          key={node.n}
          className="reasoning-node relative group"
          style={{
            animation: "rcFade 620ms ease forwards",
            animationDelay: `${i * 140}ms`,
            opacity: 0,
          }}
        >
          {/* connector line on md+ */}
          {i < NODES.length - 1 && (
            <>
              <div
                className="hidden md:block absolute top-1/2 right-[-12px] h-px w-6 bg-zinc-300 z-0"
                style={{
                  animation: "rcLine 500ms ease forwards",
                  animationDelay: `${i * 140 + 400}ms`,
                  transformOrigin: "left center",
                  transform: "scaleX(0)",
                }}
              />
              <div
                className="hidden md:block absolute top-1/2 right-[-16px] -translate-y-1/2 font-mono text-[10px] text-zinc-400 z-10"
                style={{
                  animation: "rcFade 400ms ease forwards",
                  animationDelay: `${i * 140 + 500}ms`,
                  opacity: 0,
                }}
              >
                &rarr;
              </div>
            </>
          )}

          <div className="relative border border-zinc-200 bg-white p-5 min-h-[148px] flex flex-col justify-between hover:border-zinc-950 transition-colors z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400">
                {node.n} &middot; {node.label}
              </span>
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  i === NODES.length - 1 ? "bg-[#0f8f77]" : "bg-zinc-300"
                }`}
              />
            </div>
            <div
              className={`text-[13px] leading-[1.4] whitespace-pre-line ${
                i === NODES.length - 1 ? "text-zinc-950 font-medium" : "text-zinc-700"
              }`}
            >
              {node.title}
            </div>
            <div className="mt-3 pt-3 border-t border-zinc-100 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400">
              {node.type}
            </div>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes rcFade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rcLine {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
