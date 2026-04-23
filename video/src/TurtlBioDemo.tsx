import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { LandingScene } from "./LandingScene";
import { WorkspaceScene } from "./WorkspaceScene";

// Shot 1: Landing page — 4 seconds (120 frames at 30fps)
const LANDING_DURATION = 120;
// Transition: fade — 0.5 seconds (15 frames)
const FADE_DURATION = 15;
// Shots 2-6: Workspace — 51 seconds (1530 frames at 30fps)
const WORKSPACE_DURATION = 1530;

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
