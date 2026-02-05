
import React from 'react';
// 🛠️ Fixed: Import casing for BusinessMetrics and PersonaID from types.ts
import { business_metrics as BusinessMetrics, persona_id as PersonaID } from '../types';
import AIAvatar from './AIAvatar';

interface DashboardProps {
  metrics: BusinessMetrics;
}

const Dashboard: React.FC<DashboardProps> = ({ metrics }) => {
  return (
    <div className="h-full p-10 space-y-12 overflow-y-auto no-scrollbar pb-40">
      <header>
        <h1 className="text-6xl font-serif gold-gradient italic uppercase tracking-tighter">Resonance Hub</h1>
        <p className="text-gray-500 font-black uppercase tracking-[0.4em] mt-3">Omega Core Operations Center</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Revenue', val: metrics.revenue.toLocaleString() + ' đ', color: 'text-white' },
          { label: 'Inventory', val: metrics.gold_inventory + ' Chỉ', color: 'text-amber-500' },
          { label: 'Production', val: metrics.production_progress + '%', color: 'text-cyan-400' },
          { label: 'Risk Score', val: metrics.risk_score, color: 'text-red-500' }
        ].map((m, i) => (
          <div key={i} className="ai-panel p-10 bg-black/40 border-white/5 hover:border-white/10 transition-all">
             <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-4">{m.label}</p>
             <p className={`text-3xl font-mono font-black italic ${m.color}`}>{m.val}</p>
          </div>
        ))}
      </div>

      <div className="p-12 bg-indigo-500/5 border border-indigo-500/20 rounded-[3rem] flex items-center gap-10">
         <AIAvatar personaId={PersonaID.thien} size="lg" />
         <div className="flex-1">
            <h3 className="text-xl font-bold text-white uppercase italic mb-2">Báo cáo Thiên</h3>
            <p className="text-gray-400 italic font-light leading-relaxed">
               "Hệ thống đang vận hành tại cường độ tối ưu. Các Shard dữ liệu đã được niêm phong hoàn toàn. Master Natt có thể bắt đầu phiên làm việc mới."
            </p>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
