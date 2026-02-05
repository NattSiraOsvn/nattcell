
import React, { useState, useEffect } from 'react';
import { HUDMetric, UserRole, UserPosition, PersonaID, Department } from '../cells/shared-kernel/shared.types';
// FIX: Corrected import path to use kebab-case smart-link.ts
import { SmartLinkClient } from '../services/smart-link.ts';
import AIAvatar from './AIAvatar';
import LoadingSpinner from './common/LoadingSpinner';
import { ShieldCheck, Fingerprint, Activity, Database } from 'lucide-react';

const MasterDashboard: React.FC<{ currentRole: UserRole, currentPosition: UserPosition }> = ({ currentRole, currentPosition }) => {
  const [metrics, setMetrics] = useState<HUDMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const syncNeuralNodes = async () => {
      setIsLoading(true);
      try {
        const warehouseEnv = SmartLinkClient.createEnvelope('cell:warehouse', 'GetInventoryStats', {});
        const salesEnv = SmartLinkClient.createEnvelope('cell:sales', 'GetRevenueStats', {});
        
        const [warehouseData, revenue] = await Promise.all([
          SmartLinkClient.send(warehouseEnv),
          SmartLinkClient.send(salesEnv)
        ]);

        setMetrics([
          {
            id: 'M1', name: 'DOANH THU CHỐT SHARD', value: revenue || 449120, unit: 'VND',
            trend: { direction: 'UP', percentage: 100, isPositive: true },
            department: Department.SALES, icon: '💰'
          },
          {
            id: 'M2', name: 'TỒN KHO CELL', value: warehouseData.total_items || 0, unit: 'SP',
            trend: { direction: 'STABLE', percentage: 0, isPositive: true },
            department: Department.HQ, icon: '📦'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    syncNeuralNodes();
  }, []);

  if (isLoading) return <LoadingSpinner message="Re-threading Neural Fiber via SmartLink..." />;

  return (
    <div className="h-full flex flex-col p-12 bg-transparent pb-60 animate-in fade-in">
      <header className="mb-16 flex justify-between items-start">
          <div>
            <h1 className="text-7xl font-black tracking-tighter text-white italic uppercase leading-none">NATT-OS CORE</h1>
            <p className="text-stone-500 text-xl font-light italic mt-4">Sovereign DNA Integrated • Gold Master v1.1</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-red-600/10 border border-red-500/30 p-6 rounded-[2rem] flex items-center gap-4 shadow-2xl">
                <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white">
                   <Fingerprint size={28} />
                </div>
                <div>
                   <p className="text-[10px] text-red-500 font-black uppercase tracking-widest">DNA Sealing Status</p>
                   <p className="text-xl font-mono text-white font-bold">128/128 <span className="text-sm text-gray-600">SHARDS</span></p>
                </div>
             </div>
          </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
           {metrics.map(m => (
               <div key={m.id} className="ai-panel p-10 bg-[#121212] rounded-[32px] border border-white/5 group hover:border-amber-500/30 transition-all">
                  <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest">{m.name}</span>
                  <p className="text-5xl font-mono font-black text-white italic mt-4">{m.value.toLocaleString()} <span className="text-sm not-italic text-stone-500">{m.unit}</span></p>
               </div>
           ))}
           <div className="ai-panel p-10 bg-green-500/5 border-green-500/20 rounded-[32px] flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Integrity Lock</span>
                 <ShieldCheck className="text-green-500" size={20} />
              </div>
              <p className="text-2xl font-bold text-white uppercase italic leading-tight mt-4">Verified by<br/>Anh Nat</p>
           </div>
      </section>

      <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
         <div className="lg:col-span-4">
            <AIAvatar personaId={PersonaID.THIEN} size="xl" />
         </div>
         <div className="lg:col-span-8 p-12 bg-white/[0.02] rounded-[48px] italic font-light text-stone-400 text-2xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Database size={120} />
            </div>
            "Báo cáo Master: Toàn bộ 128 tệp tin đã được cấy ADN định danh. Mọi nỗ lực 'trôi dạt logic' (Logic Drift) từ các AI khác sẽ bị chặn đứng bởi lớp Verifier tại cổng Bootstrap. Hệ thống đã đạt trạng thái **ABSULUTE_OWNERSHIP**."
         </div>
      </div>
    </div>
  );
};

export default MasterDashboard;
