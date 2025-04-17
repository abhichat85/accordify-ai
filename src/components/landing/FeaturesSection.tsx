import React from "react";
import { Zap, FileText, BrainCircuit, Users, ScrollText, Shield } from "lucide-react";
import Feature from "@/components/landing/Feature";

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 px-4 md:px-8 bg-soft-gradient">
      <div className="container mx-auto max-w-[90%] xl:max-w-[1400px]">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-2">
            <Zap size={14} />
            <span>Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Powerful AI Contract Tools
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Accord AI combines advanced language models with legal expertise to transform your contract workflow.
          </p>
        </div>
        
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            <Feature
              icon={FileText}
              title="Intelligent Drafting"
              description="Generate customized contracts from scratch in seconds, tailored to your specific business needs and industry requirements."
              illustration="/images/features/intelligent-drafting.svg"
            />
            <Feature
              icon={BrainCircuit}
              title="Comprehensive Review"
              description="Analyze contracts for risks, missing clauses, and compliance issues with detailed recommendations and explanations."
              illustration="/images/features/comprehensive-review.svg"
            />
            <Feature
              icon={Zap}
              title="Negotiation Advisor"
              description="Get expert guidance on negotiation points and alternative language with pros and cons analysis based on your position."
              illustration="/images/features/negotiation-advisor.svg"
            />
            <Feature
              icon={Users}
              title="Collaborative Workflow"
              description="Share contracts with your team, assign roles, and track changes in a secure environment with role-based permissions."
              illustration="/images/features/collaborative-workflow.svg"
            />
            <Feature
              icon={ScrollText}
              title="Contract Timeline"
              description="Track important deadlines, renewal dates, and obligations with automated reminders and calendar integration."
              illustration="/images/features/contract-timeline.svg"
            />
            <Feature
              icon={Shield}
              title="Enterprise Security"
              description="Bank-level encryption, role-based access control, and data privacy compliance with SOC 2 Type II certification."
              illustration="/images/features/enterprise-security.svg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
