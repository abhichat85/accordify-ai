
import React from "react";
import { FileText, ChevronDown } from "lucide-react";
import { Message } from "../MessageBubble";

interface ActionPanelProps {
  actionMessages: Message[];
  actionsExpanded: boolean;
  setActionsExpanded: (expanded: boolean) => void;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({
  actionMessages,
  actionsExpanded,
  setActionsExpanded
}) => {
  if (actionMessages.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div 
        className="flex items-center justify-between cursor-pointer p-2 bg-muted/30 rounded-t-lg border-x border-t border-border/30"
        onClick={() => setActionsExpanded(!actionsExpanded)}
      >
        <div className="flex items-center">
          <FileText size={16} className="text-primary mr-2" />
          <h3 className="text-sm font-medium">Actions</h3>
        </div>
        <ChevronDown size={16} className={`transition-transform ${actionsExpanded ? 'rotate-180' : ''}`} />
      </div>
      
      {actionsExpanded && (
        <div className="p-3 bg-muted/10 border-x border-b border-border/30 rounded-b-lg">
          <div className="text-sm space-y-2">
            {actionMessages.map((action, index) => (
              <div key={index} className="p-2 bg-primary/5 rounded border border-primary/10">
                <p className="whitespace-pre-wrap">{action.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
