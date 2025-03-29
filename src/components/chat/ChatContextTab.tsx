
import React from "react";
import { Card } from "@/components/ui/card";
import { History } from "lucide-react";
import { Message } from "./MessageBubble";

interface ChatContextTabProps {
  contextAwareness: string[];
  messages: Message[];
}

export const ChatContextTab: React.FC<ChatContextTabProps> = ({
  contextAwareness,
  messages
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium mb-1">Conversation Context</h3>
        <p className="text-xs text-muted-foreground mb-2">
          The AI assistant is tracking these contextual elements:
        </p>
      </div>

      {contextAwareness.length > 0 ? (
        <Card className="divide-y divide-border/40">
          {contextAwareness.map((item, idx) => (
            <div key={idx} className="p-2 flex items-center">
              <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
              <span className="text-xs">{item}</span>
            </div>
          ))}
        </Card>
      ) : (
        <div className="text-center p-4 border border-dashed border-border rounded-lg">
          <History className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No active context yet. Start a conversation about a contract to build context.
          </p>
        </div>
      )}

      <Card className="p-3">
        <h4 className="text-sm font-medium mb-1">Conversation Memory</h4>
        <p className="text-xs text-muted-foreground mb-2">
          Your assistant remembers these key discussion points:
        </p>
        <div className="space-y-2">
          {messages.length > 0 ? (
            <ul className="space-y-1">
              {messages.slice(-3).map((msg, idx) => (
                <li key={idx} className="text-xs bg-muted/20 p-2 rounded">
                  <span className={`font-medium ${msg.type === 'user' ? 'text-primary' : ''}`}>
                    {msg.type === 'user' ? 'You: ' : 'Assistant: '}
                  </span>
                  {msg.content.length > 50 ? msg.content.substring(0, 50) + '...' : msg.content}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground italic">Start a conversation to build memory</p>
          )}
        </div>
      </Card>
    </div>
  );
};
