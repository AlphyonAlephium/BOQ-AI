
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DrawingUploadTab } from './tabs/DrawingUploadTab';
import { SpecificationUploadTab } from './tabs/SpecificationUploadTab';
import { GenerateBoqTab } from './tabs/GenerateBoqTab';
import { BoqSection } from '@/types/boq';

export const TabInterface = () => {
  const [activeTab, setActiveTab] = useState('drawings');
  const [drawingFile, setDrawingFile] = useState<File | null>(null);
  const [drawingFileUrl, setDrawingFileUrl] = useState<string | undefined>(undefined);
  const [drawingFileType, setDrawingFileType] = useState<string | undefined>(undefined);
  const [drawingFilePath, setDrawingFilePath] = useState<string | undefined>(undefined);
  
  const [specFile, setSpecFile] = useState<File | null>(null);
  const [specFileUrl, setSpecFileUrl] = useState<string | undefined>(undefined);
  const [specFileType, setSpecFileType] = useState<string | undefined>(undefined);
  const [specFilePath, setSpecFilePath] = useState<string | undefined>(undefined);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBoqGenerated, setIsBoqGenerated] = useState(false);
  const [generatedBoq, setGeneratedBoq] = useState<BoqSection[]>([]);
  
  const handleDrawingFileChange = (file: File | null, fileUrl?: string, filePath?: string, fileType?: string) => {
    setDrawingFile(file);
    setDrawingFileUrl(fileUrl);
    setDrawingFileType(fileType);
    setDrawingFilePath(filePath);
    
    // Auto-advance to specs tab when drawing is uploaded
    if (file) {
      setTimeout(() => {
        setActiveTab('specs');
      }, 1000);
    }
  };
  
  const handleSpecFileChange = (file: File | null, fileUrl?: string, filePath?: string, fileType?: string) => {
    setSpecFile(file);
    setSpecFileUrl(fileUrl);
    setSpecFileType(fileType);
    setSpecFilePath(filePath);
    
    // Auto-advance to generate tab when spec is uploaded
    if (file) {
      setTimeout(() => {
        setActiveTab('generate');
      }, 1000);
    }
  };
  
  const handleGenerateBoq = async () => {
    if (!drawingFile || !specFile) {
      toast({
        title: "Files required",
        description: "Please upload both drawing and specification files.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(async () => {
      try {
        // Generate sample BOQ data (in a real implementation, this would come from AI processing)
        const sampleBoqData = [
          {
            section: 'SITE WORK',
            items: [
              {
                ref: 'A',
                description: 'Site Clearance.\nRemoval of debris, rubbish, vegetation, any existing foundation and services and the like prior to the commencement of excavation works; including disposal to approved location',
                quantity: '1',
                unit: 'Item',
                rate: '2,500.00',
                rateRef: 'SM01',
                total: '2,500.00'
              },
              {
                ref: 'B',
                description: 'Termite Control\nAnti-termite soil treatment; to horizontal and sloping surfaces',
                quantity: '31.62',
                unit: 'm²',
                rate: '120.00',
                rateRef: 'SM02',
                total: '3,794.40'
              }
            ]
          },
          {
            section: 'CONCRETE WORKS',
            items: [
              {
                ref: 'C',
                description: 'Foundation Concrete\nFormwork for foundations; all sizes',
                quantity: '4.8',
                unit: 'm²',
                rate: '350.00',
                rateRef: 'CW01',
                total: '1,680.00'
              },
              {
                ref: 'D',
                description: 'Reinforced concrete; grade 30\nIn foundations',
                quantity: '3.2',
                unit: 'm³',
                rate: '5,800.00',
                rateRef: 'CW02',
                total: '18,560.00'
              }
            ]
          },
          {
            section: 'MASONRY',
            items: [
              {
                ref: 'E',
                description: 'Blockwork\nNormal hollow concrete block; strength 7.0 N/mm²; in cement mortar (1:3)',
                quantity: '42.5',
                unit: 'm²',
                rate: '450.00',
                rateRef: 'MS01',
                total: '19,125.00'
              }
            ]
          }
        ];
        
        setGeneratedBoq(sampleBoqData);
        setIsBoqGenerated(true);
        
        // Save project to database
        const projectName = drawingFile.name.split('.')[0];
        
        const { data, error } = await supabase
          .from('plans')
          .insert([
            {
              name: projectName,
              type: 'BoQ',
              file_url: drawingFileUrl,
              file_path: drawingFilePath,
              file_type: drawingFileType,
              spec_url: specFileUrl,
              spec_path: specFilePath,
              spec_type: specFileType
            }
          ])
          .select();
          
        if (error) {
          console.error('Error saving project:', error);
          toast({
            title: "Error",
            description: "Failed to save the project",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success!",
            description: "Bill of quantities generated successfully",
          });
        }
      } catch (error) {
        console.error('Failed to generate BoQ:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }, 3000);
  };
  
  const handleExportPdf = () => {
    toast({
      title: "Export Initiated",
      description: "Your BOQ is being exported as PDF",
    });
    // In a real implementation, this would trigger a PDF generation and download
  };
  
  const handleExportExcel = () => {
    toast({
      title: "Export Initiated",
      description: "Your BOQ is being exported as Excel",
    });
    // In a real implementation, this would trigger an Excel generation and download
  };
  
  const formatCurrency = (value: string) => {
    const numberValue = parseFloat(value.replace(/,/g, ''));
    return numberValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 w-full mb-8">
        <TabsTrigger value="drawings" className="text-lg py-3">
          Upload Drawings
        </TabsTrigger>
        <TabsTrigger value="specs" className="text-lg py-3">
          Upload Specifications
        </TabsTrigger>
        <TabsTrigger value="generate" className="text-lg py-3">
          Generate BOQ
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="drawings" className="mt-4">
        <DrawingUploadTab 
          drawingFile={drawingFile}
          onDrawingFileChange={handleDrawingFileChange}
        />
      </TabsContent>
      
      <TabsContent value="specs" className="mt-4">
        <SpecificationUploadTab
          specFile={specFile}
          onSpecFileChange={handleSpecFileChange}
        />
      </TabsContent>
      
      <TabsContent value="generate" className="mt-4">
        <GenerateBoqTab
          drawingFile={drawingFile}
          specFile={specFile}
          isProcessing={isProcessing}
          isBoqGenerated={isBoqGenerated}
          generatedBoq={generatedBoq}
          handleGenerateBoq={handleGenerateBoq}
          handleExportPdf={handleExportPdf}
          handleExportExcel={handleExportExcel}
          formatCurrency={formatCurrency}
        />
      </TabsContent>
    </Tabs>
  );
};
