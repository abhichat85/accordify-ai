
// supabase/functions/send-signature-request/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

// Initialize Resend with the API key
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

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

    // Update the request status to 'pending' from draft
    const { error: updateError } = await supabaseClient
      .from('signature_requests')
      .update({ status: 'pending' }) // Using the correct enum value
      .eq('id', signatureRequestId);

    if (updateError) {
      throw new Error(`Failed to update signature request: ${updateError.message}`);
    }

    // Send emails to all signers using Resend
    for (const signer of requestData.signature_signers) {
      try {
        // Generate a unique signing link (this would be your actual link in production)
        const signingLink = `https://yourapp.com/sign/${signatureRequestId}/${signer.id}`;
        
        // Send email via Resend
        const emailResponse = await resend.emails.send({
          from: 'Accord AI <esign@accordai.app>', // Update with your verified domain
          to: signer.signer_email,
          subject: `Signature requested: ${requestData.title}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Document Signature Request</h2>
              <p>Hello ${signer.signer_name},</p>
              <p>You have been requested to sign the document "${requestData.title}".</p>
              <p>Please click the button below to review and sign the document:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${signingLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Review & Sign Document</a>
              </div>
              <p>This link will expire in 7 days.</p>
              <p>Thank you,<br>Accord AI</p>
            </div>
          `,
        });

        console.log(`Email sent to ${signer.signer_email} - ID: ${emailResponse.id}`);
      } catch (emailError) {
        console.error(`Failed to send email to ${signer.signer_email}:`, emailError);
        // Continue with other signers even if one email fails
      }

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
