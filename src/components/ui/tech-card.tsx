import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TechCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  index?: number;
}

const TechCard: React.FC<TechCardProps> = ({ 
  icon: Icon, 
  title, 
  description,
  index = 0
}) => {
  // Create a unique gradient angle based on the index
  const gradientAngle = 45 + (index * 30) % 360;
  
  return (
    <div className="group perspective">
      <div className="relative h-full transform transition-all duration-500 preserve-3d group-hover:rotate-y-12">
        {/* Card background with circuit patterns */}
        <div className="absolute inset-0 bg-card rounded-xl border border-border/30 shadow-md overflow-hidden">
          {/* Circuit pattern background */}
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id={`circuit-${index}`} patternUnits="userSpaceOnUse" width="50" height="50" patternTransform="rotate(35)">
                <path d="M10 0 L10 50 M20 0 L20 50 M30 0 L30 50 M40 0 L40 50 M0 10 L50 10 M0 20 L50 20 M0 30 L50 30 M0 40 L50 40" 
                      stroke="currentColor" strokeWidth="0.5" fill="none" className="text-primary" />
                <circle cx="10" cy="10" r="2" className="fill-primary"/>
                <circle cx="30" cy="30" r="2" className="fill-primary"/>
                <circle cx="10" cy="30" r="1" className="fill-primary"/>
                <circle cx="30" cy="10" r="1" className="fill-primary"/>
              </pattern>
              <rect width="100%" height="100%" fill={`url(#circuit-${index})`} />
            </svg>
          </div>
          
          {/* Gradient overlay */}
          <div 
            className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500" 
            style={{
              background: `linear-gradient(${gradientAngle}deg, rgba(124, 58, 237, 0.2), transparent 70%)`
            }}
          ></div>
        </div>
        
        {/* Card content */}
        <div className="relative p-6 h-full flex flex-col">
          <div className="mb-4 flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:shadow-glow">
              <Icon size={22} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold">{title}</h3>
          </div>
          
          <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">{description}</p>
          
          {/* Glowing accent in corner */}
          <div 
            className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full blur-xl opacity-20 group-hover:opacity-60 transition-opacity duration-700"
            style={{
              background: `radial-gradient(circle, rgba(124, 58, 237, 0.8) 0%, transparent 70%)`
            }}
          ></div>
          
          {/* Animated tech indicator */}
          <div className="absolute bottom-4 right-4 flex items-center justify-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-20"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary/60"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TechCard };
