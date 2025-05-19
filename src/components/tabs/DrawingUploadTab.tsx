
import React from 'react';
import { Card } from '@/components/ui/card';
import { FileUploader } from '@/components/FileUploader';

interface DrawingUploadTabProps {
  drawingFile: File | null;
  onDrawingFileChange: (file: File | null, fileUrl?: string, filePath?: string, fileType?: string) => void;
}

export const DrawingUploadTab: React.FC<DrawingUploadTabProps> = ({
  drawingFile,
  onDrawingFileChange
}) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-medium text-gray-800 mb-4">Upload Architectural Drawings</h2>
      <p className="text-gray-600 mb-6">Upload your architectural drawings in PDF or DWG format. Our AI will analyze the drawings to extract measurements and identify building elements.</p>
      
      <FileUploader onFileChange={onDrawingFileChange} />
      
      {drawingFile && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <p className="font-medium">Uploaded Drawing: {drawingFile.name}</p>
          <p className="text-sm text-gray-500">Our system will analyze this drawing to extract measurements and building elements.</p>
        </div>
      )}
    </Card>
  );
};
