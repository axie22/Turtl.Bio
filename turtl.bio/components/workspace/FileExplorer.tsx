"use client";

import React, { useState } from "react";
import { Folder, FileCode, ChevronRight, ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { FileNode } from "./useFileSystem";

interface FileTreeItemProps {
    node: FileNode;
    level: number;
    onSelect: (node: FileNode) => void;
}

function FileTreeItem({ node, level, onSelect }: FileTreeItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (node.type === "folder") {
            setIsOpen(!isOpen);
        } else {
            onSelect(node);
        }
    };

    return (
        <div>
            <div
                className={clsx(
                    "flex items-center py-1 px-2 cursor-pointer hover:bg-[#2a2d2e] text-sm select-none",
                    level === 0 && "font-bold"
                )}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
                onClick={toggleOpen}
            >
                <span className="mr-1 text-gray-400">
                    {node.type === "folder" ? (
                        isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                    ) : (
                        <span className="w-4" /> // Spacer
                    )}
                </span>

                <span className="mr-2 text-blue-400">
                    {node.type === "folder" ? <Folder size={16} /> : <FileCode size={16} />}
                </span>

                <span className="text-gray-300">{node.name}</span>
            </div>

            {isOpen && node.children && (
                <div>
                    {node.children.map((child) => (
                        <FileTreeItem key={child.id} node={child} level={level + 1} onSelect={onSelect} />
                    ))}
                </div>
            )}
        </div>
    );
}

interface FileExplorerProps {
    files: FileNode[];
    onFileSelect: (node: FileNode) => void;
}

export function FileExplorer({ files, onFileSelect }: FileExplorerProps) {
    return (
        <div className="h-full bg-[#181818] text-white overflow-y-auto">
            <div className="p-2 text-xs font-bold uppercase tracking-wider text-gray-500">Explorer</div>
            {files.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                    No folder open
                </div>
            ) : (
                files.map((node) => (
                    <FileTreeItem key={node.id} node={node} level={0} onSelect={onFileSelect} />
                ))
            )}
        </div>
    );
}
