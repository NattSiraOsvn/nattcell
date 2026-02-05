
import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 h-full bg-[#020202]">
      <div className={`${sizeMap[size]} border-white/10 border-t-amber-500 rounded-full animate-spin mb-4`}></div>
      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
