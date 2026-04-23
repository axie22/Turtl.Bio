import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-950">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Analytics />
      <footer className="border-t border-zinc-200 mt-24">
        <div className="mx-auto max-w-[1200px] px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-baseline gap-2">
                <span className="text-[15px] font-semibold tracking-tight">
                  Turtl.Bio
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400">
                  Alpha · 2026
                </span>
              </div>
              <p className="mt-3 max-w-md text-sm text-zinc-500 leading-relaxed">
                A structured interpretation workspace for preclinical biotech
                teams preparing their first IND.
              </p>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400 mb-3">
                Site
              </div>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="hover:text-zinc-950 text-zinc-600">
                    Index
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-zinc-950 text-zinc-600"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/workspace"
                    className="hover:text-zinc-950 text-zinc-600"
                  >
                    Workspace
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400 mb-3">
                Contact
              </div>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="mailto:hl4929@nyu.edu"
                    className="hover:text-zinc-950 text-zinc-600"
                  >
                    hl4929@nyu.edu
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-zinc-100 flex flex-col md:flex-row justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400">
            <span>© 2026 Turtl.Bio</span>
            <span>Built in New York</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
