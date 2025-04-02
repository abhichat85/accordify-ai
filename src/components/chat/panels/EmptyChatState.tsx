
import React from "react";
import { AIModeOrb } from "../AIModeOrb";
import { AiMode } from "../AiModes";

interface EmptyChatStateProps {
  activeMode: "write" | "chat";
  currentAiMode: AiMode;
}

export const EmptyChatState: React.FC<EmptyChatStateProps> = ({
  activeMode,
  currentAiMode
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="flex items-center justify-center mb-4">
        <AIModeOrb active={true} activeMode={currentAiMode} size={2} />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-1 text-center">Write with Accord AI</h2>
      <p className="text-sm text-muted-foreground text-center px-6">
        {activeMode === "write" 
          ? "Draft, review, or analyze contracts with AI assistance" 
          : "Ask questions about contracts or get legal guidance"}
      </p>
    </div>
  );
};
