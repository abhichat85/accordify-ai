import React from "react";
import { Bot, PenLine, ClipboardCheck, FileSearch } from "lucide-react";
import { TimelineStep } from "@/components/ui/timeline-step";
import { AbstractBg } from "@/components/ui/abstract-bg";

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 md:px-8 bg-grid relative min-h-[600px]">
      <AbstractBg variant="mesh" intensity="low" />
      <div className="container mx-auto max-w-[90%] xl:max-w-[1400px]">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-2">
            <Bot size={14} />
            <span>Intelligent Interaction</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            How Accord AI Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how our AI agent helps you draft, review, and summarize contracts through natural conversation.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto mt-20">
          <TimelineStep 
            step={1}
            icon={PenLine}
            title="Draft Contracts"
            userMessage="Draft an NDA for software development."
            aiResponse="I've prepared a comprehensive NDA tailored for software development with standard confidentiality provisions, disclosure protocols, and a 2-year term. Would you like me to customize any specific sections?"
            align="left"
          />
          
          <TimelineStep 
            step={2}
            icon={ClipboardCheck}
            title="Review Contracts"
            userMessage="Review this employment agreement for employer-biased clauses."
            aiResponse="I've identified 3 clauses that disproportionately favor the employer: 1) The non-compete is overly broad in scope and duration, 2) The IP assignment has no exceptions for prior work, and 3) The termination terms lack reciprocal notice periods."
            align="right"
          />
          
          <TimelineStep 
            step={3}
            icon={FileSearch}
            title="Summarize Contracts"
            userMessage="Summarize this 45-page cloud service agreement."
            aiResponse="This agreement covers cloud infrastructure services with: 1) A 3-year term with auto-renewal, 2) 99.9% uptime SLA with defined penalties, 3) Monthly billing with net-30 terms, and 4) Data protection terms compliant with GDPR and CCPA."
            align="left"
            isLast={true}
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
