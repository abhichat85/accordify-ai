import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, Trash2, Users, Mail, Send, 
  FileCheck, AlertCircle, Loader2, 
  ChevronLeft, ChevronRight, FileSignature,
  UserCheck, Info, Book, Maximize2
} from "lucide-react";
import { PDFViewer } from "./PDFViewer";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { nanoid } from "@/lib/utils";
import { Database } from "@/integrations/supabase/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSignature } from "@/hooks/useSignature";

type SignatureRequestStatus = Database["public"]["Enums"]["signature_request_status"];
type SignerStatus = Database["public"]["Enums"]["signer_status"];

interface Signer {
  id: string;
  name: string;
  email: string;
}

interface SignatureField {
  id: string;
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
  signerId: string;
}

interface SignatureRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentContent: string;
}

export const SignatureRequestModal: React.FC<SignatureRequestModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  documentContent
}) => {
  const { toast } = useToast();
  const { isMaximized, toggleMaximized } = useSignature();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [signers, setSigners] = useState<Signer[]>([
    { id: nanoid(), name: "", email: "" }
  ]);
  const [signatureFields, setSignatureFields] = useState<SignatureField[]>([]);
  const [currentSignerId, setCurrentSignerId] = useState<string | null>(null);
  const [isPlacingSignature, setIsPlacingSignature] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showSignerSheet, setShowSignerSheet] = useState<boolean>(false);
  const [confirmCancel, setConfirmCancel] = useState<boolean>(false);
  const [documentLoaded, setDocumentLoaded] = useState<boolean>(false);
  const [pdfViewerHeight, setPdfViewerHeight] = useState<string>("calc(100vh - 280px)");
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (signers.length > 0 && !currentSignerId) {
      setCurrentSignerId(signers[0].id);
    }
  }, [signers, currentSignerId]);

  useEffect(() => {
    if (isOpen && documentContent) {
      setIsProcessing(true);
      setDocumentLoaded(false);
      convertToPDF(documentContent, documentTitle)
        .then(url => {
          setPdfDataUrl(url);
          setIsProcessing(false);
          setTotalPages(3);
        })
        .catch(error => {
          console.error("Error generating PDF:", error);
          toast({
            title: "Error generating PDF",
            description: "Failed to convert document to PDF. Please try again.",
            variant: "destructive"
          });
          setIsProcessing(false);
        });
    }
  }, [isOpen, documentContent, documentTitle, toast]);

  const convertToPDF = async (content: string, title: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KL1Jlc291cmNlcyA8PCAvRm9udCA8PCAvRjEgNCAwIFIgPj4gPj4KL0NvbnRlbnRzIDUgMCBSCi9QYXJlbnQgMiAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwgL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iago1IDAgb2JqCjw8IC9MZW5ndGggNzQgPj4Kc3RyZWFtCkJUCi9GMSAxOCBUZgoxMDAgNzAwIFRkCihTYW1wbGUgUERGIERvY3VtZW50IC0gKSBUagoxMDAgNjgwIFRkCihDb250cmFjdDogKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMDA5IDAwMDAwIG4KMDAwMDAwMDA2NiAwMDAwMCBuCjAwMDAwMDAxMjUgMDAwMDAgbgowMDAwMDAwMjQ4IDAwMDAwIG4KMDAwMDAwMDMxNSAwMDAwMCBuCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDM5CiUlRU9GCg==");
      }, 1000);
    });
  };

  const handleAddSigner = () => {
    setSigners([...signers, { id: nanoid(), name: "", email: "" }]);
  };

  const handleRemoveSigner = (id: string) => {
    if (signers.length > 1) {
      setSigners(signers.filter(signer => signer.id !== id));
      
      if (currentSignerId === id) {
        setCurrentSignerId(signers[0].id === id ? signers[1].id : signers[0].id);
      }
      
      setSignatureFields(signatureFields.filter(field => field.signerId !== id));
    } else {
      toast({
        title: "Cannot remove",
        description: "At least one signer is required",
        variant: "default"
      });
    }
  };

  const handleSignerChange = (id: string, field: 'name' | 'email', value: string) => {
    setSigners(signers.map(signer => 
      signer.id === id ? { ...signer, [field]: value } : signer
    ));
  };

  const handleAddSignatureField = () => {
    if (!currentSignerId) {
      toast({
        title: "No signer selected",
        description: "Please select a signer before adding a signature field",
        variant: "destructive"
      });
      return;
    }
    
    setIsPlacingSignature(true);
    toast({
      title: "Add signature field",
      description: "Click on the document to place a signature field",
    });
  };

  const handlePDFClick = (e: React.MouseEvent<HTMLDivElement>, pageNumber: number) => {
    if (!isPlacingSignature || !currentSignerId) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newSignatureField: SignatureField = {
      id: nanoid(),
      pageNumber,
      x,
      y,
      width: 20,
      height: 10,
      signerId: currentSignerId
    };
    
    setSignatureFields([...signatureFields, newSignatureField]);
    setIsPlacingSignature(false);
    
    toast({
      title: "Signature field added",
      description: "Signature field has been placed successfully",
    });
  };

  const handleRemoveSignatureField = (id: string) => {
    setSignatureFields(signatureFields.filter(field => field.id !== id));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleGoToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSendForSignature = async () => {
    try {
      const emptySigners = signers.filter(s => !s.name || !s.email);
      if (emptySigners.length > 0) {
        toast({
          title: "Missing information",
          description: "Please fill in name and email for all signers",
          variant: "destructive"
        });
        return;
      }

      if (signatureFields.length === 0) {
        toast({
          title: "No signature fields",
          description: "Please add at least one signature field",
          variant: "destructive"
        });
        return;
      }

      setIsProcessing(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const { data: requestData, error: requestError } = await supabase
        .from('signature_requests')
        .insert({
          document_id: nanoid(),
          requestor_id: user.id,
          title: documentTitle,
          status: "draft" as SignatureRequestStatus,
          signing_type: signers.length > 1 ? 'sequential' : 'simple',
          metadata: { original_content: documentContent }
        })
        .select()
        .single();
        
      if (requestError) {
        throw new Error(`Failed to create signature request: ${requestError.message}`);
      }
      
      const signerRecords = signers.map((signer, index) => ({
        signature_request_id: requestData.id,
        signer_name: signer.name,
        signer_email: signer.email,
        signing_order: index + 1,
        status: "pending" as SignerStatus
      }));
      
      const { data: signersData, error: signersError } = await supabase
        .from('signature_signers')
        .insert(signerRecords)
        .select();
        
      if (signersError) {
        throw new Error(`Failed to add signers: ${signersError.message}`);
      }
      
      const signerIdMap = signersData.reduce((map: Record<string, string>, dbSigner: any) => {
        const localSigner = signers.find(s => s.email === dbSigner.signer_email);
        if (localSigner) {
          map[localSigner.id] = dbSigner.id;
        }
        return map;
      }, {});
      
      const fieldRecords = signatureFields.map(field => ({
        signature_request_id: requestData.id,
        signer_id: signerIdMap[field.signerId],
        page_number: field.pageNumber,
        position_x: field.x,
        position_y: field.y,
        width: field.width,
        height: field.height,
        field_type: 'signature',
        required: true
      }));
      
      const { error: fieldsError } = await supabase
        .from('signature_fields')
        .insert(fieldRecords);
        
      if (fieldsError) {
        throw new Error(`Failed to add signature fields: ${fieldsError.message}`);
      }
      
      const { error: updateError } = await supabase
        .from('signature_requests')
        .update({ status: "pending" as SignatureRequestStatus })
        .eq('id', requestData.id);
        
      if (updateError) {
        throw new Error(`Failed to update request status: ${updateError.message}`);
      }
      
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-signature-request', {
        body: { signatureRequestId: requestData.id }
      });
      
      if (emailError) {
        throw new Error(`Failed to send signature emails: ${emailError.message}`);
      }

      toast({
        title: "Document sent for signing",
        description: `Signature request has been sent to ${signers.length} recipient(s)`,
      });
      
      onClose();
    } catch (error: any) {
      console.error("Error sending for signature:", error);
      toast({
        title: "Failed to send for signature",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { title: "Review Document", description: "Review the document before sending for signature", icon: <Book className="w-4 h-4" /> },
    { title: "Add Signers", description: "Add the people who need to sign this document", icon: <UserCheck className="w-4 h-4" /> },
    { title: "Place Signatures", description: "Specify where signatures should appear", icon: <FileSignature className="w-4 h-4" /> },
    { title: "Send Document", description: "Review and send document for signatures", icon: <Send className="w-4 h-4" /> }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getPageSignatureFields = () => {
    return signatureFields.filter(field => field.pageNumber === currentPage);
  };

  const renderPaginationControls = () => {
    const pageButtons = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => handleGoToPage(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      pageButtons.push(
        <PaginationItem key={1}>
          <PaginationLink 
            onClick={() => handleGoToPage(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, startPage + 2);
      
      if (endPage === totalPages - 1) {
        startPage = Math.max(2, endPage - 2);
      }
      
      if (startPage > 2) {
        pageButtons.push(
          <PaginationItem key="ellipsis-start">
            <span className="flex h-9 w-9 items-center justify-center">&hellip;</span>
          </PaginationItem>
        );
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => handleGoToPage(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      if (endPage < totalPages - 1) {
        pageButtons.push(
          <PaginationItem key="ellipsis-end">
            <span className="flex h-9 w-9 items-center justify-center">&hellip;</span>
          </PaginationItem>
        );
      }
      
      pageButtons.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            onClick={() => handleGoToPage(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={handlePrevPage}
              className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
            />
          </PaginationItem>
          
          {pageButtons}
          
          <PaginationItem>
            <PaginationNext 
              onClick={handleNextPage}
              className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const renderStepProgress = () => (
    <div className="relative mt-6 mb-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-1 bg-muted-foreground/20 rounded-full">
          <div className="h-full bg-primary rounded-full transition-all" 
            style={{ 
              width: `${(currentStep / (steps.length - 1)) * 100}%` 
            }}
          />
        </div>
      </div>
      
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div key={index} className="flex flex-col items-center" style={{ zIndex: 1 }}>
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30 bg-background text-muted-foreground"
                )}
              >
                {step.icon}
              </div>
              <span className={cn(
                "text-xs font-medium mt-2",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {step.title}
              </span>
              <Progress 
                value={isCompleted ? 100 : isActive ? 50 : 0} 
                className="h-1 w-16 mt-1" 
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  const handleClose = useCallback(() => {
    if (signatureFields.length > 0 || signers.some(s => s.name || s.email)) {
      setConfirmCancel(true);
    } else {
      onClose();
    }
  }, [onClose, signatureFields, signers]);

  const handleMaximizePDF = () => {
    toggleMaximized();
    if (!isMaximized) {
      setPdfViewerHeight("calc(100vh - 150px)");
    } else {
      setPdfViewerHeight("calc(100vh - 280px)");
    }
  };

  return (
    <>
      <Dialog 
        open={isOpen} 
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className={cn(
          "max-w-[95vw] w-full max-h-[95vh] p-0 overflow-hidden",
          isMaximized ? "h-[95vh]" : "w-[1200px]",
          isMaximized && "fullscreen-dialog"
        )}>
          <div className="flex flex-col h-full">
            {!isMaximized && (
              <div className="p-6 border-b">
                <DialogHeader>
                  <div className="flex items-center">
                    <FileSignature className="h-6 w-6 text-primary mr-2" />
                    <DialogTitle className="text-xl">Send "{documentTitle}" for Signature</DialogTitle>
                  </div>
                  <DialogDescription className="mt-1">
                    {steps[currentStep].description}
                  </DialogDescription>
                </DialogHeader>

                {renderStepProgress()}
              </div>
            )}

            <div className="flex-1 overflow-hidden flex flex-col">
              {currentStep === 0 && (
                <div className={cn(
                  "flex-1 overflow-hidden p-6",
                  isMaximized ? "pt-0 pb-0 px-0" : "pt-4"
                )}>
                  {isProcessing ? (
                    <div className="flex-1 flex items-center justify-center h-full">
                      <div className="flex flex-col items-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="mt-4 text-lg">Converting document to PDF...</p>
                        <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-hidden flex flex-col h-full bg-muted/5 rounded-lg shadow-inner">
                      {!isMaximized && (
                        <div className="flex items-center justify-between bg-muted/10 p-3 border-b">
                          <div className="flex items-center">
                            <Info className="h-4 w-4 text-muted-foreground mr-2" />
                            <span className="text-sm text-muted-foreground">
                              Review the document before proceeding to the next step
                            </span>
                          </div>
                          <div className="text-sm font-medium">
                            Page {currentPage} of {totalPages}
                          </div>
                        </div>
                      )}
                      
                      <div 
                        ref={pdfContainerRef}
                        className={cn(
                          "flex-1 flex items-stretch justify-center",
                          isMaximized ? "p-0" : "p-6", 
                          "overflow-auto"
                        )}
                        style={{ 
                          height: pdfViewerHeight,
                          transition: 'height 0.3s ease'
                        }}
                      >
                        {pdfDataUrl ? (
                          <div className="w-full h-full">
                            <PDFViewer 
                              pdfUrl={pdfDataUrl} 
                              className="h-full w-full rounded-lg border shadow-sm bg-white" 
                              onLoad={() => setDocumentLoaded(true)}
                              onMaximize={handleMaximizePDF}
                              isMaximized={isMaximized}
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <AlertCircle className="h-12 w-12 text-destructive mb-3" />
                            <p className="text-lg font-medium">Failed to load PDF</p>
                            <p className="text-muted-foreground mt-1">
                              The document could not be loaded
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {totalPages > 1 && !isMaximized && (
                        <div className="py-3 px-4 bg-muted/10 border-t">
                          {renderPaginationControls()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {currentStep === 1 && !isMaximized && (
                <div className="flex-1 overflow-auto p-6 pt-4">
                  <div className="bg-background rounded-md border shadow-sm p-6">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Users className="mr-2 h-5 w-5 text-primary" />
                      Document Signers
                    </h3>
                    
                    <div className="space-y-6">
                      {signers.map((signer, index) => (
                        <div key={signer.id} className="flex gap-4 items-start bg-muted/10 p-5 rounded-md border shadow-sm">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1 grid gap-4 grid-cols-1 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor={`name-${signer.id}`}>Full Name</Label>
                              <Input 
                                id={`name-${signer.id}`} 
                                value={signer.name} 
                                placeholder="John Doe"
                                className="bg-background"
                                onChange={(e) => handleSignerChange(signer.id, 'name', e.target.value)} 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`email-${signer.id}`}>Email</Label>
                              <Input 
                                id={`email-${signer.id}`} 
                                type="email" 
                                value={signer.email} 
                                placeholder="john@example.com"
                                className="bg-background"
                                onChange={(e) => handleSignerChange(signer.id, 'email', e.target.value)} 
                              />
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveSigner(signer.id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="mt-6"
                      onClick={handleAddSigner}
                    >
                      <Plus size={16} className="mr-2" />
                      Add Another Signer
                    </Button>
                    
                    {signers.length > 1 && (
                      <div className="mt-6 pt-4 border-t">
                        <div className="flex items-center text-sm bg-primary/5 p-4 rounded-md border border-primary/20">
                          <Info className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                          <span>
                            Signers will be asked to sign in the order listed above. Each signer will receive an email notification when it's their turn to sign.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && !isMaximized && (
                <div className="flex-1 overflow-hidden p-6 pt-4 flex flex-col">
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-8 flex items-center space-x-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={cn(
                          isPlacingSignature && "bg-primary/10 border-primary text-primary", 
                          "shadow-sm transition-all"
                        )}
                        onClick={handleAddSignatureField}
                      >
                        <Plus size={16} className="mr-2" />
                        Add Signature Field
                      </Button>
                      {isPlacingSignature && (
                        <span className="text-sm text-primary animate-pulse font-medium">
                          Click on the document where the signature should appear
                        </span>
                      )}
                    </div>
                    <div className="col-span-4">
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-sm text-muted-foreground">Current signer:</span>
                        <select 
                          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                          value={currentSignerId || ''}
                          onChange={(e) => setCurrentSignerId(e.target.value)}
                        >
                          {signers.map((signer) => (
                            <option key={signer.id} value={signer.id}>
                              {signer.name || `Signer ${signers.findIndex(s => s.id === signer.id) + 1}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-auto relative border rounded-md shadow-sm bg-muted/5">
                    {pdfDataUrl ? (
                      <div className="relative w-full h-full flex flex-col">
                        <div
                          className="flex-1 relative"
                          onClick={(e) => handlePDFClick(e, currentPage)}
                        >
                          <PDFViewer pdfUrl={pdfDataUrl} className="w-full h-full" />
                          
                          {getPageSignatureFields().map((field) => (
                            <div 
                              key={field.id}
                              className="absolute border-2 border-primary bg-primary/10 rounded-md flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-all shadow-sm"
                              style={{
                                left: `${field.x}%`,
                                top: `${field.y}%`,
                                width: `${field.width}%`,
                                height: `${field.height}%`,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveSignatureField(field.id);
                              }}
                            >
                              <span className="text-xs truncate px-1 text-primary font-medium">
                                {signers.find(s => s.id === field.signerId)?.name || "Signature"}
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        {totalPages > 1 && (
                          <div className="py-3 px-4 bg-muted/10 border-t">
                            {renderPaginationControls()}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                          <p className="mt-2">Loading document...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {signatureFields.length > 0 && (
                    <div className="mt-4 bg-muted/10 p-4 rounded-md border shadow-sm flex items-center">
                      <FileCheck className="h-5 w-5 text-primary mr-2" />
                      <span className="text-sm">
                        {signatureFields.length} signature {signatureFields.length === 1 ? 'field' : 'fields'} placed 
                        across {new Set(signatureFields.map(f => f.pageNumber)).size} {new Set(signatureFields.map(f => f.pageNumber)).size === 1 ? 'page' : 'pages'}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-auto text-xs"
                        onClick={() => setShowSignerSheet(true)}
                      >
                        View Details
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 3 && !isMaximized && (
                <div className="flex-1 overflow-auto p-6 pt-4">
                  <div className="space-y-6">
                    <div className="bg-muted/5 rounded-md p-5 border shadow-sm">
                      <h3 className="text-lg font-medium flex items-center">
                        <FileCheck size={20} className="mr-2 text-primary" /> 
                        Document Summary
                      </h3>
                      <div className="mt-2 space-y-1 text-sm">
                        <p><span className="font-medium">Title:</span> {documentTitle}</p>
                        <p><span className="font-medium">Pages:</span> {totalPages}</p>
                        <p>
                          <span className="font-medium">Signature Fields:</span> {signatureFields.length} fields across {new Set(signatureFields.map(f => f.pageNumber)).size} pages
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-muted/5 rounded-md p-5 border shadow-sm">
                      <h3 className="text-lg font-medium flex items-center">
                        <Users size={20} className="mr-2 text-primary" /> 
                        Signers ({signers.length})
                      </h3>
                      <div className="mt-3 space-y-3">
                        {signers.map((signer, index) => (
                          <div key={signer.id} className="flex items-center bg-background p-4 rounded-md shadow-sm border">
                            <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-medium mr-3">
                              {index + 1}
                            </span>
                            <div>
                              <p className="font-medium">{signer.name}</p>
                              <p className="text-sm text-muted-foreground">{signer.email}</p>
                            </div>
                            <div className="ml-auto text-sm bg-muted/20 py-1 px-2 rounded-md">
                              {signatureFields.filter(f => f.signerId === signer.id).length} signature fields
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-primary/5 p-5 rounded-md border border-primary/20 shadow-sm">
                      <h3 className="text-lg font-medium flex items-center">
                        <Mail size={20} className="mr-2 text-primary" /> Email Notification
                      </h3>
                      <p className="mt-2 text-sm">
                        Each signer will receive an email with instructions to view and sign this document online.
                        {signers.length > 1 && " Signers will be notified in the order listed above."}
                      </p>
                      <div className="mt-4 bg-background p-4 rounded-md text-sm border shadow-sm">
                        <p className="font-medium">Email Preview</p>
                        <div className="mt-2 text-muted-foreground">
                          <p>Subject: Please sign: {documentTitle}</p>
                          <p className="mt-1">Hi [Signer Name],</p>
                          <p className="mt-1">You have been requested to sign a document: {documentTitle}.</p>
                          <p className="mt-1">Click the button below to review and sign the document.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {!isMaximized && (
              <DialogFooter className="flex items-center justify-between p-6 border-t mt-auto bg-muted/5">
                <div>
                  {currentStep > 0 && (
                    <Button variant="outline" onClick={prevStep} className="shadow-sm">
                      <ChevronLeft className="mr-1 h-4 w-4" /> Back
                    </Button>
                  )}
                </div>
                <div>
                  {currentStep < steps.length - 1 ? (
                    <Button 
                      onClick={nextStep} 
                      variant="default"
                      disabled={currentStep === 0 && (!pdfDataUrl || !documentLoaded)}
                      className="shadow-sm"
                    >
                      Continue <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSendForSignature} 
                      disabled={isProcessing}
                      className="bg-primary shadow-sm"
                    >
                      {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Send size={16} className="mr-2" />
                      Send for Signature
                    </Button>
                  )}
                </div>
              </DialogFooter>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Sheet open={showSignerSheet} onOpenChange={setShowSignerSheet}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Signature Fields</h2>
              <p className="text-sm text-muted-foreground mt-1">
                View all signature fields placed on the document
              </p>
            </div>
            
            <ScrollArea className="flex-1 p-6">
              {signers.map((signer) => {
                const signerFields = signatureFields.filter(field => field.signerId === signer.id);
                if (signerFields.length === 0) return null;
                
                return (
                  <div key={signer.id} className="mb-6">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary mr-2">
                        {signers.findIndex(s => s.id === signer.id) + 1}
                      </div>
                      <h3 className="font-medium">{signer.name || "Unnamed Signer"}</h3>
                    </div>
                    
                    <div className="pl-8 space-y-3">
                      {signerFields.map((field) => (
                        <div key={field.id} className="bg-muted/10 p-4 rounded-md border shadow-sm flex items-center">
                          <div className="flex-1">
                            <p className="text-sm font-medium">Signature Field</p>
                            <p className="text-xs text-muted-foreground">Page {field.pageNumber}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              setCurrentPage(field.pageNumber);
                              setShowSignerSheet(false);
                              setTimeout(() => {
                                handleRemoveSignatureField(field.id);
                              }, 300);
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
            
            <div className="p-6 border-t">
              <Button 
                variant="outline" 
                className="w-full shadow-sm" 
                onClick={() => setShowSignerSheet(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel signature request?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to exit? All signature fields and signer information will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={onClose} className="bg-destructive">
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
