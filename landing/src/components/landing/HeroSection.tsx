import * as React from "react";
import { Bot, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { HeroBackground, AnimatedHeroText } from "@/components/ui/hero-background";
import { AbstractBg } from "@/components/ui/abstract-bg";
import { EnhancedButton } from "@/components/ui/enhanced-button";

interface HeroSectionProps {
  openWaitlistForm: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ openWaitlistForm }) => {
  return (
    <section id="hero" className="py-12 md:py-20 px-4 md:px-8 bg-subtle-accent min-h-[90vh] flex items-center relative overflow-hidden">
      <AbstractBg variant="purple" intensity="medium" />
      <HeroBackground className="container mx-auto max-w-[90%] xl:max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4 font-medium animate-fade-in animate-delay-100">
              <Sparkles size={14} className="animate-pulse-subtle" />
              <span>AI-Powered Contract Intelligence</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight font-poppins">
              <AnimatedHeroText text="Draft, Review and<br>Smart Contracts,<br>powered by AI Agents" />
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mt-6 font-inter">
              Draft, review, and negotiate contracts with your intelligent AI assistant. Built with custom SLMs, LoRA fine-tuning, and RAG for unmatched accuracy and performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in animate-delay-200">
              <EnhancedButton 
                size="lg" 
                className="gap-2 rounded-full shadow-lg bg-primary text-primary-foreground font-medium"
                onClick={openWaitlistForm}
                glowOnHover
                scaleOnHover
                animateIn
              >
                REQUEST DEMO <ArrowRight className="ml-1 h-4 w-4" />
              </EnhancedButton>
            </div>
            <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-muted-foreground font-inter animate-fade-in animate-delay-300">
              <div className="flex items-center gap-1.5 transition-transform hover:translate-y-[-2px]">
                <CheckCircle2 size={16} className="text-primary" />
                <span>AI-powered contract analysis</span>
              </div>
              <div className="flex items-center gap-1.5 transition-transform hover:translate-y-[-2px]">
                <CheckCircle2 size={16} className="text-primary" />
                <span>Enterprise-grade security</span>
              </div>
              <div className="flex items-center gap-1.5 transition-transform hover:translate-y-[-2px]">
                <CheckCircle2 size={16} className="text-primary" />
                <span>24/7 intelligent assistance</span>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in animate-delay-200">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl blur-3xl animate-pulse-slow"></div>
            <div className="relative shadow-xl rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:shadow-primary/20 hover:border-primary/30">
              <div className="border-b border-border/20 p-4 flex items-center gap-4 bg-card/80">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center animate-bounce-subtle">
                  <Bot size={16} className="text-primary" />
                </div>
                <span className="font-medium font-poppins">Accord AI Assistant</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-3 animate-fade-in animate-delay-300">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    ME
                  </div>
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-none text-sm max-w-xs font-inter shadow-sm">
                    Draft an SaaS agreement with custom IP protection clauses for a B2B AI software product.
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end animate-fade-in animate-delay-400">
                  <div className="bg-primary/10 px-4 py-3 rounded-2xl rounded-tr-none text-sm max-w-sm font-inter shadow-sm">
                    <p>I'll create a comprehensive SaaS agreement tailored for your B2B AI software with enhanced IP protection. This will include:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Custom AI-specific IP protection clauses</li>
                      <li>Data usage and ownership provisions</li>
                      <li>Model training restrictions</li>
                      <li>Confidentiality terms for AI algorithms</li>
                    </ul>
                  </div>
                  <div className="w-8 h-8 shrink-0 rounded-full bg-primary flex items-center justify-center animate-bounce-subtle">
                    <Bot size={16} className="text-primary-foreground" />
                  </div>
                </div>
                
                <div className="flex gap-3 animate-fade-in animate-delay-500">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    ME
                  </div>
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-none text-sm max-w-xs font-inter shadow-sm">
                    Can you add specific language about model outputs and derivative works?
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end animate-pulse-subtle animate-fade-in animate-delay-600">
                  <div className="bg-primary/10 px-4 py-3 rounded-2xl rounded-tr-none text-sm max-w-sm font-inter shadow-sm">
                    <p>Absolutely. I'll incorporate specific provisions addressing:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Ownership of model outputs generated by end-users</li>
                      <li>Clear definitions of "derivative works" in AI context</li>
                      <li>Rights to improvements derived from customer data</li>
                      <li>License limitations for AI-generated content</li>
                    </ul>
                    <p className="mt-2">Would you like to see a draft of these clauses now?</p>
                  </div>
                  <div className="w-8 h-8 shrink-0 rounded-full bg-primary flex items-center justify-center animate-bounce-subtle">
                    <Bot size={16} className="text-primary-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HeroBackground>
    </section>
  );
};

export default HeroSection;
