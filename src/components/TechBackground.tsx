
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
        background: 'linear-gradient(135deg, #2f2b3a 0%, #3a2a99 50%, #564f81 100%)',
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
