import { Composition } from "remotion";
import { TurtlBioDemo } from "./TurtlBioDemo";

// 30fps, ~44.5 seconds total
// Landing: 120 frames (4s)
// Fade transition: 15 frames (overlap)
// Workspace: 1230 frames (41s)
// Total: 120 + 1230 - 15 = 1335 frames
const DURATION = 1335;

export const RemotionRoot = () => {
  return (
    <Composition
      id="TurtlBioDemo"
      component={TurtlBioDemo}
      durationInFrames={DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
