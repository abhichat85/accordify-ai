import React from "react";
import { cn } from "@/lib/utils";

interface AbstractBgProps {
  className?: string;
  variant?: "purple" | "gradient" | "mesh";
  intensity?: "low" | "medium" | "high";
}

const AbstractBg: React.FC<AbstractBgProps> = ({ 
  className, 
  variant = "purple",
  intensity = "medium"
}) => {
  const intensityMap = {
    low: 0.1,
    medium: 0.2,
    high: 0.3
  };
  
  const opacity = intensityMap[intensity];
  
  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden", className)}>
      {variant === "purple" && (
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity={opacity}>
            <circle cx="1200" cy="150" r="250" fill="#7c3aed" fillOpacity="0.2" />
            <circle cx="200" cy="750" r="200" fill="#7c3aed" fillOpacity="0.15" />
            <circle cx="700" cy="300" r="300" fill="#7c3aed" fillOpacity="0.05" />
            <path
              d="M1400 350C1400 432.843 1332.84 500 1250 500C1167.16 500 1100 432.843 1100 350C1100 267.157 1167.16 200 1250 200C1332.84 200 1400 267.157 1400 350Z"
              stroke="#7c3aed"
              strokeWidth="2"
              strokeDasharray="8 8"
            />
            <path
              d="M400 650C400 732.843 332.843 800 250 800C167.157 800 100 732.843 100 650C100 567.157 167.157 500 250 500C332.843 500 400 567.157 400 650Z"
              stroke="#7c3aed"
              strokeWidth="2"
              strokeDasharray="8 8"
            />
            <path
              d="M800 200L900 350L700 350L800 200Z"
              fill="#7c3aed"
              fillOpacity="0.1"
            />
            <path
              d="M400 450L500 600L300 600L400 450Z"
              fill="#7c3aed"
              fillOpacity="0.1"
            />
            <rect x="850" y="500" width="200" height="200" rx="20" fill="#7c3aed" fillOpacity="0.05" />
            <rect x="300" y="200" width="150" height="150" rx="15" fill="#7c3aed" fillOpacity="0.05" />
          </g>
        </svg>
      )}
      
      {variant === "gradient" && (
        <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-background/0 to-background/0" />
      )}
      
      {variant === "mesh" && (
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-40" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM3YzNhZWQiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')]" style={{ opacity }} />
        </div>
      )}
    </div>
  );
};

export { AbstractBg };
