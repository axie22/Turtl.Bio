import type { Metadata } from "next";
import { HeroB } from "@/components/marketing/HeroB";
import { SharedContent } from "@/components/marketing/SharedContent";

export const metadata: Metadata = {
  title: "Turtl.Bio",
  robots: { index: false, follow: false },
};

export default function VariantB() {
  return (
    <div>
      <HeroB />
      <SharedContent />
    </div>
  );
}
