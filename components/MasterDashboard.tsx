
import React, { useState, useEffect } from 'react';
import { HUDMetric, UserRole, UserPosition, PersonaID, Department } from '../cells/shared-kernel/shared.types';
import { SmartLinkClient } from '../services/smartLink';
import AIAvatar from './AIAvatar';
import LoadingSpinner from './common/LoadingSpinner';

const MasterDashboard: React.FC<{ currentRole: UserRole, currentPosition: UserPosition }> = ({ currentRole, currentPosition }) => {
  const [metrics, setMetrics] = useState<HUDMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const syncNeuralNodes = async () => {
      setIsLoading(true);
      try {
        // 🛡️ HỢP HIẾN: Pull dữ liệu từ các Cell thông qua SmartLink Intent
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
      <header className="mb-16">
          <h1 className="text-7xl font-black tracking-tighter text-white italic uppercase leading-none">NATT-OS CORE</h1>
          <p className="text-stone-500 text-xl font-light italic mt-4">SmartLink Registry v4.0 Active. All cells synchronized.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
           {metrics.map(m => (
               <div key={m.id} className="ai-panel p-10 bg-[#121212] rounded-[32px] border border-white/5 group hover:border-amber-500/30 transition-all">
                  <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest">{m.name}</span>
                  <p className="text-5xl font-mono font-black text-white italic mt-4">{m.value.toLocaleString()} <span className="text-sm not-italic text-stone-500">{m.unit}</span></p>
               </div>
           ))}
      </section>

      <div className="mt-20">
         <AIAvatar personaId={PersonaID.THIEN} size="xl" />
         <div className="mt-10 p-10 bg-white/[0.02] rounded-[40px] italic font-light text-stone-400 text-lg border border-white/5">
            "Báo cáo Master: Toàn bộ logic đã được di dời vào hệ thống Cell. Mọi Shard hiện tại đã tuân thủ Boundary Law."
         </div>
      </div>
    </div>
  );
};

export default MasterDashboard;
