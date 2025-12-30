"use client";

import React, { useState, useRef, useEffect } from "react";
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

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        setTimeout(() => {
            const aiResponses = [
                "The preclinical toxicology data suggests a potential signal in the hepatic panel. We should cross-reference this with the 21 CFR 312.23(a)(8) requirements for pharmacology and toxicology information.",
                "For the IND application, ensure the Investigator's Brochure (IB) is updated with the latest in vitro metabolic stability data.",
                "I've flagged a potential gap in the CMC (Chemistry, Manufacturing, and Controls) section regarding the stability protocol for the clinical batch.",
                "Based on the mechanism of action, we should anticipate FDA questions regarding off-target effects. I recommend conducting an additional safety pharmacology study.",
                "The protocol for the Phase 1 study needs to explicitly define the stopping rules for dose escalation as per FDA guidance on identifying safe starting doses.",
                "Remember to include the Form FDA 1571 and 1572 in Module 1 of the eCTD structure."
            ];
            const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: randomResponse,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, aiMessage]);
            setIsLoading(false);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

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
            <div className="p-4 border-t border-[#333] bg-[#1e1e1e]">
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
                        onClick={handleSendMessage}
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
