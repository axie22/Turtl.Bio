import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, AlertTriangle, Users, GitMerge, FileText, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">

      {/* Hero Section */}
      <section className="space-y-6 pb-12 pt-16 md:pb-20 md:pt-24 lg:py-32 flex flex-col items-center text-center container px-4 mx-auto max-w-5xl">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200 mb-4">
          In Alpha Stage
        </div>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tighter md:text-6xl lg:text-7xl lg:leading-[1.1]">
          Pre-IND Interpretation, <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
            Without the Ambiguity
          </span>
        </h1>
        <p className="max-w-[800px] text-lg text-muted-foreground sm:text-xl leading-relaxed">
          The structured workspace for preclinical biotech teams to understand what FDA guidance and precedent
          <em> actually</em> mean for your specific product.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/workspace">
            <Button size="lg" className="gap-2 h-12 px-8 text-base">
              Try Workspace <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* The Problem: Ambiguity */}
      <section className="w-full py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Why Early-Stage Teams Struggle
            </h2>
            <p className="text-lg text-muted-foreground">
              It's not about finding the guidance. It's about interpreting high-level, conditional requirements in the context of your specific modality.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            <Card className="bg-background border-slate-200 dark:border-slate-800">
              <CardHeader>
                <AlertTriangle className="h-10 w-10 text-orange-500 mb-2" />
                <CardTitle>Ambiguous Guidance</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                FDA guidance is often high-level and conditional. Teams over-plan or under-plan studies because "applicability" varies by reviewer and product type.
              </CardContent>
            </Card>

            <Card className="bg-background border-slate-200 dark:border-slate-800">
              <CardHeader>
                <GitMerge className="h-10 w-10 text-blue-500 mb-2" />
                <CardTitle>Fragmented Precedent</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Relevant precedent is scattered across generic databases, internal spreadsheets, and consultant summaries. There is no shared structure.
              </CardContent>
            </Card>

            <Card className="bg-background border-slate-200 dark:border-slate-800">
              <CardHeader>
                <Users className="h-10 w-10 text-purple-500 mb-2" />
                <CardTitle>Reliance on Consultants</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Lack of internal regulatory depth leads to interpretation bottlenecks, avoidable delays, and expensive dependency on external opinions.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The Solution: Interpretation Workspace */}
      <section className="container py-20 md:py-32 px-4 mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 text-blue-600 font-bold tracking-wide uppercase text-sm">
              <BookOpen className="h-4 w-4" />
              Our Approach
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Interpretation, <br /> Not Automation.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We don't automate drafting or replace your experts. We provide a workspace that structures the chaotic logic of regulatory applicability.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground">Connect Guidance to Product</h4>
                  <p className="text-sm text-muted-foreground">Map high-level FDA requirements directly to your product's specific attributes.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground">Contextualize with Precedent</h4>
                  <p className="text-sm text-muted-foreground">See how similar products interpreted the same conditional requirements.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground">Decide with Confidence</h4>
                  <p className="text-sm text-muted-foreground">Make and document applicability decisions earlier in development.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Abstract */}
          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-2 shadow-2xl">
            <div className="rounded-xl overflow-hidden bg-background border border-slate-200 dark:border-slate-700 relative aspect-[4/3]">
              <Image
                src="/IND-process.webp"
                alt="Interpretation Workspace Visual"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-blue-600 dark:bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Stop guessing. Start interpreting.</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join the alpha and give your team the regulatory clarity they need to move fast.
            Contact us to get early access.
          </p>
          <Link href="mailto:hl4929@nyu.edu">
            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-semibold text-blue-700">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
