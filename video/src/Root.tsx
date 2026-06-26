import { Composition } from "remotion";
import { TurtlBioDemo } from "./TurtlBioDemo";

// 30fps, ~50 seconds total
// Landing: 120 frames (4s)
// Fade transition: 15 frames (overlap)
// Workspace: 1395 frames (46.5s)
// Total: 120 + 1395 - 15 = 1500 frames
const DURATION = 1500;

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
