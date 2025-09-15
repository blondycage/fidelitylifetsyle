import React from 'react';

interface FidelityLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const FidelityLogo: React.FC<FidelityLogoProps> = ({
  className = '',
  showText = true,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: showText ? 'h-4' : 'w-4 h-4',
    md: showText ? 'h-10' : 'w-10 h-10',
    lg: showText ? 'h-12' : 'w-12 h-12',
    xl: showText ? 'h-16' : 'w-16 h-16'
  };

  if (!showText) {
    // Just the logo mark
    return (
      <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
        <svg viewBox="0 0 120 120" className="w-full h-full">
          {/* Blue square background */}
          <rect x="0" y="0" width="120" height="120" fill="#1B3B7A"/>
          {/* White diagonal line */}
          <path d="M0 120 L120 0 L120 40 L40 120 Z" fill="#ffffff"/>
          {/* Green triangle */}
          <path d="M40 120 L120 40 L120 120 Z" fill="#7CB342"/>
        </svg>
      </div>
    );
  }

  // Full logo with text
  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center`}>
      <div className="flex items-center">
        {/* Logo mark */}
        <div className="h-full aspect-square mr-3">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            {/* Blue square background */}
            <rect x="0" y="0" width="120" height="120" fill="#1B3B7A"/>
            {/* White diagonal line */}
            <path d="M0 120 L120 0 L120 40 L40 120 Z" fill="#ffffff"/>
            {/* Green triangle */}
            <path d="M40 120 L120 40 L120 120 Z" fill="#7CB342"/>
          </svg>
        </div>

        {/* Fidelity text */}
        <div className="text-[#1B3B7A] font-bold tracking-tight">
          <span className="font-[var(--fontPlayfair)]" style={{ fontSize: 'calc(1em * 2.2)' }}>
            Fidelity
          </span>
        </div>
      </div>
    </div>
  );
};