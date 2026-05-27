import type { Metadata } from "next";
import { HeroC } from "@/components/marketing/HeroC";
import { SharedContent } from "@/components/marketing/SharedContent";

export const metadata: Metadata = {
  title: "Turtl.Bio",
  robots: { index: false, follow: false },
};

export default function VariantC() {
  return (
    <div>
      <HeroC />
      <SharedContent />
    </div>
  );
}
