
import React, { useState, useRef } from 'react';
import { FileUp, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';

interface FileUploaderProps {
  onFileChange: (file: File | null, fileUrl?: string, filePath?: string, fileType?: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileChange
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    if (extension === 'pdf') return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    if (['dwg', 'dxf'].includes(extension)) return 'blueprint';
    return 'other';
  };

  const uploadToSupabase = async (selectedFile: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      // Create a unique file path
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      const fileType = getFileType(selectedFile.name);

      // Simulate upload progress - in a real implementation, this would be replaced with actual progress tracking
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.random() * 10;
        });
      }, 300);

      // Upload file to Supabase Storage
      const {
        data,
        error
      } = await supabase.storage.from('blueprints').upload(filePath, selectedFile);
      if (error) {
        console.error('Error uploading file:', error);
        clearInterval(progressInterval);
        setUploadProgress(0);
        setIsUploading(false);
        toast({
          title: "Upload Failed",
          description: "There was an error uploading your file.",
          variant: "destructive"
        });
        return;
      }

      // Set progress to 100% when complete
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Get public URL for the uploaded file
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from('blueprints').getPublicUrl(filePath);

      // Pass back file information including file type
      onFileChange(selectedFile, publicUrl, filePath, fileType);
      toast({
        title: "Upload Successful",
        description: "Your file has been uploaded."
      });

      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error('File upload failed:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file.",
        variant: "destructive"
      });
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
    <div className="flex flex-col gap-4">
      <div className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} ${isUploading ? 'opacity-70' : ''}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={handleClick}>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.jpg,.jpeg,.png,.dwg,.dxf" disabled={isUploading} />

        <div className="flex flex-col items-center justify-center gap-2">
          {file ? <>
              {isUploading ? <Upload className="h-12 w-12 text-blue-500" /> : <FileUp className="h-12 w-12 text-blue-500" />}
              <p className="text-gray-700 text-sm mt-2">{file.name}</p>
            </> : <>
              <FileUp className="h-12 w-12 text-gray-400" />
              <p className="text-xl font-medium text-gray-800 mt-2">Upload File</p>
              <p className="text-sm text-gray-500 text-center">Drag and drop or click to upload PDF or DWG files</p>
            </>}
        </div>
      </div>
      
      {/* Progress bar shown only when uploading */}
      {isUploading && <div className="w-full">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Uploading {file?.name}</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>}
    </div>
  );
};
