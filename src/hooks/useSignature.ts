
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

// Define the allowed status values based on the database schema
type SignatureRequestStatus = Database["public"]["Enums"]["signature_request_status"];
type SignerStatus = Database["public"]["Enums"]["signer_status"];

export interface SignatureRequestData {
  documentId: string;
  title: string;
  content?: string;
  signers: Array<{
    name: string;
    email: string;
  }>;
  signatureFields: Array<{
    pageNumber: number;
    x: number;
    y: number;
    width: number;
    height: number;
    signerId: number;
  }>;
}

export const useSignature = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const { toast } = useToast();

  const toggleMaximized = () => {
    setIsMaximized(prev => !prev);
  };

  /**
   * Create a signature request and notify signers
   */
  const createSignatureRequest = async (data: SignatureRequestData) => {
    setIsLoading(true);
    try {
      // 1. Create signature request
      const { data: requestData, error: requestError } = await supabase
        .from('signature_requests')
        .insert({
          document_id: data.documentId,
          requestor_id: (await supabase.auth.getUser()).data.user?.id,
          title: data.title,
          status: "pending" as SignatureRequestStatus, // Use the correct enum value
          signing_type: data.signers.length > 1 ? 'sequential' : 'simple',
          metadata: { original_content: data.content }
        })
        .select()
        .single();
        
      if (requestError) {
        throw new Error(`Failed to create signature request: ${requestError.message}`);
      }
      
      // 2. Add signers
      const signerRecords = data.signers.map((signer, index) => ({
        signature_request_id: requestData.id,
        signer_name: signer.name,
        signer_email: signer.email,
        signing_order: index + 1,
        status: "pending" as SignerStatus // Use the correct enum value
      }));
      
      const { data: signersData, error: signersError } = await supabase
        .from('signature_signers')
        .insert(signerRecords)
        .select();
        
      if (signersError) {
        throw new Error(`Failed to add signers: ${signersError.message}`);
      }
      
      // 3. Add signature fields
      // In a real implementation, we would need to map local signer IDs to database IDs
      
      return {
        success: true,
        requestId: requestData.id
      };
    } catch (error: any) {
      console.error("Error creating signature request:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return {
        success: false,
        error: error.message
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isMaximized,
    toggleMaximized,
    createSignatureRequest
  };
};
