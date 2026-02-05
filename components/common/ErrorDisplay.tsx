
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => (
  <div className="h-full w-full flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-500">
    <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
      ⚠️
    </div>
    <h3 className="text-xl font-bold text-red-500 uppercase tracking-widest mb-2">Neural Link Interrupted</h3>
    <p className="text-gray-500 italic text-sm mb-8 max-w-xs">{message}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="px-8 py-3 bg-white text-black font-black text-[10px] uppercase rounded-xl hover:bg-gray-200 transition-all active:scale-95"
      >
        THIẾT LẬP LẠI KẾT NỐI
      </button>
    )}
  </div>
);

export default ErrorDisplay;
