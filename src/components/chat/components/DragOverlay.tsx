import React from "react";
import { Paperclip, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface DragOverlayProps {
  isDragging: boolean;
}

export const DragOverlay: React.FC<DragOverlayProps> = ({ isDragging }) => {
  if (!isDragging) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/90 border-2 border-dashed border-primary/70 z-10 backdrop-blur-sm transition-all duration-300 animate-in fade-in-50">
      <div className="text-center p-6 rounded-lg bg-primary/5 shadow-lg animate-pulse-slow">
        <div className="relative mx-auto h-12 w-12 mb-2">
          <Upload className="absolute inset-0 h-full w-full text-primary opacity-80" />
          <Paperclip className="absolute inset-0 h-full w-full text-primary animate-bounce-slow" />
        </div>
        <p className="mt-2 text-sm font-medium text-primary">Drop files to upload</p>
        <p className="text-xs text-muted-foreground mt-1">We support documents and images</p>
      </div>
    </div>
  );
};

// Add these animations to your global CSS file if not already present
// @keyframes pulse-slow {
//   0%, 100% { opacity: 1; }
//   50% { opacity: 0.7; }
// }
// @keyframes bounce-slow {
//   0%, 100% { transform: translateY(0); }
//   50% { transform: translateY(-10px); }
// }
// .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
// .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
