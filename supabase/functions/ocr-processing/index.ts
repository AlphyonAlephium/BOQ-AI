import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { fileUrl, fileName } = await req.json();
    
    if (!fileUrl) {
      throw new Error('File URL is required');
    }

    console.log(`Processing specification document: ${fileName || 'unknown'}`);
    
    // Fetch the file content from the Supabase URL
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch file: ${fileResponse.statusText}`);
    }
    
    // Get the file data as blob
    const fileBlob = await fileResponse.blob();
    
    // Use OpenAI for OCR instead of Google Cloud Vision due to referrer restrictions
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }
    
    // Convert blob to base64
    const fileBuffer = await fileBlob.arrayBuffer();
    const base64File = btoa(
      new Uint8Array(fileBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
    
    // Prepare request for OpenAI Vision API
    console.log("Sending request to OpenAI Vision API for OCR");
    const openaiApiUrl = 'https://api.openai.com/v1/chat/completions';
    const requestBody = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in OCR processing. Extract all text from the provided document, including materials specifications, standards references, and technical details. Format detected tables accurately."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all text from this specification document. Identify materials, standards, and specifications. Return a structured response with all detected information."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64File}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" }
    };
    
    // Make request to OpenAI
    const openaiResponse = await fetch(openaiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("OpenAI API error response:", errorText);
      throw new Error(`OpenAI API error: ${openaiResponse.status} ${openaiResponse.statusText}`);
    }
    
    const openaiResult = await openaiResponse.json();
    
    if (!openaiResult.choices || openaiResult.choices.length === 0) {
      throw new Error('No text detected in the document');
    }
    
    // Parse the OpenAI response which should be in JSON format
    let extractedText;
    try {
      const resultContent = openaiResult.choices[0].message.content;
      extractedText = JSON.parse(resultContent);
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      throw new Error('Failed to parse OCR results');
    }
    
    console.log("OCR text extracted successfully");
    
    // Process the extracted text to identify materials, standards and specifications
    const extractedData = processExtractedText(extractedText);
    
    console.log("OCR processing completed successfully");
    
    return new Response(JSON.stringify({ 
      success: true,
      data: extractedData 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("OCR processing error:", error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Function to process and structure the extracted OCR text
function processExtractedText(extractedData: any) {
  // If OpenAI already returned structured data in our format, use it directly
  if (extractedData.materials && extractedData.standards && extractedData.specifications) {
    return extractedData;
  }
  
  // Otherwise, create a default structure and populate from the text
  const result = {
    materials: [] as Array<{name: string; grade: string; description: string}>,
    standards: [] as Array<{code: string; description: string}>,
    specifications: {} as {[key: string]: string}
  };
  
  // Extract materials if present in the OpenAI response
  if (extractedData.materials || extractedData.material_list) {
    const materialsList = extractedData.materials || extractedData.material_list || [];
    result.materials = Array.isArray(materialsList) ? materialsList.map((material: any) => {
      return {
        name: material.name || material.type || "Unknown Material",
        grade: material.grade || material.quality || "",
        description: material.description || material.details || ""
      };
    }) : [];
  }
  
  // Extract standards if present
  if (extractedData.standards || extractedData.codes) {
    const standardsList = extractedData.standards || extractedData.codes || [];
    result.standards = Array.isArray(standardsList) ? standardsList.map((standard: any) => {
      return {
        code: standard.code || standard.number || "Unknown Standard",
        description: standard.description || standard.details || ""
      };
    }) : [];
  }
  
  // Extract specifications if present
  if (extractedData.specifications || extractedData.specs) {
    const specs = extractedData.specifications || extractedData.specs || {};
    
    // Handle both object and array formats
    if (Array.isArray(specs)) {
      specs.forEach((spec: any) => {
        if (spec.key && spec.value) {
          result.specifications[spec.key] = spec.value;
        }
      });
    } else {
      // It's an object, copy properties
      result.specifications = { ...specs };
    }
  }
  
  // Add some default specifications sections if missing
  const defaultSections = ['foundation', 'walls', 'flooring', 'roofing'];
  defaultSections.forEach(section => {
    if (!result.specifications[section]) {
      // Try to find content related to this section in the raw text
      const sectionContent = findSectionContent(extractedData, section);
      if (sectionContent) {
        result.specifications[section] = sectionContent;
      }
    }
  });
  
  return result;
}

// Helper function to find content related to specific sections in raw text
function findSectionContent(data: any, sectionName: string): string {
  // Look through all properties for mentions of the section
  let content = "";
  
  // First try to find a direct property match
  if (data[sectionName]) {
    return data[sectionName];
  }
  
  // Look for section in the text content
  if (data.text || data.content || data.fullText) {
    const textContent = data.text || data.content || data.fullText;
    const regex = new RegExp(`${sectionName}[:\\s]+(.*?)(?=\\n\\n|\\n[A-Z]|$)`, 'i');
    const match = textContent.match(regex);
    if (match && match[1]) {
      content = match[1].trim();
    }
  }
  
  // Default placeholder if not found
  if (!content) {
    const defaults: {[key: string]: string} = {
      'foundation': "Standard concrete foundation per engineering specs",
      'walls': "Brick masonry with cement mortar",
      'flooring': "Ceramic tile flooring on cement base",
      'roofing': "RCC slab with waterproofing"
    };
    content = defaults[sectionName] || "Standard construction specifications";
  }
  
  return content;
}
