"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import dynamic from "next/dynamic";
import { FileExplorer } from "./FileExplorer";
import { CodeEditor } from "./CodeEditor";

const Terminal = dynamic(() => import("./Terminal").then((mod) => mod.Terminal), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-[#1e1e1e] text-white p-2">Loading Terminal...</div>,
});

export function WorkspaceLayout() {
    return (
        <div className="h-screen w-screen bg-black text-white overflow-hidden flex flex-col">
            {/* Header / Toolbar Stub */}
            <div className="h-10 border-b border-[#333] flex items-center px-4 bg-[#1e1e1e] select-none">
                <span className="font-bold text-gray-200">Values.ts - Turtl.Bio</span>
            </div>

            <div className="flex-1 overflow-hidden">
                <PanelGroup direction="horizontal">

                    {/* Sidebar: File Explorer */}
                    <Panel defaultSize={20} minSize={10} maxSize={30} className="border-r border-[#333]">
                        <FileExplorer />
                    </Panel>

                    <PanelResizeHandle className="w-1 bg-[#333] hover:bg-blue-500 transition-colors cursor-col-resize" />

                    {/* Main Content: Editor & Terminal */}
                    <Panel defaultSize={80}>
                        <PanelGroup direction="vertical">

                            {/* Top: Editor */}
                            <Panel defaultSize={70} minSize={20}>
                                <CodeEditor />
                            </Panel>

                            <PanelResizeHandle className="h-1 bg-[#333] hover:bg-blue-500 transition-colors cursor-row-resize" />

                            {/* Bottom: Terminal */}
                            <Panel defaultSize={30} minSize={10}>
                                <Terminal />
                            </Panel>

                        </PanelGroup>
                    </Panel>

                </PanelGroup>
            </div>
        </div>
    );
}
