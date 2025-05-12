
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Table as TableIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIScanAnimation } from './AIScanAnimation';
import { PDFViewer } from './PDFViewer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProjectViewerProps {
  open: boolean;
  onClose: () => void;
  projectName: string;
  fileUrl?: string;
  fileType?: string;
}

// Sample Bill of Quantities data
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

export const ProjectViewer: React.FC<ProjectViewerProps> = ({ 
  open, 
  onClose, 
  projectName,
  fileUrl,
  fileType = 'image'
}) => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'boq'>('blueprint');
  const [isGeneratingBoq, setIsGeneratingBoq] = useState(true);
  const [outputFormat, setOutputFormat] = useState<string>('nrm');
  
  useEffect(() => {
    if (open && activeTab === 'boq') {
      // Simulate BOQ generation when the dialog is opened and BOQ tab is active
      setIsGeneratingBoq(true);
      const timer = setTimeout(() => {
        setIsGeneratingBoq(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [open, activeTab]);
  
  const formatCurrency = (value: string) => {
    const numberValue = parseFloat(value.replace(/,/g, ''));
    return numberValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  
  const totalSum = sampleBoqData.reduce((acc, section) => {
    return acc + section.items.reduce((sectionAcc, item) => {
      return sectionAcc + parseFloat(item.total.replace(/,/g, ''));
    }, 0);
  }, 0);
  
  const renderPreviewContent = () => {
    if (!fileUrl) {
      return <div className="text-gray-500">No blueprint available</div>;
    }

    if (fileType === 'pdf') {
      return <PDFViewer fileUrl={fileUrl} className="h-full" />;
    }

    return (
      <img src={fileUrl} alt={projectName} className="max-h-[500px] object-contain" />
    );
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{projectName}</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-4 mb-4">
          <Button
            variant={activeTab === 'blueprint' ? 'default' : 'outline'}
            onClick={() => setActiveTab('blueprint')}
          >
            <FileText className="mr-2 h-4 w-4" /> Blueprint
          </Button>
          <Button
            variant={activeTab === 'boq' ? 'default' : 'outline'}
            onClick={() => setActiveTab('boq')}
          >
            <TableIcon className="mr-2 h-4 w-4" /> Bill of Quantities
          </Button>
        </div>
        
        {activeTab === 'blueprint' && (
          <div className="bg-gray-100 rounded-md p-4 flex justify-center items-center min-h-[500px]">
            {renderPreviewContent()}
          </div>
        )}
        
        {activeTab === 'boq' && (
          <div className="relative">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Bill of Quantities</h3>
                <Select
                  value={outputFormat}
                  onValueChange={(value) => setOutputFormat(value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nrm">NRM Format</SelectItem>
                    <SelectItem value="pomi">POMI Format</SelectItem>
                    <SelectItem value="cessm">CESSM Format</SelectItem>
                    <SelectItem value="custom">Custom Format</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">S. No</TableHead>
                    <TableHead className="w-1/2">Item Description</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Rate ref</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleBoqData.map((section, sectionIndex) => (
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
            </div>
            
            <AIScanAnimation isScanning={isGeneratingBoq} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

