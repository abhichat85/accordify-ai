import React, { useState, useRef } from "react";
import { 
  SaveIcon, 
  Share2,
  Download, 
  Printer, 
  MoreHorizontal,
  ChevronDown,
  FileText,
  FileImage,
  FileJson,
  Send,
  Clock,
  Check,
  Mail,
  FileSymlink,
  NotebookPen,
  MessageSquare,
  CalendarDays,
  FileSearch,
  CheckCircle,
  Scale,
  GanttChart,
  Brain,
  Folder,
  FileIcon,
  History,
  ListChecks // Adding ListChecks icon for the Summary button
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { SignatureRequestModal } from "@/components/signature/SignatureRequestModal";
import { setChatInputValue } from "@/utils/chatInputUtils"; // Assuming this utility exists

interface EditorToolbarProps {
  title: string;
  currentTitle: string;
  setCurrentTitle: (title: string) => void;
  handleSave: () => void;
  isSaving: boolean;
  lastSaved: Date | null;
  content: string;
  status: 'draft' | 'submitted' | 'sent_for_signing';
  onStatusChange: (status: 'draft' | 'submitted' | 'sent_for_signing') => void;
  setChatPrompt?: (prompt: string) => boolean;
  onVersionsClick?: () => void;
  onSummarize?: () => void; // Adding a new prop for the summarize action
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  title,
  currentTitle,
  setCurrentTitle,
  handleSave,
  isSaving,
  lastSaved,
  content,
  status,
  onStatusChange,
  setChatPrompt,
  onVersionsClick,
  onSummarize // Destructuring the new prop
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const { toast } = useToast();

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
    // Optionally save on blur, or rely on explicit save
    // handleSave(); 
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      // Optionally save on enter
      // handleSave();
    }
  };

  const handleShareLink = () => {
    const shareUrl = `https://example.com/shared-contract/${currentTitle.replace(/\s+/g, '-').toLowerCase()}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast({
          title: "Link Copied",
          description: "Shareable link has been copied to clipboard.",
        });
      })
      .catch(err => {
        toast({
          title: "Copy Failed",
          description: "Could not copy link to clipboard.",
          variant: "destructive"
        });
      });
  };
  
  const handleShareEmail = () => {
     const subject = encodeURIComponent(currentTitle);
     const body = encodeURIComponent(`${currentTitle}\n\n${content}`);
     window.open(`mailto:?subject=${subject}&body=${body}`);
     toast({
       title: "Email Sharing",
       description: "Opening your default email client...",
     });
  };

  const handleExport = (format: 'docx' | 'json' | 'image' /* Removed pdf */) => {
    let formattedContent: string | Blob = content;
    let mimeType = 'text/plain';
    let extension = 'txt';

    switch (format) {
      case 'docx':
        // Basic DOCX creation - for real implementation, use a library like docx or mammoth
        formattedContent = new Blob([
          `<html><head><meta charset='utf-8'></head><body>${content.replace(/\n/g, '<br/>')}</body></html>`
        ], { type: 'application/msword' });
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        extension = 'docx';
        break;
      // PDF export removed by user - can be re-added if needed with a library like jsPDF
      case 'json':
        formattedContent = JSON.stringify({ title: currentTitle, content: content }, null, 2);
        mimeType = 'application/json';
        extension = 'json';
        break;
      case 'image':
        // Requires a library like html2canvas to render content to an image
        toast({ title: "Image Export", description: "Image export requires a rendering library (coming soon).", variant: "destructive" });
        return; // Placeholder
        // mimeType = 'image/png';
        // extension = 'png';
        // break;
    }

    const blob = formattedContent instanceof Blob ? formattedContent : new Blob([formattedContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = linkRef.current || document.createElement('a');
    a.href = url;
    a.download = `${currentTitle.replace(/\s+/g, '_')}.${extension}`;
    if (!linkRef.current) document.body.appendChild(a);
    a.click();
    if (!linkRef.current) document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: `Document has been prepared for download as ${format.toUpperCase()}.`,
    });
  };
  
  // Basic print formatting - might need improvement for complex content
  const formatContentForPrint = (text: string): string => {
    let formattedText = text;
    formattedText = formattedText
      .split('\n\n')
      .map(paragraph => {
        if (!paragraph.trim()) return '';
        const paraHtml = paragraph
          .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') // Basic HTML escaping
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bold
          .replace(/\*(.+?)\*/g, '<em>$1</em>') // Italic
          .replace(/__(.+?)__/g, '<u>$1</u>') // Underline (using __ instead of ++, removed unnecessary escapes)
          .replace(/\n/g, '<br>'); // Handle line breaks within paragraphs
        return `<p>${paraHtml}</p>`;
      })
      .join('\n');
    return formattedText;
  };

  const handlePrint = () => {
     const printWindow = window.open('', '_blank');
     if (!printWindow) {
       toast({ title: "Print Failed", description: "Cannot open print window. Check popup blocker.", variant: "destructive" });
       return;
     }
     printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print - ${currentTitle}</title>
          <style>
            body { font-family: sans-serif; margin: 1in; line-height: 1.5; }
            p { margin-bottom: 1em; }
            strong { font-weight: bold; }
            em { font-style: italic; }
            u { text-decoration: underline; }
            @media print {
              body { margin: 0.5in; }
            }
          </style>
        </head>
        <body>
          <h1>${currentTitle}</h1>
          ${formatContentForPrint(content)}
        </body>
      </html>
     `);
     printWindow.document.close();
     printWindow.focus(); 
     // Delay print slightly to allow content rendering
     setTimeout(() => {
       printWindow.print();
       // Close window after print dialog is handled (might not always work)
       printWindow.onafterprint = () => printWindow.close();
     }, 300); 
     toast({ title: "Print Initialized", description: "Print dialog opened." });
  };

  const handleSendForSigning = () => {
    setIsSignatureModalOpen(true);
  };

  const handleSignatureComplete = (success: boolean) => {
    setIsSignatureModalOpen(false);
    if (success) {
      onStatusChange('sent_for_signing'); 
      const prompt = `The contract "${currentTitle}" has been sent for signing. What are the next steps I should track?`;
      if (setChatPrompt) setChatPrompt(prompt);
      toast({ title: "Contract Sent", description: "Successfully sent for signing." });
    } else {
      toast({ title: "Sending Cancelled", description: "Signature request was cancelled.", variant: "default" });
    }
  };
  
  const handleSaveAsTemplate = () => {
    // Logic to save the current content as a template
    handleSave(); // Save current state first
    toast({ title: "Saved as Template", description: `"${currentTitle}" saved as a reusable template.` });
    // API call to save as template would go here
  };

  const handleAIAnalysis = (analysisType: string) => {
    if (!setChatPrompt) {
       toast({ title: "AI Not Configured", description: "Chat prompt function is not available.", variant: "destructive" });
       return;
    }
    let prompt = "";
    let title = "";
    switch (analysisType) {
      case "risk":
        title = "Risk Analysis";
        prompt = `Perform a risk analysis on the contract "${currentTitle}". Identify high, medium, low risk clauses and suggest mitigation strategies. Contract content:\n\n${content}`; 
        break;
      case "grammar":
        title = "Grammar & Clarity Check";
        prompt = `Review the contract "${currentTitle}" for grammar, clarity, and readability. Highlight ambiguous terms or confusing sentences. Contract content:\n\n${content}`;
        break;
      case "compliance":
        title = "Legal Compliance Check";
        prompt = `Analyze the contract "${currentTitle}" for legal compliance with standard requirements. Identify missing clauses or potential issues. Contract content:\n\n${content}`;
        break;
      case "terms":
        title = "Key Term Extraction";
        prompt = `Extract and summarize key terms from the contract "${currentTitle}" (e.g., dates, values, obligations, termination). Contract content:\n\n${content}`;
        break;
      case "full":
        title = "Full Contract Review";
        prompt = `Perform a comprehensive review of the contract "${currentTitle}". Analyze risks, clarity, compliance, extract key terms, and provide overall recommendations. Contract content:\n\n${content}`;
        break;
      default:
        title = "General AI Analysis";
        prompt = `Analyze the contract "${currentTitle}" and provide general feedback. Contract content:\n\n${content}`;
    }
    const success = setChatPrompt(prompt);
    if (success) {
      toast({ title: `${title} Prompt Ready`, description: "Check the chat panel and press Enter to send." });
    } else {
      toast({ title: "AI Prompt Failed", description: "Could not set the prompt in the chat input.", variant: "destructive" });
    }
  };

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 5) return 'Just now';
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) + ' ' + date.toLocaleDateString();
  };

  return (
    <div className="flex items-center justify-between p-2 px-4 border-b border-border/40 bg-background">
       {/* Link for programmatic downloads */}
       <a ref={linkRef} style={{ display: 'none' }} download></a>
       {/* Signature Modal */}
       <SignatureRequestModal
         isOpen={isSignatureModalOpen}
         onClose={() => {
           setIsSignatureModalOpen(false);
           handleSignatureComplete(true); // Assuming modal closing normally counts as success
         }}
         documentTitle={currentTitle}
         documentContent={content} 
       />
      
      {/* Left side: Title and Status */}
      <div className="flex items-center gap-3">
        {isEditing ? (
          <Input
            value={currentTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            className="h-8 text-lg font-medium"
            autoFocus
            placeholder="Contract Title"
          />
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                 <h2 
                   className="text-lg font-medium cursor-pointer hover:text-primary transition-colors truncate max-w-xs md:max-w-sm lg:max-w-md"
                   onClick={handleTitleClick}
                 >
                   {currentTitle || title || 'Untitled Contract'}
                 </h2>
              </TooltipTrigger>
              <TooltipContent>Click to edit title</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
         {/* Status Indicator (optional) */}
         {/* <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
           status === 'draft' ? 'bg-muted text-muted-foreground' :
           status === 'submitted' ? 'bg-blue-100 text-blue-800' :
           'bg-green-100 text-green-800'
         }`}>
           {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
         </span> */}
      </div>
      
      {/* Right side: Actions */}
      <div className="flex items-center space-x-1">
        <TooltipProvider>
          {/* Last Saved Time */}
          {lastSaved && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs text-muted-foreground flex items-center mr-2 cursor-default">
                  <Clock size={12} className="mr-1 flex-shrink-0" />
                  <span className="truncate">{formatLastSaved(lastSaved)}</span>
                </span>
              </TooltipTrigger>
              <TooltipContent>Last saved time</TooltipContent>
            </Tooltip>
          )}

          {/* Versions Button (conditionally rendered) */}
          {onVersionsClick && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="h-8" onClick={onVersionsClick}>
                   <History size={14} className="mr-1"/> Versions
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Document History</TooltipContent>
            </Tooltip>
          )}
          
          {/* Export Dropdown */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Download size={16} />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Export</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export As</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('docx')}>
                <FileText size={16} className="mr-2" /> Word (.docx)
              </DropdownMenuItem>
              {/* PDF Option removed by user */}
              <DropdownMenuItem onClick={() => handleExport('image')}>
                <FileImage size={16} className="mr-2" /> Image (.png) <span className="ml-auto text-xs text-muted-foreground">(Soon)</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('json')}>
                <FileJson size={16} className="mr-2" /> JSON (.json)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Share/Integrate Dropdown */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                 <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Share2 size={16} />
                    </Button>
                 </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Share & Integrate</TooltipContent>
            </Tooltip>
             <DropdownMenuContent align="end" className="w-60">
               <DropdownMenuLabel>Share Options</DropdownMenuLabel>
               <DropdownMenuSeparator />
               <DropdownMenuGroup>
                 <DropdownMenuItem onClick={handleShareEmail} className="flex items-center gap-2">
                   <Mail size={16} /> Send via Email
                 </DropdownMenuItem>
                 <DropdownMenuItem onClick={handleShareLink} className="flex items-center gap-2">
                   <FileSymlink size={16} /> Copy Share Link
                 </DropdownMenuItem>
               </DropdownMenuGroup>
               <DropdownMenuSeparator />
               <DropdownMenuGroup>
                 <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center justify-between">
                   Integrations
                   <span className="text-xs font-normal bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                     Planned
                   </span>
                 </DropdownMenuLabel>
                 <DropdownMenuItem disabled className="flex items-center gap-2">
                   <FileText size={16} /> Google Docs
                 </DropdownMenuItem>
                 <DropdownMenuItem disabled className="flex items-center gap-2">
                   <NotebookPen size={16} /> Notion
                 </DropdownMenuItem>
                 <DropdownMenuItem disabled className="flex items-center gap-2">
                   <MessageSquare size={16} /> Slack
                 </DropdownMenuItem>
                 <DropdownMenuItem disabled className="flex items-center gap-2">
                   <CalendarDays size={16} /> Calendar
                 </DropdownMenuItem>
               </DropdownMenuGroup>
             </DropdownMenuContent>
          </DropdownMenu>

          {/* Print Button */}
           <Tooltip>
             <TooltipTrigger asChild>
               <Button variant="outline" size="icon" onClick={handlePrint} className="h-8 w-8">
                 <Printer size={16} />
               </Button>
             </TooltipTrigger>
             <TooltipContent>Print</TooltipContent>
           </Tooltip>

          {/* AI Check Dropdown */}
          <DropdownMenu>
             <Tooltip>
               <TooltipTrigger asChild>
                 <DropdownMenuTrigger asChild>
                   <Button variant="outline" size="sm" className="h-8">
                     <Brain size={14} className="mr-1"/> AI Check <ChevronDown size={14} className="ml-1"/>
                   </Button>
                 </DropdownMenuTrigger>
               </TooltipTrigger>
               <TooltipContent>Analyze contract with AI</TooltipContent>
             </Tooltip>
             <DropdownMenuContent align="end" className="w-56">
               <DropdownMenuLabel>AI Contract Analysis</DropdownMenuLabel>
               <DropdownMenuSeparator />
               <DropdownMenuItem onClick={() => handleAIAnalysis('risk')}><FileSearch size={16} className="mr-2"/> Risk Analysis</DropdownMenuItem>
               <DropdownMenuItem onClick={() => handleAIAnalysis('grammar')}><CheckCircle size={16} className="mr-2"/> Grammar & Clarity</DropdownMenuItem>
               <DropdownMenuItem onClick={() => handleAIAnalysis('compliance')}><Scale size={16} className="mr-2"/> Compliance Check</DropdownMenuItem>
               <DropdownMenuItem onClick={() => handleAIAnalysis('terms')}><GanttChart size={16} className="mr-2"/> Key Term Extraction</DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuItem onClick={() => handleAIAnalysis('full')}><Brain size={16} className="mr-2"/> Full Review</DropdownMenuItem>
             </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Save Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="default" // Default action is save
                className="h-8 pl-2 pr-1"
                disabled={isSaving}
                onClick={handleSave} // Direct click saves
              >
                {isSaving ? (
                  <div className="animate-spin mr-1 h-3 w-3 border-2 border-current border-t-transparent rounded-full"></div>
                ) : (
                  <SaveIcon size={16} className="mr-1" />
                )}
                <span>{isSaving ? 'Saving...' : 'Save'}</span>
                {/* Split button part */}
                <DropdownMenuSeparator className="bg-primary-foreground/20 h-4 mx-1 w-px" />
                <ChevronDown size={16} className="-ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
               <DropdownMenuItem onClick={handleSave} className="flex items-center gap-2">
                 <Folder size={16} /> Save Draft
               </DropdownMenuItem>
               <DropdownMenuItem onClick={handleSaveAsTemplate} className="flex items-center gap-2">
                 <FileIcon size={16} /> Save as Template
               </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Send for Signing Button */}
          <Button
            onClick={handleSendForSigning}
            size="sm"
            variant="outline"
            className="h-8"
          >
            <Send size={14} className="mr-1" />
            <span>Send for Signing</span>
          </Button>
          
          {/* Summary Button */}
          <Button
            onClick={onSummarize}
            size="sm"
            variant="outline"
            className="h-8"
          >
            <ListChecks size={14} className="mr-1" />
            <span>Summary</span>
          </Button>
        </TooltipProvider>
      </div>
    </div>
  );
};
