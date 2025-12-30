"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CopilotPanelProps {
    directoryName: string;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export function CopilotPanel({ directoryName }: CopilotPanelProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: `Hello! I'm your Turtl.Bio AI assistant specializing in FDA Investigational New Drug (IND) applications. I can help you with preclinical data analysis, 21 CFR Part 312 compliance, and safety reporting.\n\nType a message to start analyzing your IND submission data.`,
            timestamp: Date.now()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const streamResponse = useCallback((fullText: string) => {
        const id = (Date.now() + 1).toString();
        const newMessage: Message = {
            id,
            role: 'assistant',
            content: "",
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, newMessage]);
        setIsLoading(false); // Stop loading spinner, start streaming

        let i = 0;
        const interval = setInterval(() => {
            setMessages(prev => prev.map(msg => 
                msg.id === id 
                    ? { ...msg, content: fullText.slice(0, i + 1) }
                    : msg
            ));
            i++;
            if (i >= fullText.length) {
                clearInterval(interval);
            }
        }, 20); // Typing speed
    }, []);

    const handleSendMessage = useCallback((text: string) => {
        if (!text.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        // Delay before streaming starts
        setTimeout(() => {
            const aiResponses = [
                "The preclinical toxicology data suggests a potential signal in the hepatic panel. We should cross-reference this with the 21 CFR 312.23(a)(8) requirements for pharmacology and toxicology information.",
                "For the IND application, ensure the Investigator's Brochure (IB) is updated with the latest in vitro metabolic stability data.",
                "I've flagged a potential gap in the CMC (Chemistry, Manufacturing, and Controls) section regarding the stability protocol for the clinical batch.",
                "Based on the mechanism of action, we should anticipate FDA questions regarding off-target effects. I recommend conducting an additional safety pharmacology study.",
                "The protocol for the Phase 1 study needs to explicitly define the stopping rules for dose escalation as per FDA guidance on identifying safe starting doses.",
                "Remember to include the Form FDA 1571 and 1572 in Module 1 of the eCTD structure.",
                "Regarding 21 CFR Part 11.10(e), the key requirement is ensuring that the audit trail captures the exact timestamp of every record creation, modification, or deletion. Your system needs to prevent users from altering these timestamps."
            ];
            
            const isContextQuestion = text.includes("21 CFR Part 11.10(e)");
            const responseContent = isContextQuestion 
                ? aiResponses[6] 
                : aiResponses[Math.floor(Math.random() * (aiResponses.length - 1))];

            streamResponse(responseContent);
        }, 1000);
    }, [streamResponse]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage(inputValue);
        }
    };

    // Listen for custom event from Terminal
    useEffect(() => {
        const handleCustomEvent = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (detail) {
                // Ensure the panel is ready to receive
                handleSendMessage(detail);
            }
        };

        window.addEventListener('trigger-copilot-question', handleCustomEvent);
        return () => window.removeEventListener('trigger-copilot-question', handleCustomEvent);
    }, [handleSendMessage]);

    const quickPrompts = [
        "Analyze Safety Data",
        "Check 21 CFR Compliance", 
        "Generate Summary"
    ];

    return (
        <div className="h-full w-full bg-[#1e1e1e] border-l border-[#333] flex flex-col">
            {/* Header */}
            <div className="h-10 border-b border-[#333] flex items-center px-4 bg-[#1e1e1e] select-none shadow-sm">
                <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
                <span className="font-bold text-gray-200 text-sm">AI Copilot</span>
            </div>

            {/* Content Area - Chat History */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                        <div className={`
                            h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0
                            ${msg.role === 'assistant' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}
                        `}>
                            {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                        </div>
                        
                        <div className={`
                            max-w-[85%] rounded-lg p-3 text-sm leading-relaxed
                            ${msg.role === 'assistant' 
                                ? 'bg-[#252526] text-gray-300 border border-[#333]' 
                                : 'bg-blue-600 text-white border border-blue-500'}
                        `}>
                            {msg.content}
                            {msg.role === 'assistant' && msg.id !== 'welcome' && (msg.content.length === 0 || msg === messages[messages.length - 1] && isLoading === false && msg.content.length > 0 && msg.content.length < 10) && (
                                <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-purple-400 animate-pulse" />
                            )}
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex gap-3">
                         <div className="h-8 w-8 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
                            <Bot size={16} />
                        </div>
                        <div className="bg-[#252526] rounded-lg p-3 border border-[#333] flex items-center gap-1.5 h-10">
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[#333] bg-[#1e1e1e] space-y-3">
                {/* Quick Prompts */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {quickPrompts.map((prompt) => (
                        <button
                            key={prompt}
                            onClick={() => handleSendMessage(prompt)}
                            disabled={isLoading}
                            className="text-xs bg-[#2a2a2a] hover:bg-[#333] text-gray-300 px-3 py-1.5 rounded-full border border-[#444] whitespace-nowrap transition-colors disabled:opacity-50"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>

                <div className="relative flex gap-2">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Ask about ${directoryName || 'workspace'}...`}
                        className="bg-[#252526] border-[#333] text-sm focus-visible:ring-purple-500/50 flex-1"
                    />
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleSendMessage(inputValue)}
                        disabled={!inputValue.trim() || isLoading}
                        className="h-10 w-10 text-gray-400 hover:text-white hover:bg-[#333]"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
