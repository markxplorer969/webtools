'use client';

import React, { useEffect, useRef } from 'react';

interface NativeBannerProps {
  className?: string;
}

const NativeBanner: React.FC<NativeBannerProps> = ({ className = "" }) => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Script akan di-load melalui layout.tsx
    // Container akan diisi otomatis oleh script
  }, []);

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <div 
        id="container-c75d5d260359b050a3f999df7fd4d073"
        className="w-full max-w-7xl mx-auto min-h-[250px] flex items-center justify-center bg-gray-100/10 rounded-lg border border-gray-200/20"
        ref={bannerRef}
      >
        {/* Loading placeholder */}
        <div className="text-gray-400 text-sm">
          <div className="animate-pulse flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
          <p className="mt-2 text-xs">Loading ads...</p>
        </div>
      </div>
    </div>
  );
};

export default NativeBanner;