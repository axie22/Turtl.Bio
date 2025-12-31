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

    const findTabLocation = (node: LayoutNode, tabId: string): { paneId: string, node: LeafNode, tab: FileTab } | null => {
        if (node.type === 'leaf') {
            const tab = node.tabs.find(t => t.id === tabId);
            if (tab) return { paneId: node.id, node, tab };
        } else {
            for (const child of node.children) {
                const found = findTabLocation(child, tabId);
                if (found) return found;
            }
        }
        return null;
    };

    const removeTabFromNode = (node: LayoutNode, paneId: string, tabId: string): LayoutNode => {
        if (node.id === paneId && node.type === 'leaf') {
            const newTabs = node.tabs.filter(t => t.id !== tabId);
            let newActiveId = node.activeTabId;
            if (node.activeTabId === tabId) {
                newActiveId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
            }
            return { ...node, tabs: newTabs, activeTabId: newActiveId };
        }
        if (node.type === 'split') {
            return { ...node, children: node.children.map(c => removeTabFromNode(c, paneId, tabId)) };
        }
        return node;
    };

    const addTabToNode = (node: LayoutNode, paneId: string, tab: FileTab): LayoutNode => {
        if (node.id === paneId && node.type === 'leaf') {
            const exists = node.tabs.find(t => t.id === tab.id);
            if (exists) return { ...node, activeTabId: tab.id };
            return {
                ...node,
                tabs: [...node.tabs, tab],
                activeTabId: tab.id
            };
        }
        if (node.type === 'split') {
            return { ...node, children: node.children.map(c => addTabToNode(c, paneId, tab)) };
        }
        return node;
    };

    const pruneLayout = (node: LayoutNode): LayoutNode | null => {
        if (node.type === 'leaf') {
            if (node.tabs.length === 0) return null;
            return node;
        }
        
        // Split node
        const newChildren = node.children
            .map(pruneLayout)
            .filter((c): c is LayoutNode => c !== null);

        if (newChildren.length === 0) return null;
        if (newChildren.length === 1) return newChildren[0]; // Collapse split

        return { ...node, children: newChildren };
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

    const findFileNodeByPath = (nodes: FileNode[], searchPath: string): FileNode | null => {
         // Normalized search: remove leading slash if present to match our recursive structure if needed
         // But here my fileTree IDs are built as "/Filename" or "/Folder/Filename" from readDirectory
         // Backend returns "/Filename" or "Folder/Filename". 
         
         const normalizedSearch = searchPath.startsWith('/') ? searchPath : '/' + searchPath;

         for (const node of nodes) {
             if (node.id === normalizedSearch || node.id.endsWith(searchPath)) { // Fuzzy match if absolute path differs slightly
                 return node;
             }
             if (node.children) {
                 const found = findFileNodeByPath(node.children, searchPath);
                 if (found) return found;
             }
         }
         return null;
    };

    const openFileByPath = async (path: string) => {
        const node = findFileNodeByPath(fileTree, path);
        if (node && node.type === 'file') {
            await selectFile(node);
        } else {
            console.warn("File not found in current tree:", path);
            // Optional: visual feedback
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
        setLayout(prev => {
            const updated = removeTabFromNode(prev, paneId, tabId);
            const pruned = pruneLayout(updated);
            // Ensure root is never null if everything is closed
            return pruned || { id: 'root', type: 'leaf', tabs: [], activeTabId: null };
        });
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

    const moveTab = (sourcePaneId: string, targetPaneId: string, tabId: string) => {
        setLayout(prev => {
            const loc = findTabLocation(prev, tabId);
            if (!loc) return prev;
            let newLayout = removeTabFromNode(prev, sourcePaneId, tabId);

            newLayout = addTabToNode(newLayout, targetPaneId, loc.tab);
            
            const pruned = pruneLayout(newLayout);
            return pruned || { id: 'root', type: 'leaf', tabs: [], activeTabId: null };
        });
        setActivePaneId(targetPaneId);
    };

    const splitPane = (targetId: string, direction: 'horizontal' | 'vertical', tabIdToMove?: string) => {
        setLayout(prev => {
            let initialTabs: FileTab[] = [];
            let initialActiveId: string | null = null;
            
            let layoutInProgress = prev;

            if (tabIdToMove) {
                const loc = findTabLocation(prev, tabIdToMove);
                if (loc) {
                    initialTabs = [loc.tab];
                    initialActiveId = loc.tab.id;
                    layoutInProgress = removeTabFromNode(layoutInProgress, loc.paneId, tabIdToMove);
                }
            } else {
                const targetNode = findNode(prev, targetId);
                if (targetNode && targetNode.type === 'leaf' && targetNode.activeTabId) {
                    const activeTab = targetNode.tabs.find(t => t.id === targetNode.activeTabId);
                    if (activeTab) {
                        initialTabs = [activeTab];
                        initialActiveId = activeTab.id;
                    }
                }
            }

            const newId = Date.now().toString();
            const newLeaf: LeafNode = {
                id: newId,
                type: 'leaf',
                tabs: initialTabs,
                activeTabId: initialActiveId
            };

            const splitTransformer = (node: LayoutNode): LayoutNode => {
                 if (node.id === targetId && node.type === 'leaf') {
                     return {
                        id: `${node.id}-split-${Date.now()}`,
                        type: 'split',
                        direction,
                        children: [
                            node,
                            newLeaf
                        ]
                    };
                 }
                 if (node.type === 'split') {
                     return { ...node, children: node.children.map(splitTransformer) };
                 }
                 return node;
            };

            const splitLayout = splitTransformer(layoutInProgress);
            const finalLayout = pruneLayout(splitLayout);
            return finalLayout || { id: 'root', type: 'leaf', tabs: [], activeTabId: null };
        });
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
        activateTab,
        moveTab,
        openFileByPath
    };
}
