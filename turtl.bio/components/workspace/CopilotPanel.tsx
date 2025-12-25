"use client";

import React from "react";
import { Sparkles, Send, Check, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CopilotPanelProps {
    directoryName: string;
}

export function CopilotPanel({ directoryName }: CopilotPanelProps) {
    return (
        <div className="h-full w-full bg-[#1e1e1e] border-l border-[#333] flex flex-col">
            {/* Header */}
            <div className="h-10 border-b border-[#333] flex items-center px-4 bg-[#1e1e1e] select-none">
                <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
                <span className="font-bold text-gray-200 text-sm">AI Copilot</span>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-6">
                    {/* Suggestions Section */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Suggestions</h3>

                        <Card className="bg-[#252526] border-[#333]">
                            <CardHeader className="p-3 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-200">Optimize Language</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 pt-0">
                                <p className="text-xs text-gray-400 mb-3">
                                    Suboptimal language usage in <code>Layout.pdf</code>.
                                </p>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="h-7 text-xs border-[#444] hover:bg-[#333] hover:text-white">
                                        <Check className="h-3 w-3 mr-1" /> Fix
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-7 text-xs hover:bg-[#333] hover:text-white">
                                        <X className="h-3 w-3 mr-1" /> Ignore
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Reference Section */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">References</h3>
                        <div className="p-3 bg-[#252526] rounded-md border border-[#333] flex items-start gap-3 hover:bg-[#2a2a2b] cursor-pointer transition-colors">
                            <BookOpen className="h-4 w-4 text-blue-400 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-medium text-gray-200">React Resizable Panels</h4>
                                <p className="text-xs text-gray-400 mt-1">Documentation on conditional rendering and layout stability.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[#333] bg-[#1e1e1e]">
                <div className="relative">
                    <Input
                        placeholder={`Ask a question about ${directoryName || 'workspace'}...`}
                        className="bg-[#252526] border-[#333] text-sm pr-10 focus-visible:ring-purple-500/50"
                    />
                    <Button size="icon" variant="ghost" className="absolute right-1 top-1 h-7 w-7 text-gray-400 hover:text-white">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
