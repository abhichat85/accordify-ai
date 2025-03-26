
import React, { useState, useEffect } from "react";
import { ContractPanel } from "./ContractPanel";
import { SaveIcon, Edit3, CheckCircle, Clock, RotateCcw } from "lucide-react";

interface ContractEditorProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialContent?: string;
}

export const ContractEditor: React.FC<ContractEditorProps> = ({
  isOpen,
  onClose,
  title,
  initialContent = "",
}) => {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Update content when initialContent changes
  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  const handleSave = () => {
    setIsSaving(true);
    // Simulating saving process
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 800);
  };

  return (
    <ContractPanel
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type="editor"
    >
      <div className="flex flex-col h-full">
        {/* Editor toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-accord-lightGray/70 border-b border-accord-mediumGray/50">
          <div className="flex items-center space-x-2">
            <button className="p-1.5 hover:bg-white rounded transition-colors">
              <Edit3 size={16} />
            </button>
            <button className="p-1.5 hover:bg-white rounded transition-colors">
              <RotateCcw size={16} />
            </button>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-accord-darkGray">
            {lastSaved && (
              <div className="flex items-center">
                <Clock size={12} className="mr-1" />
                <span>
                  Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-3 py-1.5 bg-white rounded border border-accord-mediumGray/50 hover:shadow-sm transition-all"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin mr-1 h-3 w-3 border-2 border-accord-teal border-t-transparent rounded-full"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <SaveIcon size={12} className="mr-1" />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Editor content */}
        <div className="flex-grow p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <input
                type="text"
                placeholder="Contract Title"
                className="w-full text-2xl font-bold border-none outline-none bg-transparent text-accord-blue"
                defaultValue={title}
              />
              <div className="flex items-center text-xs text-accord-darkGray mt-1">
                <span className="bg-accord-teal/20 text-accord-teal px-2 py-0.5 rounded-full mr-2">
                  Template
                </span>
                <span>Generated on {new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            <textarea
              className="w-full min-h-[calc(100vh-220px)] p-4 border border-accord-mediumGray/30 rounded-lg text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-accord-teal resize-none styled-scrollbar"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter contract text here..."
            />
          </div>
        </div>
      </div>
    </ContractPanel>
  );
};
