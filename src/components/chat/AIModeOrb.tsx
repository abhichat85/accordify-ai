
import React from 'react';
import { OrbCanvas } from '../ui/OrbCanvas';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface AIModeOrbProps {
  active?: boolean;
  mode?: string;
  className?: string;
  size?: number;
}

export const AIModeOrb: React.FC<AIModeOrbProps> = ({
  active = false,
  mode = "normal",
  className,
  size = 1.0
}) => {
  const { theme } = useTheme();
  
  // Map mode to colors - using theme-specific colors
  const getOrbColor = () => {
    if (!active) return "#cbd5e1"; // Inactive color
    
    switch (mode) {
      case "lawyer": return theme === "purple" ? "#9b87f5" : 
                           theme === "blue" ? "#3b82f6" : 
                           theme === "red" ? "#ef4444" :
                           theme === "orange" ? "#f97316" :
                           theme === "green" ? "#22c55e" :
                           theme === "yellow" ? "#eab308" :
                           theme === "zinc" ? "#71717a" :
                           theme === "rose" ? "#f43f5e" : "#9b87f5";
      case "reasoning": return theme === "purple" ? "#8b5cf6" : 
                              theme === "blue" ? "#2563eb" : 
                              theme === "red" ? "#dc2626" :
                              theme === "orange" ? "#ea580c" :
                              theme === "green" ? "#16a34a" :
                              theme === "yellow" ? "#ca8a04" :
                              theme === "zinc" ? "#52525b" :
                              theme === "rose" ? "#e11d48" : "#8b5cf6";
      case "creative": return theme === "purple" ? "#a78bfa" : 
                            theme === "blue" ? "#60a5fa" : 
                            theme === "red" ? "#f87171" :
                            theme === "orange" ? "#fb923c" :
                            theme === "green" ? "#4ade80" :
                            theme === "yellow" ? "#facc15" :
                            theme === "zinc" ? "#a1a1aa" :
                            theme === "rose" ? "#fb7185" : "#a78bfa";
      case "analyst": return theme === "purple" ? "#7c3aed" : 
                           theme === "blue" ? "#1d4ed8" : 
                           theme === "red" ? "#b91c1c" :
                           theme === "orange" ? "#c2410c" :
                           theme === "green" ? "#15803d" :
                           theme === "yellow" ? "#a16207" :
                           theme === "zinc" ? "#3f3f46" :
                           theme === "rose" ? "#be123c" : "#7c3aed";
      case "research": return theme === "purple" ? "#6d28d9" : 
                            theme === "blue" ? "#1e40af" : 
                            theme === "red" ? "#991b1b" :
                            theme === "orange" ? "#9a3412" :
                            theme === "green" ? "#166534" :
                            theme === "yellow" ? "#854d0e" :
                            theme === "zinc" ? "#27272a" :
                            theme === "rose" ? "#9f1239" : "#6d28d9";
      case "educator": return theme === "purple" ? "#7e22ce" : 
                            theme === "blue" ? "#1e3a8a" : 
                            theme === "red" ? "#7f1d1d" :
                            theme === "orange" ? "#7c2d12" :
                            theme === "green" ? "#14532d" :
                            theme === "yellow" ? "#713f12" :
                            theme === "zinc" ? "#18181b" :
                            theme === "rose" ? "#881337" : "#7e22ce";
      default: return theme === "purple" ? "#9b87f5" : 
                     theme === "blue" ? "#3b82f6" : 
                     theme === "red" ? "#ef4444" :
                     theme === "orange" ? "#f97316" :
                     theme === "green" ? "#22c55e" :
                     theme === "yellow" ? "#eab308" :
                     theme === "zinc" ? "#71717a" :
                     theme === "rose" ? "#f43f5e" : "#9b87f5";
    }
  };

  return (
    <div className={cn(
      "w-6 h-6 rounded-full overflow-hidden",
      active && "ring-2 ring-offset-1 ring-primary/40", 
      className
    )}>
      <OrbCanvas 
        color={getOrbColor()}
        size={size}
        speed={active ? 1.2 : 0.5}
        distort={active ? 0.3 : 0.2}
      />
    </div>
  );
};
