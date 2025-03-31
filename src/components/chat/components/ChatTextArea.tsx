
import React, { useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

interface ChatTextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

export const ChatTextArea: React.FC<ChatTextAreaProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder = "Message Accord AI..."
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Adjust height of textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      adjustTextareaHeight();
    }
  }, [value]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      
      // Calculate new height (constrained between 40px and 150px)
      const newHeight = Math.max(40, Math.min(textareaRef.current.scrollHeight, 150));
      
      // Set the new height
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className="min-h-[40px] max-h-[150px] py-3 px-4 flex-1 bg-transparent border-0 focus-visible:ring-0 resize-none overflow-y-auto styled-scrollbar"
      data-chat-input="true"
      aria-label="chat-input"
    />
  );
};
