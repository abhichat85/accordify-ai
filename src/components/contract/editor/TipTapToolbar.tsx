import React, { useState, useRef } from 'react';
import { Editor } from '@tiptap/react';
import {
  Clock,
  History,
  Download,
  Share2,
  Printer,
  Brain,
  Save,
  Send,
  FileText,
  FileSearch,
  CheckCircle,
  Scale,
  GanttChart,
  ChevronDown,
  Mail,
  FileSymlink,
  Folder,
  FileIcon,
  FileImage,
  FileJson,
  Eye,
  Code,
  Edit,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { setChatInputValue } from "@/utils/chatInputUtils";
import { SignatureRequestModal } from "@/components/signature/SignatureRequestModal";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface TipTapToolbarProps {
  editor: Editor | null;
  currentTitle?: string;
  setCurrentTitle?: (title: string) => void;
  handleSave?: () => void;
  isSaving?: boolean;
  lastSaved?: Date | null;
  content?: string;
  status?: 'draft' | 'submitted' | 'sent_for_signing';
  onStatusChange?: (status: 'draft' | 'submitted' | 'sent_for_signing') => void;
  setChatPrompt?: (prompt: string) => boolean;
  onVersionsClick?: () => void;
  onSummarize?: () => void;
  viewMode?: 'edit' | 'preview';
  setViewMode?: (mode: 'edit' | 'preview') => void;
  editorMode?: 'rich' | 'code';
  setEditorMode?: (mode: 'rich' | 'code') => void;
  showFormatting?: boolean;
  setShowFormatting?: (show: boolean) => void;
}

export function TipTapToolbar({ 
  editor, 
  currentTitle = "Untitled Document",
  setCurrentTitle,
  handleSave,
  isSaving = false,
  lastSaved = null,
  content = '',
  status = 'draft',
  onStatusChange,
  setChatPrompt,
  onVersionsClick,
  onSummarize,
  viewMode = 'edit',
  setViewMode = () => {},
  editorMode = 'rich',
  setEditorMode = () => {},
  showFormatting = true,
  setShowFormatting = () => {}
}: TipTapToolbarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const { toast } = useToast();

  if (!editor) {
    return null;
  }

  const handleTitleClick = () => {
    if (setCurrentTitle) {
      setIsEditing(true);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setCurrentTitle) {
      setCurrentTitle(e.target.value);
    }
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  const handleShareLink = () => {
    if (!currentTitle) return;
    
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
    if (!currentTitle || !content) return;
    
    const subject = encodeURIComponent(currentTitle);
    const body = encodeURIComponent(`${currentTitle}\n\n${content}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
    toast({
      title: "Email Sharing",
      description: "Opening your default email client...",
    });
  };

  const handleExport = (format: 'docx' | 'json' | 'image') => {
    if (!currentTitle || !content) return;
    
    let fileContent = '';
    let mimeType = '';
    let fileExtension = '';
    
    switch(format) {
      case 'docx':
        fileContent = content;
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        fileExtension = 'docx';
        break;
      case 'json':
        fileContent = JSON.stringify({
          title: currentTitle,
          content: content,
          lastModified: new Date().toISOString()
        }, null, 2);
        mimeType = 'application/json';
        fileExtension = 'json';
        break;
      case 'image':
        toast({
          title: "Export as Image",
          description: "This feature would capture the document as an image in a real application.",
        });
        return;
    }
    
    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTitle.replace(/\s+/g, '-').toLowerCase()}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: `Export as ${format.toUpperCase()}`,
      description: `Document has been exported as ${format.toUpperCase()} file.`,
    });
  };

  const handlePrint = () => {
    if (!content) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Print Failed",
        description: "Could not open print window. Please check your popup blocker settings.",
        variant: "destructive"
      });
      return;
    }
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${currentTitle} - Print Version</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 30px;
              color: #333;
            }
            h1 {
              color: #1a1a1a;
              font-size: 24px;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 1px solid #eaeaea;
            }
            h2 {
              color: #333;
              font-size: 20px;
              margin-top: 20px;
              margin-bottom: 10px;
            }
            h3 {
              color: #444;
              font-size: 18px;
              margin-top: 18px;
              margin-bottom: 8px;
            }
            p {
              margin-bottom: 10px;
              line-height: 1.5;
            }
            ul, ol {
              margin-bottom: 10px;
              padding-left: 30px;
            }
            li {
              margin-bottom: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .footnote {
              font-size: 12px;
              color: #666;
              margin-top: 40px;
              padding-top: 10px;
              border-top: 1px solid #eaeaea;
            }
            @media print {
              body {
                margin: 1cm;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <h1>${currentTitle}</h1>
          <div>${content.replace(/\n/g, '<br/>')}</div>
          <div class="footnote">
            Printed on ${new Date().toLocaleDateString()} via Accordify AI
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    printWindow.onafterprint = function() {
      printWindow.close();
    };
  };

  const handleAIAnalysis = (analysisType: string) => {
    if (!setChatPrompt || !currentTitle || !content) return;
    
    let prompt = '';
    
    switch(analysisType) {
      case 'risk':
        prompt = `Analyze this ${currentTitle} contract for legal risks and potential issues:\n\n${content}\n\nPlease identify any risks, ambiguous language, or potential legal issues in this contract. Focus on clauses that might be problematic.`;
        break;
      case 'grammar':
        prompt = `Review this ${currentTitle} contract for grammar, clarity, and readability issues:\n\n${content}\n\nPlease identify any grammar problems, unclear language, or readability issues. Suggest improvements for clarity.`;
        break;
      case 'compliance':
        prompt = `Check this ${currentTitle} contract for compliance with standard legal requirements:\n\n${content}\n\nPlease verify if this contract includes all standard legal elements and complies with typical legal requirements. Identify any missing components.`;
        break;
      case 'terms':
        prompt = `Extract and define key terms from this ${currentTitle} contract:\n\n${content}\n\nPlease identify and explain the key terms, defined terms, and important provisions in this contract.`;
        break;
      case 'full':
        prompt = `Perform a comprehensive legal review of this ${currentTitle} contract:\n\n${content}\n\nPlease provide a complete analysis of this contract, including:
1. Identification of potential legal risks and issues
2. Grammar and clarity assessment
3. Compliance with standard legal requirements
4. Extraction and explanation of key terms
5. Overall evaluation and suggestions for improvement`;
        break;
      default:
        prompt = `Analyze this ${currentTitle} contract:\n\n${content}`;
    }
    
    const success = setChatPrompt(prompt);
    
    if (success) {
      toast({
        title: `AI ${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} Analysis`,
        description: "Your request has been sent to AI assistant.",
      });
    } else {
      toast({
        title: "Analysis Failed",
        description: "Could not send your request to AI assistant.",
        variant: "destructive"
      });
    }
  };

  const handleSendForSigning = () => {
    setIsSignatureModalOpen(true);
  };

  const handleSignatureComplete = (success: boolean) => {
    setIsSignatureModalOpen(false);
    
    if (success) {
      toast({
        title: "Signature Request Sent",
        description: "Your document has been sent for signing.",
      });
      
      // Update document status
      if (onStatusChange) {
        onStatusChange('sent_for_signing');
      }
    } else {
      toast({
        title: "Signature Request Cancelled",
        description: "Your signature request was cancelled.",
        variant: "destructive"
      });
    }
  };

  const handleSaveAsTemplate = () => {
    toast({
      title: "Saved as Template",
      description: "This document has been saved as a template for future use.",
    });
  };

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else {
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const handleVersionHistory = () => {
    if (onVersionsClick) {
      onVersionsClick();
    }
  };

  return (
    <div className="tiptap-toolbar">
      <TooltipProvider>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center ml-2">
              {isEditing ? (
                <Input
                  value={currentTitle}
                  onChange={handleTitleChange}
                  onBlur={handleTitleBlur}
                  onKeyDown={handleTitleKeyDown}
                  className="h-8 min-w-[200px]"
                  autoFocus
                />
              ) : (
                <div
                  onClick={handleTitleClick}
                  className="font-medium cursor-pointer hover:text-primary"
                >
                  {currentTitle}
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-border"></div>

            <div className="flex items-center mr-2">
              <Tabs 
                value={viewMode} 
                onValueChange={(value) => setViewMode(value as 'edit' | 'preview')}
                className="h-8"
              >
                <TabsList className="h-8">
                  <TabsTrigger value="edit" className="h-7 px-3">
                    <Edit size={14} className="mr-1" />
                    Edit
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="h-7 px-3">
                    <Eye size={14} className="mr-1" />
                    Preview
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center mr-2">
              <Tabs 
                value={editorMode} 
                onValueChange={(value) => setEditorMode(value as 'rich' | 'code')}
                className="h-8"
              >
                <TabsList className="h-8">
                  <TabsTrigger value="rich" className="h-7 px-3">
                    Rich
                  </TabsTrigger>
                  <TabsTrigger value="code" className="h-7 px-3">
                    <Code size={14} className="mr-1" />
                    Code
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center mr-2">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="show-formatting" 
                  checked={showFormatting}
                  onCheckedChange={setShowFormatting}
                />
                <Label htmlFor="show-formatting" className="text-xs">Show Formatting</Label>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleVersionHistory}
                  size="sm"
                  variant="outline"
                  className="h-8"
                >
                  <History size={14} className="mr-1" />
                  <span>History</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>View document history</TooltipContent>
            </Tooltip>

            {lastSaved && (
              <div className="text-xs text-muted-foreground flex items-center">
                <Clock size={12} className="mr-1" />
                {formatLastSaved(lastSaved)}
              </div>
            )}

            <div className="h-4 w-px bg-border"></div>

            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <Share2 size={14} className="mr-1"/> Share <ChevronDown size={14} className="ml-1"/>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Share document</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Share Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleShareLink}>
                  <FileSymlink size={16} className="mr-2"/> Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareEmail}>
                  <Mail size={16} className="mr-2"/> Email
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <Download size={14} className="mr-1"/> Export <ChevronDown size={14} className="ml-1"/>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Export document</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('docx')}>
                  <FileIcon size={16} className="mr-2"/> Word Document (.docx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('json')}>
                  <FileJson size={16} className="mr-2"/> JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('image')}>
                  <FileImage size={16} className="mr-2"/> Image
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handlePrint}
                  size="sm"
                  variant="outline"
                  className="h-8"
                >
                  <Printer size={14} className="mr-1"/>
                  <span>Print</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Print document</TooltipContent>
            </Tooltip>

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
                <DropdownMenuItem onClick={() => handleAIAnalysis('risk')}>
                  <FileSearch size={16} className="mr-2"/> Risk Analysis
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAIAnalysis('grammar')}>
                  <CheckCircle size={16} className="mr-2"/> Grammar & Clarity
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAIAnalysis('compliance')}>
                  <Scale size={16} className="mr-2"/> Compliance Check
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAIAnalysis('terms')}>
                  <GanttChart size={16} className="mr-2"/> Key Term Extraction
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleAIAnalysis('full')}>
                  <Brain size={16} className="mr-2"/> Full Review
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {onSummarize && (
              <Button
                onClick={onSummarize}
                size="sm"
                variant="outline"
                className="h-8"
              >
                <FileText size={14} className="mr-1" />
                <span>Summary</span>
              </Button>
            )}

            <div className="h-4 w-px bg-border"></div>

            {handleSave && (
              <Button
                onClick={handleSave}
                size="sm"
                variant="default"
                className="h-8 bg-purple-600 hover:bg-purple-700"
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="animate-spin mr-1 h-3 w-3 border-2 border-current border-t-transparent rounded-full"></div>
                ) : (
                  <Save size={16} className="mr-1" />
                )}
                <span>{isSaving ? 'Saving...' : 'Save'}</span>
              </Button>
            )}

            <Button
              onClick={handleSendForSigning}
              size="sm"
              variant="outline"
              className="h-8"
            >
              <Send size={14} className="mr-1" />
              <span>Send for Signing</span>
            </Button>
          </div>
        </div>
      </TooltipProvider>
      
      <SignatureRequestModal
        isOpen={isSignatureModalOpen}
        onClose={() => handleSignatureComplete(false)}
        documentTitle={currentTitle}
        documentContent={content}
      />
    </div>
  );
}
