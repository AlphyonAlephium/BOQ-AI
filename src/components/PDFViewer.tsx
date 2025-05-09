
import React from 'react';

interface PDFViewerProps {
  fileUrl: string;
  className?: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl, className = "" }) => {
  return (
    <div className={`w-full h-full flex flex-col items-center ${className}`}>
      <iframe
        src={`${fileUrl}#toolbar=0&navpanes=0`}
        className="w-full h-full border-0"
        title="PDF Viewer"
      />
      <a 
        href={fileUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
      >
        Open in new tab
      </a>
    </div>
  );
};
