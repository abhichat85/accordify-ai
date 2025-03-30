
import React from "react";
import { Button } from "@/components/ui/button";
import { Bot, CheckCircle2, Sparkles } from "lucide-react";
import { HeroBackground, AnimatedHeroText, AnimatedWaitlistButton } from "@/components/ui/hero-background";

interface HeroSectionProps {
  openWaitlistForm: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ openWaitlistForm }) => {
  return (
    <HeroBackground className="py-20 md:py-28 px-4 md:px-8 lg:px-0 bg-subtle-accent">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
              <Sparkles size={14} />
              <span>AI-Powered Legal Intelligence</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              <AnimatedHeroText text="Draft, Review and<br>Intelligence of Contracts,<br>powered by AI Agent" />
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              Draft, review, and negotiate contracts with your intelligent AI assistant. Built with custom SLMs, LoRA fine-tuning, and RAG for unmatched accuracy and performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <AnimatedWaitlistButton onClick={openWaitlistForm} />
            </div>
            <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-primary" />
                <span>AI-powered contract analysis</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-primary" />
                <span>Enterprise-grade security</span>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in delay-100">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl blur-3xl"></div>
            <div className="relative shadow-xl rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="border-b border-border/20 p-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot size={16} className="text-primary" />
                </div>
                <span className="font-medium">Accord AI Assistant</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    ME
                  </div>
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-none text-sm max-w-xs">
                    Draft an SaaS agreement with custom IP protection clauses for a B2B AI software product.
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end">
                  <div className="bg-primary/10 px-4 py-3 rounded-2xl rounded-tr-none text-sm max-w-sm">
                    <p>I'll create a comprehensive SaaS agreement tailored for your B2B AI software with enhanced IP protection. This will include:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Custom AI-specific IP protection clauses</li>
                      <li>Data usage and ownership provisions</li>
                      <li>Model training restrictions</li>
                      <li>Confidentiality terms for AI algorithms</li>
                    </ul>
                  </div>
                  <div className="w-8 h-8 shrink-0 rounded-full bg-primary flex items-center justify-center">
                    <Bot size={16} className="text-primary-foreground" />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    ME
                  </div>
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-none text-sm max-w-xs">
                    Can you add specific language about model outputs and derivative works?
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end animate-pulse-subtle">
                  <div className="bg-primary/10 px-4 py-3 rounded-2xl rounded-tr-none text-sm max-w-sm">
                    <p>Absolutely. I'll incorporate specific provisions addressing:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Ownership of model outputs generated by end-users</li>
                      <li>Clear definitions of "derivative works" in AI context</li>
                      <li>Rights to improvements derived from customer data</li>
                      <li>License limitations for AI-generated content</li>
                    </ul>
                    <p className="mt-2">Would you like to see a draft of these clauses now?</p>
                  </div>
                  <div className="w-8 h-8 shrink-0 rounded-full bg-primary flex items-center justify-center">
                    <Bot size={16} className="text-primary-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeroBackground>
  );
};

export default HeroSection;
