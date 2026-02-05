
import React, { useState, useEffect } from 'react';
import { OrderStatus } from '../types';

const ProductionWallboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    oee: 86.5,
    onTime: 94.2,
    avgLoss: 1.3,
    dailyOutput: 42
  });

  const stages = [
    { stage: OrderStatus.DESIGNING, count: 8, color: 'bg-blue-500' },
    { stage: OrderStatus.CASTING, count: 12, color: 'bg-orange-500' },
    { stage: OrderStatus.COLD_WORK, count: 10, color: 'bg-yellow-500' },
    { stage: OrderStatus.STONE_SETTING, count: 6, color: 'bg-purple-500' },
    { stage: OrderStatus.FINISHING, count: 5, color: 'bg-pink-500' },
    { stage: OrderStatus.QC_PENDING, count: 3, color: 'bg-teal-500' },
    { stage: OrderStatus.COMPLETED, count: 15, color: 'bg-green-500' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        oee: prev.oee + (Math.random() - 0.5) * 0.1,
        dailyOutput: prev.dailyOutput + (Math.random() > 0.9 ? 1 : 0)
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full bg-black flex flex-col p-10 space-y-12 animate-in fade-in duration-1000 overflow-hidden">
      
      {/* GLOBAL TICKER IS NOW IN APPSHELL - REMOVED LOCAL TICKER */}

      <header className="flex justify-between items-center mt-2">
         <div>
            <h1 className="text-6xl font-serif gold-gradient italic uppercase tracking-tighter">Production Pulse</h1>
            <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.6em] mt-3">Tâm Luxury Master Factory • Global Operations Center</p>
         </div>
         <div className="flex gap-12 text-right">
            <div>
               <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-1">Thời gian Shard</p>
               <p className="text-3xl font-mono font-black text-white">{new Date().toLocaleTimeString('vi-VN')}</p>
            </div>
            <div className="flex items-center gap-4 px-8 py-4 glass border border-green-500/20 bg-green-500/5 rounded-3xl">
               <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse shadow-[0_0_20px_rgba(34,197,94,1)]"></div>
               <span className="text-xs font-black text-green-500 uppercase tracking-widest">SYSTEM OPTIMAL</span>
            </div>
         </div>
      </header>

      {/* STAGE COLUMNS */}
      <div className="flex-1 grid grid-cols-7 gap-6 min-h-0">
         {stages.map(s => (
           <div key={s.stage} className="flex flex-col gap-6 animate-in slide-in-from-bottom-10" style={{ animationDelay: `${stages.indexOf(s) * 100}ms` }}>
              <div className={`p-6 rounded-[2.5rem] border border-white/5 bg-white/[0.02] flex flex-col items-center text-center shadow-2xl relative overflow-hidden group`}>
                 <div className={`absolute top-0 left-0 w-full h-1 ${s.color}`}></div>
                 <p className="text-5xl font-mono font-black text-white mb-2">{s.count}</p>
                 <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest group-hover:text-white transition-colors">{s.stage.replace('_', ' ')}</p>
              </div>
              <div className="flex-1 glass border border-white/5 rounded-[3rem] bg-black/40 flex flex-col p-4 space-y-3 overflow-y-auto no-scrollbar opacity-40">
                 {Array.from({ length: s.count }).map((_, i) => (
                    <div key={i} className="h-12 w-full bg-white/[0.03] rounded-2xl border border-white/5 border-dashed"></div>
                 ))}
              </div>
           </div>
         ))}
      </div>

      {/* METRICS HUD */}
      <footer className="grid grid-cols-4 gap-10 shrink-0">
         {[
           { label: 'Hiệu suất OEE', value: metrics.oee.toFixed(1) + '%', trend: 'UP', color: 'text-cyan-400' },
           { label: 'Giao hàng đúng hạn', value: metrics.onTime.toFixed(1) + '%', trend: 'STABLE', color: 'text-green-400' },
           { label: 'Hao hụt bình quân', value: metrics.avgLoss.toFixed(2) + '%', trend: 'DOWN', color: 'text-amber-500' },
           { label: 'Sản lượng ngày', value: metrics.dailyOutput + ' SP', trend: 'UP', color: 'text-white' }
         ].map((m, i) => (
           <div key={i} className="ai-panel p-10 flex flex-col items-center text-center bg-white/[0.02] border-white/10">
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-4">{m.label}</p>
              <p className={`text-6xl font-mono font-black italic tracking-tighter ${m.color}`}>{m.value}</p>
              <div className="mt-4 flex items-center gap-2">
                 <span className={`text-[8px] font-black uppercase ${m.trend === 'UP' ? 'text-green-400' : 'text-gray-500'}`}>{m.trend}</span>
                 <div className="w-16 h-0.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${m.trend === 'UP' ? 'bg-green-500' : 'bg-gray-500'} w-3/4 animate-pulse`}></div>
                 </div>
              </div>
           </div>
         ))}
      </footer>
    </div>
  );
};

export default ProductionWallboard;
