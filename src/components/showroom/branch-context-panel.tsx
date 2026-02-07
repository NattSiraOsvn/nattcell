
import React from 'react';
import { ShowroomBranch } from '@/types/showroom';
import { MapPin, UserCheck } from 'lucide-react';

export const BranchContextPanel: React.FC<{ branch: ShowroomBranch }> = ({ branch }) => {
  return (
    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
           <MapPin size={20} />
        </div>
        <div>
           <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Hiện vật đang tại</p>
           <h4 className="text-sm text-white font-bold">{branch.name}</h4>
           <p className="text-[10px] text-gray-400 italic">{branch.address}</p>
        </div>
      </div>
      
      <div className="text-right">
         <div className="flex items-center gap-2 justify-end mb-1">
             <UserCheck size={12} className="text-green-500" />
             <span className="text-[9px] text-green-500 font-black uppercase">Manager Verified</span>
         </div>
         <p className="text-xs text-white font-serif italic">{branch.manager}</p>
      </div>
    </div>
  );
};
