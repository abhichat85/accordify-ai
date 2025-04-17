import React, { useState } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  Heading1, 
  Heading2,
  History,
  List,
  ListOrdered,
  Table,
  FileUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Editor } from '@tiptap/react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface FormattingToolbarProps {
  editor?: Editor | null;
  showFormatting: boolean;
  onFormat?: (command: string) => void;
  selection?: { start: number; end: number; text: string } | null;
  onVersionsClick?: () => void;
}

interface PdfTextItem {
  str?: string;
  dir?: string;
  transform?: number[];
  width?: number;
  height?: number;
  [key: string]: unknown;
}

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
  editor,
  showFormatting,
  onFormat,
  selection,
  onVersionsClick
}) => {
  const [isUploading, setIsUploading] = useState(false);

  if (!showFormatting) return null;

  const setParagraph = () => {
    if (editor) {
      editor.chain().focus().setParagraph().run();
    } else if (onFormat) {
      onFormat('paragraph');
    }
  };

  const setHeading = (level: number) => {
    if (editor) {
      editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
    } else if (onFormat) {
      onFormat(`heading-${level}`);
    }
  };

  const addTable = () => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    } else if (onFormat) {
      onFormat('table');
    }
  };

  return (
    <div className={cn(
      "border-b border-border/40 bg-muted/30 transition-all overflow-hidden formatting-toolbar",
      showFormatting ? "py-2 px-4 h-auto opacity-100" : "h-0 py-0 opacity-0"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <div className="flex items-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      if (editor) {
                        editor.chain().focus().toggleBold().run();
                      } else if (onFormat) {
                        onFormat('bold');
                      }
                    }}
                    data-active={editor?.isActive('bold')}
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
                    onClick={() => {
                      if (editor) {
                        editor.chain().focus().toggleItalic().run();
                      } else if (onFormat) {
                        onFormat('italic');
                      }
                    }}
                    data-active={editor?.isActive('italic')}
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
                    onClick={() => {
                      if (editor) {
                        editor.chain().focus().toggleUnderline().run();
                      } else if (onFormat) {
                        onFormat('underline');
                      }
                    }}
                    data-active={editor?.isActive('underline')}
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
                    onClick={() => {
                      if (editor) {
                        editor.chain().focus().toggleStrike().run();
                      } else if (onFormat) {
                        onFormat('strike');
                      }
                    }}
                    data-active={editor?.isActive('strike')}
                  >
                    <Strikethrough size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Strikethrough</TooltipContent>
              </Tooltip>
            </div>

            <div className="h-4 w-px bg-border mx-2"></div>

            <div className="flex items-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      if (editor) {
                        editor.chain().focus().toggleBulletList().run();
                      } else if (onFormat) {
                        onFormat('bulletList');
                      }
                    }}
                    data-active={editor?.isActive('bulletList')}
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
                    onClick={() => {
                      if (editor) {
                        editor.chain().focus().toggleOrderedList().run();
                      } else if (onFormat) {
                        onFormat('orderedList');
                      }
                    }}
                    data-active={editor?.isActive('orderedList')}
                  >
                    <ListOrdered size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Numbered List</TooltipContent>
              </Tooltip>

              <Select
                value={
                  editor?.isActive('heading', { level: 1 })
                    ? 'h1'
                    : editor?.isActive('heading', { level: 2 })
                    ? 'h2'
                    : editor?.isActive('heading', { level: 3 })
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

            <div className="h-4 w-px bg-border mx-2"></div>

            {onVersionsClick && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onVersionsClick}
                  >
                    <History size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Version History</TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
        
        {/* Upload Contract Button - Moved to right side */}
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => {
              document.getElementById('upload-contract-input')?.click();
            }}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-1"></span>
                <span>Parsing...</span>
              </>
            ) : (
              <>
                <FileUp size={16} />
                <span>Upload Contract</span>
              </>
            )}
          </Button>
          <input
            id="upload-contract-input"
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              
              setIsUploading(true);
              try {
                // Read the file data
                const fileData = await file.arrayBuffer();
                const typedArray = new Uint8Array(fileData);
                // Load the PDF document using the pre-configured worker
                const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
                
                // Extract text from all pages with more robust filtering
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                  const page = await pdf.getPage(i);
                  const textContent = await page.getTextContent();
                  
                  // Handle items in a type-safe way
                  const pageText = textContent.items
                    .filter((item: PdfTextItem) => typeof item.str === 'string')
                    .map((item: PdfTextItem) => item.str as string)
                    .join(' ');
                    
                  fullText += pageText + '\n\n';
                }
                
                // Set the extracted text in the editor
                if (editor) {
                  editor.commands.setContent(fullText);
                }
              } catch (err) {
                console.error('PDF processing error:', err); // Log the actual error
                alert('Failed to parse PDF. Please try a different file or copy/paste the text directly.');
                
                // Provide feedback in the editor
                if (editor) {
                  editor.commands.setContent('Unable to extract text from the uploaded PDF. Please copy and paste your contract content here.');
                }
              } finally {
                setIsUploading(false);
                e.target.value = ''; // Reset the file input
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
