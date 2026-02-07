
import React from 'react';
import { ShowroomSpec } from '@/types/showroom';

export const SpecificationBlock: React.FC<{ specs: ShowroomSpec[] }> = ({ specs }) => {
  return (
    <div className="p-8 bg-black/40 border border-white/10 rounded-[2.5rem]">
      <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">
         Thông số Master
      </h3>
      <div className="space-y-4">
         {specs.map((s, i) => (
           <div key={i} className="flex justify-between items-center group">
              <span className="text-xs text-gray-500 font-bold uppercase">{s.key}</span>
              <span className={`text-sm font-mono ${s.isHighlight ? 'text-amber-300 font-black' : 'text-white'}`}>
                 {s.value}
              </span>
           </div>
         ))}
      </div>
    </div>
  );
};
