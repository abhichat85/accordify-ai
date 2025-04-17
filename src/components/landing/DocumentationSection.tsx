import React from "react";
import { FileText, Presentation, Bot, ServerCog, ExternalLink, Shield } from "lucide-react";

interface DocumentationItemProps {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}

const DocumentationItem: React.FC<DocumentationItemProps> = ({ title, description, href, icon: Icon }) => (
  <a 
    href={href}
    className="block p-6 rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all h-full"
  >
    <div className="flex items-start gap-4">
      <div className="mt-1 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon size={20} className="text-primary" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  </a>
);

const DocumentationSection: React.FC = () => {
  return (
    <section id="documentation" className="py-20 px-4 md:px-8 bg-light-noise">
      <div className="container mx-auto max-w-[90%] xl:max-w-[1400px]">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-2">
            <FileText size={14} />
            <span>Resources</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Documentation & Resources
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to get started and make the most of Accord AI.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DocumentationItem 
            icon={Presentation}
            title="Quick Start Guide"
            description="Get up and running with Accord AI in minutes with our step-by-step quick start guide."
            href="/docs/quickstart"
          />
          <DocumentationItem 
            icon={Bot}
            title="AI Agent Capabilities"
            description="Learn about the capabilities of our AI agent and how to leverage its full potential."
            href="/docs/ai-capabilities"
          />
          <DocumentationItem 
            icon={FileText}
            title="Contract Templates"
            description="Browse our library of pre-built contract templates for various industries and use cases."
            href="/docs/templates"
          />
          <DocumentationItem 
            icon={ServerCog}
            title="API Reference"
            description="Comprehensive API documentation for integrating Accord AI into your existing systems."
            href="/docs/api"
          />
          <DocumentationItem 
            icon={ExternalLink}
            title="Integration Guides"
            description="Step-by-step guides for integrating with popular tools like Salesforce, Notion, and more."
            href="/docs/integrations"
          />
          <DocumentationItem 
            icon={Shield}
            title="Security & Compliance"
            description="Details about our security practices, data handling, and compliance certifications."
            href="/docs/security"
          />
        </div>
      </div>
    </section>
  );
};

export default DocumentationSection;
