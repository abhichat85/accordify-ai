
import React from "react";
import { FileText, Shield, Briefcase, Scale, Users, Building, Handshake, Brain } from "lucide-react";

// Template mock data
const TEMPLATE_DATA = [
  {
    id: 1,
    title: "Non-Disclosure Agreement",
    description: "Standard confidentiality agreement to protect your business information",
    category: "Legal Protection",
    icon: Shield
  },
  {
    id: 2,
    title: "Employment Contract",
    description: "Comprehensive agreement for hiring new team members",
    category: "HR",
    icon: Users
  },
  {
    id: 3,
    title: "Service Agreement",
    description: "Define the terms for providing services to clients",
    category: "Business",
    icon: Briefcase
  },
  {
    id: 4,
    title: "Contractor Agreement",
    description: "Agreement for working with independent contractors",
    category: "HR",
    icon: Building
  },
  {
    id: 5,
    title: "Partnership Agreement",
    description: "Structure the legal framework for business partnerships",
    category: "Business",
    icon: Handshake
  },
  {
    id: 6,
    title: "License Agreement",
    description: "Control how your intellectual property can be used",
    category: "Legal Protection",
    icon: Scale
  }
];

// Template card component
const TemplateCard = ({ template }: { template: any }) => {
  return (
    <div className="bg-card rounded-xl border border-border/50 p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <template.icon size={20} className="text-primary" />
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-1">{template.title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs bg-secondary px-2 py-1 rounded-full">{template.category}</span>
        <button className="text-sm text-primary hover:underline">Use Template</button>
      </div>
    </div>
  );
};

// Template list component
export const TemplatesSection = () => {
  return (
    <div className="p-6 h-full overflow-auto">
      <h1 className="text-2xl font-bold mb-6">Templates Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATE_DATA.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
};
