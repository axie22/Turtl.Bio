"use client";

import React, { useRef, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";

interface CodeEditorProps {
  initialContent?: string;
  language?: string;
  onChange?: (value: string) => void;
  onSave?: (value: string) => void;
}

export function CodeEditor({
  initialContent = "",
  language = "javascript",
  onChange,
  onSave
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Add Save command (Cmd+S / Ctrl+S)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSave) {
        onSave(editor.getValue());
      }
    });
  };

  const handleChange = (value: string | undefined) => {
    if (onChange && value !== undefined) {
      onChange(value);
    }
  };

  return (
    <div className="h-full w-full bg-[#1e1e1e]">
      <Editor
        height="100%"
        language={language}
        defaultValue={initialContent}
        theme="vs-dark"
        onMount={handleEditorDidMount}
        onChange={handleChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          snippetSuggestions: "none",
          codeLens: false,
          parameterHints: { enabled: false },
          hover: { enabled: false },
          links: false,
        }}
      />
    </div>
  );
}
