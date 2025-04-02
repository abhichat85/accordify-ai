
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_NDA_TEMPLATE } from "@/constants/contractTemplates";
import { setChatInputValue } from "@/utils/chatInputUtils";
import { supabase } from "@/integrations/supabase/client";

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

  // Set a prompt in the chat input and focus it
  const setChatPrompt = (prompt: string) => {
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

  const saveToSupabase = async (content: string, title: string, status: 'draft' | 'submitted' | 'sent_for_signing') => {
    try {
      // Get the current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.error("No authenticated user found");
        return false;
      }
      
      const userId = session.user.id;
      
      // Check if a document with this title exists for the current user
      const { data: existingDocs, error: fetchError } = await supabase
        .from('documents')
        .select('id')
        .eq('user_id', userId)
        .eq('title', title)
        .limit(1);
        
      if (fetchError) {
        console.error("Error fetching documents:", fetchError);
        return false;
      }
      
      let result;
      
      // Update or insert the document
      if (existingDocs && existingDocs.length > 0) {
        // Update existing document
        result = await supabase
          .from('documents')
          .update({
            content,
            status,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingDocs[0].id);
      } else {
        // Insert new document
        result = await supabase
          .from('documents')
          .insert({
            title,
            content,
            user_id: userId,
            status,
            document_type: 'contract',
            file_path: `contracts/${title.toLowerCase().replace(/\s+/g, '-')}`
          });
      }
      
      if (result.error) {
        console.error("Error saving document:", result.error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in saveToSupabase:", error);
      return false;
    }
  };

  const handleSave = async () => {
    setState(prev => ({ ...prev, isSaving: true }));
    
    try {
      // Save to Supabase
      const success = await saveToSupabase(
        state.content,
        state.currentTitle,
        'draft' // Always save as draft when manually saving
      );
      
      if (success) {
        setState(prev => ({ 
          ...prev, 
          isSaving: false, 
          lastSaved: new Date(),
          status: 'draft'
        }));
        
        toast({
          title: "Contract saved",
          description: "Your changes have been saved successfully to the database.",
        });
      } else {
        // Handle error
        setState(prev => ({ ...prev, isSaving: false }));
        toast({
          title: "Save failed",
          description: "There was an error saving your contract. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving contract:", error);
      setState(prev => ({ ...prev, isSaving: false }));
      toast({
        title: "Save failed",
        description: "There was an error saving your contract. Please try again.",
        variant: "destructive"
      });
    }
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
