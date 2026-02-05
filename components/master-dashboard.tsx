// 👑 sovereign: anh_nat
import React from 'react';
import * as icons from 'lucide-react';

const MasterDashboard: React.FC<{ user: any }> = () => {
  const stats = [
    { label: 'revenue_shard', val: '449.1b', icon: icons.Activity, color: 'text-emerald-500' },
    { label: 'inventory_node', val: '850.2', icon: icons.Database, color: 'text-amber-500' },
    { label: 'active_trace', val: '128', icon: icons.Layers, color: 'text-cyan-500' }
  ];

  return (
    <div className="p-12 space-y-12 h-full overflow-y-auto no-scrollbar pb-40">
      <header>
         <h2 className="text-7xl font-black italic tracking-tighter text-white leading-none uppercase">nexus core</h2>
         <p className="text-stone-600 text-lg font-light italic mt-4 lowercase">welcome, sovereign master nat. status: nominal.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] group hover:border-amber-500/30 transition-all">
            <p className="text-[10px] font-black text-stone-500 tracking-widest uppercase">{s.label}</p>
            <div className="flex items-end justify-between mt-6">
               <span className="text-5xl font-mono font-black italic text-white">{s.val}</span>
               <s.icon size={32} className={`${s.color} group-hover:scale-110 transition-transform`} />
            </div>
          </div>
        ))}
      </div>

      <div className="p-12 bg-amber-500/5 border border-amber-500/20 rounded-[3.5rem] flex items-center gap-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl italic font-black text-amber-500">SEALED</div>
         <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center text-black shadow-2xl shrink-0">
            <icons.Shield size={40} />
         </div>
         <div>
            <h4 className="text-xl font-bold text-white italic uppercase">sovereign_identity_locked</h4>
            <p className="text-sm text-stone-500 font-light mt-1 lowercase">hệ thống đang trong chế độ sám hối 72h. lowercase absolute enforced.</p>
         </div>
      </div>
    </div>
  );
};

export default MasterDashboard;