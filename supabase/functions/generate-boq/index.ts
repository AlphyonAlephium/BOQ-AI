
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
    const { ocrData, drawingData, projectName, debug } = await req.json();
    
    if (!ocrData || !drawingData) {
      throw new Error('OCR data and drawing data are required');
    }

    console.log(`Generating BOQ for project: ${projectName}`);
    if (debug) {
      console.log("Debug mode enabled for BOQ generation");
      console.log("OCR Data:", JSON.stringify(ocrData).substring(0, 500) + "...");
      console.log("Drawing Data:", JSON.stringify(drawingData).substring(0, 500) + "...");
    }
    
    // Ensure the data structure is correct
    let dimensions, elements, rooms;
    
    if (drawingData.dimensions) {
      dimensions = drawingData.dimensions;
      elements = drawingData.elements;
      rooms = drawingData.rooms;
    } else if (drawingData.data && drawingData.data.dimensions) {
      dimensions = drawingData.data.dimensions;
      elements = drawingData.data.elements;
      rooms = drawingData.data.rooms;
    } else {
      console.error("Invalid drawing data structure, using fallback data");
      if (debug) {
        return new Response(
          JSON.stringify({
            error: "Invalid drawing data structure",
            details: { drawingData },
            boq: getFallbackBoqData(projectName, ocrData).boq
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Return fallback BOQ data
      return new Response(
        JSON.stringify(getFallbackBoqData(projectName, ocrData)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if we have the required data
    if (!dimensions || !dimensions.buildingFootprint) {
      console.error("Missing required drawing data (buildingFootprint), using fallback data");
      if (debug) {
        return new Response(
          JSON.stringify({
            error: "Missing required drawing data (buildingFootprint)",
            details: { dimensions },
            boq: getFallbackBoqData(projectName, ocrData).boq
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Return fallback BOQ data
      return new Response(
        JSON.stringify(getFallbackBoqData(projectName, ocrData)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Generate BOQ using AI or calculate based on the drawing and specs
    // Try to use OpenAI if API key is available
    const openAIKey = Deno.env.get("OPENAI_API_KEY");
    
    if (!openAIKey) {
      console.log("OpenAI API key not available, using fallback BOQ data");
      return new Response(
        JSON.stringify(getFallbackBoqData(projectName, ocrData)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Test if OpenAI API key works
    if (debug) {
      try {
        console.log("Testing OpenAI API key...");
        const testResponse = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${openAIKey}`
          }
        });
        
        if (testResponse.ok) {
          console.log("OpenAI API key is valid");
        } else {
          const errorData = await testResponse.json();
          console.error("OpenAI API key validation failed:", errorData);
          return new Response(
            JSON.stringify({
              error: "OpenAI API key validation failed",
              details: errorData,
              boq: getFallbackBoqData(projectName, ocrData).boq
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch (testError) {
        console.error("Error testing OpenAI API key:", testError);
      }
    }
    
    try {
      // Prepare the prompt for OpenAI
      const prompt = `Generate a detailed bill of quantities (BOQ) for a building project with the following specifications:
      
Project: ${projectName}

Building Dimensions:
- Width: ${dimensions.buildingFootprint.width} ${dimensions.buildingFootprint.unit}
- Length: ${dimensions.buildingFootprint.length} ${dimensions.buildingFootprint.unit}
- Floor Height: ${dimensions.floorHeight} ${dimensions.buildingFootprint.unit}
- Total Height: ${dimensions.totalHeight} ${dimensions.buildingFootprint.unit}

Building Elements:
${elements.map(elem => `- ${elem.type}: ${elem.area || elem.length || elem.count || 'N/A'} ${elem.unit || ''}`).join('\n')}

Materials:
${ocrData.materials ? ocrData.materials.map(m => `- ${m.name} (${m.grade}): ${m.description}`).join('\n') : 'Standard materials'}

Specifications:
${ocrData.specifications ? Object.entries(ocrData.specifications).map(([key, value]) => `- ${key}: ${value}`).join('\n') : 'Standard specifications'}

Create a detailed bill of quantities with the following sections:
1. Earthwork and Foundation
2. Concrete Works
3. Masonry Works
4. Finishing Works
5. Doors and Windows
6. Plumbing Works
7. Electrical Works

For each section, include:
- Reference number
- Detailed description of work items
- Quantities with appropriate units
- Unit rates (in USD)
- Rate references
- Total amounts

Format as a structured JSON array of sections, where each section has items with ref, description, quantity, unit, rate, rateRef, and total fields.`;

      // Call OpenAI
      console.log("Calling OpenAI to generate BOQ...");
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { 
              role: "system", 
              content: "You are a construction estimator that creates detailed BOQs. Provide only JSON formatted response." 
            },
            { 
              role: "user", 
              content: prompt 
            }
          ],
          temperature: 0.7,
          response_format: { type: "json_object" }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI API error:", errorText);
        
        if (debug) {
          return new Response(
            JSON.stringify({
              error: `OpenAI API error: ${response.status} ${response.statusText}`,
              details: errorText,
              boq: getFallbackBoqData(projectName, ocrData).boq
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        console.error("OpenAI API error, using fallback data");
        return new Response(
          JSON.stringify(getFallbackBoqData(projectName, ocrData)),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const openAIResult = await response.json();
      if (debug) {
        console.log("OpenAI response received");
      }
      
      const content = openAIResult.choices[0].message.content;
      
      // Parse the JSON response from OpenAI
      let boqData;
      try {
        boqData = JSON.parse(content);
        
        if (debug) {
          console.log("Successfully parsed OpenAI response as JSON");
        }
        
        // If the structure doesn't match what we expect, use the fallback
        if (!boqData.boq && !Array.isArray(boqData)) {
          console.error("Invalid BOQ structure from OpenAI, using fallback data");
          if (debug) {
            return new Response(
              JSON.stringify({
                error: "Invalid BOQ structure from OpenAI",
                openAIResponse: boqData,
                boq: getFallbackBoqData(projectName, ocrData).boq
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          return new Response(
            JSON.stringify(getFallbackBoqData(projectName, ocrData)),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Ensure proper structure
        if (Array.isArray(boqData)) {
          boqData = { boq: boqData };
        } else if (boqData.sections) {
          boqData = { boq: boqData.sections };
        }
        
      } catch (e) {
        console.error("Error parsing OpenAI response:", e);
        if (debug) {
          return new Response(
            JSON.stringify({
              error: "Failed to parse OpenAI response",
              openAIResponseContent: content,
              boq: getFallbackBoqData(projectName, ocrData).boq
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(
          JSON.stringify(getFallbackBoqData(projectName, ocrData)),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log("BOQ generation complete");
      
      return new Response(
        JSON.stringify(boqData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      
    } catch (openaiError) {
      console.error("OpenAI processing error:", openaiError);
      console.log("Using fallback BOQ data");
      
      if (debug) {
        return new Response(
          JSON.stringify({
            error: openaiError.message,
            boq: getFallbackBoqData(projectName, ocrData).boq
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // If OpenAI fails or no API key, use fallback data
    return new Response(
      JSON.stringify(getFallbackBoqData(projectName, ocrData)),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("BOQ generation error:", error);
    
    // Always return a valid response, even in case of errors
    return new Response(
      JSON.stringify({ 
        error: error.message,
        boq: getFallbackBoqData("Unknown Project", { specifications: {} }).boq 
      }),
      { 
        status: 200, // Use 200 even for errors so frontend can handle it
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Function to generate fallback BOQ data
function getFallbackBoqData(projectName: string, ocrData: any) {
  console.log("Generating fallback BOQ data for:", projectName);
  
  // Extract some data from ocrData if available to make the fallback data more relevant
  const hasFoundation = ocrData?.specifications?.foundation || "Standard concrete foundation";
  const hasWalls = ocrData?.specifications?.walls || "Brick masonry walls";
  const hasFlooring = ocrData?.specifications?.flooring || "Ceramic tile flooring";
  const hasRoofing = ocrData?.specifications?.roofing || "RCC slab roofing";
  
  return {
    boq: [
      {
        section: "1. Earthwork and Foundation",
        items: [
          {
            ref: "1.1",
            description: "Site clearing and leveling",
            quantity: "280.28",
            unit: "m²",
            rate: "3.50",
            rateRef: "R-EW01",
            total: "980.98"
          },
          {
            ref: "1.2",
            description: "Excavation for foundation trenches",
            quantity: "33.60",
            unit: "m³",
            rate: "12.25",
            rateRef: "R-EW02",
            total: "411.60"
          },
          {
            ref: "1.3",
            description: hasFoundation,
            quantity: "28.03",
            unit: "m³",
            rate: "185.75",
            rateRef: "R-FD01",
            total: "5,205.57"
          }
        ]
      },
      {
        section: "2. Concrete Works",
        items: [
          {
            ref: "2.1",
            description: "RCC for columns M25",
            quantity: "14.50",
            unit: "m³",
            rate: "210.25",
            rateRef: "R-CC01",
            total: "3,048.63"
          },
          {
            ref: "2.2",
            description: "RCC for beams and lintels M25",
            quantity: "18.30",
            unit: "m³",
            rate: "205.50",
            rateRef: "R-CC02",
            total: "3,760.65"
          },
          {
            ref: "2.3",
            description: "RCC for slabs M25",
            quantity: "42.04",
            unit: "m³",
            rate: "198.75",
            rateRef: "R-CC03",
            total: "8,355.45"
          }
        ]
      },
      {
        section: "3. Masonry Works",
        items: [
          {
            ref: "3.1",
            description: hasWalls,
            quantity: "67.20",
            unit: "m²",
            rate: "48.50",
            rateRef: "R-MW01",
            total: "3,259.20"
          },
          {
            ref: "3.2",
            description: "Internal partition walls 115mm thick",
            quantity: "42.80",
            unit: "m²",
            rate: "42.75",
            rateRef: "R-MW02",
            total: "1,829.70"
          }
        ]
      },
      {
        section: "4. Finishing Works",
        items: [
          {
            ref: "4.1",
            description: "Internal wall plastering",
            quantity: "220.00",
            unit: "m²",
            rate: "12.35",
            rateRef: "R-FW01",
            total: "2,717.00"
          },
          {
            ref: "4.2",
            description: "External wall plastering",
            quantity: "134.40",
            unit: "m²",
            rate: "14.85",
            rateRef: "R-FW02",
            total: "1,995.84"
          },
          {
            ref: "4.3",
            description: hasFlooring,
            quantity: "280.28",
            unit: "m²",
            rate: "45.25",
            rateRef: "R-FW03",
            total: "12,682.67"
          },
          {
            ref: "4.4",
            description: "Painting - Interior walls",
            quantity: "220.00",
            unit: "m²",
            rate: "8.75",
            rateRef: "R-FW04",
            total: "1,925.00"
          },
          {
            ref: "4.5",
            description: "Painting - Exterior walls",
            quantity: "134.40",
            unit: "m²",
            rate: "9.50",
            rateRef: "R-FW05",
            total: "1,276.80"
          }
        ]
      },
      {
        section: "5. Doors and Windows",
        items: [
          {
            ref: "5.1",
            description: "Wooden doors including frames and hardware",
            quantity: "8",
            unit: "nos",
            rate: "325.00",
            rateRef: "R-DW01",
            total: "2,600.00"
          },
          {
            ref: "5.2",
            description: "Aluminum windows with glass",
            quantity: "12",
            unit: "nos",
            rate: "275.50",
            rateRef: "R-DW02",
            total: "3,306.00"
          }
        ]
      },
      {
        section: "6. Plumbing Works",
        items: [
          {
            ref: "6.1",
            description: "Bathroom fittings and fixtures",
            quantity: "2",
            unit: "set",
            rate: "1,250.00",
            rateRef: "R-PL01",
            total: "2,500.00"
          },
          {
            ref: "6.2",
            description: "Kitchen sink with fixtures",
            quantity: "1",
            unit: "set",
            rate: "750.00",
            rateRef: "R-PL02",
            total: "750.00"
          },
          {
            ref: "6.3",
            description: "Water supply piping",
            quantity: "75.00",
            unit: "m",
            rate: "18.50",
            rateRef: "R-PL03",
            total: "1,387.50"
          },
          {
            ref: "6.4",
            description: "Drainage piping",
            quantity: "45.00",
            unit: "m",
            rate: "22.75",
            rateRef: "R-PL04",
            total: "1,023.75"
          }
        ]
      },
      {
        section: "7. Roofing",
        items: [
          {
            ref: "7.1",
            description: hasRoofing,
            quantity: "280.28",
            unit: "m²",
            rate: "65.25",
            rateRef: "R-RF01",
            total: "18,288.27"
          },
          {
            ref: "7.2",
            description: "Waterproofing treatment",
            quantity: "280.28",
            unit: "m²",
            rate: "18.75",
            rateRef: "R-RF02",
            total: "5,255.25"
          }
        ]
      },
      {
        section: "8. Electrical Works",
        items: [
          {
            ref: "8.1",
            description: "Electrical wiring",
            quantity: "280.28",
            unit: "m²",
            rate: "28.50",
            rateRef: "R-EL01",
            total: "7,987.98"
          },
          {
            ref: "8.2",
            description: "Light fixtures",
            quantity: "24",
            unit: "nos",
            rate: "45.75",
            rateRef: "R-EL02",
            total: "1,098.00"
          },
          {
            ref: "8.3",
            description: "Switches and sockets",
            quantity: "32",
            unit: "nos",
            rate: "22.50",
            rateRef: "R-EL03",
            total: "720.00"
          },
          {
            ref: "8.4",
            description: "Distribution board and MCBs",
            quantity: "1",
            unit: "set",
            rate: "450.00",
            rateRef: "R-EL04",
            total: "450.00"
          }
        ]
      }
    ]
  };
}
