
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Heading1, 
  Heading2, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormattingToolbarProps {
  showFormatting: boolean;
}

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({ showFormatting }) => {
  const { toast } = useToast();

  const handleAutoFormat = () => {
    // Simulating auto-formatting
    toast({
      title: "Auto-formatting applied",
      description: "Your document has been formatted according to legal standards.",
    });
  };

  if (!showFormatting) return null;

  return (
    <div className="px-4 py-1 border-b border-border/40 bg-card/80 flex items-center space-x-1 overflow-x-auto styled-scrollbar">
      <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md">
        <Heading1 size={16} />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md">
        <Heading2 size={16} />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md">
        <Bold size={16} />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md">
        <Italic size={16} />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md">
        <Underline size={16} />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md">
        <List size={16} />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md">
        <ListOrdered size={16} />
      </Button>
      <div className="h-6 w-px bg-border/40 mx-1"></div>
      <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md text-xs">
        Clause
      </Button>
      <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md text-xs">
        Party
      </Button>
      <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md text-xs">
        Definition
      </Button>
      <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md text-xs">
        Date
      </Button>
      <div className="h-6 w-px bg-border/40 mx-1"></div>
      <Button variant="ghost" size="sm" className="h-8 px-2 rounded-md" onClick={handleAutoFormat}>
        Auto Format
      </Button>
    </div>
  );
};
