import React from "react";
import { cn } from "@/lib/utils";

interface TechBackgroundProps {
  className?: string;
}

const TechBackground: React.FC<TechBackgroundProps> = ({ className }) => {
  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden", className)}>
      {/* Dark gradient background with hue shift */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0b2e] via-[#1f1135] to-[#131022]"></div>
      
      {/* Neural network pattern overlay */}
      <div className="absolute inset-0" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="neural-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="#7c3aed" opacity="0.4"/>
              <circle cx="50" cy="20" r="2" fill="#7c3aed" opacity="0.4"/>
              <circle cx="30" cy="40" r="2" fill="#7c3aed" opacity="0.4"/>
              <circle cx="70" cy="60" r="2" fill="#7c3aed" opacity="0.4"/>
              <circle cx="90" cy="30" r="2" fill="#7c3aed" opacity="0.4"/>
              <circle cx="20" cy="80" r="2" fill="#7c3aed" opacity="0.4"/>
              <circle cx="60" cy="90" r="2" fill="#7c3aed" opacity="0.4"/>
              
              <line x1="10" y1="10" x2="50" y2="20" stroke="#7c3aed" strokeWidth="0.5" opacity="0.2"/>
              <line x1="50" y1="20" x2="30" y2="40" stroke="#7c3aed" strokeWidth="0.5" opacity="0.2"/>
              <line x1="30" y1="40" x2="70" y2="60" stroke="#7c3aed" strokeWidth="0.5" opacity="0.2"/>
              <line x1="70" y1="60" x2="90" y2="30" stroke="#7c3aed" strokeWidth="0.5" opacity="0.2"/>
              <line x1="90" y1="30" x2="20" y2="80" stroke="#7c3aed" strokeWidth="0.5" opacity="0.2"/>
              <line x1="20" y1="80" x2="60" y2="90" stroke="#7c3aed" strokeWidth="0.5" opacity="0.2"/>
              <line x1="60" y1="90" x2="10" y2="10" stroke="#7c3aed" strokeWidth="0.5" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-pattern)" />
        </svg>
      </div>
      
      {/* Glowing spheres */}
      <div className="absolute w-[500px] h-[500px] -top-[250px] -left-[250px] bg-[#9d4edd] rounded-full blur-[150px] opacity-30"></div>
      <div className="absolute w-[600px] h-[600px] -bottom-[300px] -right-[300px] bg-[#7b2cbf] rounded-full blur-[180px] opacity-30"></div>
      <div className="absolute w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#5a189a] rounded-full blur-[120px] opacity-20"></div>
      
      {/* AI-inspired floating elements */}
      <div className="absolute top-1/4 left-1/4 opacity-60">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float" style={{animationDuration: '6s'}}>
          <path d="M40 10L70 60H10L40 10Z" stroke="#7c3aed" strokeWidth="1" fill="none" opacity="0.6"/>
          <circle cx="40" cy="25" r="3" fill="#7c3aed" opacity="0.8"/>
        </svg>
      </div>
      <div className="absolute top-3/4 right-1/4 opacity-60">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float" style={{animationDuration: '7s', animationDelay: '1s'}}>
          <rect x="10" y="10" width="40" height="40" stroke="#7c3aed" strokeWidth="1" fill="none" opacity="0.6"/>
          <circle cx="30" cy="30" r="3" fill="#7c3aed" opacity="0.8"/>
        </svg>
      </div>
      <div className="absolute top-1/2 right-1/5 opacity-60">
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float" style={{animationDuration: '8s', animationDelay: '0.5s'}}>
          <circle cx="35" cy="35" r="25" stroke="#7c3aed" strokeWidth="1" fill="none" opacity="0.6"/>
          <circle cx="35" cy="35" r="3" fill="#7c3aed" opacity="0.8"/>
        </svg>
      </div>
      
      {/* Circuit lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <path className="animate-draw-path" d="M0,100 C150,200 250,50 400,150 L400,0 L0,0 Z" fill="none" stroke="#7c3aed" strokeWidth="0.5" opacity="0.3"></path>
        <path className="animate-draw-path" style={{animationDelay: '1s'}} d="M0,200 C150,100 350,300 400,100 L400,0 L0,0 Z" fill="none" stroke="#7c3aed" strokeWidth="0.5" opacity="0.3"></path>
        <path className="animate-draw-path" style={{animationDelay: '2s'}} d="M100,0 C200,150 250,200 300,100 L400,300 L400,0 Z" fill="none" stroke="#7c3aed" strokeWidth="0.5" opacity="0.3"></path>
        
        {/* Dots at connection points */}
        <circle cx="150" cy="200" r="2" fill="#7c3aed" opacity="0.8">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="250" cy="50" r="2" fill="#7c3aed" opacity="0.8">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="350" cy="300" r="2" fill="#7c3aed" opacity="0.8">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite"/>
        </circle>
      </svg>
      
      {/* Data streams */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#7c3aed]/10 to-transparent opacity-30"></div>
      
      {/* Digital particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.3 + Math.random() * 0.4,
              animationDuration: `${5 + Math.random() * 5}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export { TechBackground };
