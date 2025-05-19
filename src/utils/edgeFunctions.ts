
import { supabase } from "@/integrations/supabase/client";

// Process specification document using OCR with Google Cloud Vision
export const processSpecification = async (fileUrl: string, fileName: string) => {
  try {
    console.log("Sending specification to OCR processing function:", fileName);
    const { data, error } = await supabase.functions.invoke('ocr-processing', {
      body: { fileUrl, fileName }
    });
    
    if (error) {
      console.error('OCR processing error:', error);
      throw new Error(`OCR processing failed: ${error.message}`);
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
      throw new Error(`Drawing analysis failed: ${error.message}`);
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
    const { data, error } = await supabase.functions.invoke('generate-boq', {
      body: { ocrData, drawingData, projectName }
    });
    
    if (error) {
      console.error('BOQ generation error:', error);
      throw new Error(`BOQ generation failed: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in generateBoq:', error);
    throw error;
  }
};
