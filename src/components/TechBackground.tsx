
import React from 'react';

interface TechBackgroundProps {
  className?: string;
}

const TechBackground: React.FC<TechBackgroundProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a6c] via-[#2d1d69] to-[#3d1060] z-0"></div>
      
      {/* Circuit-like patterns */}
      <div className="absolute inset-0 z-0">
        {/* Decorative elements - lines */}
        <div className="absolute top-[10%] left-[5%] w-[30%] h-[1px] bg-blue-300/20"></div>
        <div className="absolute top-[20%] left-[15%] w-[40%] h-[1px] bg-blue-300/20"></div>
        <div className="absolute top-[30%] right-[25%] w-[25%] h-[1px] bg-blue-300/20"></div>
        <div className="absolute top-[70%] left-[10%] w-[35%] h-[1px] bg-blue-300/20"></div>
        <div className="absolute top-[85%] right-[15%] w-[30%] h-[1px] bg-blue-300/20"></div>
        
        {/* Decorative elements - squares */}
        <div className="absolute top-[15%] left-[10%] w-2 h-2 bg-blue-400/30"></div>
        <div className="absolute top-[25%] right-[20%] w-1 h-1 bg-blue-300/30"></div>
        <div className="absolute top-[40%] left-[30%] w-3 h-3 bg-blue-500/20"></div>
        <div className="absolute top-[60%] right-[30%] w-2 h-2 bg-blue-400/20"></div>
        <div className="absolute top-[75%] left-[25%] w-1 h-1 bg-blue-300/20"></div>
        
        {/* Decorative elements - circles */}
        <div className="absolute top-[10%] right-[10%] w-4 h-4 rounded-full border border-blue-300/30"></div>
        <div className="absolute top-[35%] left-[15%] w-6 h-6 rounded-full border border-blue-400/20"></div>
        <div className="absolute top-[65%] right-[15%] w-5 h-5 rounded-full border border-blue-300/20"></div>
        
        {/* Decorative elements - angles/arrows */}
        <div className="absolute top-[20%] right-[35%] w-4 h-4 border-t-2 border-r-2 border-blue-400/30 transform rotate-45"></div>
        <div className="absolute top-[50%] left-[20%] w-6 h-6 border-t-2 border-l-2 border-blue-500/20 transform -rotate-45"></div>
        <div className="absolute top-[80%] right-[25%] w-3 h-3 border-b-2 border-r-2 border-blue-300/20 transform rotate-45"></div>
        
        {/* Glowing dots */}
        <div className="absolute top-[15%] right-[25%] w-2 h-2 rounded-full bg-blue-400/60 blur-[2px]"></div>
        <div className="absolute top-[45%] left-[10%] w-3 h-3 rounded-full bg-blue-300/70 blur-[3px]"></div>
        <div className="absolute top-[75%] right-[15%] w-2 h-2 rounded-full bg-blue-400/60 blur-[2px]"></div>
        
        {/* Horizontal bars */}
        <div className="absolute top-[55%] left-[40%] w-[15%] h-2 bg-blue-500/10"></div>
        <div className="absolute top-[30%] left-[60%] w-[10%] h-1 bg-blue-400/10"></div>
        <div className="absolute top-[70%] left-[5%] w-[8%] h-2 bg-blue-500/10"></div>
      </div>
    </div>
  );
};

export default TechBackground;
