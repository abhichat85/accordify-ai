
import React from "react";
import { Paperclip } from "lucide-react";

interface DragOverlayProps {
  isDragging: boolean;
}

export const DragOverlay: React.FC<DragOverlayProps> = ({ isDragging }) => {
  if (!isDragging) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/80 border-2 border-dashed border-primary z-10">
      <div className="text-center">
        <Paperclip className="mx-auto h-8 w-8 text-primary" />
        <p className="mt-2 text-sm font-medium text-primary">Drop files to upload</p>
      </div>
    </div>
  );
};
