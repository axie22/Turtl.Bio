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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Linkedin } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  image?: string;
  initials?: string;
  linkedin?: string;
  pastExperience?: string[];
  bio?: string;
}

const TEAM: TeamMember[] = [
  {
    name: "Anthony Lee",
    role: "Product & Discovery Lead",
    image: "/Anthony.jpeg",
    linkedin: "https://www.linkedin.com/in/hyunjun-lee-990021248/",
    pastExperience: ["New York University"],
    bio: "Anthony leads product discovery and user research at Turtl.Bio. \
          With a background in business, he focuses on understanding \
          how early-stage biotech teams navigate regulatory uncertainty and translating \
          those insights into clear, usable product direction.",
  },
  {
    name: "Sabrina Wu",
    role: "Product Lead",
    image: "/Sabrina.jpeg",
    linkedin: "https://www.linkedin.com/in/jingshu-wu2024/",
    pastExperience: ["UCLA", "The Mind Research Network"],
    bio: "Sabrina drives product strategy and execution at Turtl.Bio. \
          With experience across research and product management, she ensures the platform \
          is grounded in real scientific workflows and solves meaningful problems for researchers \
          and biotech teams.",
  },
  {
    name: "Alexander Xie",
    role: "Engineering Lead",
    image: "/Alex.jpeg",
    linkedin: "https://linkedin.com/in/alexanderxie04",
    pastExperience: ["Amazon", "Fortinet"],
    bio: "Alexander leads engineering and system architecture at Turtl.Bio. \
          Drawing on experience from Amazon and Fortinet, he focuses on building scalable, \
          reliable infrastructure and defining the right level of technical modeling to support \
          complex regulatory reasoning.",
  },
  {
    name: "Sam",
    role: "Outreach & Strategy Lead",
    image: "/Sam.jpeg",
    linkedin: "https://www.linkedin.com/in/sam-mathew-2b147526a/",
    pastExperience: ["HealthWorks for Northern Virginia"],
    bio: "Sam leads outreach and strategic partnerships at Turtl.Bio. He works closely with founders, \
          researchers, and advisors to understand industry needs and help shape how the platform supports\
          early-stage biotech teams.",
  },
  {
    name: "Grace",
    role: "Full Stack Engineer",
    image: "/Grace.jpeg",
    linkedin: "https://www.linkedin.com/in/gracehe04/",
    pastExperience: ["Nike"],
    bio: "Grace builds the core frontend and backend systems at Turtl.Bio. \
          With a strong full-stack background, she focuses on creating intuitive, \
          reliable user experiences that support complex workflows without adding unnecessary friction.",
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
            <Dialog key={member.name}>
              <DialogTrigger asChild>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-800 flex flex-col pt-6 items-center cursor-pointer hover:-translate-y-1 group">
                  <Avatar className="h-24 w-24 border-2 border-slate-100 dark:border-slate-700 shadow-sm transition-transform group-hover:scale-105">
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
                    <div className="text-xs text-muted-foreground group-hover:text-blue-500 transition-colors">
                      Click to learn more
                    </div>
                  </CardFooter>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="flex flex-col items-center sm:items-start gap-4">
                  <div className="flex flex-col items-center sm:flex-row sm:gap-4 w-full">
                    <Avatar className="h-24 w-24 border-2 border-slate-100 dark:border-slate-700 shadow-sm">
                      <AvatarImage
                        src={member.image}
                        alt={member.name}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center sm:text-left mt-4 sm:mt-0">
                      <DialogTitle className="text-2xl font-bold">
                        {member.name}
                      </DialogTitle>
                      <DialogDescription className="text-blue-500 font-semibold mt-1">
                        {member.role}
                      </DialogDescription>

                      <div className="mt-2 flex justify-center sm:justify-start">
                        <Link href={member.linkedin || "#"} target="_blank">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-2"
                          >
                            <Linkedin className="h-4 w-4" />
                            LinkedIn
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="text-sm text-foreground/90 leading-relaxed">
                    {member.bio}
                  </div>

                  {member.pastExperience && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium leading-none">Experience</h4>
                      <div className="flex flex-wrap gap-2">
                        {member.pastExperience.map((exp) => (
                          <span
                            key={exp}
                            className="px-2.5 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs font-medium"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </section>
    </div>
  );
}
