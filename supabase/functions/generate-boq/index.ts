
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OCRData {
  materials: Array<{
    name: string;
    grade: string;
    description: string;
  }>;
  standards: Array<{
    code: string;
    description: string;
  }>;
  specifications: {
    [key: string]: string;
  };
}

interface DrawingData {
  dimensions: {
    buildingFootprint: { width: number; length: number; unit: string };
    floorHeight: number;
    totalHeight: number;
  };
  elements: Array<{
    type: string;
    [key: string]: any;
  }>;
  rooms: Array<{
    name: string;
    area: number;
    unit: string;
  }>;
}

interface BoqItem {
  ref: string;
  description: string;
  quantity: string;
  unit: string;
  rate: string;
  rateRef: string;
  total: string;
}

interface BoqSection {
  section: string;
  items: BoqItem[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ocrData, drawingData, projectName } = await req.json();
    
    if (!ocrData || !drawingData) {
      throw new Error('Both OCR data and drawing data are required');
    }

    console.log(`Generating BOQ for project: ${projectName || 'unknown'}`);
    
    // In a real implementation, this would use sophisticated algorithms to calculate quantities
    // based on the extracted measurements and match them with specifications
    // For the MVP, we'll generate a structured BOQ based on the mock data
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const typedOcrData = ocrData as OCRData;
    const typedDrawingData = drawingData as DrawingData;
    
    // Generate BOQ sections and items
    const boq: BoqSection[] = [
      {
        section: 'SITE WORK',
        items: [
          {
            ref: 'A',
            description: 'Site Clearance.\nRemoval of debris, rubbish, vegetation, and the like prior to the commencement of excavation works; including disposal to approved location',
            quantity: typedDrawingData.dimensions.buildingFootprint.width * typedDrawingData.dimensions.buildingFootprint.length + ' m²',
            unit: 'Item',
            rate: '2,500.00',
            rateRef: 'SM01',
            total: '2,500.00'
          },
          {
            ref: 'B',
            description: 'Anti-termite soil treatment; to horizontal and sloping surfaces',
            quantity: typedDrawingData.dimensions.buildingFootprint.width * typedDrawingData.dimensions.buildingFootprint.length + ' m²',
            unit: 'm²',
            rate: '120.00',
            rateRef: 'SM02',
            total: formatCurrency((typedDrawingData.dimensions.buildingFootprint.width * typedDrawingData.dimensions.buildingFootprint.length * 120).toString())
          }
        ]
      },
      {
        section: 'CONCRETE WORKS',
        items: [
          {
            ref: 'C',
            description: `Foundation Concrete\nFormwork for foundations; all sizes with ${typedOcrData.specifications.foundation}`,
            quantity: (typedDrawingData.elements.find(e => e.type === 'foundation')?.area || 0) + ' m²',
            unit: 'm²',
            rate: '350.00',
            rateRef: 'CW01',
            total: formatCurrency(((typedDrawingData.elements.find(e => e.type === 'foundation')?.area || 0) * 350).toString())
          },
          {
            ref: 'D',
            description: `Reinforced concrete; grade ${typedOcrData.materials.find(m => m.name === "Concrete")?.grade || "M25"}\nIn foundations`,
            quantity: (typedDrawingData.elements.find(e => e.type === 'foundation')?.area || 0) * (typedDrawingData.elements.find(e => e.type === 'foundation')?.depth || 1) / 10 + ' m³',
            unit: 'm³',
            rate: '5,800.00',
            rateRef: 'CW02',
            total: formatCurrency(((typedDrawingData.elements.find(e => e.type === 'foundation')?.area || 0) * (typedDrawingData.elements.find(e => e.type === 'foundation')?.depth || 1) / 10 * 5800).toString())
          }
        ]
      },
      {
        section: 'MASONRY',
        items: [
          {
            ref: 'E',
            description: `Blockwork\n${typedOcrData.specifications.walls || "Brick masonry with cement mortar"}`,
            quantity: ((typedDrawingData.elements.find(e => e.type === 'externalWalls')?.length || 0) + (typedDrawingData.elements.find(e => e.type === 'internalWalls')?.length || 0)) * (typedDrawingData.dimensions.floorHeight || 3) + ' m²',
            unit: 'm²',
            rate: '450.00',
            rateRef: 'MS01',
            total: formatCurrency((((typedDrawingData.elements.find(e => e.type === 'externalWalls')?.length || 0) + (typedDrawingData.elements.find(e => e.type === 'internalWalls')?.length || 0)) * (typedDrawingData.dimensions.floorHeight || 3) * 450).toString())
          }
        ]
      },
      {
        section: 'FLOORING',
        items: [
          {
            ref: 'F',
            description: `Floor Finish\n${typedOcrData.specifications.flooring || "Cement concrete flooring"}`,
            quantity: (typedDrawingData.elements.find(e => e.type === 'floor')?.area || 0) + ' m²',
            unit: 'm²',
            rate: '750.00',
            rateRef: 'FL01',
            total: formatCurrency(((typedDrawingData.elements.find(e => e.type === 'floor')?.area || 0) * 750).toString())
          }
        ]
      },
      {
        section: 'ROOFING',
        items: [
          {
            ref: 'G',
            description: `Roof Construction\n${typedOcrData.specifications.roofing || "RCC roof slab"}`,
            quantity: (typedDrawingData.elements.find(e => e.type === 'roof')?.area || 0) + ' m²',
            unit: 'm²',
            rate: '1,200.00',
            rateRef: 'RF01',
            total: formatCurrency(((typedDrawingData.elements.find(e => e.type === 'roof')?.area || 0) * 1200).toString())
          }
        ]
      }
    ];
    
    console.log("BOQ generation completed successfully");
    
    return new Response(JSON.stringify({ 
      success: true,
      boq 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("BOQ generation error:", error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Utility function to format currency values
function formatCurrency(value: string): string {
  const numberValue = parseFloat(value.replace(/,/g, ''));
  return numberValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
