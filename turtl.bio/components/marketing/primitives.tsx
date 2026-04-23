import type { ReactNode } from "react";
import { clsx } from "clsx";

export function Section({
  number,
  label,
  className,
  children,
}: {
  number?: string;
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={clsx("relative", className)}>
      <div className="mx-auto max-w-[1200px] px-6">
        {(number || label) && (
          <div className="flex items-center gap-3 mb-10 md:mb-14">
            {number && (
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400">
                {number}
              </span>
            )}
            {label && (
              <>
                <span className="h-px w-6 bg-zinc-300" />
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                  {label}
                </span>
              </>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div className="max-w-4xl">
      {eyebrow && (
        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#0f8f77] mb-5">
          {eyebrow}
        </div>
      )}
      <h2 className="text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] font-normal text-zinc-950">
        {title}
      </h2>
      {description && (
        <p className="mt-6 max-w-[680px] text-[16px] leading-relaxed text-zinc-600">
          {description}
        </p>
      )}
    </div>
  );
}

export function MetaStrip({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3 border-y border-zinc-200 font-mono text-[11px] uppercase tracking-[0.14em]">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-3">
          <span className="text-zinc-400">{item.label}</span>
          <span className="text-zinc-950">{item.value}</span>
          {i < items.length - 1 && <span className="text-zinc-300">&middot;</span>}
        </span>
      ))}
    </div>
  );
}

export function Cite({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <figcaption
      className={clsx(
        "font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500 leading-relaxed",
        className
      )}
    >
      {children}
    </figcaption>
  );
}
