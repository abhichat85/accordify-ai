
// supabase/functions/send-signature-request/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for the response
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  signatureRequestId: string;
}

// This function handles sending emails for signature requests
const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
      }
    );

    // Get the signature request ID from the request body
    const { signatureRequestId }: RequestBody = await req.json();

    if (!signatureRequestId) {
      throw new Error('Signature request ID is required');
    }

    console.log(`Processing signature request: ${signatureRequestId}`);

    // Fetch the signature request details
    const { data: requestData, error: requestError } = await supabaseClient
      .from('signature_requests')
      .select(`
        *,
        signature_signers(*)
      `)
      .eq('id', signatureRequestId)
      .single();

    if (requestError) {
      throw new Error(`Failed to fetch signature request: ${requestError.message}`);
    }

    if (!requestData) {
      throw new Error(`Signature request not found: ${signatureRequestId}`);
    }

    console.log(`Found signature request: ${requestData.title}`);
    console.log(`Signers: ${requestData.signature_signers.length}`);

    // In a production environment, we would send emails to all signers here
    // For now, we'll just simulate this process and update the database

    // Update the request status to 'sent'
    const { error: updateError } = await supabaseClient
      .from('signature_requests')
      .update({ status: 'sent' })
      .eq('id', signatureRequestId);

    if (updateError) {
      throw new Error(`Failed to update signature request: ${updateError.message}`);
    }

    // Create audit trail entries for the email sending
    for (const signer of requestData.signature_signers) {
      // Create an audit trail entry for email sent
      await supabaseClient.rpc('create_signature_audit_trail_entry', {
        p_signature_request_id: signatureRequestId,
        p_signer_id: signer.id,
        p_event_type: 'email_sent',
        p_event_data: JSON.stringify({
          recipient: signer.signer_email,
          timestamp: new Date().toISOString(),
        }),
        p_ip_address: null,
        p_user_agent: 'Supabase Edge Function'
      });

      console.log(`Created audit trail entry for signer: ${signer.signer_name}`);
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Signature request emails sent successfully',
      }),
      {
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
      }
    );
  } catch (error) {
    console.error('Error processing signature request:', error.message);
    
    // Return error response
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
      }
    );
  }
};

// This serves the function with Deno
serve(handler);
