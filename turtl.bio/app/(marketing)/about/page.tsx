import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AboutPage() {
    return (
        <div className="container py-12 md:py-24 mx-auto px-4 max-w-4xl">
            <div className="space-y-6 text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                    About Us
                </h1>
                <p className="text-xl text-muted-foreground mx-auto max-w-2xl">
                    We are building the future of biotech software infrastructure.
                </p>
            </div>

            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold tracking-tight mb-4">Our Mission</h2>
                    <p className="leading-7 [&:not(:first-child)]:mt-6 text-lg">
                        Small biotech companies struggle with fragmented tools and complex cloud infrastructure.
                        Turtl.Bio aims to unify the development experience, giving scientists and bioinformaticians
                        the power of a professional engineering environment without the DevOps overhead.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold tracking-tight mb-6">The Team</h2>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-lg">
                                    AX
                                </div>
                                <div>
                                    <CardTitle>Alexander Xie</CardTitle>
                                    <CardDescription>Co-Founder & Engineering</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                Building the core infrastructure and IDE experience.
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-lg">
                                    TB
                                </div>
                                <div>
                                    <CardTitle>Turtl Bio</CardTitle>
                                    <CardDescription>The Vision</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                Empowering the next generation of therapeutics.
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    );
}
