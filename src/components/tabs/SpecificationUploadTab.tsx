
import React from 'react';
import { Card } from '@/components/ui/card';
import { FileUploader } from '@/components/FileUploader';

interface SpecificationUploadTabProps {
  specFile: File | null;
  onSpecFileChange: (file: File | null, fileUrl?: string, filePath?: string, fileType?: string) => void;
}

export const SpecificationUploadTab: React.FC<SpecificationUploadTabProps> = ({
  specFile,
  onSpecFileChange
}) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-medium text-gray-800 mb-4">Upload Specification Sheets</h2>
      <p className="text-gray-600 mb-6">Upload specification documents to provide details about materials, quality standards, and construction requirements.</p>
      
      <FileUploader onFileChange={onSpecFileChange} />
      
      {specFile && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <p className="font-medium">Uploaded Specification: {specFile.name}</p>
          <p className="text-sm text-gray-500">Our system will extract material and quality specifications from this document.</p>
        </div>
      )}
    </Card>
  );
};
