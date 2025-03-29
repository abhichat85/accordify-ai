
/**
 * Utility functions for finding and interacting with the chat input field
 */

import { useToast } from "@/hooks/use-toast";

/**
 * Finds the chat input field in the DOM using multiple strategies
 * for increased reliability
 */
export const findChatInput = (): HTMLTextAreaElement | null => {
  // Try specific selectors first (ordered from most to least specific)
  const selectors = [
    'textarea[placeholder*="Ask about contracts"]',
    'textarea[placeholder*="contract"]',
    'textarea[placeholder*="Ask"]',
    'textarea[aria-label*="chat"]',
    'textarea[placeholder]' // Any textarea with a placeholder
  ];
  
  // Try each selector
  for (const selector of selectors) {
    const input = document.querySelector(selector) as HTMLTextAreaElement;
    if (input) {
      console.log(`Found chat input with selector: ${selector}`, input);
      return input;
    }
  }
  
  // Try to find any textarea within chat containers
  const chatContainers = document.querySelectorAll('[class*="chat"], [id*="chat"], [aria-label*="chat"]');
  for (const container of chatContainers) {
    const textarea = container.querySelector('textarea');
    if (textarea) {
      console.log('Found chat input within chat container', textarea);
      return textarea as HTMLTextAreaElement;
    }
  }
  
  // Last resort - grab the last textarea on the page
  const allTextareas = document.querySelectorAll('textarea');
  if (allTextareas.length > 0) {
    const lastTextarea = allTextareas[allTextareas.length - 1] as HTMLTextAreaElement;
    console.log('Using last textarea as chat input', lastTextarea);
    return lastTextarea;
  }
  
  console.warn('Could not find chat input');
  return null;
};

/**
 * Sets the value of the chat input and focuses it
 * Uses multiple methods to ensure the value gets set properly
 */
export const setChatInputValue = (prompt: string): boolean => {
  const chatInput = findChatInput();
  
  if (!chatInput) {
    console.error('Chat input not found');
    return false;
  }
  
  console.log(`Setting prompt in chat input:`, prompt);
  console.log(`Chat input element:`, chatInput);
  
  try {
    // 1. Direct value assignment
    chatInput.value = prompt;
    
    // 2. Use Input event
    const inputEvent = new Event('input', { bubbles: true });
    chatInput.dispatchEvent(inputEvent);
    
    // 3. If using React controlled components, try to update the internal ReactDOM value
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype, "value"
    )?.set;
    
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(chatInput, prompt);
      chatInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // 4. Try setting innerText as well (some frameworks use this)
    chatInput.innerText = prompt;
    
    // 5. For React controlled components, trigger change event
    const changeEvent = new Event('change', { bubbles: true });
    chatInput.dispatchEvent(changeEvent);
    
    // Log the result for debugging
    console.log(`After setting prompt, input value is:`, chatInput.value);
    
    // Focus the input so user can press Enter
    chatInput.focus();
    
    return true;
  } catch (error) {
    console.error('Error setting chat input value:', error);
    return false;
  }
};

/**
 * Sets a prompt in the chat input and shows a toast notification
 */
export const setChatPrompt = (prompt: string, toast: ReturnType<typeof useToast>['toast']): boolean => {
  const success = setChatInputValue(prompt);
  
  if (success) {
    toast({
      title: "Prompt ready",
      description: "Press Enter to send the prompt to the AI assistant.",
    });
  } else {
    toast({
      title: "Chat not available",
      description: "Please make sure the chat panel is visible.",
      variant: "destructive"
    });
  }
  
  return success;
};
