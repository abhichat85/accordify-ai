
import React, { useState, useRef } from "react";
import { 
  Upload, 
  FileText, 
  Check, 
  AlertCircle, 
  Trash2, 
  FileUp, 
  File 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface DocumentUploaderProps {
  onDocumentContent: (content: string) => void;
  className?: string;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onDocumentContent,
  className
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    // Check file type
    const validTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Please upload a PDF, TXT, or DOC/DOCX file.");
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, TXT, or DOC/DOCX file.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB.");
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB.",
        variant: "destructive",
      });
      return;
    }

    setFile(file);
    setIsLoading(true);
    setError(null);
    
    try {
      // For text files, just read the content directly
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        
        reader.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setProgress(percentComplete);
          }
        };
        
        reader.onload = () => {
          const content = reader.result as string;
          setIsLoading(false);
          setProgress(100);
          onDocumentContent(content);
          
          toast({
            title: "File processed successfully",
            description: "Your document has been uploaded and processed.",
          });
        };
        
        reader.onerror = () => {
          setIsLoading(false);
          setError("Failed to read file content.");
          toast({
            title: "Processing failed",
            description: "Failed to read the document content.",
            variant: "destructive",
          });
        };
        
        reader.readAsText(file);
      } else {
        // For binary files like PDF/DOC, we'd typically use a service to extract text
        // For this example, we'll simulate text extraction (in a real app, you'd integrate with a PDF parsing service)
        
        // Simulating processing time
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setProgress(i);
        }
        
        // For demo purposes, just assume we could extract text
        const demoText = `MUTUAL NON-DISCLOSURE AGREEMENT
        
THIS MUTUAL NON-DISCLOSURE AGREEMENT (this "Agreement") is made and entered into as of [EFFECTIVE DATE] (the "Effective Date"), by and between [PARTY A], a [STATE] [ENTITY TYPE] with its principal place of business at [ADDRESS] ("Company"), and [PARTY B], a [STATE] [ENTITY TYPE] with its principal place of business at [ADDRESS] ("Recipient").

1. PURPOSE
Company and Recipient wish to explore a potential business relationship in connection with [DESCRIBE POTENTIAL RELATIONSHIP] (the "Purpose"). In connection with the Purpose, each party may disclose to the other certain confidential technical and business information that the disclosing party desires the receiving party to treat as confidential.

2. CONFIDENTIAL INFORMATION
"Confidential Information" means any information disclosed by either party to the other party, either directly or indirectly, in writing, orally or by inspection of tangible objects, which is designated as "Confidential," "Proprietary" or some similar designation, or information the confidential nature of which is reasonably apparent under the circumstances. Confidential Information shall include, without limitation, [SPECIFIC TYPES OF INFORMATION].

3. NON-USE AND NON-DISCLOSURE
Each party agrees not to use any Confidential Information of the other party for any purpose except to evaluate and engage in discussions concerning the Purpose. Each party agrees not to disclose any Confidential Information of the other party to third parties or to such party's employees, except to those employees who are required to have the information in order to evaluate or engage in discussions concerning the Purpose and who have signed confidentiality agreements with terms no less restrictive than those contained herein.

4. TERM
This Agreement shall remain in effect for a period of [TIME PERIOD] from the Effective Date, unless earlier terminated by either party with [NOTICE PERIOD] prior written notice. Each party's obligations under this Agreement shall survive termination of the Agreement and shall be binding upon such party's heirs, successors, and assigns.`;
        
        setIsLoading(false);
        onDocumentContent(demoText);
        
        toast({
          title: "File processed successfully",
          description: "Your document has been uploaded and processed.",
        });
      }
    } catch (error) {
      setIsLoading(false);
      setError("An error occurred while processing the file.");
      toast({
        title: "Processing failed",
        description: "An error occurred while processing your document.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      {!file ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4 transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-border",
            className
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="bg-muted/50 p-4 rounded-full">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-base">Upload your contract document</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Drag and drop your file here, or click to browse. We support PDF, TXT, and DOC files.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg"
          >
            <FileUp className="mr-2 h-4 w-4" />
            Browse files
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.txt,.doc,.docx"
          />
          <p className="text-xs text-muted-foreground">Maximum file size: 10MB</p>
        </div>
      ) : (
        <div className="border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemoveFile}
              disabled={isLoading}
              className="h-8 w-8 rounded-full"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
          
          {isLoading ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Processing...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm flex items-start">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          ) : (
            <div className="bg-success/10 text-success rounded-lg p-3 text-sm flex items-start">
              <Check className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <p>File processed successfully</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
