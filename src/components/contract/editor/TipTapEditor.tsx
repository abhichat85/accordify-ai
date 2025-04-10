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
import { PanelLeft, PanelLeftClose } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentStructurePanel } from './DocumentStructurePanel';
import { TipTapToolbar } from './TipTapToolbar';
import { VariableHighlighter } from './extensions/VariableHighlighter';
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
      // Convert HTML content to markdown when content changes
      const html = editor.getHTML();
      const markdown = convertHTMLToMarkdown(html);
      setContent(markdown);
    },
    onCreate: () => {
      setIsEditorReady(true);
    }
  });

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content !== convertHTMLToMarkdown(editor.getHTML())) {
      const newContent = convertMarkdownToHTML(content);
      editor.commands.setContent(newContent);
    }
  }, [content, editor]);

  // Register global focus method for external components to focus the editor
  useEffect(() => {
    // Define the focus function inside the effect to avoid dependency issues
    const focusContractEditor = () => {
      editor?.commands.focus('end');
    };

    // Add to window object for external access
    if (typeof window !== 'undefined') {
      window.focusContractEditor = focusContractEditor;
    }

    return () => {
      // Clean up when component unmounts
      if (typeof window !== 'undefined') {
        delete window.focusContractEditor;
      }
    };
  }, [editor]);

  // Commented out for now - will be implemented later
  // Toggle document structure panel
  // const togglePanel = () => {
  //   setShowPanel(!showPanel);
  // };

  // Handle clicking on a section in the document structure panel
  // const handleSectionClick = (headingId: string) => {
  //   if (!editor) return;
    
  //   // Find the heading element by ID
  //   const headingElement = document.getElementById(headingId);
  //   if (headingElement) {
  //     // Scroll to the heading
  //     headingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
  //     // Focus the editor
  //     setTimeout(() => {
  //       editor.commands.focus();
  //     }, 100);
  //   }
  // };

  return (
    <div className={`tiptap-editor-container ${className}`}>
      {/* Toolbar */}
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
        onSummarize={onSummarize}
      />
      
      {/* Editor Area */}
      <div className="tiptap-editor-area">
        {/* Document Structure Panel (when visible) - Commented out for now */}
        {/* {showPanel && (
          <div className="document-structure-panel">
            <div className="panel-header flex justify-between items-center p-2 border-b border-gray-200">
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
        
        {/* Editor Content */}
        <div className="tiptap-editor-content-area">
          <EditorContent editor={editor} className="tiptap-editor-content" />
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
