
import React, { useRef } from "react";
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
  Brain,
  FileCheck,
  Send
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
import { setChatInputValue } from "@/utils/chatInputUtils";

interface EditorToolbarProps {
  title: string;
  currentTitle: string;
  setCurrentTitle: (title: string) => void;
  handleSave: () => void;
  isSaving: boolean;
  lastSaved: Date | null;
  content?: string;
  status?: 'draft' | 'submitted' | 'sent_for_signing';
  onStatusChange?: (status: 'draft' | 'submitted' | 'sent_for_signing') => void;
  setChatPrompt?: (prompt: string) => boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  currentTitle,
  setCurrentTitle,
  handleSave,
  isSaving,
  lastSaved,
  content = "",
  status = 'draft',
  onStatusChange,
  setChatPrompt
}) => {
  const { toast } = useToast();
  const linkRef = useRef<HTMLAnchorElement>(null);

  // Print functionality
  const handlePrint = () => {
    toast({
      title: "Preparing document for printing",
      description: "Opening print dialog...",
    });
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Print failed",
        description: "Unable to open print window. Check your popup blocker settings.",
        variant: "destructive"
      });
      return;
    }
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${currentTitle}</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              max-width: 8.5in;
              margin: 0.5in auto;
              line-height: 1.5;
              color: #333;
            }
            h1 { font-size: 24px; margin-top: 24px; margin-bottom: 16px; }
            h2 { font-size: 20px; margin-top: 20px; margin-bottom: 12px; }
            p { margin-bottom: 12px; }
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
    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }, 300);
  };

  // Format content for print by replacing markdown with HTML
  const formatContentForPrint = (text: string) => {
    let formattedText = text;
    
    formattedText = formattedText
      .split('\n\n')
      .map(paragraph => {
        if (!paragraph.trim()) return '';

        if (paragraph.startsWith('# ')) {
          return `<h1>${paragraph.substring(2)}</h1>`;
        } else if (paragraph.startsWith('## ')) {
          return `<h2>${paragraph.substring(3)}</h2>`;
        }
        
        let formatted = paragraph
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>')
          .replace(/\+\+(.+?)\+\+/g, '<u>$1</u>')
          .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
          
        return `<p>${formatted}</p>`;
      })
      .join('\n');
      
    return formattedText;
  };

  // Export functionality
  const handleExport = (format: string) => {
    let exportContent = content;
    let mimeType = 'text/plain';
    let extension = 'txt';
    
    switch (format) {
      case 'PDF':
        toast({
          title: "PDF Export",
          description: "PDF export requires browser print to PDF feature. Opening print dialog...",
        });
        handlePrint();
        return;
      
      case 'DOCX':
        toast({
          title: "Export Not Available",
          description: "Direct DOCX export is not available in the browser. Use TXT or PDF format instead.",
        });
        return;
        
      case 'TXT':
        mimeType = 'text/plain';
        extension = 'txt';
        break;
        
      case 'MD':
        mimeType = 'text/markdown';
        extension = 'md';
        break;
        
      case 'HTML':
        exportContent = `<!DOCTYPE html>
<html>
<head>
  <title>${currentTitle}</title>
  <meta charset="utf-8" />
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { font-size: 24px; }
    h2 { font-size: 20px; }
  </style>
</head>
<body>
  <h1>${currentTitle}</h1>
  ${formatContentForPrint(content)}
</body>
</html>`;
        mimeType = 'text/html';
        extension = 'html';
        break;
    }
    
    const blob = new Blob([exportContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    if (linkRef.current) {
      linkRef.current.href = url;
      linkRef.current.download = `${currentTitle.replace(/\s+/g, '_')}.${extension}`;
      linkRef.current.click();
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      toast({
        title: `${format} Export`,
        description: `Your document has been exported as ${format}.`,
      });
    }
  };

  // Handle sharing functionality
  const handleIntegration = (service: string) => {
    switch (service) {
      case 'Email':
        const subject = encodeURIComponent(currentTitle);
        const body = encodeURIComponent(`${currentTitle}\n\n${content}`);
        window.open(`mailto:?subject=${subject}&body=${body}`);
        
        toast({
          title: "Email Sharing",
          description: "Opening your default email client...",
        });
        break;
        
      case 'Link':
        navigator.clipboard.writeText(`https://example.com/shared-contract/${currentTitle.replace(/\s+/g, '-').toLowerCase()}`)
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
        break;
        
      default:
        toast({
          title: `${service} Integration`,
          description: `Preparing to connect with ${service}. This feature would require authentication and API integration.`,
        });
    }
  };

  // Find the chat input field
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
    
    // If still not found, try all textareas
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
    
    return chatInput;
  };

  // Set the AI chat prompt and focus the input
  const setChatPromptInner = (prompt: string) => {
    // Get the chat input
    const chatInput = findChatInput();
    
    if (!chatInput) {
      toast({
        title: "Chat not available",
        description: "Please make sure the chat panel is visible.",
        variant: "destructive"
      });
      return false;
    }
    
    console.log("Found chat input:", chatInput);
    
    // Set the prompt in the chat input
    chatInput.value = prompt;
    
    // Using multiple approaches to ensure the value gets set
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
    
    // Focus the input
    chatInput.focus();
    
    toast({
      title: "Prompt ready",
      description: "Press Enter to send the prompt to the AI assistant.",
    });
    
    // Log for debugging
    console.log("Prompt set in chat input:", prompt);
    
    return true;
  };

  const handleSubmitContract = () => {
    if (onStatusChange) {
      onStatusChange('submitted');
      
      // Set prompt for submitted contract
      const prompt = `I've just submitted my contract "${currentTitle}" for internal review. Could you please help me check for any potential issues or suggest improvements before it goes to the next stage? Focus on legal clarity, completeness, and any potential risks.`;
      
      const success = setChatInputValue(prompt);
      
      if (success) {
        toast({
          title: "Contract submitted",
          description: "Your contract has been submitted for internal review. AI prompt is ready in the chat.",
        });
      } else {
        toast({
          title: "Contract submitted",
          description: "Your contract has been submitted for internal review.",
        });
      }
    }
  };
  
  const handleSendForSigning = () => {
    if (onStatusChange) {
      onStatusChange('sent_for_signing');
      
      // Set prompt for sending for signing
      const prompt = `I'm about to send my contract "${currentTitle}" for electronic signatures. Before I do, could you please verify that all signature blocks, dates, and party information are correctly formatted? Also, is there anything I should communicate to the signatories?`;
      
      const success = setChatInputValue(prompt);
      
      if (success) {
        toast({
          title: "Contract sent for signing",
          description: "Your contract has been sent for signatures. AI prompt is ready in the chat.",
        });
      } else {
        toast({
          title: "Contract sent for signing",
          description: "Your contract has been sent for electronic signatures.",
        });
      }
    }
  };

  const handleAIAnalysis = (analysisType: string) => {
    // Create appropriate prompt based on analysis type
    let prompt = "";
    switch (analysisType) {
      case "risk":
        prompt = `Please perform a risk analysis on my contract "${currentTitle}". Identify any clauses with high, medium, or low risk levels, explain why they might be problematic, and provide specific recommendations for mitigating these risks.`;
        break;
      case "grammar":
        prompt = `Please review my contract "${currentTitle}" for grammar, clarity, and readability issues. Identify any confusing language, run-on sentences, or ambiguous terms that should be clarified to improve the overall quality of the document.`;
        break;
      case "compliance":
        prompt = `Please analyze my contract "${currentTitle}" for legal compliance. Check if it adheres to standard legal requirements and identify any missing clauses or provisions that might be required by relevant laws and regulations.`;
        break;
      case "terms":
        prompt = `Please extract and summarize the key terms from my contract "${currentTitle}". Identify important dates, monetary values, obligations, termination conditions, and any other critical elements that define the agreement.`;
        break;
      case "full":
        prompt = `Please perform a comprehensive review of my contract "${currentTitle}". Analyze it for risks, clarity issues, legal compliance, extract key terms, and provide overall recommendations to improve the agreement.`;
        break;
      default:
        prompt = `Please analyze my contract "${currentTitle}" and provide general feedback on its quality and effectiveness.`;
    }
    
    // Set the prompt in the chat input
    const success = setChatInputValue(prompt);
    
    console.log(`Setting AI Analysis prompt for ${analysisType}:`, prompt);
    console.log("Setting chat prompt success:", success);
    
    toast({
      title: `${analysisType === "full" ? "Full Contract Review" : analysisType.charAt(0).toUpperCase() + analysisType.slice(1) + " Analysis"} prompt ready`,
      description: "Press Enter to send the prompt to the AI assistant.",
    });
  };

  return (
    <div className="px-6 py-3 border-b border-border/40 bg-background/80 backdrop-blur-sm space-y-0">
      <a ref={linkRef} style={{ display: 'none' }} />
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
            <span className={`px-2 py-0.5 rounded-full font-medium ${
              status === 'draft' ? 'bg-muted text-muted-foreground' :
              status === 'submitted' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {status === 'draft' ? 'Draft' : 
               status === 'submitted' ? 'Submitted' : 
               'Sent for Signing'}
            </span>
            <span className="text-muted-foreground">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-full shadow-sm"
                  onClick={() => handlePrint()}
                >
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
              <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleAIAnalysis("risk")}>
                <FileSearch size={16} /> Risk Analysis
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleAIAnalysis("grammar")}>
                <CheckCircle size={16} /> Grammar & Clarity Check
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleAIAnalysis("compliance")}>
                <Scale size={16} /> Legal Compliance
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleAIAnalysis("terms")}>
                <GanttChart size={16} /> Term Extraction
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleAIAnalysis("full")}>
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
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              variant={status === 'draft' ? "default" : "outline"}
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
                  <span>Save Draft</span>
                </>
              )}
            </Button>
            
            <Button
              onClick={handleSubmitContract}
              size="sm"
              variant="outline"
              className="h-8 rounded-lg shadow-sm"
            >
              <FileCheck size={16} className="mr-1" />
              <span>Submit</span>
            </Button>
            
            <Button
              onClick={handleSendForSigning}
              size="sm"
              variant="outline"
              className="h-8 rounded-lg shadow-sm"
            >
              <Send size={16} className="mr-1" />
              <span>Send for Signing</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
