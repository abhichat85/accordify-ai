
import { useState, useEffect, useRef } from "react";

export const useInputHandling = (defaultInputValue: string = "") => {
  const [inputValue, setInputValue] = useState(defaultInputValue);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Effect to synchronize with defaultInputValue when it changes
  useEffect(() => {
    if (defaultInputValue && defaultInputValue !== inputValue) {
      setInputValue(defaultInputValue);
    }
  }, [defaultInputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Listen for custom events from setChatInputValue
  useEffect(() => {
    const handleCustomEvent = (event: CustomEvent) => {
      if (event.detail && event.detail.prompt) {
        setInputValue(event.detail.prompt);
      }
    };

    document.addEventListener('chat-prompt-update', handleCustomEvent as EventListener);

    return () => {
      document.removeEventListener('chat-prompt-update', handleCustomEvent as EventListener);
    };
  }, []);

  return {
    inputValue,
    setInputValue,
    inputRef,
    handleInputChange,
    handleSuggestionClick
  };
};
