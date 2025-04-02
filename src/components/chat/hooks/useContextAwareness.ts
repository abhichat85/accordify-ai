
import { useState, useEffect } from "react";
import { Message } from "../MessageBubble";

export const useContextAwareness = (messages: Message[]) => {
  const [contextAwareness, setContextAwareness] = useState<string[]>([]);

  useEffect(() => {
    if (messages.length > 3) {
      setContextAwareness([
        "Current document: Non-Disclosure Agreement (Draft)",
        "Related documents: 2 previous NDAs in your history",
        "Missing elements: Jurisdiction clause, Term definition",
        "Risk level: Medium (3 potential issues identified)"
      ]);
    }
  }, [messages]);

  return contextAwareness;
};
