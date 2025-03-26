
import React from "react";
import { CheckCircle } from "lucide-react";

interface StatusBarProps {
  content: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ content }) => {
  return (
    <div className="flex items-center justify-between px-4 py-1 border-t border-border/40 bg-muted/20 text-xs text-muted-foreground">
      <div className="flex items-center">
        <span className="mr-4">Words: {content.split(/\s+/).filter(Boolean).length}</span>
        <span>Characters: {content.length}</span>
      </div>
      <div className="flex items-center">
        <CheckCircle size={14} className="text-primary mr-1" />
        <span>No issues detected</span>
      </div>
    </div>
  );
};
