
import React, { useState } from 'react';
import { AlertCircle, PlayCircle, StopCircle, ShieldAlert, History, Activity } from 'lucide-react';
import AIAvatar from '../AIAvatar.tsx';
import { PersonaID } from '../../types.ts';

const EmergencyDashboard: React.FC = () => {
  const [eventStreams, setEventStreams] = useState([
    { id: 'sales.order.created.v1', status: 'active', throughput: '1200/min', risk: 'low' },
    { id: 'finance.payment.completed.v1', status: 'active', throughput: '800/min', risk: 'medium' },
    { id: 'warehouse.inventory.reserved.v1', status: 'active', throughput: '1500/min', risk: 'low' },
  ]);

  const [fraudAlerts] = useState([
    { id: 1, type: 'SUSPICIOUS_PATTERN', event: 'finance.payment.completed.v1', confidence: 87 },
    { id: 2, type: 'RATE_LIMIT_EXCEEDED', event: 'sales.order.created.v1', confidence: 65 },
  ]);

  const toggleStream = (id: string) => {
    setEventStreams(prev => prev.map(s => 
      s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s
    ));
  };

  return (
    <div className="h-full bg-[#020202] p-10 overflow-y-auto no-scrollbar space-y-10 animate-in fade-in duration-700">
      
      <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-[3rem] flex items-center gap-8 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-10 opacity-5 text-8xl grayscale">🚨</div>
         <div className="w-16 h-16 rounded-[1.5rem] bg-red-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <ShieldAlert size={32} />
         </div>
         <div>
            <h2 className="text-2xl font-black text-red-500 uppercase tracking-widest">GATEKEEPER EMERGENCY CONTROL PANEL</h2>
            <p className="text-sm text-red-200/60 font-light italic mt-1 leading-relaxed">
               "Sử dụng với sự cẩn trọng tối đa. Mọi hành động tại bảng điều khiển này đều được niêm phong vào sổ cái pháp lý vĩnh viễn."
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
         
         {/* STREAM CONTROL */}
         <div className="xl:col-span-2 ai-panel p-10 bg-black/40 border-white/5 shadow-2xl">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
               <Activity size={18} className="text-cyan-400" />
               Event Stream Orchestration
            </h3>
            <div className="space-y-6">
               {eventStreams.map(stream => (
                 <div key={stream.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center gap-6 flex-1">
                       <div className={`w-3 h-3 rounded-full ${stream.status === 'active' ? 'bg-green-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500 animate-pulse'}`}></div>
                       <div>
                          <p className="text-xs font-mono font-bold text-white uppercase">{stream.id}</p>
                          <div className="flex gap-4 mt-1">
                             <span className="text-[9px] text-gray-500 font-black uppercase">Load: {stream.throughput}</span>
                             <span className={`text-[9px] font-black uppercase ${stream.risk === 'medium' ? 'text-amber-500' : 'text-green-500'}`}>Risk: {stream.risk}</span>
                          </div>
                       </div>
                    </div>
                    <button 
                      onClick={() => toggleStream(stream.id)}
                      className={`px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 ${
                        stream.status === 'active' ? 'bg-red-600/20 text-red-500 border border-red-500/30 hover:bg-red-600 hover:text-white' : 'bg-green-600 text-white hover:bg-green-500'
                      }`}
                    >
                       {stream.status === 'active' ? <StopCircle size={14}/> : <PlayCircle size={14}/>}
                       {stream.status === 'active' ? 'PAUSE STREAM' : 'RESUME STREAM'}
                    </button>
                 </div>
               ))}
            </div>
         </div>

         {/* FRAUD ALERTS */}
         <div className="space-y-8">
            <div className="ai-panel p-8 bg-amber-950/10 border-amber-500/30 shadow-2xl">
               <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-8 flex items-center gap-3">
                  <AlertCircle size={16} /> Fraud Detection Feed
               </h3>
               <div className="space-y-4">
                  {fraudAlerts.map(alert => (
                    <div key={alert.id} className="p-4 bg-black/60 rounded-2xl border border-white/5 relative group overflow-hidden transition-all hover:border-amber-500/50">
                       <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-white uppercase tracking-tight">{alert.type}</span>
                          <span className={`text-[10px] font-mono font-black ${alert.confidence > 80 ? 'text-red-500' : 'text-amber-500'}`}>{alert.confidence}%</span>
                       </div>
                       <p className="text-[9px] text-gray-500 font-mono italic truncate">{alert.event}</p>
                       <button className="mt-4 w-full py-2 bg-red-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">BLOCK EVENT SOURCE</button>
                    </div>
                  ))}
               </div>
            </div>

            <div className="ai-panel p-8 bg-indigo-500/5 border-indigo-500/20 flex items-center gap-6">
               <AIAvatar personaId={PersonaID.THIEN} size="sm" isThinking={false} />
               <p className="text-[11px] text-gray-400 italic leading-relaxed font-light">
                  "Báo cáo Gatekeeper: KIM đã bọc tách được 02 rủi ro băm Shard chéo. Đã đưa vào Staging để Anh phán quyết."
               </p>
            </div>
         </div>

      </div>

      {/* SYSTEM ROLLBACK */}
      <div className="ai-panel p-10 bg-black/40 border-white/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-5 text-6xl italic grayscale">ROLLBACK</div>
         <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
            <History size={18} className="text-indigo-400" />
            System-Wide Temporal Rollback
         </h3>
         
         <div className="flex flex-col md:flex-row items-center gap-8 bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5">
            <div className="flex-1 space-y-2">
               <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Temporal Target (Timestamp)</label>
               <input type="datetime-local" className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-xs text-amber-500 font-mono outline-none focus:border-amber-500" />
            </div>
            <button className="px-12 py-5 bg-red-600 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl hover:bg-red-700 shadow-2xl transition-all active:scale-95">
               EXECUTE RE-SYNCHRONIZATION
            </button>
         </div>
         <p className="text-[9px] text-red-500/50 mt-6 italic font-black uppercase tracking-widest text-center">CẢNH BÁO: HÀNH ĐỘNG NÀY SẼ REPLAY LẠI TOÀN BỘ SỰ KIỆN TỪ DLQ VỀ THỜI ĐIỂM CHỌN.</p>
      </div>
    </div>
  );
};

export default EmergencyDashboard;
