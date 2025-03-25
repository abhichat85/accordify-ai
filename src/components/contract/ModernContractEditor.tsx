
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
  ChevronDown,
  FileText,
  GanttChart,
  FileSearch,
  LayoutGrid,
  List,
  FileCode,
  Heading1,
  Heading2,
  ListOrdered,
  Bold,
  Italic,
  Underline,
  Check,
  FileSymlink,
  Mail,
  NotebookPen,
  MessageSquare,
  CalendarDays,
  FileDigit,
  Scale,
  Brain
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
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [editorMode, setEditorMode] = useState<'rich' | 'code'>('rich');
  const [showFormatting, setShowFormatting] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    setIsSaving(true);
    // Simulating saving process
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
      toast({
        title: "Contract saved",
        description: "Your changes have been saved successfully.",
      });
    }, 800);
  };

  const handleAutoFormat = () => {
    // Simulating auto-formatting
    toast({
      title: "Auto-formatting applied",
      description: "Your document has been formatted according to legal standards.",
    });
  };

  const handleExport = (format: string) => {
    toast({
      title: `Exporting as ${format}`,
      description: `Your document is being exported as ${format}...`,
    });
    // In a real app, this would trigger a download
  };

  const handleIntegration = (service: string) => {
    toast({
      title: `Integrating with ${service}`,
      description: `Preparing to connect with ${service}...`,
    });
    // In a real app, this would open a connection dialog
  };

  const handleVersionHistory = () => {
    toast({
      title: "Version history",
      description: "Loading previous versions of this document...",
    });
    // In a real app, this would show version history
  };

  return (
    <Card className={cn("flex flex-col h-full shadow-md border-border/40 rounded-xl overflow-hidden", className)}>
      {/* Editor toolbar - simplified */}
      <CardHeader className="px-6 py-3 border-b border-border/40 bg-background/80 backdrop-blur-sm space-y-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              className="text-lg font-medium border-none focus:outline-none focus:ring-0 bg-transparent max-w-[200px] md:max-w-sm lg:max-w-lg rounded-md px-2 py-1 hover:bg-muted/50 transition-colors"
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
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full shadow-sm">
                    <Printer size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Print</TooltipContent>
              </Tooltip>
              
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full shadow-sm">
                        <Download size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Export</TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Export Document</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleExport('PDF')} className="flex items-center gap-2">
                    <FileText size={16} /> PDF Document
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('DOCX')} className="flex items-center gap-2">
                    <FileDigit size={16} /> Word Document (.docx)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('TXT')} className="flex items-center gap-2">
                    <FileText size={16} /> Plain Text (.txt)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('MD')} className="flex items-center gap-2">
                    <FileCode size={16} /> Markdown (.md)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('HTML')} className="flex items-center gap-2">
                    <FileCode size={16} /> HTML Document
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full shadow-sm">
                        <Share2 size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Share & Integrate</TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuLabel>Share & Integrate</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Share with</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleIntegration('Email')} className="flex items-center gap-2">
                      <Mail size={16} /> Send via Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleIntegration('Link')} className="flex items-center gap-2">
                      <FileSymlink size={16} /> Copy Share Link
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Integrate with</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleIntegration('Google Docs')} className="flex items-center gap-2">
                      <FileText size={16} /> Google Docs
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleIntegration('MS Word')} className="flex items-center gap-2">
                      <FileText size={16} /> Microsoft Word
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleIntegration('Notion')} className="flex items-center gap-2">
                      <NotebookPen size={16} /> Notion
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleIntegration('Slack')} className="flex items-center gap-2">
                      <MessageSquare size={16} /> Slack
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleIntegration('Calendar')} className="flex items-center gap-2">
                      <CalendarDays size={16} /> Calendar
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipProvider>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2 rounded-lg shadow-sm">
                  <span className="sr-only">More</span>
                  <AlertCircle size={16} className="mr-2" />
                  <span>AI Check</span>
                  <ChevronDown size={16} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>Contract Analysis</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2">
                  <FileSearch size={16} /> Risk Analysis
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <CheckCircle size={16} /> Grammar & Clarity Check
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Scale size={16} /> Legal Compliance
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <GanttChart size={16} /> Term Extraction
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2">
                  <Brain size={16} /> Full AI Contract Review
                </DropdownMenuItem>
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
              className="h-8 rounded-lg shadow-sm"
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
      </CardHeader>
      
      {/* Formatting toolbar */}
      {showFormatting && (
        <div className="px-4 py-1 border-b border-border/40 bg-card/80 flex items-center space-x-1 overflow-x-auto styled-scrollbar">
          <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md">
            <Heading1 size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md">
            <Heading2 size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md">
            <Bold size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md">
            <Italic size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md">
            <Underline size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md">
            <List size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md">
            <ListOrdered size={16} />
          </Button>
          <div className="h-6 w-px bg-border/40 mx-1"></div>
          <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md text-xs">
            Clause
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md text-xs">
            Party
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md text-xs">
            Definition
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md text-xs">
            Date
          </Button>
          <div className="h-6 w-px bg-border/40 mx-1"></div>
          <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md" onClick={handleAutoFormat}>
            Auto Format
          </Button>
        </div>
      )}
      
      {/* View/Mode Selection */}
      <div className="flex items-center px-4 py-2 border-b border-border/40 bg-muted/30">
        <div className="flex items-center space-x-1 mr-4">
          <Button 
            variant={viewMode === 'edit' ? "secondary" : "ghost"} 
            size="sm" 
            className="h-7 text-xs rounded-lg"
            onClick={() => setViewMode('edit')}
          >
            <Edit3 size={14} className="mr-1" />
            Edit
          </Button>
          <Button 
            variant={viewMode === 'preview' ? "secondary" : "ghost"} 
            size="sm" 
            className="h-7 text-xs rounded-lg"
            onClick={() => setViewMode('preview')}
          >
            <FileText size={14} className="mr-1" />
            Preview
          </Button>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button 
            variant={editorMode === 'rich' ? "secondary" : "ghost"} 
            size="sm" 
            className="h-7 text-xs rounded-lg"
            onClick={() => {
              setEditorMode('rich');
              setShowFormatting(true);
            }}
          >
            <LayoutGrid size={14} className="mr-1" />
            Rich Text
          </Button>
          <Button 
            variant={editorMode === 'code' ? "secondary" : "ghost"} 
            size="sm" 
            className="h-7 text-xs rounded-lg"
            onClick={() => {
              setEditorMode('code');
              setShowFormatting(false);
            }}
          >
            <FileCode size={14} className="mr-1" />
            Markdown
          </Button>
        </div>
        
        <div className="ml-auto flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs rounded-lg" 
            onClick={handleVersionHistory}
          >
            <RotateCcw size={14} className="mr-1" />
            History
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs rounded-lg"
            onClick={() => setShowFormatting(!showFormatting)}
          >
            {showFormatting ? "Hide Formatting" : "Show Formatting"}
          </Button>
        </div>
      </div>
      
      {/* Editor content */}
      <CardContent className="flex-grow p-0 overflow-y-auto">
        <div className="h-full">
          {viewMode === 'edit' ? (
            <textarea
              className="w-full h-full p-6 border-none text-sm leading-relaxed focus:outline-none focus:ring-0 bg-card font-mono resize-none styled-scrollbar"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter contract text here..."
            />
          ) : (
            <div className="w-full h-full p-6 overflow-auto styled-scrollbar">
              <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 border border-border/20">
                <div className="prose prose-sm max-w-none">
                  {content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 whitespace-pre-line">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1 border-t border-border/40 bg-muted/20 text-xs text-muted-foreground">
        <div className="flex items-center">
          <span className="mr-4">Words: {content.split(/\s+/).filter(Boolean).length}</span>
          <span>Characters: {content.length}</span>
        </div>
        <div className="flex items-center">
          <CheckCircle size={14} className="text-primary mr-1" />
          <span>No issues detected</span>
        </div>
      </div>
    </Card>
  );
};
