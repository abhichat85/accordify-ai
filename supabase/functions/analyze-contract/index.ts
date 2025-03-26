
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contractText, analysisType } = await req.json();
    
    if (!contractText) {
      return new Response(
        JSON.stringify({ error: 'Contract text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing contract with type: ${analysisType}`);
    
    // Define different system prompts based on analysis type
    let systemPrompt = "";
    
    switch (analysisType) {
      case "general":
        systemPrompt = `You are an AI legal assistant specializing in contract analysis. 
        Analyze the provided contract text and provide a general overview of the document, 
        including its type, main clauses, and purpose. Format your response in JSON with these keys: 
        documentType, purpose, mainClauses (array), parties (array), effectiveDate, termDuration.`;
        break;
      case "risk":
        systemPrompt = `You are an AI legal assistant specializing in contract risk assessment. 
        Thoroughly analyze the provided contract text and identify potential legal risks, unbalanced 
        clauses, or terms that might be disadvantageous. Rate each risk as high, medium, or low. 
        Format your response in JSON with an array of risks, each containing: 
        type (high, medium, low), clause (name), description, suggestion (optional recommendation to address the risk).`;
        break;
      case "clauses":
        systemPrompt = `You are an AI legal assistant specializing in contract clause extraction. 
        Extract and categorize all clauses from the provided contract text. 
        Format your response in JSON with an array of clauses, each containing: 
        name, content, and risk (high, medium, low, or null if no risk).`;
        break;
      default:
        systemPrompt = `You are an AI legal assistant specializing in contract analysis. 
        Analyze the provided contract text and provide insights. Format your response in JSON.`;
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: contractText }
        ],
        temperature: 0.1, // Lower temperature for more consistent, analytical results
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      return new Response(
        JSON.stringify({ error: 'Error from OpenAI: ' + data.error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract and parse the content
    const analysisResult = data.choices[0].message.content;
    
    // Try to parse as JSON, but fallback to sending raw text if parsing fails
    let parsedResult;
    try {
      parsedResult = JSON.parse(analysisResult);
    } catch (e) {
      console.warn('Failed to parse OpenAI response as JSON:', e);
      parsedResult = { rawAnalysis: analysisResult };
    }

    return new Response(
      JSON.stringify({ 
        result: parsedResult,
        type: analysisType 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-contract function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
