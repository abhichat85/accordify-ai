import React, { useState, useEffect, useRef } from "react";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Plus, Trash2, Users, Mail, Send, 
  FileCheck, AlertCircle, Loader2
} from "lucide-react";
import { PDFViewer } from "./PDFViewer";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { nanoid } from "@/lib/utils";

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
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [signers, setSigners] = useState<Signer[]>([
    { id: nanoid(), name: "", email: "" }
  ]);
  const [signatureFields, setSignatureFields] = useState<SignatureField[]>([]);
  const [currentSignerId, setCurrentSignerId] = useState<string | null>(null);
  const [isPlacingSignature, setIsPlacingSignature] = useState<boolean>(false);

  useEffect(() => {
    if (signers.length > 0 && !currentSignerId) {
      setCurrentSignerId(signers[0].id);
    }
  }, [signers, currentSignerId]);

  useEffect(() => {
    if (isOpen && documentContent) {
      setIsProcessing(true);
      convertToPDF(documentContent, documentTitle)
        .then(url => {
          setPdfDataUrl(url);
          setIsProcessing(false);
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
          status: 'draft',
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
        status: 'pending'
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
    { title: "Review Document", description: "Review the document before sending for signature" },
    { title: "Add Signers", description: "Add the people who need to sign this document" },
    { title: "Place Signatures", description: "Specify where signatures should appear" },
    { title: "Send Document", description: "Review and send document for signatures" }
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Send "{documentTitle}" for Signature</DialogTitle>
          <DialogDescription>
            {steps[currentStep].description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between mb-6 mt-2 px-1">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  index === currentStep 
                    ? "bg-primary text-primary-foreground" 
                    : index < currentStep 
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted text-muted-foreground"
                )}
              >
                {index + 1}
              </div>
              <span className="text-xs mt-1 text-muted-foreground hidden md:block">{step.title}</span>
            </div>
          ))}
          
          <div className="absolute h-px bg-border w-[calc(100%-8rem)] left-16 top-[7.85rem] -z-10">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          {currentStep === 0 && (
            <div className="flex-1 overflow-hidden flex flex-col">
              {isProcessing ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2">Converting document to PDF...</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-auto">
                  {pdfDataUrl ? (
                    <PDFViewer pdfUrl={pdfDataUrl} className="w-full h-full" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="flex flex-col items-center">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                        <p className="mt-2">Failed to load PDF</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {currentStep === 1 && (
            <div className="flex-1 overflow-auto px-1">
              <div className="space-y-4 py-2">
                {signers.map((signer, index) => (
                  <div key={signer.id} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 grid gap-4 grid-cols-1 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${signer.id}`}>Full Name</Label>
                        <Input 
                          id={`name-${signer.id}`} 
                          value={signer.name} 
                          placeholder="John Doe"
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
                className="mt-4"
                onClick={handleAddSigner}
              >
                <Plus size={16} className="mr-2" />
                Add Another Signer
              </Button>
              
              <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  {signers.length > 1 ? (
                    "Signers will be asked to sign in the order listed above."
                  ) : (
                    "This document will be sent to one signer."
                  )}
                </p>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="col-span-2">
                  <Label className="mb-1 block">Place signature fields on the document</Label>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={cn(isPlacingSignature && "bg-primary/20")}
                      onClick={handleAddSignatureField}
                    >
                      <Plus size={16} className="mr-2" />
                      Add Signature Field
                    </Button>
                    {isPlacingSignature && (
                      <span className="text-xs text-muted-foreground">
                        Click on the document where signature should appear
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="mb-1 block">Signer</Label>
                  <select 
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background"
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
              
              <div className="flex-1 overflow-auto relative border rounded-md">
                {pdfDataUrl ? (
                  <div 
                    className="relative w-full h-full" 
                    onClick={(e) => handlePDFClick(e, 1)}
                  >
                    <PDFViewer pdfUrl={pdfDataUrl} className="w-full h-full" />
                    
                    {signatureFields.map((field) => (
                      <div 
                        key={field.id}
                        className="absolute border-2 border-primary bg-primary/10 rounded-md flex items-center justify-center cursor-pointer"
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
                        <span className="text-xs truncate text-primary-foreground">
                          {signers.find(s => s.id === field.signerId)?.name || "Signature"}
                        </span>
                      </div>
                    ))}
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
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Signature Fields ({signatureFields.length})</h4>
                  <div className="text-xs text-muted-foreground">
                    Click on a signature field in the document to remove it
                  </div>
                </div>
              )}
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="flex-1 overflow-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Review Document</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Document "{documentTitle}" is ready to be sent for signatures.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-base font-medium flex items-center">
                    <Users size={18} className="mr-2" /> 
                    Signers ({signers.length})
                  </h4>
                  <ul className="mt-2 space-y-2">
                    {signers.map((signer, index) => (
                      <li key={signer.id} className="flex items-center text-sm">
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary mr-2">
                          {index + 1}
                        </span>
                        <span className="font-medium">{signer.name}</span>
                        <span className="text-muted-foreground ml-2">({signer.email})</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-base font-medium flex items-center">
                    <FileCheck size={18} className="mr-2" /> 
                    Signature Fields ({signatureFields.length})
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {signatureFields.length} signature {signatureFields.length === 1 ? 'field has' : 'fields have'} been placed on the document.
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="text-base font-medium flex items-center">
                    <Mail size={18} className="mr-2" /> Email Message
                  </h4>
                  <p className="text-sm mt-2">
                    Recipients will receive an email with a link to view and sign this document.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex items-center justify-between pt-2 border-t mt-4">
          <div>
            {currentStep > 0 && (
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
            )}
          </div>
          <div>
            {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep}>
                Continue
              </Button>
            ) : (
              <Button 
                onClick={handleSendForSignature} 
                disabled={isProcessing}
                className="bg-primary"
              >
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Send size={16} className="mr-2" />
                Send for Signature
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
