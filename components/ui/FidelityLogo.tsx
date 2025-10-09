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
    sm: showText ? 'h-12' : 'w-12 h-12',
    md: showText ? 'h-20' : 'w-20 h-20',
    lg: showText ? 'h-28' : 'w-28 h-28',
    xl: showText ? 'h-32' : 'w-32 h-32'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
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