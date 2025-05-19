
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
    
    if (data && !data.success) {
      console.error('OCR processing failed:', data.error);
      toast({
        title: "OCR Processing Failed",
        description: data.error || "Failed to extract text from document",
        variant: "destructive"
      });
      throw new Error(`OCR processing failed: ${data.error}`);
    }
    
    return data.data;
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
    
    if (data && !data.success) {
      console.error('Drawing analysis failed:', data.error);
      toast({
        title: "Drawing Analysis Failed",
        description: data.error || "Failed to analyze drawing",
        variant: "destructive"
      });
      throw new Error(`Drawing analysis failed: ${data.error}`);
    }
    
    return data.data;
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
      toast({
        title: "BOQ Generation Error",
        description: `Error generating BOQ: ${error.message}`,
        variant: "destructive"
      });
      throw new Error(`BOQ generation failed: ${error.message}`);
    }
    
    if (data && !data.success) {
      console.error('BOQ generation failed:', data.error);
      toast({
        title: "BOQ Generation Failed",
        description: data.error || "Failed to generate BOQ",
        variant: "destructive"
      });
      throw new Error(`BOQ generation failed: ${data.error}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in generateBoq:', error);
    throw error;
  }
};
