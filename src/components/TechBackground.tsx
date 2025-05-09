
import React from 'react';

interface TechBackgroundProps {
  className?: string;
}

const TechBackground: React.FC<TechBackgroundProps> = ({ className }) => {
  return (
    <div 
      className={`absolute inset-0 overflow-hidden -z-10 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#2d1d69] via-[#3d2d79] to-[#2d1d95] opacity-90"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-40"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(116,81,255,0.4),rgba(65,37,207,0.2)_70%)] opacity-70"></div>
      <div className="absolute inset-0 w-full h-full">
        <svg className="h-full w-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wavePattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M0,100 C40,70 60,130 100,100 C140,70 160,130 200,100 C240,70 260,130 300,100 C340,70 360,130 400,100" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="1" />
              <path d="M0,150 C40,120 60,180 100,150 C140,120 160,180 200,150 C240,120 260,180 300,150 C340,120 360,180 400,150" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="1" />
              <path d="M0,50 C40,20 60,80 100,50 C140,20 160,80 200,50 C240,20 260,80 300,50 C340,20 360,80 400,50" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="1" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#wavePattern)"></rect>
        </svg>
      </div>
    </div>
  );
};

export default TechBackground;
