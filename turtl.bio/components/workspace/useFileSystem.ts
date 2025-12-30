import { useState, useCallback } from "react";

// Types for File System Access API
// @ts-ignore
interface FileSystemHandle {
    kind: 'file' | 'directory';
    name: string;
    isSameEntry(other: FileSystemHandle): Promise<boolean>;
}

// @ts-ignore
interface FileSystemFileHandle extends FileSystemHandle {
    kind: 'file';
    getFile(): Promise<File>;
    createWritable(options?: any): Promise<FileSystemWritableFileStream>;
}

// @ts-ignore
interface FileSystemWritableFileStream extends WritableStream {
    write(data: any): Promise<void>;
    seek(position: number): Promise<void>;
    truncate(size: number): Promise<void>;
    close(): Promise<void>;
}

// @ts-ignore
interface FileSystemDirectoryHandle extends FileSystemHandle {
    kind: 'directory';
    values(): AsyncIterable<FileSystemDirectoryHandle | FileSystemFileHandle>;
}

declare global {
    interface Window {
        showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
    }
}


export interface FileNode {
    id: string;
    name: string;
    type: "file" | "folder";
    handle: FileSystemDirectoryHandle | FileSystemFileHandle;
    children?: FileNode[];
}

export type LayoutNode = SplitNode | LeafNode;

export interface SplitNode {
    id: string;
    type: 'split';
    direction: 'horizontal' | 'vertical';
    children: LayoutNode[];
}

export interface FileTab {
    id: string; // path
    name: string;
    content: string;
    handle: FileSystemFileHandle;
    objectUrl?: string; // for PDF
}

export interface LeafNode {
    id: string;
    type: 'leaf';
    tabs: FileTab[];
    activeTabId: string | null;
}

export interface FileSystemState {
    directoryHandle: FileSystemDirectoryHandle | null;
    fileTree: FileNode[];
    layout: LayoutNode;
    activePaneId: string;
    unsavedChanges: boolean;
}

export function useFileSystem() {
    const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);
    const [fileTree, setFileTree] = useState<FileNode[]>([]);
    
    // Initial Layout: Single Empty Leaf
    const [layout, setLayout] = useState<LayoutNode>({
        id: 'root',
        type: 'leaf',
        tabs: [],
        activeTabId: null
    });
    const [activePaneId, setActivePaneId] = useState<string>('root');
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    // Helpers to recursively find/update nodes
    const findNode = (node: LayoutNode, id: string): LayoutNode | null => {
        if (node.id === id) return node;
        if (node.type === 'split') {
            for (const child of node.children) {
                const found = findNode(child, id);
                if (found) return found;
            }
        }
        return null;
    };

    const updateNode = (root: LayoutNode, targetId: string, transform: (node: LayoutNode) => LayoutNode): LayoutNode => {
        if (root.id === targetId) return transform(root);
        if (root.type === 'split') {
            return {
                ...root,
                children: root.children.map(child => updateNode(child, targetId, transform))
            };
        }
        return root;
    };

    const readDirectory = async (dirHandle: FileSystemDirectoryHandle, path: string = ""): Promise<FileNode[]> => {
        const nodes: FileNode[] = [];
        for await (const entry of dirHandle.values()) {
            const entryPath = `${path}/${entry.name}`;
            if (entry.kind === "file") {
                nodes.push({
                    id: entryPath,
                    name: entry.name,
                    type: "file",
                    handle: entry
                });
            } else if (entry.kind === "directory") {
                const children = await readDirectory(entry, entryPath);
                nodes.push({
                    id: entryPath,
                    name: entry.name,
                    type: "folder",
                    handle: entry,
                    children
                });
            }
        }
        return nodes.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === "folder" ? -1 : 1;
        });
    };

    const openDirectory = async () => {
        try {
            const handle = await window.showDirectoryPicker();
            setDirectoryHandle(handle);
            const tree = await readDirectory(handle);
            setFileTree(tree);
        } catch (err) {
            if ((err as Error).name !== 'AbortError') {
                console.error("Error opening directory:", err);
            }
        }
    };

    const selectFile = async (node: FileNode) => {
        if (node.type !== "file") return;
        const handle = node.handle as FileSystemFileHandle;
        
        setLayout(prev => updateNode(prev, activePaneId, (paneNode) => {
            if (paneNode.type !== 'leaf') return paneNode;

            // Check if tab already exists
            const existingTab = paneNode.tabs.find(t => t.id === node.id);
            if (existingTab) {
                return { ...paneNode, activeTabId: node.id };
            }

            return paneNode; 
        }));

        // Read file content first
        let newTab: FileTab;
        const file = await handle.getFile();
        if (node.name.toLowerCase().endsWith('.pdf')) {
            newTab = {
                id: node.id,
                name: node.name,
                handle,
                content: "",
                objectUrl: URL.createObjectURL(file)
            };
        } else {
            newTab = {
                id: node.id,
                name: node.name,
                handle,
                content: await file.text()
            };
        }

        // Now update state with the new tab
        setLayout(prev => updateNode(prev, activePaneId, (paneNode) => {
            if (paneNode.type !== 'leaf') return paneNode;
            
            // Re-check existence to be safe (race condition unlikely but good practice)
            const existingTab = paneNode.tabs.find(t => t.id === node.id);
            if (existingTab) {
                return { ...paneNode, activeTabId: node.id };
            }

            return {
                ...paneNode,
                tabs: [...paneNode.tabs, newTab],
                activeTabId: newTab.id
            };
        }));
        
        setUnsavedChanges(false);
    };

    const activateTab = (paneId: string, tabId: string) => {
        setActivePaneId(paneId);
        setLayout(prev => updateNode(prev, paneId, (node) => {
            if (node.type === 'leaf') {
                return { ...node, activeTabId: tabId };
            }
            return node;
        }));
    };

    const closeTab = (paneId: string, tabId: string) => {
        setLayout(prev => updateNode(prev, paneId, (node) => {
            if (node.type !== 'leaf') return node;

            const newTabs = node.tabs.filter(t => t.id !== tabId);
            let newActiveId = node.activeTabId;

            // If we closed the active tab, switch to another one
            if (tabId === node.activeTabId) {
                newActiveId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
            }

            return {
                ...node,
                tabs: newTabs,
                activeTabId: newActiveId
            };
        }));
    };

    const saveFile = async (content: string) => {
        const activeNode = findNode(layout, activePaneId) as LeafNode;
        if (!activeNode || !activeNode.activeTabId) return;

        const activeTab = activeNode.tabs.find(t => t.id === activeNode.activeTabId);
        if (!activeTab) return;

        try {
            const writable = await activeTab.handle.createWritable();
            await writable.write(content);
            await writable.close();
            
            // Update content in state for ALL instances of this file? 
            // Ideally yes, but for now just this tab in this pane.
            // COMPLEXITY: Syncing changes across split panes for same file.
            // MVP: Just update this tab.
            setLayout(prev => updateNode(prev, activePaneId, (node) => {
                if (node.type === 'leaf') {
                    return {
                        ...node,
                        tabs: node.tabs.map(t => 
                            t.id === activeTab.id ? { ...t, content } : t
                        )
                    };
                }
                return node;
            }));
            
            setUnsavedChanges(false);
        } catch (err) {
            console.error("Error saving file:", err);
        }
    };

    const splitPane = (targetId: string, direction: 'horizontal' | 'vertical', tabIdToMove?: string) => {
        // Helper to find a tab by ID anywhere in the layout
        const findTab = (node: LayoutNode, id: string): FileTab | null => {
            if (node.type === 'leaf') {
                return node.tabs.find(t => t.id === id) || null;
            }
            for (const child of node.children) {
                const found = findTab(child, id);
                if (found) return found;
            }
            return null;
        };

        setLayout(prev => updateNode(prev, targetId, (node) => {
            if (node.type !== 'leaf') return node;

            const newId = Date.now().toString();
            
            // Determine initial tab for new pane
            let initialTabs: FileTab[] = [];
            let initialActiveId: string | null = null;

            if (tabIdToMove) {
                const tab = findTab(prev, tabIdToMove);
                if (tab) {
                    initialTabs = [tab];
                    initialActiveId = tab.id;
                }
            } 
            
            if (initialTabs.length === 0 && node.activeTabId) {
                const activeTab = node.tabs.find(t => t.id === node.activeTabId);
                if (activeTab) {
                    initialTabs = [activeTab];
                    initialActiveId = activeTab.id;
                }
            }

            const newLeaf: LeafNode = {
                id: newId,
                type: 'leaf',
                tabs: initialTabs,
                activeTabId: initialActiveId
            };

            return {
                id: `${node.id}-split-${Date.now()}`,
                type: 'split',
                direction,
                children: [
                    node,
                    newLeaf
                ]
            };
        }));
    };

    return {
        directoryHandle,
        fileTree,
        layout,
        activePaneId,
        unsavedChanges,
        openDirectory,
        selectFile,
        saveFile,
        setUnsavedChanges,
        setLayout,
        setActivePaneId,
        splitPane,
        closeTab,
        activateTab
    };
}
