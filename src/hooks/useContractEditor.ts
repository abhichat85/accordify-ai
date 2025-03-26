
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
    showFormatting: false
  });

  useEffect(() => {
    if (initialContent) {
      console.log("ModernContractEditor: Setting content from initialContent:", initialContent.substring(0, 100) + "...");
      setState(prev => ({ ...prev, content: initialContent }));
    }
  }, [initialContent]);

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

  const handleSave = () => {
    setState(prev => ({ ...prev, isSaving: true }));
    // Simulating saving process
    setTimeout(() => {
      setState(prev => ({ ...prev, isSaving: false, lastSaved: new Date() }));
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
    handleSave
  };
};
