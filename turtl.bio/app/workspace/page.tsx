"use client";

import { useState } from "react";
import { PathMapLayout } from "@/components/workspace/PathMap/PathMapLayout";
import { UploadPage } from "@/components/workspace/PathMap/UploadPage";
import { ContextPage } from "@/components/workspace/PathMap/ContextPage";

export type WorkspaceView = "upload" | "context" | "workspace";

export default function WorkspacePage() {
  const [view, setView] = useState<WorkspaceView>("upload");

  const navigate = (v: string) => setView(v as WorkspaceView);

  // 1. Document ingestion
  if (view === "upload") {
    return <UploadPage onAnalyze={() => setView("context")} onNavigate={navigate} />;
  }

  // 2. Literature + competitor comparison
  if (view === "context") {
    return <ContextPage onGenerate={() => setView("workspace")} onNavigate={navigate} />;
  }

  // 3. The workspace — graph opens automatically as a tab, END-101 file tree, node copilot
  return <PathMapLayout onNavigate={navigate} />;
}
