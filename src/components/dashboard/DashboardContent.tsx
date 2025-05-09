
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const DashboardContent = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Sample projects data
  const recentProjects = [
    { id: 1, name: 'Construction Project', date: 'Apr 15, 2024', type: 'BoQ' },
    { id: 2, name: 'Construction Project', date: 'Apr 10, 2024', type: 'BOF' },
    { id: 3, name: 'Construction Project', date: 'Apr 3, 2024', type: 'BOF' },
    { id: 4, name: 'Construction Project', date: 'Mar 25, 2024', type: 'BOQ' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleGenerate = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a building plan first.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Processing file",
      description: `Generating bill of quantities for ${file.name}...`,
    });
    
    // Here you would handle the actual file processing
    // For now, we'll just show a success message after a delay
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "Bill of quantities has been generated.",
      });
    }, 2000);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-700 mb-8">DASHBOARD</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Upload Panel */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Generate Bill of Quantities</h2>
            <p className="text-gray-600 mb-6">Upload a building plan to start generating a bill of quantities</p>
            
            <div 
              className={`border-2 border-dashed rounded-md p-8 text-center mb-6 cursor-pointer ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <input 
                type="file" 
                id="fileInput" 
                className="hidden" 
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <Upload className="mx-auto h-12 w-12 text-primary mb-2" />
              <p className="text-lg font-medium">
                {file ? file.name : 'Upload File'}
              </p>
              {!file && (
                <p className="text-sm text-gray-500 mt-1">
                  Drag and drop or click to browse
                </p>
              )}
            </div>
            
            <Button 
              className="w-full py-6 text-lg"
              onClick={handleGenerate}
            >
              GENERATE
            </Button>
          </CardContent>
        </Card>
        
        {/* Sample Plan Image */}
        <Card className="shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <img 
              src="/lovable-uploads/ec4a3a53-358c-4dc3-9377-80986ae9bc1a.png" 
              alt="Building Plan Example" 
              className="w-full h-full object-contain"
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Projects */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Projects</h2>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.date}</TableCell>
                  <TableCell>{project.type}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="default">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;
