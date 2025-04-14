import React from "react";
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
  Table
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

interface FormattingToolbarProps {
  editor?: Editor | null;
  showFormatting: boolean;
  onFormat?: (command: string) => void;
  selection?: { start: number; end: number; text: string } | null;
  onVersionsClick?: () => void;
}

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
  editor,
  showFormatting,
  onFormat,
  selection,
  onVersionsClick
}) => {
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

              {onVersionsClick && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 ml-2"
                      onClick={onVersionsClick}
                    >
                      <History size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Version History</TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
