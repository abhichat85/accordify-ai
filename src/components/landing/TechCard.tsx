
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

interface TechCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

const TechCard: React.FC<TechCardProps> = ({ icon, title, description, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`relative h-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 bg-primary/5 rounded-xl transform transition-transform duration-300 ${isHovered ? 'scale-95' : 'scale-0'}`}></div>
      <div className="bg-card/80 backdrop-blur-sm border border-border/30 rounded-xl p-6 hover:shadow-md transition-all hover:bg-card hover:border-primary/20 space-y-3 h-full relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className={`absolute bottom-6 right-6 transform transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <ArrowRight size={14} className="text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechCard;
