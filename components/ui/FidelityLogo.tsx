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
    sm: showText ? 'h-10' : 'w-10 h-10',
    md: showText ? 'h-16' : 'w-16 h-16',
    lg: showText ? 'h-20' : 'w-20 h-20',
    xl: showText ? 'h-24' : 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  if (!showText) {
    // Just the logo mark
    return (
      <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
        <Image
          src="/images/lifestyle.svg"
          alt="Fidelity Lifestyle Banking Logo"
          width={300}
          height={300}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  // Full logo with text
  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center sm:justify-start`}>
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Logo mark */}
        <div className="h-full aspect-square flex-shrink-0">
          <Image
            src="/images/lifestyle.svg"
            alt="Fidelity Lifestyle Banking Logo"
            width={300}
            height={300}
            className="w-full h-full object-contain"
            priority
          />
        </div>

        {/* Fidelity text */}
        <span className={`${textSizeClasses[size]} font-bold text-[var(--blueHex)] font-urbanist whitespace-nowrap`}>
          Fidelity Lifestyle
        </span>
      </div>
    </div>
  );
};