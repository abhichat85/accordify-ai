
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
  content?: string;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  currentTitle,
  setCurrentTitle,
  handleSave,
  isSaving,
  lastSaved,
  content = ""
}) => {
  const { toast } = useToast();
  const linkRef = useRef<HTMLAnchorElement>(null);

  // Print functionality
  const handlePrint = () => {
    toast({
      title: "Preparing document for printing",
      description: "Opening print dialog...",
    });
    
    // Create a new window with formatted content
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Print failed",
        description: "Unable to open print window. Check your popup blocker settings.",
        variant: "destructive"
      });
      return;
    }
    
    // Add formatted content to the print window
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
    
    // Focus the window and trigger print
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
    
    // Format paragraphs
    formattedText = formattedText
      .split('\n\n')
      .map(paragraph => {
        if (!paragraph.trim()) return '';

        // Convert headings
        if (paragraph.startsWith('# ')) {
          return `<h1>${paragraph.substring(2)}</h1>`;
        } else if (paragraph.startsWith('## ')) {
          return `<h2>${paragraph.substring(3)}</h2>`;
        }
        
        // Convert inline formatting
        let formatted = paragraph
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bold
          .replace(/\*(.+?)\*/g, '<em>$1</em>')             // Italic
          .replace(/\+\+(.+?)\+\+/g, '<u>$1</u>')           // Underline
          .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>'); // Links
          
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
    
    // Convert content to appropriate format
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
        // Text remains as is
        mimeType = 'text/plain';
        extension = 'txt';
        break;
        
      case 'MD':
        // Markdown remains as is
        mimeType = 'text/markdown';
        extension = 'md';
        break;
        
      case 'HTML':
        // Convert to HTML
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
    
    // Create download link
    const blob = new Blob([exportContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    // Use the linkRef to create a temporary download link
    if (linkRef.current) {
      linkRef.current.href = url;
      linkRef.current.download = `${currentTitle.replace(/\s+/g, '_')}.${extension}`;
      linkRef.current.click();
      
      // Clean up
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
        // Create a mailto link with the document title and content
        const subject = encodeURIComponent(currentTitle);
        const body = encodeURIComponent(`${currentTitle}\n\n${content}`);
        window.open(`mailto:?subject=${subject}&body=${body}`);
        
        toast({
          title: "Email Sharing",
          description: "Opening your default email client...",
        });
        break;
        
      case 'Link':
        // In a real app, this would create a shareable link to the document
        // Simulate copy to clipboard
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
        // For other services, show integration toast
        toast({
          title: `${service} Integration`,
          description: `Preparing to connect with ${service}. This feature would require authentication and API integration.`,
        });
    }
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
            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">Template</span>
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
                  onClick={handlePrint}
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
