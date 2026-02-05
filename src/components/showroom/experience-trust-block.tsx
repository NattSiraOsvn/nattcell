
import React from 'react';
import { ShieldCheck, RefreshCw, Truck } from 'lucide-react';

export const ExperienceTrustBlock: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
       {[
         { icon: ShieldCheck, label: "GIA Certified", color: "text-blue-400" },
         { icon: RefreshCw, label: "Thu đổi 95%", color: "text-green-400" },
         { icon: Truck, label: "Vận chuyển VIP", color: "text-amber-400" }
       ].map((item, i) => (
         <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col items-center text-center gap-2">
            <item.icon size={20} className={item.color} />
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
         </div>
       ))}
    </div>
  );
};
