
import React from 'react';

interface TechBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export const TechBackground: React.FC<TechBackgroundProps> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(135deg, #221F26 0%, #2d1d69 50%, #403E43 100%)',
      }}
    >
      <div 
        className="absolute inset-0 opacity-20" 
        style={{ 
          backgroundImage: `radial-gradient(#1EAEDB 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} 
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
