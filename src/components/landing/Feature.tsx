
import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 hover:shadow-md transition-shadow space-y-4 animate-fade-in delay-100 relative group overflow-hidden">
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center relative z-10">
        <Icon size={24} className="text-primary" />
      </div>
      <h3 className="text-xl font-semibold relative z-10">{title}</h3>
      <p className="text-muted-foreground relative z-10">{description}</p>
    </div>
  );
};

export default Feature;
