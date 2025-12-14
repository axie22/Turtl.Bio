import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Code, Database, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 flex flex-col items-center text-center container px-4 mx-auto">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
          The Workspace built for <br className="hidden sm:inline" />
          <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
            Small Pharma & Biotech
          </span>
        </h1>
        <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
          Accelerate your research with a cloud-native environment designed for
          research. Write, analyze, and collaborate without the infrastructure
          headache.
        </p>
        <div className="flex gap-4">
          <Link href="/workspace">
            <Button size="lg" className="gap-2">
              Try Workspace <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24 mx-auto px-4 rounded-3xl my-10 border border-slate-100 dark:border-slate-800">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Everything you need to run your bioinformatics pipelines.
          </p>
        </div>

        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <Card>
            <CardHeader>
              <Code className="h-10 w-10 mb-2 text-blue-500" />
              <CardTitle>Integrated IDE</CardTitle>
              <CardDescription>
                VS Code-compatible code editor available directly in your
                browser.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 mb-2 text-green-500" />
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Your data stays in your container. Enterprise-grade security for
                your IP.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Database className="h-10 w-10 mb-2 text-purple-500" />
              <CardTitle>Data Ready</CardTitle>
              <CardDescription>
                Connect to local files or massive datasets with ease.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
}
