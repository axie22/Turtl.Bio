"use client";

import React, { useState } from "react";
import { ChevronUp, ChevronDown, FileText, Database, Radio, CheckCircle2, Loader2 } from "lucide-react";

export function Terminal() {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="h-full w-full bg-[#0a0a0a] text-gray-300 flex flex-col font-mono text-sm border-t border-[#333]">
            {/* Header / Toggle Bar - Always Visible (Closed Variant is essentially just this bar) */}
            <div
                className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] cursor-pointer hover:bg-[#252525] transition-colors select-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    <Database size={16} className="text-blue-400" />
                    <span className="font-semibold text-gray-200">FDA Reference Source</span>
                    <span className="text-xs text-gray-500">|</span>
                    <span className="text-xs text-gray-400">21 CFR Part 11.10(e) Controls for Closed Systems</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 rounded-full border border-green-500/20">
                        <CheckCircle2 size={12} className="text-green-400" />
                        <span className="text-[10px] text-green-400 font-medium">VERIFIED</span>
                    </div>
                    {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </div>
            </div>

            {/* Open Variant Content */}
            {isOpen && (
                <div className="flex-1 overflow-auto p-4 space-y-6">

                    {/* Source Reference Header */}
                    <div className="space-y-2">
                        <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1 flex items-center gap-2">
                            <FileText size={12} />
                            Source Documentation
                        </h3>
                        <div className="bg-[#151515] p-3 rounded-md border border-[#333] text-gray-400 leading-relaxed">
                            <p className="text-yellow-500/80 mb-1 text-xs">§ 11.10 Controls for closed systems.</p>
                            <p>
                                (e) Use of secure, computer-generated, time-stamped audit trails to independently record the date and time of operator entries and actions that create, modify, or delete electronic records. Record changes shall not obscure previously recorded information.
                            </p>
                        </div>
                    </div>

                    {/* Example AI Reference & Suggestions */}
                    <div className="space-y-2">
                        <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1 flex items-center gap-2">
                            <Radio size={12} />
                            AI Analysis
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[#151515] p-3 rounded-md border border-[#333] border-l-2 border-l-blue-500">
                                <span className="text-xs font-bold text-blue-400 block mb-2">INTERPRETATION</span>
                                <p className="text-gray-400">
                                    The system requires an immutable audit trail. Current implementation lacks independent timestamp verification for "delete" actions.
                                </p>
                            </div>
                            <div className="bg-[#151515] p-3 rounded-md border border-[#333] border-l-2 border-l-purple-500">
                                <span className="text-xs font-bold text-purple-400 block mb-2">SUGGESTION</span>
                                <p className="text-gray-400">
                                    Implement <code className="text-gray-300 bg-[#2a2a2a] px-1 rounded">LogEntry</code> struct with <code className="text-gray-300 bg-[#2a2a2a] px-1 rounded">CreatedAt</code> timestamp that cannot be modified by the client.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Example Raw Data Excerpt */}
                    <div className="space-y-2">
                        <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1 flex items-center gap-2">
                            <Database size={12} />
                            Raw Data Context
                        </h3>
                        <div className="bg-[#111] p-3 rounded-md border border-[#333] font-mono text-xs overflow-x-auto text-gray-500">
                            <pre>{`{
  "regulation_id": "21_CFR_11.10",
  "subpart": "e",
  "compliance_status": "PARTIAL",
  "last_check": "2024-10-24T14:30:00Z",
  "detected_gaps": [
    "audit_trail_missing_delete_events"
  ]
}`}</pre>
                        </div>
                    </div>

                    {/* Loading / Confirmation Line */}
                    <div className="flex items-center gap-2 py-2 text-xs text-gray-500 border-t border-[#222] mt-4">
                        <Loader2 size={12} className="animate-spin text-blue-500" />
                        <span>Syncing verification status with regulatory database...</span>
                    </div>

                </div>
            )}
        </div>
    );
}
