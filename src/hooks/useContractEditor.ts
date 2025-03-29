
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_NDA_TEMPLATE } from "@/constants/contractTemplates";

export interface ContractEditorState {
  content: string;
  currentTitle: string;
  isSaving: boolean;
  lastSaved: Date | null;
  viewMode: 'edit' | 'preview';
  editorMode: 'rich' | 'code';
  showFormatting: boolean;
  status: 'draft' | 'submitted' | 'sent_for_signing';
}

export const useContractEditor = (title: string, initialContent: string) => {
  const { toast } = useToast();
  const [state, setState] = useState<ContractEditorState>({
    content: initialContent || DEFAULT_NDA_TEMPLATE,
    currentTitle: title,
    isSaving: false,
    lastSaved: null,
    viewMode: 'edit',
    editorMode: 'rich',
    showFormatting: false,
    status: 'draft'
  });

  useEffect(() => {
    if (initialContent) {
      console.log("ModernContractEditor: Setting content from initialContent:", initialContent.substring(0, 100) + "...");
      setState(prev => ({ ...prev, content: initialContent }));
    }
  }, [initialContent]);

  // Find the chat input field in the DOM - enhanced version
  const findChatInput = (): HTMLTextAreaElement | null => {
    // Look for the input element in multiple ways to improve reliability
    
    // Try specific selectors first
    let chatInput = document.querySelector('textarea[placeholder*="Ask about contracts"]') as HTMLTextAreaElement;
    
    // If not found, try more generic selectors
    if (!chatInput) {
      chatInput = document.querySelector('textarea[placeholder*="contract"]') as HTMLTextAreaElement;
    }
    
    if (!chatInput) {
      chatInput = document.querySelector('textarea[placeholder*="Ask"]') as HTMLTextAreaElement;
    }
    
    // If still not found, try all textareas within chat containers
    if (!chatInput) {
      const allTextareas = document.querySelectorAll('textarea');
      // Try to find any textarea in the chat section
      for (const textarea of allTextareas) {
        const parent = textarea.closest('[class*="chat"]') || 
                      textarea.closest('[id*="chat"]') || 
                      textarea.closest('[aria-label*="chat"]');
        if (parent) {
          chatInput = textarea;
          break;
        }
      }
    }
    
    // Last resort - just grab the last textarea on the page
    if (!chatInput) {
      const allTextareas = document.querySelectorAll('textarea');
      if (allTextareas.length > 0) {
        chatInput = allTextareas[allTextareas.length - 1] as HTMLTextAreaElement;
      }
    }
    
    console.log("Found chat input:", chatInput);
    return chatInput;
  };

  // Set a prompt in the chat input and focus it
  const setChatPrompt = (prompt: string) => {
    const chatInput = findChatInput();
    
    if (!chatInput) {
      toast({
        title: "Chat not available",
        description: "Please make sure the chat panel is visible.",
        variant: "destructive"
      });
      return false;
    }
    
    console.log("Setting prompt in chat input:", prompt);
    
    // Multiple approaches to ensure the value gets set
    // 1. Direct value assignment
    chatInput.value = prompt;
    
    // 2. Use Input event
    chatInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    // 3. If using React controlled components, try to update the internal ReactDOM value
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype, "value"
    )?.set;
    
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(chatInput, prompt);
    }
    
    // 4. Force React to acknowledge the change
    const inputEvent = new Event('input', { bubbles: true });
    chatInput.dispatchEvent(inputEvent);
    
    // Focus the input so user can press Enter
    chatInput.focus();
    
    toast({
      title: "Prompt ready",
      description: "Press Enter to send the prompt to the AI assistant.",
    });
    
    return true;
  };

  const setContent = (content: string) => {
    setState(prev => ({ ...prev, content }));
  };

  const setCurrentTitle = (currentTitle: string) => {
    setState(prev => ({ ...prev, currentTitle }));
  };

  const setViewMode = (viewMode: 'edit' | 'preview') => {
    setState(prev => ({ ...prev, viewMode }));
  };

  const setEditorMode = (editorMode: 'rich' | 'code') => {
    setState(prev => ({ ...prev, editorMode }));
  };

  const setShowFormatting = (showFormatting: boolean) => {
    setState(prev => ({ ...prev, showFormatting }));
  };

  const setStatus = (status: 'draft' | 'submitted' | 'sent_for_signing') => {
    setState(prev => ({ ...prev, status }));
    
    // Create appropriate prompt based on the new status
    let prompt = "";
    if (status === 'draft') {
      prompt = `I've saved my "${state.currentTitle}" contract as a draft. Could you please help me review it before I proceed further?`;
      toast({
        title: "Contract saved as draft",
        description: "You can continue editing this contract.",
      });
    } else if (status === 'submitted') {
      prompt = `I've just submitted my contract "${state.currentTitle}" for internal review. Could you please help me check for any potential issues or suggest improvements before it goes to the next stage? Focus on legal clarity, completeness, and any potential risks.`;
      toast({
        title: "Contract submitted",
        description: "Your contract is now submitted for internal review.",
      });
    } else if (status === 'sent_for_signing') {
      prompt = `I'm about to send my contract "${state.currentTitle}" for electronic signatures. Before I do, could you please verify that all signature blocks, dates, and party information are correctly formatted? Also, is there anything I should communicate to the signatories?`;
      toast({
        title: "Contract sent for signing",
        description: "Your contract has been sent for electronic signatures.",
      });
    }
    
    // Set the prompt in the chat input if there is one
    if (prompt) {
      setChatPrompt(prompt);
    }
  };

  const handleSave = () => {
    setState(prev => ({ ...prev, isSaving: true }));
    // Simulating saving process
    setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        isSaving: false, 
        lastSaved: new Date(),
        // Always set status to draft when manually saving
        status: 'draft'
      }));
      
      toast({
        title: "Contract saved",
        description: "Your changes have been saved successfully.",
      });
    }, 800);
  };

  return {
    ...state,
    setContent,
    setCurrentTitle,
    setViewMode,
    setEditorMode,
    setShowFormatting,
    setStatus,
    handleSave,
    setChatPrompt
  };
};
