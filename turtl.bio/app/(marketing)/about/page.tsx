import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  image?: string;
  initials?: string;
  linkedin?: string;
  pastExperience?: string[];
}

const TEAM: TeamMember[] = [
  {
    name: "Anthony Lee",
    role: "Product & Discovery Lead",
    image: "/Anthony.jpeg",
    linkedin: "https://www.linkedin.com/in/hyunjun-lee-990021248/",
    pastExperience: ["New York University"],
  },
  {
    name: "Sabrina Wu",
    role: "Product Lead",
    image: "/Sabrina.jpeg",
    linkedin: "https://www.linkedin.com/in/jingshu-wu2024/",
    pastExperience: ["UCLA", "The Mind Research Network"],
  },
  {
    name: "Alexander Xie",
    role: "Engineering Lead",
    initials: "AX",
    linkedin: "https://linkedin.com/in/alexanderxie04",
    pastExperience: ["Amazon", "Fortinet"],
  },
  {
    name: "Sam",
    role: "Outreach & Strategy Lead",
    image: "/Sam.jpeg",
    linkedin: "https://www.linkedin.com/in/sam-mathew-2b147526a/",
    pastExperience: ["HealthWorks for Northern Virginia"],
  },
  {
    name: "Grace",
    role: "Full Stack Engineer",
    image: "/Grace.jpeg",
    linkedin: "https://www.linkedin.com/in/gracehe04/",
    pastExperience: ["Nike"],
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:to-slate-950/50">
      {/* Hero Section */}
      <section className="container py-16 text-center mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Building the OS for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
            Biological Intelligence
          </span>
        </h1>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 max-w-3xl mb-16 text-center">
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Small biotech companies struggle with fragmented tools and complex
            cloud infrastructure. Turtl.Bio aims to unify the development
            experience, giving scientists and bioinformaticians the power of a
            professional engineering environment without the DevOps overhead.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="container py-8 px-4 mx-auto">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Meet the Team
          </h2>
          <div className="h-1 w-12 bg-blue-500 rounded-full" />
        </div>

        {/* Compact Grid: up to 5 cols for the 5 members */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-7xl mx-auto justify-center">
          {TEAM.map((member) => (
            <Card
              key={member.name}
              className="overflow-hidden hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800 flex flex-col pt-6 items-center"
            >
              <Avatar className="h-24 w-24 border-2 border-slate-100 dark:border-slate-700 shadow-sm">
                <AvatarImage
                  src={member.image}
                  alt={member.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-slate-500 text-2xl font-bold">
                  {member.initials}
                </AvatarFallback>
              </Avatar>

              <CardHeader className="text-center p-4 pb-0 w-full">
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <CardDescription className="text-blue-500 text-xs font-semibold uppercase tracking-wide">
                  {member.role}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 pt-2 flex-grow text-center w-full">
                {member.pastExperience && (
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Previously:
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1 justify-center">
                      {member.pastExperience.map((exp) => (
                        <span
                          key={exp}
                          className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px]"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="justify-center p-4 pt-0 w-full">
                <Link href={member.linkedin || "#"} target="_blank">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-blue-700"
                  >
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
