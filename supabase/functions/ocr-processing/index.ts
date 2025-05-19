
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
    
    // Connect to Google Cloud Vision API for OCR processing
    const apiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY');
    if (!apiKey) {
      throw new Error('Google Cloud API key not configured');
    }
    
    // Convert blob to base64
    const fileBuffer = await fileBlob.arrayBuffer();
    const base64File = btoa(
      new Uint8Array(fileBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
    
    // Prepare request for Google Cloud Vision API
    const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    const requestBody = {
      requests: [
        {
          image: {
            content: base64File
          },
          features: [
            {
              type: "DOCUMENT_TEXT_DETECTION",
              maxResults: 50
            }
          ]
        }
      ]
    };
    
    // Make request to Google Cloud Vision
    console.log("Sending request to Google Cloud Vision API");
    const visionResponse = await fetch(visionApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!visionResponse.ok) {
      const errorText = await visionResponse.text();
      console.error("Vision API error response:", errorText);
      throw new Error(`Google Cloud Vision API error: ${visionResponse.status} ${visionResponse.statusText}`);
    }
    
    const visionResult = await visionResponse.json();
    
    if (!visionResult.responses || visionResult.responses.length === 0) {
      throw new Error('No text detected in the document');
    }
    
    const detectedText = visionResult.responses[0].fullTextAnnotation?.text || '';
    console.log("OCR text extracted successfully, length:", detectedText.length);
    
    // Process the extracted text to identify materials, standards and specifications
    // This section parses the raw OCR text into structured data
    const extractedData = processExtractedText(detectedText);
    
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
function processExtractedText(text: string) {
  // Implementing simple pattern matching for construction document processing
  // In a production environment, this would be more sophisticated with NLP or ML
  
  const materials: Array<{name: string; grade: string; description: string}> = [];
  const standards: Array<{code: string; description: string}> = [];
  const specifications: {[key: string]: string} = {};
  
  // Extract materials (looking for patterns like "Material: X, Grade: Y")
  const materialMatches = text.match(/(?:Material|Materials):\s*(.*?)(?:\n|$)/gi) || [];
  materialMatches.forEach(match => {
    const materialName = match.replace(/(?:Material|Materials):\s*/i, '').trim();
    const gradeMatch = text.match(new RegExp(`${materialName}.*?Grade:\\s*(.*?)(?:\\n|$)`, 'i'));
    const descMatch = text.match(new RegExp(`${materialName}.*?Description:\\s*(.*?)(?:\\n|$)`, 'i'));
    
    materials.push({
      name: materialName,
      grade: gradeMatch ? gradeMatch[1].trim() : '',
      description: descMatch ? descMatch[1].trim() : ''
    });
  });
  
  // Add default materials if none found (for fallback)
  if (materials.length === 0) {
    if (text.includes('concrete') || text.includes('Concrete')) {
      materials.push({ name: "Concrete", grade: text.includes('M25') ? 'M25' : 'Standard', description: "Ready mix concrete" });
    }
    if (text.includes('steel') || text.includes('Steel')) {
      materials.push({ name: "Steel", grade: text.includes('Fe500') ? 'Fe500' : 'Standard', description: "Reinforcement steel" });
    }
    if (text.includes('brick') || text.includes('Brick')) {
      materials.push({ name: "Bricks", grade: "Class A", description: "Clay bricks for masonry work" });
    }
  }
  
  // Extract standards (looking for codes like "IS 456:2000" or "ASTM")
  const standardMatches = text.match(/(?:IS|ASTM|BS|EN)\s*\d+(?:[-:]\d+)?/g) || [];
  standardMatches.forEach(code => {
    // Try to find a description following the standard code
    const descMatch = text.match(new RegExp(`${code}\\s*[-–—]\\s*(.*?)(?:\\.|\\n|$)`));
    standards.push({
      code: code.trim(),
      description: descMatch ? descMatch[1].trim() : "Construction standard"
    });
  });
  
  // Add default standards if none found (for fallback)
  if (standards.length === 0) {
    if (text.includes('concrete') || text.includes('Concrete')) {
      standards.push({ code: "IS 456:2000", description: "Plain and reinforced concrete - Code of practice" });
    }
    if (text.includes('steel') || text.includes('Steel')) {
      standards.push({ code: "IS 800:2007", description: "General construction in steel - Code of practice" });
    }
  }
  
  // Extract specifications for different building elements
  const specSections = [
    { key: 'foundation', patterns: ['foundation', 'Foundation', 'footing', 'Footing'] },
    { key: 'walls', patterns: ['wall', 'Wall', 'masonry', 'Masonry'] },
    { key: 'flooring', patterns: ['floor', 'Floor', 'Flooring', 'flooring'] },
    { key: 'roofing', patterns: ['roof', 'Roof', 'ceiling', 'Ceiling'] }
  ];
  
  specSections.forEach(section => {
    for (const pattern of section.patterns) {
      const matches = text.match(new RegExp(`${pattern}.*?(?:\\.|\\n)`, 'g'));
      if (matches && matches.length > 0) {
        // Use the longest match as it likely has more details
        const bestMatch = matches.reduce((a, b) => a.length > b.length ? a : b);
        specifications[section.key] = bestMatch.trim();
        break;
      }
    }
    
    // If no match found for this section, add a placeholder based on text context
    if (!specifications[section.key]) {
      if (section.key === 'foundation' && (text.includes('RCC') || text.includes('concrete'))) {
        specifications[section.key] = "RCC foundation with concrete";
      } else if (section.key === 'walls' && text.includes('brick')) {
        specifications[section.key] = "Brick masonry walls with cement mortar";
      } else if (section.key === 'flooring' && text.includes('tile')) {
        specifications[section.key] = "Tiled flooring";
      } else if (section.key === 'roofing' && text.includes('RCC')) {
        specifications[section.key] = "RCC slab roofing";
      }
    }
  });
  
  return {
    materials,
    standards,
    specifications
  };
}
