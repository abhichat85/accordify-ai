
import React from "react";
import { Bot, PenLine, ClipboardCheck, FileSearch } from "lucide-react";

interface InteractionStepProps {
  userMessage: string;
  aiResponse: string;
  icon: React.ElementType;
  title: string;
}

const InteractionStep: React.FC<InteractionStepProps> = ({ userMessage, aiResponse, icon: Icon, title }) => (
  <div className="bg-card border border-border/50 rounded-xl p-6 space-y-6 animate-fade-in">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon size={24} className="text-primary" />
      </div>
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
    </div>
    
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="w-8 h-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
          ME
        </div>
        <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-none text-sm max-w-md">
          <p className="typing-step">{userMessage}</p>
        </div>
      </div>
      
      <div className="flex gap-3 justify-end">
        <div className="bg-primary/10 px-4 py-3 rounded-2xl rounded-tr-none text-sm max-w-md">
          <p>{aiResponse}</p>
        </div>
        <div className="w-8 h-8 shrink-0 rounded-full bg-primary flex items-center justify-center">
          <Bot size={16} className="text-primary-foreground" />
        </div>
      </div>
    </div>
  </div>
);

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 md:px-8 lg:px-0 bg-grid">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-2">
            <Bot size={14} />
            <span>Intelligent Interaction</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            How Accord AI Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how our AI agent helps you draft, review, and summarize contracts through natural conversation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <InteractionStep 
            icon={PenLine}
            title="Draft Contracts"
            userMessage="Draft a simple NDA for a software development project with standard confidentiality clauses."
            aiResponse="I've prepared a comprehensive NDA tailored for software development with standard confidentiality provisions, disclosure protocols, and a 2-year term. Would you like me to customize any specific sections?"
          />
          
          <InteractionStep 
            icon={ClipboardCheck}
            title="Review Contracts"
            userMessage="Review this employment agreement and identify any clauses that favor the employer too heavily."
            aiResponse="I've identified 3 clauses that disproportionately favor the employer: 1) The non-compete is overly broad in scope and duration, 2) The IP assignment has no exceptions for prior work, and 3) The termination terms lack reciprocal notice periods."
          />
          
          <InteractionStep 
            icon={FileSearch}
            title="Summarize Contracts"
            userMessage="Summarize the key terms of this 45-page service agreement for cloud infrastructure services."
            aiResponse="This agreement covers cloud infrastructure services with: 1) A 3-year term with auto-renewal, 2) 99.9% uptime SLA with defined penalties, 3) Monthly billing with net-30 terms, and 4) Data protection terms compliant with GDPR and CCPA."
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
