'use client';
import React from 'react';
import { FidelityLogo } from '@/components/ui/FidelityLogo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        {/* Image Section - Static image with overlay and border radius */}
        <div className="hidden lg:block lg:w-1/2 relative m-6 mr-3 rounded-2xl overflow-hidden">
          {/* Static Background Image */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url('https://i.ibb.co/qFxjY1sW/Images.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />

          {/* Curved overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-blue-800/10 to-transparent">
            {/* SVG Curve */}
           
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8 lg:pl-3 relative">
          {/* Mobile curved overlay */}
          <div className="lg:hidden absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-50 to-green-50 opacity-30 rounded-t-2xl">
            <svg
              className="absolute top-0 left-0 w-full h-full"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 Q50,20 100,0 L100,0 L0,0 Z"
                fill="rgba(59, 130, 246, 0.1)"
              />
            </svg>
          </div>

          <div className="max-w-md w-full space-y-8 relative z-10">
            <div className="text-center">
              <div className="mx-auto mb-6">
                <FidelityLogo showText={false} size="xl" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--blueHex)] font-[var(--fontPlayfair)]">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-2 text-sm text-[var(--greyHex)] font-[var(--fontOpen)]">
                  {subtitle}
                </p>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};