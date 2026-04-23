"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

export function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-baseline gap-2">
                        <span className="text-[15px] font-semibold tracking-tight text-zinc-950">
                            Turtl.Bio
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400">
                            Alpha
                        </span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.14em]">
                        <Link
                            href="/"
                            className={clsx(
                                "transition-colors hover:text-zinc-950",
                                pathname === "/" ? "text-zinc-950" : "text-zinc-500"
                            )}
                        >
                            Index
                        </Link>
                        <Link
                            href="/about"
                            className={clsx(
                                "transition-colors hover:text-zinc-950",
                                pathname === "/about" ? "text-zinc-950" : "text-zinc-500"
                            )}
                        >
                            About
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-5">
                    <Link
                        href="mailto:hl4929@nyu.edu"
                        className="hidden sm:inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500 hover:text-zinc-950 transition-colors"
                    >
                        Contact
                    </Link>
                    <Link
                        href="/workspace"
                        className="inline-flex items-center gap-2 rounded-none border border-zinc-950 bg-zinc-950 px-3.5 py-1.5 text-[12px] font-medium text-white hover:bg-white hover:text-zinc-950 transition-colors"
                    >
                        Workspace
                        <span aria-hidden className="font-mono text-[10px]">→</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
