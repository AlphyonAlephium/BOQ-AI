
import React from 'react';
import { Scan } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AIScanAnimationProps {
  isScanning: boolean;
}

export const AIScanAnimation: React.FC<AIScanAnimationProps> = ({ isScanning }) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (!isScanning) {
      setProgress(0);
      return;
    }

    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 2;
      });
    }, 50);

    return () => {
      clearInterval(timer);
    };
  }, [isScanning]);

  if (!isScanning) return null;

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-md">
      <Scan className="text-primary-500 h-12 w-12 mb-4 animate-pulse" />
      <div className="text-white font-medium mb-4">AI Scanning Document...</div>
      <div className="w-3/4 max-w-xs">
        <Progress value={progress} className="h-2 bg-gray-700" />
      </div>
      <div className="text-white text-sm mt-2">{progress}%</div>
    </div>
  );
};
