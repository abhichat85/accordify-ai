
import React from "react";
import { Card } from "@/components/ui/card";
import { AgentCapability } from "./types";

interface ChatCapabilitiesTabProps {
  agentCapabilities: AgentCapability[];
  handleCapabilityClick: (example: string) => void;
}

export const ChatCapabilitiesTab: React.FC<ChatCapabilitiesTabProps> = ({
  agentCapabilities,
  handleCapabilityClick
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium mb-1">Agent Capabilities</h3>
        <p className="text-xs text-muted-foreground mb-2">
          Your contract AI assistant can help with the following tasks:
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {agentCapabilities.map((capability) => (
          <Card key={capability.id} className="overflow-hidden">
            <div className="p-2 border-b border-border/40 bg-muted/20 flex items-center">
              <capability.icon className="h-4 w-4 mr-2 text-primary" />
              <h4 className="font-medium text-sm">{capability.name}</h4>
            </div>
            <div className="p-2">
              <p className="text-xs text-muted-foreground mb-2">{capability.description}</p>
              <div className="space-y-1">
                {capability.examples.map((example, idx) => (
                  <div 
                    key={idx}
                    className="text-xs bg-muted/30 hover:bg-muted/60 p-2 rounded-md cursor-pointer transition-colors flex items-center"
                    onClick={() => handleCapabilityClick(example)}
                  >
                    <span className="mr-1">›</span> {example}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
