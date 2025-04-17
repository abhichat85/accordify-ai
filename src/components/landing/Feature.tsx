import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
  illustration?: string;
  color?: string;
}

const Feature: React.FC<FeatureProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  illustration,
  color = "rgba(124, 58, 237, 0.8)" // Default to primary purple
}) => {
  const decorativeShapes = [
    <svg key="hex" className="absolute right-0 top-0 w-32 h-32 text-primary opacity-5 -mr-10 -mt-10" viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z" />
    </svg>,
    <svg key="circle" className="absolute left-0 bottom-0 w-24 h-24 text-primary opacity-5 -ml-10 -mb-10" viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="50" r="50" />
    </svg>,
    <svg key="triangle" className="absolute right-0 bottom-0 w-20 h-20 text-primary opacity-5 -mr-5 -mb-5" viewBox="0 0 100 100" fill="currentColor">
      <path d="M0 100L50 0L100 100H0Z" />
    </svg>
  ];

  return (
    <div 
      className="bg-card border border-border/50 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 
                 space-y-4 animate-fade-in delay-100 relative group overflow-hidden"
    >
      {/* Decorative shapes */}
      {decorativeShapes[Math.floor(Math.random() * decorativeShapes.length)]}
      
      {/* Optional illustration */}
      {illustration && (
        <div className="w-full h-32 mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-primary/5 to-accent/10">
          <div 
            className="w-full h-full bg-center bg-cover bg-no-repeat opacity-80 group-hover:opacity-100 
                       group-hover:scale-105 transition-all duration-500"
            style={{ backgroundImage: `url(${illustration})` }}
          />
        </div>
      )}
      
      {/* Feature icon with glow effect */}
      <div 
        className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center relative z-10 transition-all duration-300",
          "group-hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]",
          illustration ? "-mt-8 bg-card border border-border/50" : "bg-primary/10"
        )}
      >
        <Icon size={24} className={cn("transition-transform group-hover:scale-110", illustration ? "text-primary" : "text-primary")} />
      </div>
      
      {/* Content */}
      <h3 className="text-xl font-semibold relative z-10 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground relative z-10 group-hover:text-foreground/90 transition-colors">{description}</p>
      
      {/* Hover backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default Feature;
