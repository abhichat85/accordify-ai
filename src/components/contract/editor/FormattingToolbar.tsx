
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Heading1, 
  Heading2, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormattingToolbarProps {
  showFormatting: boolean;
  onFormat?: (formatType: string, value?: any) => void;
  selection?: { start: number; end: number; text: string } | null;
}

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({ 
  showFormatting,
  onFormat,
  selection
}) => {
  const { toast } = useToast();
  const hasSelection = selection && selection.start !== selection.end;

  const handleFormat = (formatType: string, value?: any) => {
    if (onFormat) {
      onFormat(formatType, value);
    } else {
      // If no onFormat function is provided, show a toast
      toast({
        title: "Formatting applied",
        description: `Applied ${formatType} formatting to your text.`,
      });
    }
  };

  const handleAutoFormat = () => {
    handleFormat('auto-format');
    toast({
      title: "Auto-formatting applied",
      description: "Your document has been formatted according to legal standards.",
    });
  };

  /* Commented out legal elements for now as they are not fully functional
  const handleLegalElement = (elementType: string) => {
    handleFormat('legal-element', elementType);
    toast({
      title: `${elementType} added`,
      description: `A ${elementType.toLowerCase()} element has been added to your document.`,
    });
  };
  */

  if (!showFormatting) return null;

  // Disable formatting buttons if there's no selection and it's needed
  const formatRequiresSelection = (formatType: string) => {
    return ['bold', 'italic', 'underline'].includes(formatType) && !hasSelection;
  };

  return (
    <div className="px-4 py-1 border-b border-border/40 bg-card/80 flex items-center space-x-1 overflow-x-auto styled-scrollbar">
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 px-2 rounded-md" 
        onClick={() => handleFormat('heading1')}
      >
        <Heading1 size={16} />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 px-2 rounded-md"
        onClick={() => handleFormat('heading2')}
      >
        <Heading2 size={16} />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 px-2 rounded-md"
        disabled={formatRequiresSelection('bold')}
        onClick={() => handleFormat('bold')}
      >
        <Bold size={16} />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 px-2 rounded-md"
        disabled={formatRequiresSelection('italic')}
        onClick={() => handleFormat('italic')}
      >
        <Italic size={16} />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 px-2 rounded-md"
        disabled={formatRequiresSelection('underline')}
        onClick={() => handleFormat('underline')}
      >
        <Underline size={16} />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 px-2 rounded-md"
        onClick={() => handleFormat('unordered-list')}
      >
        <List size={16} />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 px-2 rounded-md"
        onClick={() => handleFormat('ordered-list')}
      >
        <ListOrdered size={16} />
      </Button>
      
      <div className="flex items-center space-x-1 ml-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 rounded-md"
          onClick={() => handleFormat('align', 'left')}
        >
          <AlignLeft size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 rounded-md"
          onClick={() => handleFormat('align', 'center')}
        >
          <AlignCenter size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 rounded-md"
          onClick={() => handleFormat('align', 'right')}
        >
          <AlignRight size={16} />
        </Button>
      </div>
      
      <div className="h-6 w-px bg-border/40 mx-1"></div>
      
      {/* Commented out legal elements for now as they are not fully functional 
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 px-2 rounded-md text-xs"
        onClick={() => handleLegalElement('Clause')}
      >
        Clause
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 px-2 rounded-md text-xs"
        onClick={() => handleLegalElement('Party')}
      >
        Party
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 px-2 rounded-md text-xs"
        onClick={() => handleLegalElement('Definition')}
      >
        Definition
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 px-2 rounded-md text-xs"
        onClick={() => handleLegalElement('Date')}
      >
        Date
      </Button>
      
      <div className="h-6 w-px bg-border/40 mx-1"></div>
      */}
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 px-2 rounded-md" 
        onClick={handleAutoFormat}
      >
        Auto Format
      </Button>
    </div>
  );
};
