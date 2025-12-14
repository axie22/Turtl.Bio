"use client";

import React, { useState } from "react";
import { Folder, FileCode, ChevronRight, ChevronDown } from "lucide-react";
import { clsx } from "clsx";

interface FileNode {
    id: string;
    name: string;
    type: "file" | "folder";
    children?: FileNode[];
}

const MOCK_FILES: FileNode[] = [
    {
        id: "root",
        name: "turtl-project",
        type: "folder",
        children: [
            {
                id: "src",
                name: "src",
                type: "folder",
                children: [
                    { id: "main.ts", name: "main.ts", type: "file" },
                    { id: "utils.ts", name: "utils.ts", type: "file" },
                    { id: "types.d.ts", name: "types.d.ts", type: "file" },
                ],
            },
            { id: "package.json", name: "package.json", type: "file" },
            { id: "README.md", name: "README.md", type: "file" },
            { id: ".gitignore", name: ".gitignore", type: "file" },
        ],
    },
];

interface FileTreeItemProps {
    node: FileNode;
    level: number;
}

function FileTreeItem({ node, level }: FileTreeItemProps) {
    const [isOpen, setIsOpen] = useState(true);

    const toggleOpen = () => {
        if (node.type === "folder") {
            setIsOpen(!isOpen);
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
                        <FileTreeItem key={child.id} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

export function FileExplorer() {
    return (
        <div className="h-full bg-[#181818] text-white overflow-y-auto">
            <div className="p-2 text-xs font-bold uppercase tracking-wider text-gray-500">Explorer</div>
            {MOCK_FILES.map((node) => (
                <FileTreeItem key={node.id} node={node} level={0} />
            ))}
        </div>
    );
}
