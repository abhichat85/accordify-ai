
import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, FileText, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Create custom icon components properly as forwardRef components
import { forwardRef } from "react";

const CodeIcon = forwardRef<SVGSVGElement, React.ComponentProps<"svg">>((props, ref) => (
  <svg
    ref={ref}
    {...props} 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
));
CodeIcon.displayName = "CodeIcon";

const Link2Icon = forwardRef<SVGSVGElement, React.ComponentProps<"svg">>((props, ref) => (
  <svg 
    ref={ref}
    {...props}
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
));
Link2Icon.displayName = "Link2Icon";

const VideoIcon = forwardRef<SVGSVGElement, React.ComponentProps<"svg">>((props, ref) => (
  <svg
    ref={ref}
    {...props} 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
    <line x1="7" y1="2" x2="7" y2="22"></line>
    <line x1="17" y1="2" x2="17" y2="22"></line>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <line x1="2" y1="7" x2="7" y2="7"></line>
    <line x1="2" y1="17" x2="7" y2="17"></line>
    <line x1="17" y1="17" x2="22" y2="17"></line>
    <line x1="17" y1="7" x2="22" y2="7"></line>
  </svg>
));
VideoIcon.displayName = "VideoIcon";

const DocumentationSection: React.FC = () => {
  const docSections = [
    {
      title: "Quick Start Guide",
      description: "Get up and running with Accord AI in less than 5 minutes",
      icon: <Zap className="h-5 w-5" />
    },
    {
      title: "API Reference",
      description: "Comprehensive documentation for our REST and GraphQL APIs",
      icon: <CodeIcon className="h-5 w-5" />
    },
    {
      title: "Contract Templates",
      description: "Library of customizable templates for common business needs",
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: "Security & Compliance",
      description: "Our approach to data security, privacy, and regulatory compliance",
      icon: <ShieldCheck className="h-5 w-5" />
    },
    {
      title: "Integration Guides",
      description: "Connect Accord AI with your existing tools and workflows",
      icon: <Link2Icon className="h-5 w-5" />
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step visual guides to mastering Accord AI",
      icon: <VideoIcon className="h-5 w-5" />
    }
  ];
  
  return (
    <div className="container mx-auto max-w-6xl">
      <div className="text-center mb-16 space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold">Documentation</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Comprehensive resources to help you get the most out of Accord AI.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {docSections.map((section, index) => (
          <Card key={index} className="card-elevation border-border/30">
            <CardContent className="p-5 flex items-start gap-3">
              <div className="mt-1 p-2 bg-muted rounded-md">
                {section.icon}
              </div>
              <div>
                <h3 className="font-semibold">{section.title}</h3>
                <p className="text-sm text-muted-foreground">{section.description}</p>
                <Link to="/docs" className="text-primary text-sm flex items-center gap-1 mt-2 hover:underline">
                  <span>Read more</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-16 bg-muted/20 rounded-2xl p-8 border border-border/20 flex flex-col md:flex-row justify-between items-center gap-6 card-elevation">
        <div>
          <h3 className="text-xl font-semibold mb-2">Need additional help?</h3>
          <p className="text-muted-foreground">Our team is available to provide personalized support.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="gap-1 deboss">
            <BookOpen size={16} />
            <span>Knowledge Base</span>
          </Button>
          <Button className="gap-1 emboss">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentationSection;
