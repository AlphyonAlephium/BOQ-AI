
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Process specification document using OCR with OpenAI Vision
export const processSpecification = async (fileUrl: string, fileName: string) => {
  try {
    console.log("Sending specification to OCR processing function:", fileName);
    const { data, error } = await supabase.functions.invoke('ocr-processing', {
      body: { fileUrl, fileName }
    });
    
    if (error) {
      console.error('OCR processing error:', error);
      toast({
        title: "OCR Processing Error",
        description: `Error processing document: ${error.message}`,
        variant: "destructive"
      });
      throw new Error(`OCR processing failed: ${error.message}`);
    }
    
    console.log("OCR processing response:", data);
    
    if (!data) {
      console.error('OCR processing failed: No data returned');
      toast({
        title: "OCR Processing Failed",
        description: "No data returned from OCR processing",
        variant: "destructive"
      });
      throw new Error("OCR processing failed: No data returned");
    }
    
    return data;
  } catch (error) {
    console.error('Error in processSpecification:', error);
    throw error;
  }
};

// Analyze drawing to extract measurements using OpenAI Vision
export const analyzeDrawing = async (fileUrl: string, fileName: string) => {
  try {
    console.log("Sending drawing to analysis function:", fileName);
    const { data, error } = await supabase.functions.invoke('drawing-analysis', {
      body: { fileUrl, fileName }
    });
    
    if (error) {
      console.error('Drawing analysis error:', error);
      toast({
        title: "Drawing Analysis Error",
        description: `Error analyzing drawing: ${error.message}`,
        variant: "destructive"
      });
      throw new Error(`Drawing analysis failed: ${error.message}`);
    }
    
    console.log("Drawing analysis response:", data);
    
    if (!data) {
      console.error('Drawing analysis failed: No data returned');
      toast({
        title: "Drawing Analysis Failed",
        description: "No data returned from drawing analysis",
        variant: "destructive"
      });
      throw new Error("Drawing analysis failed: No data returned");
    }
    
    return data;
  } catch (error) {
    console.error('Error in analyzeDrawing:', error);
    throw error;
  }
};

// Generate BOQ from processed data
export const generateBoq = async (ocrData: any, drawingData: any, projectName: string) => {
  try {
    console.log("Generating BOQ for project:", projectName);
    console.log("OCR Data:", ocrData);
    console.log("Drawing Data:", drawingData);
    
    // Fix the data structure before passing to the edge function
    // Extract just data object if it has a nested data property
    const processedDrawingData = drawingData.data ? drawingData.data : drawingData;
    const processedOcrData = ocrData;
    
    const { data, error } = await supabase.functions.invoke('generate-boq', {
      body: { 
        ocrData: processedOcrData, 
        drawingData: processedDrawingData, 
        projectName 
      }
    });
    
    if (error) {
      console.error('BOQ generation error:', error);
      toast({
        title: "BOQ Generation Error",
        description: `Error generating BOQ: ${error.message}`,
        variant: "destructive"
      });
      throw new Error(`BOQ generation failed: ${error.message}`);
    }
    
    console.log("BOQ generation response:", data);
    
    if (!data) {
      console.error('BOQ generation failed: No data returned');
      toast({
        title: "BOQ Generation Failed",
        description: "No data returned from BOQ generation",
        variant: "destructive"
      });
      throw new Error("BOQ generation failed: No data returned");
    }
    
    return data;
  } catch (error) {
    console.error('Error in generateBoq:', error);
    throw error;
  }
};
