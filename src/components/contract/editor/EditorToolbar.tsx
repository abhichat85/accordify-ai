
import React from "react";
import { 
  SaveIcon, 
  Printer,
  Download,
  Share2,
  AlertCircle,
  ChevronDown,
  FileText,
  FileDigit,
  FileCode,
  Mail,
  NotebookPen,
  MessageSquare,
  CalendarDays,
  FileSymlink,
  Clock,
  FileSearch,
  CheckCircle,
  Scale,
  GanttChart,
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
import { useToast } from "@/hooks/use-toast";

interface EditorToolbarProps {
  title: string;
  currentTitle: string;
  setCurrentTitle: (title: string) => void;
  handleSave: () => void;
  isSaving: boolean;
  lastSaved: Date | null;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  currentTitle,
  setCurrentTitle,
  handleSave,
  isSaving,
  lastSaved
}) => {
  const { toast } = useToast();

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

  return (
    <div className="px-6 py-3 border-b border-border/40 bg-background/80 backdrop-blur-sm space-y-0">
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
    </div>
  );
};
