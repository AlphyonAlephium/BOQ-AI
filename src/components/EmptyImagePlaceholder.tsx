
import React from 'react';
import { FileUp } from 'lucide-react';

interface EmptyImagePlaceholderProps {
  className?: string;
}

export const EmptyImagePlaceholder: React.FC<EmptyImagePlaceholderProps> = ({ className }) => {
  return (
    <div className={`w-full h-full flex items-center justify-center bg-gray-100 rounded-md ${className}`}>
      <div className="flex flex-col items-center justify-center">
        <FileUp className="h-12 w-12 text-gray-400" />
        <p className="text-sm text-gray-500 mt-2">No image available</p>
      </div>
    </div>
  );
};
