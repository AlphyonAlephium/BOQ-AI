
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
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #344FB0 100%)',
      }}
    >
      <div 
        className="absolute inset-0 opacity-20" 
        style={{ 
          backgroundImage: `radial-gradient(#60A5FA 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} 
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
