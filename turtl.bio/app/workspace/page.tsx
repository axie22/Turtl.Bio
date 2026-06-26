"use client";

import { useState } from "react";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { PathMapLayout } from "@/components/workspace/PathMap/PathMapLayout";
import { UploadPage } from "@/components/workspace/PathMap/UploadPage";
import { ContextPage } from "@/components/workspace/PathMap/ContextPage";

export type WorkspaceView = "upload" | "context" | "explorer" | "path-map" | "regulatory-ai";

export default function WorkspacePage() {
  const [view, setView] = useState<WorkspaceView>("upload");

  const navigate = (v: string) => setView(v as WorkspaceView);

  if (view === "upload") {
    return <UploadPage onAnalyze={() => setView("context")} onNavigate={navigate} />;
  }

  if (view === "context") {
    return <ContextPage onGenerate={() => setView("path-map")} onNavigate={navigate} />;
  }

  if (view === "path-map") {
    return <PathMapLayout activeView={view} onNavigate={navigate} />;
  }

  return <WorkspaceLayout activeView={view} onNavigate={navigate} />;
}
