"use client";

import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Sidebar as SidebarIcon, Terminal as TerminalIcon, FolderOpen } from "lucide-react";
import dynamic from "next/dynamic";
import { FileExplorer } from "./FileExplorer";
import { CodeEditor } from "./CodeEditor";
import { PdfViewer } from "./PdfViewer";
import { useFileSystem } from "./useFileSystem";

const Terminal = dynamic(() => import("./Terminal").then((mod) => mod.Terminal), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-[#1e1e1e] text-white p-2">Loading Terminal...</div>,
});

function getLanguageFromFilename(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();

    switch (ext) {
        case 'js':
        case 'jsx':
            return 'javascript';
        case 'ts':
        case 'tsx':
            return 'typescript';
        case 'css':
            return 'css';
        case 'html':
            return 'html';
        case 'json':
            return 'json';
        case 'md':
            return 'markdown';
        case 'py':
            return 'python';
        case 'go':
            return 'go';
        case 'rs':
            return 'rust';
        case 'yaml':
        case 'yml':
            return 'yaml';
        default:
            if (filename.toLowerCase() === 'dockerfile') return 'dockerfile';
            return 'plaintext';
    }
}

export function WorkspaceLayout() {
    const {
        directoryHandle,
        fileTree,
        currentFile,
        openDirectory,
        selectFile,
        saveFile
    } = useFileSystem();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isTerminalOpen, setIsTerminalOpen] = useState(true);

    return (
        <div className="h-screen w-screen bg-black text-white overflow-hidden flex flex-col">
            {/* Header / Toolbar Stub */}
            <div className="h-10 border-b border-[#333] flex items-center px-4 bg-[#1e1e1e] select-none justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={`p-1 rounded hover:bg-[#333] transition-colors ${isSidebarOpen ? 'text-blue-400' : 'text-gray-400'}`}
                        title="Toggle Sidebar"
                    >
                        <SidebarIcon size={18} />
                    </button>
                    <button
                        onClick={() => setIsTerminalOpen(!isTerminalOpen)}
                        className={`p-1 rounded hover:bg-[#333] transition-colors ${isTerminalOpen ? 'text-blue-400' : 'text-gray-400'}`}
                        title="Toggle Terminal"
                    >
                        <TerminalIcon size={18} />
                    </button>
                    <span className="font-bold text-gray-200">
                        {directoryHandle ? directoryHandle.name : "Turtl.Bio Workspace"}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={openDirectory}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-xs rounded text-white font-medium transition-colors"
                    >
                        <FolderOpen size={14} />
                        {directoryHandle ? "Change Folder" : "Open Folder"}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <PanelGroup direction="horizontal">

                    {/* Sidebar: File Explorer */}
                    {isSidebarOpen && (
                        <>
                            <Panel defaultSize={20} minSize={10} maxSize={30} className="border-r border-[#333]">
                                <FileExplorer files={fileTree} onFileSelect={selectFile} />
                            </Panel>
                            <PanelResizeHandle className="w-1 bg-[#333] hover:bg-blue-500 transition-colors cursor-col-resize" />
                        </>
                    )}

                    {/* Main Content: Editor & Terminal */}
                    <Panel defaultSize={80}>
                        <PanelGroup direction="vertical">

                            {/* Top: Editor or PDF Viewer */}
                            <Panel defaultSize={70} minSize={20}>
                                {currentFile && currentFile.handle.name.toLowerCase().endsWith('.pdf') ? (
                                    <PdfViewer url={currentFile.objectUrl} />
                                ) : (
                                    <CodeEditor
                                        key={currentFile?.path || 'empty'}
                                        initialContent={currentFile?.content}
                                        language={currentFile ? getLanguageFromFilename(currentFile.handle.name) : 'javascript'}
                                        onSave={saveFile}
                                    />
                                )}
                            </Panel>

                            <PanelResizeHandle className="h-1 bg-[#333] hover:bg-blue-500 transition-colors cursor-row-resize" />

                            {/* Bottom: Terminal */}
                            {isTerminalOpen && (
                                <>
                                    <PanelResizeHandle className="h-1 bg-[#333] hover:bg-blue-500 transition-colors cursor-row-resize" />
                                    <Panel defaultSize={30} minSize={10}>
                                        <Terminal />
                                    </Panel>
                                </>
                            )}

                        </PanelGroup>
                    </Panel>

                </PanelGroup>
            </div>
        </div>
    );
}
