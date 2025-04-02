
import React from "react";
import { Lightbulb } from "lucide-react";

interface ProactiveSuggestionsProps {
  suggestions: string[];
  onClick: (suggestion: string) => void;
}

export const ProactiveSuggestions: React.FC<ProactiveSuggestionsProps> = ({
  suggestions,
  onClick
}) => {
  if (!suggestions.length) return null;

  return (
    <div className="mb-2 mt-2 animate-fade-in">
      <div className="bg-muted/40 rounded-lg p-3 border border-border/30 max-w-[85%] mx-auto">
        <div className="flex items-center mb-2">
          <Lightbulb size={16} className="text-primary mr-2" />
          <span className="text-sm font-medium">Proactive Insights</span>
        </div>
        <ul className="space-y-2">
          {suggestions.slice(0, 2).map((suggestion, idx) => (
            <li 
              key={idx} 
              className="text-sm hover:bg-muted/60 p-2 rounded-md cursor-pointer transition-colors"
              onClick={() => onClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
