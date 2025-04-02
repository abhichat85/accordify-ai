
import React from "react";
import { Brain } from "lucide-react";

interface ContextAwarenessPanelProps {
  contextItems: string[];
}

export const ContextAwarenessPanel: React.FC<ContextAwarenessPanelProps> = ({
  contextItems
}) => {
  if (!contextItems.length) return null;

  return (
    <div className="px-3 py-2 border-t border-border/20 bg-muted/5 text-xs text-muted-foreground">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <Brain size={12} className="mr-1 text-primary" />
          <span className="font-medium">Context</span>
        </div>
      </div>
      <div className="space-y-1">
        {contextItems.map((item, index) => (
          <div key={index} className="flex items-start">
            <span className="w-1 h-1 rounded-full bg-primary/70 mt-1.5 mr-1.5"></span>
            <p>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
