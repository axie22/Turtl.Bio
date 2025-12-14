"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";

export function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between mx-auto px-4">
                <div className="mr-4 flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block text-xl">
                            Turtl.Bio
                        </span>
                    </Link>
                    <div className="hidden md:flex gap-6 text-sm font-medium items-center">
                        <Link
                            href="/"
                            className={clsx(
                                "transition-colors hover:text-foreground/80",
                                pathname === "/" ? "text-foreground" : "text-foreground/60"
                            )}
                        >
                            Home
                        </Link>
                        <Link
                            href="/about"
                            className={clsx(
                                "transition-colors hover:text-foreground/80",
                                pathname === "/about" ? "text-foreground" : "text-foreground/60"
                            )}
                        >
                            About
                        </Link>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Link href="/workspace">
                        <Button size="sm" variant="default">
                            Try Workspace
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
