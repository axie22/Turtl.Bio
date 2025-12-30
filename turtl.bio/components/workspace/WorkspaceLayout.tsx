"use client";

import { useState } from "react";
import React, { DragEvent } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Sidebar as SidebarIcon, Terminal as TerminalIcon, FolderOpen, Sparkles, X } from "lucide-react";
import dynamic from "next/dynamic";
import { FileExplorer } from "./FileExplorer";
import { CodeEditor } from "./CodeEditor";
import { PdfViewer } from "./PdfViewer";
import { CopilotPanel } from "./CopilotPanel";
import { useFileSystem, LayoutNode, FileTab } from "./useFileSystem";

// --- Recursive Layout Renderer ---

interface LayoutRendererProps {
    node: LayoutNode;
    activePaneId: string;
    onSplit: (targetId: string, direction: 'horizontal' | 'vertical', tabId?: string) => void;
    onActivatePane: (id: string) => void;
    onActivateTab: (paneId: string, tabId: string) => void;
    onCloseTab: (paneId: string, tabId: string) => void;
    onMoveTab: (sourcePaneId: string, targetPaneId: string, tabId: string) => void;
    onSave: (content: string) => void;
}

function LayoutRenderer({ node, activePaneId, onSplit, onActivatePane, onActivateTab, onCloseTab, onMoveTab, onSave }: LayoutRendererProps) {
    if (node.type === 'split') {
        return (
            <PanelGroup direction={node.direction}>
                {node.children.map((child, index) => (
                    <React.Fragment key={child.id}>
                        <Panel minSize={10}>
                            <LayoutRenderer 
                                node={child} 
                                activePaneId={activePaneId} 
                                onSplit={onSplit} 
                                onActivatePane={onActivatePane}
                                onActivateTab={onActivateTab}
                                onCloseTab={onCloseTab}
                                onMoveTab={onMoveTab}
                                onSave={onSave}
                            />
                        </Panel>
                        {index < node.children.length - 1 && <PanelResizeHandle className={`bg-[#333] hover:bg-blue-500 transition-colors ${node.direction === 'horizontal' ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize'}`} />}
                    </React.Fragment>
                ))}
            </PanelGroup>
        );
    }
    
    return (
        <EditorPane 
            node={node} 
            isActive={node.id === activePaneId}
            onSplit={onSplit}
            onActivatePane={onActivatePane}
            onActivateTab={onActivateTab}
            onCloseTab={onCloseTab}
            onMoveTab={onMoveTab}
            onSave={onSave}
        />
    );
}

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

interface EditorPaneProps {
    node: LayoutNode & { type: 'leaf' };
    isActive: boolean;
    onSplit: (targetId: string, direction: 'horizontal' | 'vertical', tabId?: string) => void;
    onActivatePane: (id: string) => void;
    onActivateTab: (paneId: string, tabId: string) => void;
    onCloseTab: (paneId: string, tabId: string) => void;
    onMoveTab: (sourcePaneId: string, targetPaneId: string, tabId: string) => void;
    onSave: (content: string) => void;
}

function EditorPane({ node, isActive, onSplit, onActivatePane, onActivateTab, onCloseTab, onMoveTab, onSave }: EditorPaneProps) {
    const [dragOverZone, setDragOverZone] = useState<'right' | 'bottom' | 'center' | null>(null);

    const activeTab = node.tabs.find(t => t.id === node.activeTabId);

    const handleTabDragStart = (e: DragEvent, tab: FileTab) => {
        e.dataTransfer.setData('sourcePaneId', node.id);
        e.dataTransfer.setData('tabData', JSON.stringify(tab));
        e.dataTransfer.effectAllowed = 'copyMove';
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const width = rect.width;
        const height = rect.height;

        if (x > width * 0.75) {
            setDragOverZone('right');
        } else if (y > height * 0.75) {
            setDragOverZone('bottom');
        } else {
            setDragOverZone('center');
        }
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setDragOverZone(null);
        
        try {
            const tabData = JSON.parse(e.dataTransfer.getData('tabData'));
            const sourcePaneId = e.dataTransfer.getData('sourcePaneId');
            
            if (dragOverZone === 'right' || dragOverZone === 'bottom') {
                const direction = dragOverZone === 'right' ? 'horizontal' : 'vertical';
                onSplit(node.id, direction, tabData.id);
            } else if (dragOverZone === 'center') {
                if (sourcePaneId && tabData.id) {
                    onMoveTab(sourcePaneId, node.id, tabData.id);
                }
            }
        } catch (err) {
            console.error("Failed to parse tab data or handle drop", err);
        }
    };

    const handleDragLeave = () => {
        setDragOverZone(null);
    };

    return (
        <div 
            className={`h-full w-full flex flex-col relative ${isActive ? 'ring-1 ring-blue-500/50' : ''}`}
            onClick={() => onActivatePane(node.id)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
        >
             {/* Tabs Header */}
             <div className={`h-9 flex items-center bg-[#111] border-b border-[#333] select-none overflow-x-auto scrollbar-hide`}>
                {node.tabs.map(tab => (
                    <div 
                        key={tab.id}
                        className={`
                            h-full px-3 flex items-center gap-2 text-xs border-r border-[#222] min-w-[120px] max-w-[200px] cursor-pointer group
                            ${tab.id === node.activeTabId ? 'bg-[#1e1e1e] text-white border-t-2 border-t-blue-500' : 'text-gray-500 hover:bg-[#1a1a1a]'}
                        `}
                        draggable
                        onDragStart={(e) => handleTabDragStart(e, tab)}
                        onClick={(e) => {
                            e.stopPropagation();
                            onActivateTab(node.id, tab.id);
                        }}
                    >
                        <span className="truncate flex-1">
                            {tab.name}
                        </span>
                        {tab.name.endsWith('.pdf') && <span className="text-[9px] px-1 rounded bg-red-500/10 text-red-500">PDF</span>}
                        <div 
                            className={`p-0.5 rounded-sm hover:bg-gray-700/50 ${tab.id === node.activeTabId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onCloseTab(node.id, tab.id);
                            }}
                        >
                            <X size={12} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Drop Zone Indicators */}
            {dragOverZone === 'right' && (
                <div className="absolute inset-y-0 right-0 w-1/4 bg-blue-500/20 z-50 pointer-events-none border-l-2 border-blue-500" />
            )}
            {dragOverZone === 'bottom' && (
                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-blue-500/20 z-50 pointer-events-none border-t-2 border-blue-500" />
            )}

            {/* Editor Content */}
            <div className="flex-1 overflow-hidden bg-[#1e1e1e]">
                {activeTab ? (
                    activeTab.name.toLowerCase().endsWith('.pdf') ? (
                         <PdfViewer url={activeTab.objectUrl!} />
                    ) : (
                        <CodeEditor
                            key={activeTab.id}
                            initialContent={activeTab.content}
                            language={getLanguageFromFilename(activeTab.name)}
                            onSave={onSave}
                        />
                    )
                ) : (
                     <div className="h-full w-full flex items-center justify-center text-gray-600 text-xs uppercase tracking-widest">
                         No File Open
                     </div>
                )}
            </div>
        </div>
    );
}

export function WorkspaceLayout() {
    const {
        directoryHandle,
        fileTree,
        layout,
        activePaneId,
        openDirectory,
        selectFile,
        saveFile,
        splitPane,
        setActivePaneId,
        closeTab,
        activateTab,
        moveTab
    } = useFileSystem();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isTerminalOpen, setIsTerminalOpen] = useState(true);
    const [isCopilotOpen, setIsCopilotOpen] = useState(true);

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
                        onClick={() => setIsCopilotOpen(!isCopilotOpen)}
                        className={`p-1 rounded hover:bg-[#333] transition-colors ${isCopilotOpen ? 'text-purple-400' : 'text-gray-400'}`}
                        title="Toggle AI Copilot"
                    >
                        <Sparkles size={18} />
                    </button>
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
                <PanelGroup direction="horizontal" id="root-group">

                    {/* Sidebar: File Explorer */}
                    {isSidebarOpen && (
                        <>
                            <Panel
                                defaultSize={20}
                                minSize={10}
                                maxSize={30}
                                className="border-r border-[#333]"
                                id="sidebar-panel"
                                order={1}
                            >
                                <FileExplorer files={fileTree} onFileSelect={selectFile} />
                            </Panel>
                            <PanelResizeHandle className="w-1 bg-[#333] hover:bg-blue-500 transition-colors cursor-col-resize" />
                        </>
                    )}

                    {/* Main Content: Editor & Terminal */}
                    <Panel defaultSize={80} id="main-panel" order={2}>
                        <PanelGroup direction="vertical" id="main-vertical-group">

                            {/* Top: Editor or PDF Viewer (Recursive Layout) */}
                            <Panel defaultSize={70} minSize={20} id="editor-panel" order={1} className="flex flex-col relative">
                                <LayoutRenderer 
                                    node={layout} 
                                    activePaneId={activePaneId}
                                    onSplit={splitPane}
                                    onActivatePane={setActivePaneId}
                                    onActivateTab={activateTab}
                                    onCloseTab={closeTab}
                                    onMoveTab={moveTab}
                                    onSave={saveFile}
                                />
                            </Panel>

                            {/* Bottom: Terminal */}
                            {isTerminalOpen && (
                                <>
                                    <PanelResizeHandle className="h-1 bg-[#333] hover:bg-blue-500 transition-colors cursor-row-resize" />
                                    <Panel defaultSize={30} minSize={10} id="terminal-panel" order={2}>
                                        <Terminal />
                                    </Panel>
                                </>
                            )}

                        </PanelGroup>
                    </Panel>

                    {/* Right Panel: AI Copilot */}
                    {isCopilotOpen && (
                        <>
                            <PanelResizeHandle className="w-1 bg-[#333] hover:bg-purple-500 transition-colors cursor-col-resize" />
                            <Panel
                                defaultSize={20}
                                minSize={15}
                                maxSize={40}
                                id="copilot-panel"
                                order={3}
                            >
                                <CopilotPanel directoryName={directoryHandle ? directoryHandle.name : ""} />
                            </Panel>
                        </>
                    )}

                </PanelGroup>
            </div>
        </div>
    );
}
