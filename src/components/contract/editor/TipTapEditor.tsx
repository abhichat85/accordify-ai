import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Heading from '@tiptap/extension-heading';
import Paragraph from '@tiptap/extension-paragraph';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import { PanelLeft, PanelLeftClose, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentStructurePanel } from './DocumentStructurePanel';
import { TipTapToolbar } from './TipTapToolbar';
import { FormattingToolbar } from './FormattingToolbar';
import { VariableHighlighter } from './extensions/VariableHighlighter';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useToast } from '@/components/ui/use-toast';
import './TipTapStyles.css';

// Extend the Window interface to include our custom property
declare global {
  interface Window {
    focusContractEditor?: () => void;
  }
}

interface TipTapEditorProps {
  content: string;
  setContent: (content: string) => void;
  readOnly?: boolean;
  className?: string;
  currentTitle?: string;
  setCurrentTitle?: (title: string) => void;
  handleSave?: () => void;
  isSaving?: boolean;
  lastSaved?: Date | null;
  status?: 'draft' | 'submitted' | 'sent_for_signing';
  onStatusChange?: (status: 'draft' | 'submitted' | 'sent_for_signing') => void;
  setChatPrompt?: (prompt: string) => boolean;
  onVersionsClick?: () => void;
  onSummarize?: () => void;
}

// Custom extension for legal document structure
const LegalDocument = Document.extend({
  content: 'heading block+',
});

// Helper to generate unique IDs for headings
function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s-]+/g, '-');
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  content,
  setContent,
  readOnly = false,
  className = '',
  currentTitle = "Untitled Document",
  setCurrentTitle,
  handleSave,
  isSaving = false,
  lastSaved = null,
  status = 'draft',
  onStatusChange,
  setChatPrompt,
  onVersionsClick,
  onSummarize
}) => {
  // Commented out for now - will be implemented later
  // const [showPanel, setShowPanel] = useState<boolean>(true);
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditorReady, setIsEditorReady] = useState<boolean>(false);
  const [showFormatting, setShowFormatting] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [editorMode, setEditorMode] = useState<'rich' | 'code'>('rich');
  const [selectedText, setSelectedText] = useState<string>('');
  const { toast } = useToast();
  
  // Convert markdown content to HTML for initial editor content
  const initialContent = convertMarkdownToHTML(content);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        document: false, // Use our custom document extension
      }),
      LegalDocument,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
        HTMLAttributes: {
          class: 'tiptap-heading',
          // Add custom ID to headings for navigation
          // This is important for document structure navigation
          renderHTML: ({ node }) => {
            return [
              `h${node.attrs.level}`, 
              { 
                id: `heading-${generateHeadingId(node.textContent)}`,
                class: `level-${node.attrs.level}`,
                'data-level': node.attrs.level
              },
              0
            ];
          }
        }
      }),
      Paragraph,
      Text,
      Bold,
      Italic,
      Underline,
      Strike,
      BulletList,
      OrderedList,
      ListItem,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      VariableHighlighter,
    ],
    content: initialContent,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = convertHTMLToMarkdown(html);
      setContent(markdown);
    },
    onCreate: () => {
      setIsEditorReady(true);
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        setSelectedText(editor.state.doc.textBetween(from, to, ' '));
      } else {
        setSelectedText('');
      }
    }
  });

  // Make the editor focusable from external components
  useEffect(() => {
    if (editor && typeof window !== 'undefined') {
      window.focusContractEditor = () => {
        editor.commands.focus('end');
      };
    }

    return () => {
      // Clean up when component unmounts
      if (typeof window !== 'undefined') {
        delete window.focusContractEditor;
      }
    };
  }, [editor]);

  // Add a selection change listener to track selected text
  useEffect(() => {
    if (!editor) return;

    // This is a more reliable way to track selection changes
    const updateSelection = () => {
      if (editor.isActive && editor.state) {
        const { from, to } = editor.state.selection;
        if (from !== to) {
          const text = editor.state.doc.textBetween(from, to, ' ');
          setSelectedText(text);
          console.log('Selected text:', text); // Debug log
        } else {
          setSelectedText('');
        }
      }
    };

    // Add DOM event listeners for selection changes
    const editorElement = document.querySelector('.tiptap-editor-content');
    if (editorElement) {
      editorElement.addEventListener('mouseup', updateSelection);
      editorElement.addEventListener('keyup', updateSelection);
      
      // Initial check for any existing selection
      setTimeout(updateSelection, 100);
    }

    // Also use the editor's built-in selection update handler
    editor.on('selectionUpdate', updateSelection);

    return () => {
      if (editorElement) {
        editorElement.removeEventListener('mouseup', updateSelection);
        editorElement.removeEventListener('keyup', updateSelection);
      }
      editor.off('selectionUpdate', updateSelection);
    };
  }, [editor]);

  // Handle sending selected text to the agent
  const handleSendToAgent = useCallback(() => {
    console.log('Sending text to agent:', selectedText); // Debug log
    
    if (!selectedText || !setChatPrompt) {
      console.log('Cannot send: selectedText or setChatPrompt is missing'); // Debug log
      return;
    }
    
    try {
      // Force selection to persist during context menu interaction
      const currentSelection = selectedText;
      
      const success = setChatPrompt(currentSelection);
      
      if (success) {
        toast({
          title: "Text Sent to Agent",
          description: "Selected text has been sent to the AI assistant.",
        });
      } else {
        toast({
          title: "Failed to Send",
          description: "Could not send text to AI assistant. Make sure the chat panel is open.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sending text to agent:', error);
      toast({
        title: "Error",
        description: "An error occurred while sending text to the agent.",
        variant: "destructive"
      });
    }
  }, [selectedText, setChatPrompt, toast]);

  // Get the current paragraph text
  const getCurrentParagraph = useCallback(() => {
    if (!editor) return '';
    
    try {
      const { from } = editor.state.selection;
      const resolvedPos = editor.state.doc.resolve(from);
      const paragraph = resolvedPos.parent;
      
      if (paragraph.type.name === 'paragraph') {
        console.log('Current paragraph:', paragraph.textContent); // Debug log
        return paragraph.textContent;
      }
      
      // If not in a paragraph, try to get the closest text block
      const node = editor.state.doc.nodeAt(from);
      if (node && node.isText) {
        const parentNode = resolvedPos.parent;
        return parentNode.textContent;
      }
    } catch (error) {
      console.error('Error getting paragraph:', error);
    }
    
    return '';
  }, [editor]);

  // Send the current paragraph to the agent
  const handleSendParagraphToAgent = useCallback(() => {
    const paragraphText = getCurrentParagraph();
    console.log('Sending paragraph to agent:', paragraphText); // Debug log
    
    if (!paragraphText || !setChatPrompt) {
      console.log('Cannot send paragraph: text or setChatPrompt is missing'); // Debug log
      return;
    }
    
    try {
      const success = setChatPrompt(paragraphText);
      
      if (success) {
        toast({
          title: "Paragraph Sent to Agent",
          description: "Current paragraph has been sent to the AI assistant.",
        });
      } else {
        toast({
          title: "Failed to Send",
          description: "Could not send paragraph to AI assistant. Make sure the chat panel is open.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sending paragraph to agent:', error);
      toast({
        title: "Error",
        description: "An error occurred while sending paragraph to the agent.",
        variant: "destructive"
      });
    }
  }, [getCurrentParagraph, setChatPrompt, toast]);

  return (
    <div className={`tiptap-editor-container ${className}`}>
      {/* Main Toolbar for document actions */}
      <TipTapToolbar 
        editor={editor} 
        currentTitle={currentTitle}
        setCurrentTitle={setCurrentTitle}
        handleSave={handleSave}
        isSaving={isSaving}
        lastSaved={lastSaved}
        content={content}
        status={status}
        onStatusChange={onStatusChange}
        setChatPrompt={setChatPrompt}
        onVersionsClick={onVersionsClick}
        onSummarize={onSummarize ? onSummarize : undefined}
        viewMode={viewMode}
        setViewMode={setViewMode}
        editorMode={editorMode}
        setEditorMode={setEditorMode}
        showFormatting={showFormatting}
        setShowFormatting={setShowFormatting}
      />
      
      {/* Formatting Toolbar */}
      <FormattingToolbar 
        editor={editor}
        showFormatting={showFormatting}
      />
      
      {/* Editor Area */}
      <div className="tiptap-editor-area">
        {/* Document Structure Panel - Commented out for now */}
        {/* {showPanel && (
          <div className="document-structure-panel">
            <div className="panel-header">
              <Button
                variant="ghost"
                size="sm"
                className="toggle-panel-button"
                onClick={togglePanel}
                title="Hide Panel"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">Document Structure</span>
            </div>
            <div className="panel-content overflow-y-auto p-2">
              <DocumentStructurePanel
                content={content}
                onSectionClick={handleSectionClick}
              />
            </div>
          </div>
        )} */}
        
        {/* Toggle Panel Button (when panel is hidden) - Commented out for now */}
        {/* {!showPanel && (
          <Button
            variant="ghost"
            size="sm"
            className="toggle-panel-button-hidden"
            onClick={togglePanel}
            title="Show Panel"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        )} */}
        
        {/* Editor Content with Context Menu */}
        <div 
          className="tiptap-editor-content-area" 
          data-selection-active={selectedText ? "true" : "false"}
          onMouseUp={() => {
            // Force selection check after mouse up
            if (editor) {
              const { from, to } = editor.state.selection;
              if (from !== to) {
                const text = editor.state.doc.textBetween(from, to, ' ');
                setSelectedText(text);
              }
            }
          }}
        >
          <ContextMenu>
            <ContextMenuTrigger>
              <EditorContent editor={editor} className="tiptap-editor-content" />
            </ContextMenuTrigger>
            <ContextMenuContent>
              {selectedText ? (
                <ContextMenuItem 
                  onClick={() => {
                    // Ensure we're using the most recent selection
                    if (editor) {
                      const { from, to } = editor.state.selection;
                      if (from !== to) {
                        const text = editor.state.doc.textBetween(from, to, ' ');
                        setSelectedText(text);
                      }
                    }
                    handleSendToAgent();
                  }}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Send Selection to Agent</span>
                </ContextMenuItem>
              ) : null}
              <ContextMenuItem onClick={handleSendParagraphToAgent}>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Send Paragraph to Agent</span>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </div>
    </div>
  );
};

// Enhanced markdown to HTML converter
function convertMarkdownToHTML(markdown: string): string {
  if (!markdown) return '';
  
  // Process the markdown in multiple passes for better reliability
  
  // First, handle headings
  let html = markdown
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
    .replace(/^###### (.+)$/gm, '<h6>$1</h6>');
  
  // Handle lists before paragraphs to avoid interference
  // Ordered lists
  const orderedListRegex = /^(\d+\. .+)(?:\n\d+\. .+)*$/gm;
  html = html.replace(orderedListRegex, (match) => {
    const items = match.split('\n');
    return '<ol>' + items.map(item => {
      const content = item.replace(/^\d+\. (.+)$/, '$1');
      return `<li>${content}</li>`;
    }).join('') + '</ol>';
  });
  
  // Bullet lists
  const bulletListRegex = /^(\* .+)(?:\n\* .+)*$/gm;
  html = html.replace(bulletListRegex, (match) => {
    const items = match.split('\n');
    return '<ul>' + items.map(item => {
      const content = item.replace(/^\* (.+)$/, '$1');
      return `<li>${content}</li>`;
    }).join('') + '</ul>';
  });
  
  // Handle paragraphs (lines that aren't headings or list items)
  const paragraphRegex = /^(?!<h[1-6]|<[ou]l)(.+)$/gm;
  html = html.replace(paragraphRegex, '<p>$1</p>');
  
  // Handle inline formatting
  html = html
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.+?)\*/g, '<em>$1</em>')            // Italic
    .replace(/~~(.+?)~~/g, '<s>$1</s>')              // Strikethrough
    .replace(/__(.+?)__/g, '<u>$1</u>');             // Underline
  
  return html;
}

// Enhanced HTML to markdown converter
function convertHTMLToMarkdown(html: string): string {
  if (!html) return '';
  
  // Process the HTML in multiple passes for better reliability
  
  // First, handle block elements
  let markdown = html
    .replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n')
    .replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n')
    .replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n')
    .replace(/<h4>(.*?)<\/h4>/g, '#### $1\n\n')
    .replace(/<h5>(.*?)<\/h5>/g, '##### $1\n\n')
    .replace(/<h6>(.*?)<\/h6>/g, '###### $1\n\n');
  
  // Handle paragraphs
  markdown = markdown.replace(/<p>(.*?)<\/p>/g, '$1\n\n');
  
  // Handle lists
  // First convert individual list items
  markdown = markdown
    .replace(/<li>(.*?)<\/li>/g, '* $1\n');
  
  // Then adjust ordered list items to use numbers
  const olRegex = /<ol>(.*?)<\/ol>/gs;
  markdown = markdown.replace(olRegex, (match, listContent) => {
    let counter = 1;
    return listContent.replace(/\* (.*?)\n/g, () => {
      return `${counter++}. $1\n`;
    }) + '\n';
  });
  
  // Handle inline formatting
  markdown = markdown
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    .replace(/<s>(.*?)<\/s>/g, '~~$1~~')
    .replace(/<u>(.*?)<\/u>/g, '__$1__');
  
  // Clean up extra newlines
  markdown = markdown.replace(/\n\n+/g, '\n\n');
  
  return markdown.trim();
}
