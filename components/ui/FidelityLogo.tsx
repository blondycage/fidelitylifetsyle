import React from 'react';
import Image from 'next/image';

interface FidelityLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const FidelityLogo: React.FC<FidelityLogoProps> = ({
  className = '',
  showText = true,
  size = 'sm'
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
        <Image
          src="/images/lifestyle.png"
          alt="Fidelity Lifestyle Banking Logo"
          width={120}
          height={120}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  // Full logo with text
  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center`}>
      <div className="flex items-center">
        {/* Logo mark */}
        <div className="h-full aspect-square mr-3">
          <Image
            src="/images/lifestyle.png"
            alt="Fidelity Lifestyle Banking Logo"
            width={120}
            height={120}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Fidelity text */}
        <span className="text-xl font-bold text-[var(--blueHex)] font-urbanist">
          Fidelity Lifestyle
        </span>
      </div>
    </div>
  );
};