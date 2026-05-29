import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { LandingScene } from "./LandingScene";
import { WorkspaceScene } from "./WorkspaceScene";

// Landing: 4s (120 frames at 30fps)
const LANDING_DURATION = 120;
// Fade transition: 0.5s (15 frames overlap)
const FADE_DURATION = 15;
// Workspace: 41s (1230 frames at 30fps)
const WORKSPACE_DURATION = 1230;

export const TurtlBioDemo: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={LANDING_DURATION}>
        <LandingScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE_DURATION })}
      />
      <TransitionSeries.Sequence durationInFrames={WORKSPACE_DURATION}>
        <WorkspaceScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
