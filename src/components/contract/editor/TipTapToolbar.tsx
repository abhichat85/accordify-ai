import React, { useState, useRef } from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Table,
  Heading1,
  Heading2,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  const setParagraph = () => {
    editor.chain().focus().setParagraph().run();
  };

  const setHeading = (level: number) => {
    editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

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
          <title>${currentTitle}</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 1.5rem;
              margin-bottom: 1rem;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 1rem;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <h1>${currentTitle}</h1>
          ${content}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.onafterprint = () => {
      printWindow.close();
    };
    
    printWindow.print();
  };

  const handleAIAnalysis = (analysisType: string) => {
    if (!content) {
      toast({
        title: "Empty Document",
        description: "There is no content to analyze.",
        variant: "destructive"
      });
      return;
    }
    
    let prompt = '';
    let title = '';
    
    switch(analysisType) {
      case 'risk':
        title = 'Risk Analysis';
        prompt = `Analyze the following contract for potential risks and liabilities:\n\n${content}\n\nPlease identify any clauses that may pose risks to either party, ambiguous language, or potential legal issues.`;
        break;
      case 'grammar':
        title = 'Grammar & Clarity Check';
        prompt = `Review the following contract for grammar, clarity, and readability issues:\n\n${content}\n\nPlease identify any grammatical errors, unclear language, or readability issues.`;
        break;
      case 'compliance':
        title = 'Compliance Check';
        prompt = `Review the following contract for compliance with standard legal requirements:\n\n${content}\n\nPlease identify any potential compliance issues or missing standard clauses.`;
        break;
      case 'terms':
        title = 'Key Term Extraction';
        prompt = `Extract and summarize the key terms from the following contract:\n\n${content}\n\nPlease list the most important terms, obligations, and rights defined in this contract.`;
        break;
      case 'full':
        title = 'Full Contract Review';
        prompt = `Perform a comprehensive review of the following contract:\n\n${content}\n\nPlease analyze for risks, grammar issues, compliance problems, and extract key terms. Provide a summary of findings and recommendations.`;
        break;
    }
    
    if (setChatPrompt && prompt) {
      const success = setChatPrompt(prompt);
      if (success) {
        toast({
          title: `${title} Started`,
          description: "The AI is now analyzing your contract. Results will appear in the chat.",
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: "Could not start the analysis. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleSendForSigning = () => {
    setIsSignatureModalOpen(true);
  };

  const handleSignatureComplete = (success: boolean) => {
    setIsSignatureModalOpen(false);
    
    if (success) {
      if (onStatusChange) {
        onStatusChange('sent_for_signing');
      }
      
      toast({
        title: "Signature Request Sent",
        description: "The document has been sent for electronic signature.",
      });
    } else {
      toast({
        title: "Signature Request Cancelled",
        description: "The signature request has been cancelled.",
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
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleString();
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

            <div className="flex items-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    data-active={editor.isActive('bold')}
                  >
                    <Bold size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bold</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    data-active={editor.isActive('italic')}
                  >
                    <Italic size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Italic</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    data-active={editor.isActive('underline')}
                  >
                    <Underline size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Underline</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    data-active={editor.isActive('strike')}
                  >
                    <Strikethrough size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Strikethrough</TooltipContent>
              </Tooltip>
            </div>

            <div className="h-4 w-px bg-border"></div>

            <div className="flex items-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    data-active={editor.isActive('bulletList')}
                  >
                    <List size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bullet List</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    data-active={editor.isActive('orderedList')}
                  >
                    <ListOrdered size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Numbered List</TooltipContent>
              </Tooltip>

              <Select
                value={
                  editor.isActive('heading', { level: 1 })
                    ? 'h1'
                    : editor.isActive('heading', { level: 2 })
                    ? 'h2'
                    : editor.isActive('heading', { level: 3 })
                    ? 'h3'
                    : 'p'
                }
                onValueChange={(value) => {
                  if (value === 'p') {
                    setParagraph();
                  } else if (value === 'h1') {
                    setHeading(1);
                  } else if (value === 'h2') {
                    setHeading(2);
                  } else if (value === 'h3') {
                    setHeading(3);
                  }
                }}
              >
                <SelectTrigger className="h-8 w-[130px]">
                  <SelectValue placeholder="Paragraph" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="p">Paragraph</SelectItem>
                  <SelectItem value="h1">Heading 1</SelectItem>
                  <SelectItem value="h2">Heading 2</SelectItem>
                  <SelectItem value="h3">Heading 3</SelectItem>
                </SelectContent>
              </Select>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={addTable}
                  >
                    <Table size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Insert Table</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="flex items-center space-x-2">
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
