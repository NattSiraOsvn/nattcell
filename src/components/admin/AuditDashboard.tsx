
import React, { useState, useEffect } from 'react';
import { 
  Activity, ShieldCheck, Search, Filter, AlertTriangle, 
  Database, Zap, Lock, RefreshCcw, Eye, Code
} from 'lucide-react';
import { AuditProvider } from '../../services/admin/AuditService.ts';
import { AuditStats, AuditGap, AuditAlert, PersonaID } from '../../types.ts';
import AIAvatar from '../AIAvatar.tsx';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AuditDashboard: React.FC = () => {
  const [stats, setStats] = useState<AuditStats>({
    totalEvents: 124500,
    coverageRate: 94.2,
    integrityScore: 100,
    failedSeals: 0,
    avgLatency: 14
  });

  const [gaps] = useState<AuditGap[]>([
    { id: 'GAP-01', moduleId: 'WAREHOUSE', methodName: 'manualStockAdjust', severity: 'HIGH', detectedAt: Date.now() - 3600000 },
    { id: 'GAP-02', moduleId: 'FINANCE', methodName: 'updateTaxRate', severity: 'MEDIUM', detectedAt: Date.now() - 7200000 }
  ]);

  const [alerts] = useState<AuditAlert[]>([
    { id: 'AL-001', ruleName: 'MASS_DELETION_ATTEMPT', severity: 'CRITICAL', message: 'Identity USR-99 đang cố xóa 500 bản ghi tại Shard Logistics.', timestamp: Date.now(), status: 'NEW' }
  ]);

  const [waveData, setWaveData] = useState<any[]>([]);

  useEffect(() => {
    // Giả lập dữ liệu nhịp xung Audit
    const data = Array.from({ length: 20 }, (_, i) => ({
      time: i,
      events: 40 + Math.random() * 60
    }));
    setWaveData(data);
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#020202] p-8 lg:p-12 overflow-y-auto no-scrollbar gap-10 animate-in fade-in duration-1000 pb-40 relative">
      <header className="flex justify-between items-end border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-5 mb-3">
             <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-[0_0_40px_rgba(79,70,229,0.3)]">
                <Database size={32} />
             </div>
             <div>
                <h2 className="ai-headline text-6xl italic uppercase tracking-tighter text-white">Deep Audit Center</h2>
                <p className="text-[10px] text-indigo-400 font-black tracking-[0.6em] ml-1 uppercase mt-2">NATT-OS OBSERVABILITY NODE • OMEGA SECURE</p>
             </div>
          </div>
        </div>
        
        <div className="flex gap-4">
           <button className="px-8 py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl shadow-2xl hover:bg-indigo-400 transition-all active:scale-95">
              Run Coverage Scan
           </button>
        </div>
      </header>

      {/* KPI STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Audit Coverage', val: `${stats.coverageRate}%`, icon: Code, color: 'text-blue-400' },
          { label: 'Integrity Score', val: `${stats.integrityScore}%`, icon: ShieldCheck, color: 'text-green-500' },
          { label: 'Events Sealed', val: stats.totalEvents.toLocaleString(), icon: Lock, color: 'text-amber-500' },
          { label: 'Avg Pulse', val: `${stats.avgLatency}ms`, icon: Activity, color: 'text-cyan-400' }
        ].map((kpi, i) => (
          <div key={i} className="ai-panel p-6 bg-black/40 border-white/5 flex items-center gap-6 group hover:border-white/20 transition-all">
             <div className="p-3 rounded-xl bg-white/5">
                <kpi.icon size={20} className={kpi.color} />
             </div>
             <div>
                <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">{kpi.label}</p>
                <p className="text-xl font-mono font-black text-white">{kpi.val}</p>
             </div>
          </div>
        ))}
      </div>

      <main className="grid grid-cols-1 xl:grid-cols-12 gap-10 min-h-0">
          
          {/* LEFT: LIVE STREAM & CHART */}
          <div className="xl:col-span-8 space-y-8">
             <div className="ai-panel p-10 bg-black border-white/5 h-[400px] flex flex-col shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-9xl font-black italic select-none">PULSE</div>
                <h3 className="text-sm font-black text-white uppercase tracking-[0.4em] mb-10 italic flex items-center gap-3">
                   <Activity size={18} className="text-indigo-500 animate-pulse" />
                   System Mutation Velocity
                </h3>
                <div className="flex-1 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={waveData}>
                         <defs>
                            <linearGradient id="auditPulse" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                               <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
                         <XAxis dataKey="time" hide />
                         <YAxis hide domain={[0, 120]} />
                         <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                         <Area type="monotone" dataKey="events" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#auditPulse)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>

             <div className="ai-panel overflow-hidden border-white/5 bg-black/40">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                   <h3 className="text-sm font-bold text-white uppercase tracking-widest italic flex items-center gap-3">
                      <Zap size={16} className="text-amber-500" />
                      Critical Audit Alerts
                   </h3>
                </div>
                <div className="space-y-1">
                   {alerts.map(al => (
                      <div key={al.id} className="p-6 bg-red-950/10 border-b border-white/5 flex justify-between items-center group hover:bg-red-900/10 transition-all">
                         <div className="flex items-center gap-6">
                            <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center text-red-500 font-black text-xs animate-pulse">!</div>
                            <div>
                               <p className="text-xs font-bold text-white uppercase tracking-tight">{al.ruleName}</p>
                               <p className="text-[11px] text-gray-500 italic mt-1 leading-relaxed">"{al.message}"</p>
                            </div>
                         </div>
                         <button className="px-6 py-2 bg-red-600 text-white rounded-xl text-[9px] font-black uppercase shadow-lg">Lock Shard</button>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          {/* RIGHT: GAP ANALYSIS & ADVISOR */}
          <div className="xl:col-span-4 space-y-8">
             <div className="ai-panel p-8 bg-black border-amber-500/20 shadow-2xl">
                <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest mb-8 flex items-center gap-3">
                   <AlertTriangle size={18} /> Monitoring Gaps Detected
                </h3>
                <div className="space-y-4">
                   {gaps.map(gap => (
                      <div key={gap.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-amber-500/50 transition-all">
                         <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{gap.moduleId}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${gap.severity === 'HIGH' ? 'bg-red-600 text-white' : 'bg-amber-600 text-black'}`}>{gap.severity}</span>
                         </div>
                         <p className="text-sm font-bold text-white font-mono">{gap.methodName}()</p>
                         <p className="text-[9px] text-gray-600 mt-2 italic">Lỗi: Thiếu niêm phong @Auditable decorator.</p>
                         <button className="mt-4 w-full py-2 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black text-gray-500 hover:text-white transition-all">AUTO-PATCH CODE</button>
                      </div>
                   ))}
                </div>
             </div>

             <div className="ai-panel p-8 bg-indigo-500/5 border-indigo-500/20">
                <div className="flex items-center gap-4 mb-6">
                   <AIAvatar personaId={PersonaID.KRIS} size="sm" />
                   <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">KRIS - Compliance Bot</h4>
                </div>
                <p className="text-[11px] text-gray-400 italic leading-relaxed font-light">
                   "Thưa Anh Natt, KIM đã hoàn tất bóc tách codebase. Hiện tại hệ thống phát hiện 02 'vùng tối' giám sát tại module **KHO** và **TÀI CHÍNH**. Các hành động này chưa được băm Hash tự động, Kris đề nghị Anh cấp lệnh vá lỗi ngay để đảm bảo tính bất biến của sổ cái."
                </p>
             </div>
          </div>
      </main>

      <footer className="mt-auto pt-10 border-t border-white/5 flex items-center gap-8 shrink-0">
          <div className="p-10 bg-white/[0.01] border-white/5 rounded-[3rem] flex-1 flex items-center justify-between shadow-inner">
              <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3">
                     <ShieldCheck size={16} className="text-green-500" /> Shard Sealing Protocol
                  </h4>
                  <p className="text-[11px] text-gray-400 italic font-light leading-relaxed max-w-xl">
                     "Mọi bản ghi Audit được băm Shard Hash RSA-4096 và niêm phong theo lô 50 sự kiện. Cơ chế Gap Detection đảm bảo không một hành động hệ thống nào nằm ngoài sự kiểm soát của Gatekeeper."
                  </p>
              </div>
              <div className="p-8 bg-black rounded-[2.5rem] border border-green-500/30 text-center shadow-2xl group cursor-pointer hover:border-green-500 transition-colors">
                  <p className="text-[8px] text-green-500 font-black uppercase tracking-widest mb-2">Verified By</p>
                  <p className="text-2xl font-serif gold-gradient italic uppercase tracking-tighter">KIM - Team 3</p>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default AuditDashboard;
