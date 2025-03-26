
import React, { useRef, useEffect } from "react";

interface EditorContentProps {
  viewMode: 'edit' | 'preview';
  content: string;
  setContent: (content: string) => void;
  onTextSelection?: (selection: { start: number; end: number; text: string }) => void;
  applyFormatting?: (formattingType: string, params?: any) => void;
}

export const EditorContent: React.FC<EditorContentProps> = ({ 
  viewMode, 
  content, 
  setContent,
  onTextSelection,
  applyFormatting
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle text selection in the editor
  const handleTextSelection = () => {
    if (!textareaRef.current || !onTextSelection) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = content.substring(start, end);
    
    onTextSelection({ start, end, selectedText });
  };

  // Focus method to be called from parent
  const focusEditor = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Expose the focus method to the parent component
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).focusContractEditor = focusEditor;
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).focusContractEditor;
      }
    };
  }, []);

  return (
    <div className="flex-grow h-full overflow-y-auto">
      {viewMode === 'edit' ? (
        <textarea
          ref={textareaRef}
          className="w-full h-full min-h-[calc(100vh-220px)] p-6 border-none text-sm leading-relaxed focus:outline-none focus:ring-0 bg-card font-mono resize-none styled-scrollbar"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onMouseUp={handleTextSelection}
          onKeyUp={handleTextSelection}
          placeholder="Enter contract text here..."
        />
      ) : (
        <div className="w-full h-full p-6 overflow-auto styled-scrollbar">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 border border-border/20">
            <div className="prose prose-sm max-w-none contract-preview">
              {content.split('\n\n').map((paragraph, index) => {
                // Parse markdown-like formatting in preview mode
                let formattedParagraph = paragraph;
                
                // Bold: **text** or __text__
                formattedParagraph = formattedParagraph.replace(
                  /(\*\*|__)(.*?)\1/g, 
                  '<strong>$2</strong>'
                );
                
                // Italic: *text* or _text_
                formattedParagraph = formattedParagraph.replace(
                  /(\*|_)(.*?)\1/g, 
                  '<em>$2</em>'
                );
                
                // Underline: ++text++
                formattedParagraph = formattedParagraph.replace(
                  /\+\+(.*?)\+\+/g, 
                  '<u>$1</u>'
                );
                
                // Headings: # Heading 1, ## Heading 2
                if (formattedParagraph.startsWith('# ')) {
                  formattedParagraph = `<h1>${formattedParagraph.substring(2)}</h1>`;
                } else if (formattedParagraph.startsWith('## ')) {
                  formattedParagraph = `<h2>${formattedParagraph.substring(3)}</h2>`;
                }
                
                return (
                  <div 
                    key={index} 
                    className="mb-4 whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: formattedParagraph }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
