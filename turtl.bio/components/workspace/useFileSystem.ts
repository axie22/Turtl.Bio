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

export interface FileSystemState {
    directoryHandle: FileSystemDirectoryHandle | null;
    fileTree: FileNode[];
    currentFile: {
        handle: FileSystemFileHandle;
        content: string;
        path: string;
        objectUrl?: string;
    } | null;
    unsavedChanges: boolean;
}

export function useFileSystem() {
    const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);
    const [fileTree, setFileTree] = useState<FileNode[]>([]);
    const [currentFile, setCurrentFile] = useState<FileSystemState['currentFile']>(null);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

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
        // Sort directories first, then files
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
        const file = await handle.getFile();

        // Check if file is PDF
        if (node.name.toLowerCase().endsWith('.pdf')) {
            const objectUrl = URL.createObjectURL(file);
            setCurrentFile({
                handle,
                content: "", // No text content for PDF
                path: node.id,
                objectUrl
            });
        } else {
            const content = await file.text();
            setCurrentFile({
                handle,
                content,
                path: node.id
            });
        }
        setUnsavedChanges(false);
    };

    const saveFile = async (content: string) => {
        if (!currentFile) return;
        try {
            const writable = await currentFile.handle.createWritable();
            await writable.write(content);
            await writable.close();
            setCurrentFile({ ...currentFile, content });
            setUnsavedChanges(false);
        } catch (err) {
            console.error("Error saving file:", err);
        }
    };

    return {
        directoryHandle,
        fileTree,
        currentFile,
        unsavedChanges,
        openDirectory,
        selectFile,
        saveFile,
        setUnsavedChanges
    };
}
