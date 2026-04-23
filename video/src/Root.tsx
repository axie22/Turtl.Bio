import { Composition } from "remotion";
import { TurtlBioDemo } from "./TurtlBioDemo";

// 30fps, ~54 seconds total
// Landing: 120 frames (4s)
// Fade transition: 15 frames (overlap)
// Workspace: 1530 frames (~51s)
// Total composition: 120 + 1530 - 15 = 1635 frames
const DURATION = 1635;

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
