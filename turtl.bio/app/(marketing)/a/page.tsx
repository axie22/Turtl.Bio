import type { Metadata } from "next";
import { HeroA } from "@/components/marketing/HeroA";
import { SharedContent } from "@/components/marketing/SharedContent";

export const metadata: Metadata = {
  title: "Turtl.Bio",
  robots: { index: false, follow: false },
};

export default function VariantA() {
  return (
    <div>
      <HeroA />
      <SharedContent />
    </div>
  );
}
