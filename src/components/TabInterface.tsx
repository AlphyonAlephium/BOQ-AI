
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DrawingUploadTab } from './tabs/DrawingUploadTab';
import { SpecificationUploadTab } from './tabs/SpecificationUploadTab';
import { GenerateBoqTab } from './tabs/GenerateBoqTab';
import { BoqSection } from '@/types/boq';
import { processSpecification, analyzeDrawing, generateBoq } from '@/utils/edgeFunctions';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  
  // Processed data from edge functions
  const [ocrProcessedData, setOcrProcessedData] = useState<any>(null);
  const [drawingProcessedData, setDrawingProcessedData] = useState<any>(null);
  
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
    if (!drawingFile || !specFile || !drawingFileUrl || !specFileUrl) {
      toast({
        title: "Files required",
        description: "Please upload both drawing and specification files.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Process specification document
      toast({
        title: "Processing",
        description: "Extracting data from specification document...",
      });
      
      const ocrResult = await processSpecification(specFileUrl, specFile.name);
      if (!ocrResult.success) {
        throw new Error(ocrResult.error || "Failed to process specification document");
      }
      
      setOcrProcessedData(ocrResult.data);
      
      // Process drawing
      toast({
        title: "Processing",
        description: "Analyzing architectural drawing...",
      });
      
      const drawingResult = await analyzeDrawing(drawingFileUrl, drawingFile.name);
      if (!drawingResult.success) {
        throw new Error(drawingResult.error || "Failed to analyze drawing");
      }
      
      setDrawingProcessedData(drawingResult.data);
      
      // Generate BOQ
      toast({
        title: "Processing",
        description: "Generating Bill of Quantities...",
      });
      
      const boqResult = await generateBoq(
        ocrResult.data,
        drawingResult.data,
        drawingFile.name.split('.')[0]
      );
      
      if (!boqResult.success) {
        throw new Error(boqResult.error || "Failed to generate BOQ");
      }
      
      setGeneratedBoq(boqResult.boq);
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
          title: "Warning",
          description: "BOQ generated successfully, but failed to save the project",
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
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleExportPdf = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      const projectName = drawingFile?.name.split('.')[0] || "Project";
      doc.setFontSize(20);
      doc.text(`Bill of Quantities - ${projectName}`, 14, 22);
      
      // Add date
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
      
      // Define columns for the table
      const tableColumn = ["Ref", "Description", "Quantity", "Unit", "Rate", "Rate Ref", "Total"];
      
      // Create rows array for the PDF table
      const tableRows: any[] = [];
      
      generatedBoq.forEach(section => {
        // Add section header row
        tableRows.push([{
          content: section.section,
          colSpan: 7,
          styles: {
            fontStyle: 'bold',
            fillColor: [240, 240, 240]
          }
        }]);
        
        // Add section items
        section.items.forEach(item => {
          tableRows.push([
            item.ref,
            item.description,
            item.quantity,
            item.unit,
            item.rate,
            item.rateRef,
            item.total
          ]);
        });
      });
      
      // Calculate total
      const totalSum = generatedBoq.reduce((acc, section) => {
        return acc + section.items.reduce((sectionAcc, item) => {
          return sectionAcc + parseFloat(item.total.replace(/,/g, ''));
        }, 0);
      }, 0);
      
      // Add total row
      tableRows.push([
        { content: '', colSpan: 5 },
        { content: 'TOTAL:', styles: { fontStyle: 'bold', halign: 'right' } },
        { content: formatCurrency(totalSum.toString()), styles: { fontStyle: 'bold' } }
      ]);
      
      // Generate table
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        styles: { overflow: 'linebreak' },
        columnStyles: {
          0: { cellWidth: 15 }, // Ref
          1: { cellWidth: 'auto' }, // Description
          2: { cellWidth: 25, halign: 'right' }, // Quantity
          3: { cellWidth: 15 }, // Unit
          4: { cellWidth: 25, halign: 'right' }, // Rate
          5: { cellWidth: 25 }, // Rate Ref
          6: { cellWidth: 30, halign: 'right' }, // Total
        },
        didDrawPage: (data) => {
          // Footer with page number
          const pageCount = doc.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            const pageSize = doc.internal.pageSize;
            const pageHeight = pageSize.height;
            doc.text(
              `Page ${i} of ${pageCount}`,
              pageSize.width / 2,
              pageHeight - 10,
              { align: 'center' }
            );
          }
        }
      });
      
      // Save the PDF
      doc.save(`BOQ-${projectName}.pdf`);
      
      toast({
        title: "Export Complete",
        description: "PDF has been downloaded",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Export Failed",
        description: "Could not generate PDF export",
        variant: "destructive",
      });
    }
  };
  
  const handleExportExcel = () => {
    try {
      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet([
        ['Ref', 'Description', 'Quantity', 'Unit', 'Rate', 'Rate Ref', 'Total']
      ]);
      
      let rowIndex = 1;
      
      // Add data
      generatedBoq.forEach(section => {
        // Add section header
        XLSX.utils.sheet_add_aoa(ws, [[section.section, '', '', '', '', '', '']], { origin: rowIndex++ });
        
        // Add section items
        section.items.forEach(item => {
          XLSX.utils.sheet_add_aoa(ws, [
            [
              item.ref,
              item.description,
              item.quantity,
              item.unit,
              item.rate,
              item.rateRef,
              item.total
            ]
          ], { origin: rowIndex++ });
        });
      });
      
      // Calculate total
      const totalSum = generatedBoq.reduce((acc, section) => {
        return acc + section.items.reduce((sectionAcc, item) => {
          return sectionAcc + parseFloat(item.total.replace(/,/g, ''));
        }, 0);
      }, 0);
      
      // Add total row
      XLSX.utils.sheet_add_aoa(ws, [
        ['', '', '', '', '', 'TOTAL:', formatCurrency(totalSum.toString())]
      ], { origin: rowIndex++ });
      
      // Create workbook and append worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'BOQ');
      
      // Format columns
      const wscols = [
        { wch: 10 }, // Ref
        { wch: 40 }, // Description
        { wch: 15 }, // Quantity
        { wch: 10 }, // Unit
        { wch: 15 }, // Rate
        { wch: 15 }, // Rate Ref
        { wch: 15 }, // Total
      ];
      ws['!cols'] = wscols;
      
      // Generate Excel file
      const projectName = drawingFile?.name.split('.')[0] || "Project";
      XLSX.writeFile(wb, `BOQ-${projectName}.xlsx`);
      
      toast({
        title: "Export Complete",
        description: "Excel file has been downloaded",
      });
    } catch (error) {
      console.error('Excel export error:', error);
      toast({
        title: "Export Failed",
        description: "Could not generate Excel export",
        variant: "destructive",
      });
    }
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
          drawingFileUrl={drawingFileUrl}
          specFile={specFile}
          specFileUrl={specFileUrl}
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
