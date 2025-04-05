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
    const { contractText, analysisType, contractType, section, metadata } = await req.json();
    
    if (!contractText && analysisType !== "generate" && analysisType !== "outline" && analysisType !== "section") {
      return new Response(
        JSON.stringify({ error: 'Contract text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing contract with type: ${analysisType}, contract type: ${contractType}`);
    console.log(`Received parameters: contractText length: ${contractText ? contractText.length : 0}, section: ${section ? 'present' : 'not present'}, metadata: ${metadata ? 'present' : 'not present'}`);
    
    // Define different system prompts based on analysis type
    let systemPrompt = "";
    let specificInstructions = "";
    let sectionId = "";
    let sectionTitle = "";
    
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
      case "generate": {
        // Add specific instructions based on contract type
        if (contractType === "Co-Founder Agreement") {
          specificInstructions = `This should be a comprehensive co-founder agreement covering equity distribution, roles and responsibilities, 
          intellectual property rights, vesting schedules, decision-making processes, exit provisions, and dispute resolution mechanisms.
          Make it detailed, practical, and legally sound for startup founders.
          
          Extract any relevant names, company details, or specific requirements from the user's prompt and incorporate them into the agreement.
          Use formal legal language appropriate for a binding agreement between co-founders.`;
        } else if (contractType === "Shareholder Agreement") {
          specificInstructions = `This should be a comprehensive shareholder agreement covering:
          
          1. Detailed share classes, rights, and voting structures
          2. Capital contributions and financing provisions
          3. Corporate governance and management structure
          4. Director appointment rights and board composition
          5. Transfer restrictions and share disposal mechanisms
          6. Pre-emptive rights, tag-along and drag-along provisions
          7. Dividend policy and distribution of profits
          8. Reserved matters requiring special approval
          9. Information rights and financial reporting
          10. Non-compete and confidentiality provisions
          11. Dispute resolution mechanisms
          12. Exit strategy and liquidation procedures
          13. Valuation methodologies for share transfers
          14. Anti-dilution protections
          15. Default and remedy provisions
          
          Extract any company names, shareholder details, or specific requirements from the user's prompt and incorporate them into the agreement.
          This should be a detailed, legally sound document suitable for a private company with multiple shareholders.
          Use formal legal language and structure appropriate for a binding shareholder agreement.`;
        }
        
        systemPrompt = `You are an AI legal assistant specializing in contract drafting. 
        Generate a comprehensive, professional ${contractType || "legal document"} based on the user's requirements.
        ${specificInstructions}
        
        Format your response as a direct JSON object (not in a code block) with these keys: 
        title (the title of the contract), 
        content (the full text of the contract with proper formatting and structure), 
        type (the type of contract generated).
        
        For the content, use proper legal language and include all necessary sections and clauses.
        The contract should be ready to use with minimal editing needed.
        Do not include any explanations or markdown formatting in your response, just the pure JSON object.`;
        break;
      }

      case "summary": {
        systemPrompt = `You are an AI legal assistant specializing in contract analysis and summarization.
        Analyze the provided contract and create a comprehensive summary with actionable points.
        
        Format your response as a direct JSON object (not in a code block) with these keys:
        title: (the title of the contract),
        overview: (a concise 3-5 sentence summary of the contract's purpose and main provisions),
        actionPoints: [
          {
            title: (short title of the action point),
            description: (detailed explanation of what needs to be done),
            priority: (one of: 'high', 'medium', 'low'),
            category: (one of: 'obligation', 'right', 'date', 'payment', 'condition', 'restriction', 'other')
          }
        ],
        keyTerms: [
          { 
            term: (important term or concept from the contract),
            definition: (brief explanation of what it means)
          }
        ],
        dates: [
          {
            title: (name of the deadline or milestone),
            date: (the date or timeframe specified),
            description: (what happens on this date)
          }
        ]
        
        Identify at least 5-10 specific action points from the contract that require attention, tracking, or follow-up.
        Focus on deadlines, payment obligations, reporting requirements, conditions precedent, and key restrictions.
        For each action point, provide a meaningful title, detailed description, appropriate priority, and relevant category.
        Include all defined terms that are important for understanding the contract.
        Extract all important dates, deadlines, and milestones mentioned in the contract.
        Do not include any explanations or markdown formatting in your response, just the pure JSON object.`;
        break;
      }

      case "outline": {
        let outlineInstructions = "";
        
        // Add specific instructions for shareholder agreements
        if (contractType === "Shareholder Agreement") {
          outlineInstructions = `
          For a Shareholder Agreement, your outline MUST include the following sections (along with any others you deem necessary):
          
          1. Definitions and Interpretation
          2. Business of the Company
          3. Capital Structure and Contributions
          4. Issuance of Shares
          5. Transfer Restrictions
          6. Pre-emptive Rights
          7. Tag-Along and Drag-Along Rights
          8. Corporate Governance (Board composition, meetings, etc.)
          9. Shareholder Meetings and Voting
          10. Reserved Matters
          11. Information Rights and Reporting
          12. Dividend Policy
          13. Non-compete and Non-solicitation
          14. Confidentiality
          15. Representations and Warranties
          16. Default and Remedies
          17. Dispute Resolution
          18. Termination and Exit Provisions
          19. Valuation Methodology
          20. General Provisions (notices, amendments, etc.)
          
          For each section, include a brief but informative description explaining its purpose and key components.`;
        }
        
        systemPrompt = `You are an AI legal assistant specializing in contract structure and organization.
        Create a detailed outline for a ${contractType || "legal document"} based on the user's requirements.
        ${outlineInstructions}
        
        Format your response as a direct JSON object (not in a code block) with these keys:
        title (the title of the contract),
        type (the type of contract),
        metadata: {
          parties: [] (array of party names involved),
          effectiveDate: (optional expected effective date),
          jurisdiction: (optional governing jurisdiction)
        },
        sections: [
          {
            id: (unique identifier for the section),
            title: (section title),
            content: (brief description of what this section will contain),
            subsections: [] (optional array of subsections following the same structure),
            clauseNumbers: [] (optional array of clause numbers this section will contain)
          }
        ]
        
        The outline should be comprehensive and include all standard sections expected in a professional ${contractType || "legal document"}.
        For a complex document like a Shareholders Agreement, include at least 15-20 main sections covering all essential aspects.
        Do not include any explanations or markdown formatting in your response, just the pure JSON object.`;
        break;
      }

      case "section": {
        // Extract section information from the request
        sectionId = section?.id || "unknown";
        sectionTitle = section?.title || "Contract Section";
        
        systemPrompt = `You are an AI legal assistant specializing in contract drafting.
        Generate the complete content for the "${sectionTitle}" section of a ${contractType || "legal document"}.
        
        Here is the section information:
        ${JSON.stringify(section)}
        
        Additional context about the contract:
        ${JSON.stringify(metadata || {})}
        
        Format your response as a direct JSON object (not in a code block) with these keys:
        id: "${sectionId}",
        title: (keep the original section title),
        content: (the complete, detailed content for this section with proper legal language and formatting),
        subsections: (if applicable, include fully developed subsections following the same structure)
        
        IMPORTANT GUIDELINES:
        1. Be extremely comprehensive - each section should be at least 500-1000 words with detailed clauses
        2. Include appropriate legal language, defined terms, and cross-references
        3. For Shareholder Agreements in particular, ensure detailed provisions appropriate for complex business relationships
        4. DO NOT abbreviate or summarize - provide the full, detailed text as it would appear in a final legal document
        5. Include numbered sub-clauses and paragraphs where appropriate (e.g., 1.1, 1.2, etc.)
        6. Ensure content is practically usable without further editing
        
        The section content should be comprehensive, professionally written in formal legal language, and ready to use with minimal editing.
        Do not include any explanations or markdown formatting in your response, just the pure JSON object.`;
        break;
      }

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
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: analysisType === 'section' ? JSON.stringify({ section, metadata, contractType }) : contractText }
        ],
        temperature: 0.1, // Lower temperature for more consistent, analytical results
        max_tokens: 4000, // Ensure we have enough tokens for comprehensive content
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
    console.log('Response received from OpenAI. Parsing...');
    
    // Try to parse as JSON, but fallback to sending raw text if parsing fails
    let parsedResult;
    try {
      // First, try to parse directly
      try {
        parsedResult = JSON.parse(analysisResult);
        console.log('Successfully parsed OpenAI response as JSON directly');
      } catch (directParseError) {
        // If direct parsing fails, try to extract JSON from a code block
        const jsonMatch = analysisResult.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          parsedResult = JSON.parse(jsonMatch[1]);
          console.log('Successfully extracted and parsed JSON from code block');
        } else {
          // If both methods fail, throw error to trigger fallback
          throw new Error('Failed to parse JSON directly or extract from code block');
        }
      }
      
      // Validate the parsed result based on analysis type
      if (analysisType === "outline") {
        // Ensure the outline has a title
        if (!parsedResult.title || typeof parsedResult.title !== 'string') {
          console.warn('Outline missing title, adding default title');
          parsedResult.title = contractType || "Generated Agreement";
        }
        
        // Ensure the outline has a type
        if (!parsedResult.type || typeof parsedResult.type !== 'string') {
          console.warn('Outline missing type, adding default type');
          parsedResult.type = contractType || "Legal Agreement";
        }
        
        // Ensure the outline has metadata
        if (!parsedResult.metadata || typeof parsedResult.metadata !== 'object') {
          console.warn('Outline missing metadata, adding default metadata');
          parsedResult.metadata = {
            parties: [],
            effectiveDate: new Date().toISOString().split('T')[0]
          };
        }
        
        // Ensure the outline has sections and they have valid titles
        if (!parsedResult.sections || !Array.isArray(parsedResult.sections) || parsedResult.sections.length === 0) {
          console.warn('Outline missing sections or has empty sections array, adding default sections');
          parsedResult.sections = [];
          
          // For Shareholder Agreement, add default sections based on the specific instructions
          if (contractType === "Shareholder Agreement") {
            const defaultSections = [
              "Definitions and Interpretation",
              "Business of the Company",
              "Capital Structure and Contributions",
              "Issuance of Shares",
              "Transfer Restrictions",
              "Pre-emptive Rights",
              "Tag-Along and Drag-Along Rights",
              "Corporate Governance",
              "Shareholder Meetings and Voting",
              "Reserved Matters",
              "Information Rights and Reporting",
              "Dividend Policy",
              "Non-compete and Non-solicitation",
              "Confidentiality",
              "Representations and Warranties"
            ];
            
            defaultSections.forEach((title, index) => {
              parsedResult.sections.push({
                id: `section-${index + 1}`,
                title: title,
                content: `This section covers important aspects related to ${title}.`
              });
            });
          } else {
            // Generic default section
            parsedResult.sections.push({
              id: "section-1",
              title: "Agreement Terms",
              content: "This section contains the terms and conditions of the agreement."
            });
          }
        } else {
          // Validate each section has a valid title and id
          parsedResult.sections = parsedResult.sections.map((section, index) => {
            const validSection = { ...section };
            
            // Ensure section has a valid id
            if (!validSection.id || typeof validSection.id !== 'string') {
              validSection.id = `section-${index + 1}`;
            }
            
            // Ensure section has a valid title
            if (!validSection.title || typeof validSection.title !== 'string') {
              validSection.title = `Section ${index + 1}`;
            }
            
            // Ensure section has content (even if brief)
            if (!validSection.content || typeof validSection.content !== 'string') {
              validSection.content = `This section covers important aspects of the agreement.`;
            }
            
            return validSection;
          });
        }
      } else if (analysisType === "section") {
        // Validate section response
        if (!parsedResult.id || typeof parsedResult.id !== 'string') {
          parsedResult.id = sectionId || "unknown-section";
        }
        
        if (!parsedResult.title || typeof parsedResult.title !== 'string') {
          parsedResult.title = sectionTitle || "Untitled Section";
        }
        
        if (!parsedResult.content || typeof parsedResult.content !== 'string' || parsedResult.content.trim() === '') {
          parsedResult.content = `This section should contain detailed information about ${parsedResult.title}.`;
        }
      }
    } catch (e) {
      console.warn('Failed to parse OpenAI response as JSON:', e);
      parsedResult = { rawAnalysis: analysisResult };
      
      // For generation, attempt to create a more structured response
      if (analysisType === "generate") {
        // Extract title from first line
        const lines = analysisResult.split('\n');
        const title = lines[0].trim();
        const content = analysisResult;
        
        parsedResult = {
          title: title || contractType || "Generated Agreement",
          content: content,
          type: contractType || "Legal Agreement"
        };
      } else if (analysisType === "outline") {
        parsedResult = {
          title: contractType || "Generated Agreement",
          type: contractType || "Legal Agreement",
          metadata: {
            parties: [],
            effectiveDate: new Date().toISOString().split('T')[0]
          },
          sections: [
            {
              id: "section-1",
              title: "Default Section",
              content: "This is a placeholder section. The outline could not be properly generated."
            }
          ]
        };
      } else if (analysisType === "section") {
        parsedResult = {
          id: sectionId,
          title: sectionTitle,
          content: analysisResult || "Section content could not be properly generated."
        };
      }
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
