"use client";

import React, { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

export function Terminal() {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<XTerm | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);

    useEffect(() => {
        if (!terminalRef.current) return;

        // Initialize or cleanup
        const term = new XTerm({
            cursorBlink: true,
            theme: {
                background: "#1e1e1e",
                foreground: "#ffffff",
            },
            fontFamily: "monospace",
            fontSize: 14,
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        term.open(terminalRef.current);

        // Fit needs a tick to read dimensions correctly
        requestAnimationFrame(() => {
            try {
                fitAddon.fit();
            } catch (e) {
                console.error("Failed to fit terminal:", e);
            }
        });

        term.writeln("Welcome to Turtl.Bio IDE Prototype");
        term.writeln("$ ");

        // Handle input (stub for now)
        term.onData((data) => {
            // Echo back for demo
            term.write(data);
        });

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        // Resize observer to refit terminal
        const resizeObserver = new ResizeObserver(() => {
            try {
                // Check if terminal is still connected to DOM before fitting
                if (terminalRef.current && terminalRef.current.isConnected) {
                    fitAddon.fit();
                }
            } catch (e) {
                console.warn("Resize fit error:", e);
            }
        });

        resizeObserver.observe(terminalRef.current);

        return () => {
            // Cleanup: stop observing first
            resizeObserver.disconnect();
            // Dispose terminal
            term.dispose();
            xtermRef.current = null;
        };
    }, []);

    return <div className="h-full w-full bg-[#1e1e1e] pl-2 pt-2 overflow-hidden" ref={terminalRef} />;
}
