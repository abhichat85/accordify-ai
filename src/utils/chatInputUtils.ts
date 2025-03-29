
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
    'textarea[data-chat-input="true"]',
    'textarea[aria-label="chat-input"]',
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
  
  try {
    // Store the original value to check if our changes take effect
    const originalValue = chatInput.value;
    
    // Method 1: Direct value assignment
    chatInput.value = prompt;
    
    // Method 2: Use the property descriptor setter
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype, "value"
    )?.set;
    
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(chatInput, prompt);
    }
    
    // Method 3: Simulate user typing (more compatible with React)
    // This approach mimics the user typing character by character
    // Clear first (if needed)
    if (originalValue) {
      chatInput.select();
      document.execCommand('delete', false);
    }
    
    // Insert the text with execCommand
    document.execCommand('insertText', false, prompt);

    // Method 4: Trigger input event for React controlled components
    const inputEvent = new Event('input', { bubbles: true });
    chatInput.dispatchEvent(inputEvent);
    
    // Method 5: Trigger change event for React controlled components
    const changeEvent = new Event('change', { bubbles: true });
    chatInput.dispatchEvent(changeEvent);
    
    // Method 6: Focus and blur to trigger React's onBlur handlers
    chatInput.focus();
    setTimeout(() => {
      // Small delay to ensure events are processed
      // Check if our value was set correctly
      console.log(`Current input value after setting:`, chatInput.value);
      
      // If none of our methods worked, try one more approach
      if (!chatInput.value.includes(prompt)) {
        console.log("Initial methods failed, trying React state update simulation");
        
        // Create and dispatch keyboard events to simulate typing
        const keyboardEvent = new KeyboardEvent('keydown', {
          key: 'v',
          code: 'KeyV',
          ctrlKey: true, // Simulate Ctrl+V paste operation
          bubbles: true
        });
        
        chatInput.dispatchEvent(keyboardEvent);
        
        // Try one more time with a clipboard approach
        try {
          // Save original clipboard content
          const originalClipboard = navigator.clipboard?.readText();
          
          // Set clipboard with our prompt
          navigator.clipboard?.writeText(prompt).then(() => {
            // Simulate paste
            document.execCommand('paste', false);
            
            // Restore original clipboard if possible
            if (originalClipboard) {
              originalClipboard.then(text => {
                navigator.clipboard?.writeText(text);
              });
            }
          }).catch(e => {
            console.log("Clipboard approach failed:", e);
          });
        } catch (e) {
          console.log("Clipboard API not available:", e);
        }
      }
    }, 50);
    
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
