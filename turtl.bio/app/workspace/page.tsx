"use client";

import { useState } from "react";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { PathMapLayout } from "@/components/workspace/PathMap/PathMapLayout";

export type WorkspaceView = "explorer" | "path-map" | "regulatory-ai";

export default function WorkspacePage() {
  const [view, setView] = useState<WorkspaceView>("explorer");

  const navigate = (v: string) => setView(v as WorkspaceView);

  if (view === "path-map") {
    return (
      <PathMapLayout
        activeView={view}
        onNavigate={navigate}
      />
    );
  }

  return (
    <WorkspaceLayout
      activeView={view}
      onNavigate={navigate}
    />
  );
}
