
import React from "react";
import { ArrowRight, FileText, ShieldCheck, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Feature from "@/components/landing/Feature";

interface FeaturesSectionProps {
  openWaitlistForm: () => void;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ openWaitlistForm }) => {
  const features = [
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "Contract Generation",
      description: "Create customized contracts in minutes with AI that understands legal language and best practices."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "Risk Analysis",
      description: "Identify potential risks and issues in contracts with advanced legal pattern recognition."
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Collaboration",
      description: "Share contracts with team members and clients with controlled permissions and tracking."
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "E-Signatures",
      description: "Legally binding electronic signatures with robust verification and security."
    }
  ];
  
  return (
    <div className="container mx-auto max-w-6xl">
      <div className="text-center mb-16 space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold">Key Features</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Our platform combines legal expertise and AI technology to streamline your contract processes.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <Feature
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            className="card-elevation"
          />
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <Button onClick={openWaitlistForm} variant="default" size="lg" className="gap-2 emboss">
          Get Started <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default FeaturesSection;
