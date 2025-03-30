
import React from "react";
import { CheckCircle2 } from "lucide-react";
import TechCard from "@/components/landing/TechCard";

const TechnologySection: React.FC = () => {
  const techCards = [
    {
      title: "SLM Legal Models",
      description: "Specialized small language models optimized for legal understanding and generation.",
      icon: "🧠"
    },
    {
      title: "RAG Architecture",
      description: "Retrieval-Augmented Generation ensures accurate and reliable information in your contracts.",
      icon: "📚"
    },
    {
      title: "LoRA Fine-tuning",
      description: "Low-Rank Adaptation enables precise domain specialization with minimal compute.",
      icon: "🛠️"
    },
    {
      title: "Edge Processing",
      description: "Local model execution for enhanced speed and privacy of sensitive contract data.",
      icon: "⚡"
    }
  ];
  
  return (
    <div className="container mx-auto max-w-6xl">
      <div className="text-center mb-16 space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold">Our Technology</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Powered by specialized AI models for unmatched understanding of legal language and context.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {techCards.map((card, index) => (
          <TechCard
            key={index}
            title={card.title}
            description={card.description}
            icon={card.icon}
            className="h-full card-elevation"
          />
        ))}
      </div>
      
      <div className="mt-16 bg-background/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-border/20 card-elevation">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Built for Performance and Privacy</h3>
            <p className="text-muted-foreground mb-4">
              Our technology stack prioritizes both powerful AI capabilities and strict data security. We've engineered our platform to provide enterprise-grade performance while maintaining the highest standards of privacy.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-primary mt-0.5" />
                <span>Edge computing for sensitive data processing</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-primary mt-0.5" />
                <span>SOC 2 Type II compliant infrastructure</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-primary mt-0.5" />
                <span>Model training on anonymized legal corpora</span>
              </li>
            </ul>
          </div>
          <div className="bg-muted/30 rounded-xl p-6 relative deboss">
            <div className="aspect-video rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1581092921461-eab10380b606?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                alt="Technology visualization" 
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnologySection;
