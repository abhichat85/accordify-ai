
import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface UseCasesSectionProps {
  openWaitlistForm: () => void;
}

const UseCasesSection: React.FC<UseCasesSectionProps> = ({ openWaitlistForm }) => {
  const useCases = [
    {
      title: "Legal Departments",
      description: "Streamline contract workflows and reduce outside counsel spend with AI-powered contract generation, review, and management.",
      icon: "⚖️",
      benefits: [
        "40% reduction in contract processing time",
        "Standardized templates across departments",
        "Risk identification and mitigation",
        "Contract portfolio analytics"
      ]
    },
    {
      title: "Law Firms",
      description: "Enhance client service and increase efficiency with intelligent contract analysis and generation tools.",
      icon: "📝",
      benefits: [
        "Focus attorney time on high-value tasks",
        "Improve accuracy of contract review",
        "Consistent quality across junior associates",
        "Higher client satisfaction"
      ]
    },
    {
      title: "Startups & SMBs",
      description: "Access enterprise-quality legal support without the enterprise budget through AI-powered contract assistance.",
      icon: "🚀",
      benefits: [
        "Reduced legal spend",
        "Quick generation of standard agreements",
        "Risk identification for non-legal professionals",
        "Simplified contract language"
      ]
    }
  ];
  
  return (
    <div className="container mx-auto max-w-6xl">
      <div className="text-center mb-16 space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold">Use Cases</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Accord AI adapts to the needs of different organizations and legal professionals.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {useCases.map((useCase, index) => (
          <Card key={index} className="card-elevation bg-background/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-3xl mb-4">{useCase.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
              <p className="text-muted-foreground mb-4">{useCase.description}</p>
              <div className="pt-2">
                <h4 className="text-sm font-semibold text-primary mb-2">Key Benefits:</h4>
                <ul className="space-y-1">
                  {useCase.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <p className="text-muted-foreground mb-4">
          Ready to see how Accord AI can work for your organization?
        </p>
        <Button onClick={openWaitlistForm} size="lg" className="gap-2 emboss">
          Request a Demo <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default UseCasesSection;
