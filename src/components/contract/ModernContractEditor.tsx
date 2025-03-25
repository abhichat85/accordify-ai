
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  SaveIcon, 
  Edit3, 
  CheckCircle, 
  Clock, 
  RotateCcw,
  Download,
  Share2,
  Printer,
  AlertCircle,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ModernContractEditorProps {
  title: string;
  className?: string;
}

export const ModernContractEditor: React.FC<ModernContractEditorProps> = ({
  title,
  className
}) => {
  const [content, setContent] = useState(`MUTUAL NON-DISCLOSURE AGREEMENT

THIS MUTUAL NON-DISCLOSURE AGREEMENT (this "Agreement") is made and entered into as of [EFFECTIVE DATE] (the "Effective Date"), by and between [PARTY A], a [STATE] [ENTITY TYPE] with its principal place of business at [ADDRESS] ("Company"), and [PARTY B], a [STATE] [ENTITY TYPE] with its principal place of business at [ADDRESS] ("Recipient").

1. PURPOSE
Company and Recipient wish to explore a potential business relationship in connection with [DESCRIBE POTENTIAL RELATIONSHIP] (the "Purpose"). In connection with the Purpose, each party may disclose to the other certain confidential technical and business information that the disclosing party desires the receiving party to treat as confidential.

2. CONFIDENTIAL INFORMATION
"Confidential Information" means any information disclosed by either party to the other party, either directly or indirectly, in writing, orally or by inspection of tangible objects, which is designated as "Confidential," "Proprietary" or some similar designation, or information the confidential nature of which is reasonably apparent under the circumstances. Confidential Information shall include, without limitation, [SPECIFIC TYPES OF INFORMATION].

3. NON-USE AND NON-DISCLOSURE
Each party agrees not to use any Confidential Information of the other party for any purpose except to evaluate and engage in discussions concerning the Purpose. Each party agrees not to disclose any Confidential Information of the other party to third parties or to such party's employees, except to those employees who are required to have the information in order to evaluate or engage in discussions concerning the Purpose and who have signed confidentiality agreements with terms no less restrictive than those contained herein.

4. TERM
This Agreement shall remain in effect for a period of [TIME PERIOD] from the Effective Date, unless earlier terminated by either party with [NOTICE PERIOD] prior written notice. Each party's obligations under this Agreement shall survive termination of the Agreement and shall be binding upon such party's heirs, successors, and assigns.`);
  
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [currentTitle, setCurrentTitle] = useState(title);

  const handleSave = () => {
    setIsSaving(true);
    // Simulating saving process
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 800);
  };

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Editor toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center">
          <input
            type="text"
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            className="text-lg font-medium border-none focus:outline-none focus:ring-0 bg-transparent max-w-[200px] md:max-w-sm lg:max-w-lg"
            placeholder="Contract Title"
          />
          <div className="flex items-center ml-4 space-x-1 text-xs">
            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">Template</span>
            <span className="text-muted-foreground">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Printer size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Print</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Download size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Share2 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-2">
                <span className="sr-only">More</span>
                <AlertCircle size={16} className="mr-2" />
                <span>AI Check</span>
                <ChevronDown size={16} className="ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Risk Analysis</DropdownMenuItem>
              <DropdownMenuItem>Grammar Check</DropdownMenuItem>
              <DropdownMenuItem>Legal Compliance</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {lastSaved && (
            <div className="hidden md:flex items-center text-xs text-muted-foreground">
              <Clock size={12} className="mr-1" />
              <span>
                Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}
          
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            className="h-8"
          >
            {isSaving ? (
              <>
                <div className="animate-spin mr-1 h-3 w-3 border-2 border-current border-t-transparent rounded-full"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <SaveIcon size={16} className="mr-1" />
                <span>Save</span>
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Editor content */}
      <div className="flex-grow p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-xl border border-border/40 shadow-sm">
            <div className="flex items-center p-3 border-b border-border/40">
              <Button variant="ghost" size="sm" className="rounded-lg gap-1 text-xs">
                <Edit3 size={14} />
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="rounded-lg gap-1 text-xs">
                <RotateCcw size={14} />
                Versions
              </Button>
              <div className="ml-auto flex items-center text-xs text-muted-foreground">
                <CheckCircle size={14} className="text-primary mr-1" />
                No issues detected
              </div>
            </div>
            
            <textarea
              className="w-full min-h-[calc(100vh-220px)] p-6 border-none rounded-b-xl text-sm leading-relaxed focus:outline-none focus:ring-0 bg-card font-mono resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter contract text here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
