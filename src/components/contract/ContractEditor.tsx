
import React, { useState } from "react";
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
              value={content || `MUTUAL NON-DISCLOSURE AGREEMENT

THIS MUTUAL NON-DISCLOSURE AGREEMENT (this "Agreement") is made and entered into as of [EFFECTIVE DATE] (the "Effective Date"), by and between [PARTY A], a [STATE] [ENTITY TYPE] with its principal place of business at [ADDRESS] ("Company"), and [PARTY B], a [STATE] [ENTITY TYPE] with its principal place of business at [ADDRESS] ("Recipient").

1. PURPOSE
Company and Recipient wish to explore a potential business relationship in connection with [DESCRIBE POTENTIAL RELATIONSHIP] (the "Purpose"). In connection with the Purpose, each party may disclose to the other certain confidential technical and business information that the disclosing party desires the receiving party to treat as confidential.

2. CONFIDENTIAL INFORMATION
"Confidential Information" means any information disclosed by either party to the other party, either directly or indirectly, in writing, orally or by inspection of tangible objects, which is designated as "Confidential," "Proprietary" or some similar designation, or information the confidential nature of which is reasonably apparent under the circumstances. Confidential Information shall include, without limitation, [SPECIFIC TYPES OF INFORMATION].

3. NON-USE AND NON-DISCLOSURE
Each party agrees not to use any Confidential Information of the other party for any purpose except to evaluate and engage in discussions concerning the Purpose. Each party agrees not to disclose any Confidential Information of the other party to third parties or to such party's employees, except to those employees who are required to have the information in order to evaluate or engage in discussions concerning the Purpose and who have signed confidentiality agreements with terms no less restrictive than those contained herein.

4. TERM
This Agreement shall remain in effect for a period of [TIME PERIOD] from the Effective Date, unless earlier terminated by either party with [NOTICE PERIOD] prior written notice. Each party's obligations under this Agreement shall survive termination of the Agreement and shall be binding upon such party's heirs, successors, and assigns.

[Additional standard sections would follow...]

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.

[PARTY A]
By: ______________________
Name: ____________________
Title: _____________________

[PARTY B]
By: ______________________
Name: ____________________
Title: _____________________`}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter contract text here..."
            />
          </div>
        </div>
      </div>
    </ContractPanel>
  );
};
