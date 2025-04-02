
import React from "react";
import { Brain, ChevronDown } from "lucide-react";
import { Message } from "../MessageBubble";

interface ThoughtPanelProps {
  thoughtMessages: Message[];
  thoughtsExpanded: boolean;
  setThoughtsExpanded: (expanded: boolean) => void;
}

export const ThoughtPanel: React.FC<ThoughtPanelProps> = ({
  thoughtMessages,
  thoughtsExpanded,
  setThoughtsExpanded
}) => {
  if (thoughtMessages.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div 
        className="flex items-center justify-between cursor-pointer p-2 bg-muted/30 rounded-t-lg border-x border-t border-border/30"
        onClick={() => setThoughtsExpanded(!thoughtsExpanded)}
      >
        <div className="flex items-center">
          <Brain size={16} className="text-primary mr-2" />
          <h3 className="text-sm font-medium">Thinking process</h3>
        </div>
        <ChevronDown size={16} className={`transition-transform ${thoughtsExpanded ? 'rotate-180' : ''}`} />
      </div>
      
      {thoughtsExpanded && (
        <div className="p-3 bg-muted/10 border-x border-b border-border/30 rounded-b-lg mb-2">
          <div className="text-sm text-muted-foreground space-y-2">
            {thoughtMessages.map((thought, index) => (
              <div key={index} className="p-2 bg-muted/5 rounded">
                <p className="whitespace-pre-wrap">{thought.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
