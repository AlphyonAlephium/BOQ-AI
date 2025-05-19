
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AIScanAnimation } from '@/components/AIScanAnimation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clipboard, Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { BoqSection } from '@/types/boq';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface GenerateBoqTabProps {
  drawingFile: File | null;
  drawingFileUrl?: string;
  specFile: File | null;
  specFileUrl?: string;
  isProcessing: boolean;
  isBoqGenerated: boolean;
  generatedBoq: BoqSection[];
  handleGenerateBoq: () => void;
  handleExportPdf: () => void;
  handleExportExcel: () => void;
  formatCurrency: (value: string) => string;
}

export const GenerateBoqTab: React.FC<GenerateBoqTabProps> = ({
  drawingFile,
  specFile,
  isProcessing,
  isBoqGenerated,
  generatedBoq,
  handleGenerateBoq,
  handleExportPdf,
  handleExportExcel,
  formatCurrency
}) => {
  const totalSum = isBoqGenerated ? generatedBoq.reduce((acc, section) => {
    return acc + section.items.reduce((sectionAcc, item) => {
      return sectionAcc + parseFloat(item.total.replace(/,/g, ''));
    }, 0);
  }, 0) : 0;

  return (
    <Card className="p-6 relative">
      <h2 className="text-2xl font-medium text-gray-800 mb-4">Generate Bill of Quantities</h2>
      <p className="text-gray-600 mb-6">Generate a complete Bill of Quantities based on your uploaded drawings and specifications.</p>
      
      {!isBoqGenerated ? (
        <div className="text-center">
          <Button 
            onClick={handleGenerateBoq} 
            className="px-8 py-6 text-lg"
            disabled={!drawingFile || !specFile || isProcessing}
          >
            {isProcessing ? "Processing..." : "Generate BOQ"}
          </Button>
          
          {isProcessing && (
            <div className="mt-6">
              <AIScanAnimation isScanning={isProcessing} />
              <p className="mt-4 text-gray-600">Analyzing drawings and specifications...</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex justify-end gap-2 mb-4">
            <Button variant="outline" onClick={handleExportPdf}>
              <Download className="h-4 w-4 mr-2" /> Export PDF
            </Button>
            <Button variant="outline" onClick={handleExportExcel}>
              <Clipboard className="h-4 w-4 mr-2" /> Export Excel
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <BoqTable generatedBoq={generatedBoq} formatCurrency={formatCurrency} totalSum={totalSum} />
          </div>
        </div>
      )}
    </Card>
  );
};

interface BoqTableProps {
  generatedBoq: BoqSection[];
  formatCurrency: (value: string) => string;
  totalSum: number;
}

const BoqTable: React.FC<BoqTableProps> = ({ generatedBoq, formatCurrency, totalSum }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">Ref</TableHead>
          <TableHead className="w-1/2">Item Description</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Rate</TableHead>
          <TableHead>Rate ref</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {generatedBoq.map((section, sectionIndex) => (
          <React.Fragment key={`section-${sectionIndex}`}>
            <TableRow className="bg-gray-100">
              <TableCell colSpan={7} className="font-bold">
                {section.section}
              </TableCell>
            </TableRow>
            {section.items.map((item, itemIndex) => (
              <TableRow key={`item-${sectionIndex}-${itemIndex}`}>
                <TableCell className="align-top">{item.ref}</TableCell>
                <TableCell className="whitespace-pre-line align-top">{item.description}</TableCell>
                <TableCell className="text-right align-top">{item.quantity}</TableCell>
                <TableCell className="align-top">{item.unit}</TableCell>
                <TableCell className="text-right align-top">{item.rate}</TableCell>
                <TableCell className="align-top">{item.rateRef}</TableCell>
                <TableCell className="text-right align-top">{item.total}</TableCell>
              </TableRow>
            ))}
          </React.Fragment>
        ))}
        <TableRow className="font-bold">
          <TableCell colSpan={6} className="text-right">TOTAL:</TableCell>
          <TableCell className="text-right">{formatCurrency(totalSum.toString())}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
