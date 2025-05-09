
import React, { useState, useRef } from 'react';
import { FileUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface FileUploaderProps {
  onFileChange: (file: File | null, fileUrl?: string, filePath?: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const uploadToSupabase = async (selectedFile: File) => {
    setIsUploading(true);
    
    try {
      // Create a unique file path
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('blueprints')
        .upload(filePath, selectedFile);
        
      if (error) {
        console.error('Error uploading file:', error);
        setIsUploading(false);
        return;
      }
      
      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('blueprints')
        .getPublicUrl(filePath);
        
      // Pass back file information
      onFileChange(selectedFile, publicUrl, filePath);
    } catch (error) {
      console.error('File upload failed:', error);
    }
    
    setIsUploading(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      await uploadToSupabase(droppedFile);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      await uploadToSupabase(selectedFile);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      } ${isUploading ? 'opacity-70' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.dwg,.dxf"
        disabled={isUploading}
      />

      <div className="flex flex-col items-center justify-center gap-2">
        {file ? (
          <>
            <FileUp className="h-12 w-12 text-blue-500" />
            <p className="text-gray-700 text-sm mt-2">{file.name}</p>
            {isUploading && <p className="text-sm text-blue-500">Uploading...</p>}
          </>
        ) : (
          <>
            <FileUp className="h-12 w-12 text-gray-400" />
            <p className="text-xl font-medium text-gray-800 mt-2">Upload File</p>
            <p className="text-sm text-gray-500 text-center">
              Drag and drop or click to upload blueprint files
            </p>
          </>
        )}
      </div>
    </div>
  );
};
