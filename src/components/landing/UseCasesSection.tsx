
import React from "react";
import { Users, CheckCircle2 } from "lucide-react";

const UseCasesSection: React.FC = () => {
  return (
    <section id="use-cases" className="py-20 px-4 md:px-8 lg:px-0 bg-wave">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-2">
            <Users size={14} />
            <span>For Every Team</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Perfect For Every Contract Need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by legal teams, entrepreneurs, and business professionals across industries.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "In-House Legal Teams",
              description: "Streamline routine contract work and free your legal team to focus on strategic matters. Reduce review time by up to 80%.",
              tasks: ["NDA automation", "Vendor contract review", "Policy compliance checks", "Legal risk assessment"]
            },
            {
              title: "Business Founders",
              description: "Get the legal protection you need without the expensive attorney fees. Generate founder-friendly agreements instantly.",
              tasks: ["Consultant agreements", "Employment contracts", "Customer agreements", "Partnership documents"]
            },
            {
              title: "HR Departments",
              description: "Standardize your employee documents while ensuring compliance with changing regulations across jurisdictions.",
              tasks: ["Offer letters", "Employment policies", "Severance agreements", "Benefits documentation"]
            },
            {
              title: "Sales Teams",
              description: "Close deals faster with quick contract generation, redlining, and negotiation assistance for your sales agreements.",
              tasks: ["Sales agreements", "Term sheets", "Partnership contracts", "SLA documentation"]
            }
          ].map((useCase, index) => (
            <div 
              key={index} 
              className="bg-card border border-border/50 rounded-xl p-8 animate-fade-in hover:shadow-md transition-all"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
              <p className="text-muted-foreground mb-6">{useCase.description}</p>
              <div className="space-y-2">
                {useCase.tasks.map((task, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 size={12} className="text-primary" />
                    </div>
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
