"use client";

import React, { useState, useEffect } from "react";
import { Search, FileText, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FileNode } from "./useFileSystem";

interface SearchResult {
    file_path: string;
    snippet: string;
    line_num: number;
}

interface SearchPanelProps {
    fileTree: FileNode[];
    onOpenFile: (path: string) => void;
}

export function SearchPanel({ fileTree, onOpenFile }: SearchPanelProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Dynamic import for pdfjs to avoid SSR issues
    const getPdfJs = async () => {
        const pdfjs = await import('pdfjs-dist');
        // @ts-ignore
        if (!pdfjs.GlobalWorkerOptions.workerSrc) {
            pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        }
        return pdfjs;
    };

    const extractPdfText = async (file: File): Promise<string[]> => {
        try {
            const pdfjs = await getPdfJs();
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
            const doc = await loadingTask.promise;
            
            let lines: string[] = [];

            for (let i = 1; i <= doc.numPages; i++) {
                const page = await doc.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                lines.push(pageText);
            }
            return lines;
        } catch (e) {
            console.error("Failed to parse PDF", e);
            return [];
        }
    };

    // Recursive search function
    const searchInFiles = async (nodes: FileNode[], searchQuery: string): Promise<SearchResult[]> => {
        let found: SearchResult[] = [];
        const lowerQuery = searchQuery.toLowerCase();

        for (const node of nodes) {
            if (found.length > 50) break; // Optimization check

            if (node.name === ".git" || node.name === "node_modules" || node.name === "dist" || node.name === ".next") {
                continue;
            }

            if (node.type === "folder" && node.children) {
                const subResults = await searchInFiles(node.children, searchQuery);
                found = found.concat(subResults);
            } else if (node.type === "file") {
                // Search filename
                if (node.name.toLowerCase().includes(lowerQuery)) {
                    found.push({
                        file_path: node.id,
                        snippet: "Filename match",
                        line_num: 0
                    });
                }

                // Check extension
                const isPdf = node.name.toLowerCase().endsWith('.pdf');
                // Allow text files (heuristic) logic
                const isIgnoredImage = node.name.endsWith('.png') || node.name.endsWith('.jpg') || node.name.endsWith('.jpeg');
                
                if (isPdf) {
                    try {
                        const fileHandle = node.handle as FileSystemFileHandle;
                        const file = await fileHandle.getFile();
                        const lines = await extractPdfText(file);
                        
                        for (let i = 0; i < lines.length; i++) {
                            if (lines[i].toLowerCase().includes(lowerQuery)) {
                                found.push({
                                    file_path: node.id,
                                    // Truncate snippet if too long
                                    snippet: lines[i].substring(0, 100) + "...", 
                                    line_num: i + 1 // Actually page number in this simplified logic
                                });
                                if (found.filter(f => f.file_path === node.id).length > 5) break; 
                            }
                        }
                    } catch (err) {
                        console.warn("Error reading PDF:", node.name, err);
                    }
                } else if (!isIgnoredImage) {
                    // Existing text logic
                    try {
                        const fileHandle = node.handle as FileSystemFileHandle;
                        const file = await fileHandle.getFile();
                        const text = await file.text();
                        
                        const lines = text.split('\n');
                        for (let i = 0; i < lines.length; i++) {
                            if (lines[i].toLowerCase().includes(lowerQuery)) {
                                found.push({
                                    file_path: node.id,
                                    snippet: lines[i].trim(),
                                    line_num: i + 1
                                });
                                // Limit matches per file to avoid spam
                                if (found.filter(f => f.file_path === node.id).length > 5) break; 
                            }
                        }
                    } catch (err) {
                       // Silent fail for bin files
                    }
                }
            }
        }
        return found;
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        console.log("[SearchPanel] Starting search for:", query);
        console.log("[SearchPanel] FileTree length:", fileTree.length);

        setIsLoading(true);
        setHasSearched(true);
        setResults([]);

        try {
            // Run search
            const searchResults = await searchInFiles(fileTree, query);
            console.log("[SearchPanel] Search finished. Found:", searchResults.length);
            setResults(searchResults);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full w-full bg-[#1e1e1e] border-l border-[#333] flex flex-col">
            <div className="h-10 border-b border-[#333] flex items-center px-4 bg-[#1e1e1e] select-none shadow-sm">
                <Search className="h-4 w-4 mr-2 text-blue-400" />
                <span className="font-bold text-gray-200 text-sm">Search</span>
            </div>

            <div className="p-4 border-b border-[#333]">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search files (incl PDFs)..."
                        className="bg-[#252526] border-[#333] text-sm focus-visible:ring-blue-500/50 h-8"
                        autoFocus
                    />
                </form>
            </div>

            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-500 gap-2">
                        <Loader2 className="animate-spin" size={20} />
                        <span className="text-xs">Searching...</span>
                    </div>
                ) : results.length > 0 ? (
                    <div className="py-2">
                        <div className="px-4 pb-2 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                            {results.length} results
                        </div>
                        {results.map((result, index) => (
                            <div
                                key={`${result.file_path}-${index}`}
                                className="group px-4 py-3 hover:bg-[#2a2a2a] cursor-pointer border-b border-[#333]/50 last:border-0 transition-colors"
                                onClick={() => onOpenFile(result.file_path)}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <FileText size={14} className="text-gray-400 group-hover:text-blue-400" />
                                    <span className="text-sm text-gray-300 font-medium truncate" title={result.file_path}>
                                        {result.file_path.split('/').pop()}
                                    </span>
                                    <span className="text-xs text-gray-600 ml-auto truncate max-w-[100px]">
                                        {result.file_path}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 font-mono ml-6 line-clamp-2 bg-[#252526] p-1.5 rounded border border-[#333]">
                                    {result.snippet}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : hasSearched ? (
                    <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
                        No results found.
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-600 gap-2 p-8 text-center">
                        <Search size={32} className="opacity-20" />
                        <span className="text-sm">Search for text & PDFs across all files.</span>
                    </div>
                )}
            </div>
        </div>
    );
}
