import React from "react";
import { BrainCircuit, Layers, Database, Network, ServerCog, Code2 } from "lucide-react";
import TechCard from "@/components/landing/TechCard";

const TechSection: React.FC = () => {
  return (
    <section id="tech" className="py-20 px-4 md:px-8 bg-subtle-accent">
      <div className="container mx-auto max-w-[90%] xl:max-w-[1400px]">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-2">
            <BrainCircuit size={14} />
            <span>Advanced Technology</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Advanced AI Technology
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our contract intelligence platform is powered by cutting-edge AI technologies for unmatched accuracy and performance.
          </p>
        </div>
        
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TechCard 
              icon={BrainCircuit}
              title="Custom SLMs"
              description="Specialized Language Models designed specifically for legal and contract analysis, trained on vast corpora of legal documents for superior understanding of legal concepts and terminology."
            />
            <TechCard 
              icon={Layers}
              title="LoRA Fine-tuning"
              description="Low-Rank Adaptation provides efficient and targeted fine-tuning of our models on specific contract types and legal domains, ensuring higher precision with minimal computational overhead."
            />
            <TechCard 
              icon={Database}
              title="RAG Architecture"
              description="Retrieval-Augmented Generation combines the power of large language models with specialized legal knowledge bases to ensure responses are grounded in accurate and relevant legal information."
            />
            <TechCard 
              icon={Network}
              title="Domain Adaptation"
              description="Our models adapt to specific industries and use cases, learning the unique language and requirements of different business sectors for more relevant contract generation."
            />
            <TechCard 
              icon={ServerCog}
              title="Legal Reasoning Engines"
              description="Specialized reasoning modules that analyze contractual clauses for risks, inconsistencies, and compliance issues across multiple jurisdictions."
            />
            <TechCard 
              icon={Code2}
              title="Custom Embeddings"
              description="Proprietary embedding models that capture the semantic relationships between legal concepts for more accurate document comparison and clause recommendation."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechSection;
