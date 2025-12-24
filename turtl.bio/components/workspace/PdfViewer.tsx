"use client";

import React from "react";

interface PdfViewerProps {
    url?: string;
}

export function PdfViewer({ url }: PdfViewerProps) {
    if (!url) {
        return (
            <div className="h-full w-full flex items-center justify-center text-gray-400 bg-[#1e1e1e]">
                No PDF loaded
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-[#1e1e1e]">
            <iframe
                src={url}
                className="w-full h-full border-none"
                title="PDF Viewer"
            />
        </div>
    );
}
