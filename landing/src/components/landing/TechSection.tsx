import React from "react";
import { BrainCircuit, Layers, Database, Network, ServerCog, Code2 } from "lucide-react";
import { TechCard } from "@/components/ui/tech-card";
import { TechBackground } from "@/components/ui/tech-background";
import { EnhancedButton } from "@/components/ui/enhanced-button";

const TechSection: React.FC = () => {
  return (
    <section id="tech" className="relative py-32 px-4 md:px-8 overflow-hidden">
      <TechBackground />
      <div className="container mx-auto max-w-[90%] xl:max-w-[1400px] relative z-10">
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm mb-2 backdrop-blur-sm border border-primary/10 shadow-glow-sm">
            <BrainCircuit size={16} className="animate-pulse-subtle" />
            <span className="font-medium tracking-wide">ADVANCED TECHNOLOGY</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary/90 via-primary to-primary/70 bg-clip-text text-transparent pb-2 drop-shadow-sm">
            Cutting-Edge AI Infrastructure
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform is built on sophisticated AI technologies that combine deep legal expertise with advanced machine learning for unmatched accuracy and performance.
          </p>
        </div>
        
        <div className="relative mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <TechCard 
              icon={BrainCircuit}
              title="Custom SLMs"
              description="Specialized Language Models designed specifically for legal and contract analysis, trained on vast corpora of legal documents for superior understanding of legal concepts and terminology."
              index={0}
            />
            <TechCard 
              icon={Layers}
              title="LoRA Fine-tuning"
              description="Low-Rank Adaptation provides efficient and targeted fine-tuning of our models on specific contract types and legal domains, ensuring higher precision with minimal computational overhead."
              index={1}
            />
            <TechCard 
              icon={Database}
              title="RAG Architecture"
              description="Retrieval-Augmented Generation combines the power of large language models with specialized legal knowledge bases to ensure responses are grounded in accurate and relevant legal information."
              index={2}
            />
            <TechCard 
              icon={Network}
              title="Domain Adaptation"
              description="Our models adapt to specific industries and use cases, learning the unique language and requirements of different business sectors for more relevant contract generation."
              index={3}
            />
            <TechCard 
              icon={ServerCog}
              title="Legal Reasoning Engines"
              description="Specialized reasoning modules that analyze contractual clauses for risks, inconsistencies, and compliance issues across multiple jurisdictions."
              index={4}
            />
            <TechCard 
              icon={Code2}
              title="Custom Embeddings"
              description="Proprietary embedding models that capture the semantic relationships between legal concepts for more accurate document comparison and clause recommendation."
              index={5}
            />
          </div>
          
          <div className="mt-16 text-center">
            <EnhancedButton 
              className="bg-primary/20 text-white hover:bg-primary/30 border border-primary/20 backdrop-blur-sm rounded-lg px-8"
              onClick={() => window.open('https://form.typeform.com/to/qBwMkuJw', '_blank')}
            >
              Explore Our Technology
            </EnhancedButton>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-20 left-10 w-32 h-32 border border-primary/20 rounded-full opacity-20 animate-spin-slow"></div>
      <div className="absolute top-40 right-10 w-20 h-20 border border-primary/10 rounded-full opacity-10 animate-reverse-spin-slow"></div>
    </section>
  );
};

export default TechSection;
