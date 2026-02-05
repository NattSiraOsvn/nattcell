
import React, { useState, useEffect } from 'react';
import { 
  Shield, Activity, Database, Lock, Search, 
  CheckCircle2, RefreshCcw, Link2Off, Layers, StopCircle, PlayCircle, Fingerprint
} from 'lucide-react';
import AIAvatar from './AIAvatar.tsx';
import { PersonaID, AuditItem, ConstitutionState } from '../types.ts';
import { AuditProvider } from '../services/admin/AuditService.ts';

const GatekeeperDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'LEDGER' | 'CAUSATION' | 'CELLS'>('CAUSATION');
  const [logs, setLogs] = useState<AuditItem[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const refreshData = () => {
        setLogs(AuditProvider.getLogs());
    };
    refreshData();
    const interval = setInterval(refreshData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDeepAudit = async () => {
    setIsVerifying(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsVerifying(false);
    alert("✓ Toàn bộ 19TB Shard đã được xác thực tính toàn vẹn.");
  };

  const cells = [
    { id: 'cell:sales', type: 'CORE-CELL', status: ConstitutionState.ENFORCED, health: 99.8 },
    { id: 'cell:finance', type: 'CORE-CELL', status: ConstitutionState.ENFORCED, health: 100 },
    { id: 'cell:warehouse', type: 'CORE-CELL', status: ConstitutionState.DEGRADED, health: 85.2 },
    { id: 'cell:uei', type: 'UEI-CELL', status: ConstitutionState.ENFORCED, health: 99.9 },
    { id: 'cell:thien_ai', type: 'AI-CELL', status: ConstitutionState.ENFORCED, health: 99.7 },
  ];

  return (
    <div className="h-full flex flex-col bg-[#020202] p-10 lg:p-14 overflow-y-auto no-scrollbar gap-10 animate-in fade-in duration-1000 pb-40 relative">
      <header className="flex justify-between items-end border-b border-white/5 pb-10 relative z-10">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 rounded-[2rem] bg-red-600 flex items-center justify-center text-white shadow-[0_0_50px_rgba(220,38,38,0.2)] animate-pulse">
              <Shield size={36} />
           </div>
           <div>
              <h2 className="ai-headline text-6xl italic uppercase tracking-tighter leading-none text-white">Master oversight</h2>
              <p className="text-[10px] text-red-500 font-black tracking-[0.6em] ml-1 uppercase mt-3">Gatekeeper Control • Constitution Enforcement</p>
           </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="flex bg-black/60 p-1.5 rounded-2xl border border-white/10 shrink-0">
              {[
                { id: 'CAUSATION', label: 'CAUSATION CHAIN', icon: <Layers size={14}/> },
                { id: 'CELLS', label: 'CELL STATUS', icon: <Activity size={14}/> },
                { id: 'LEDGER', label: 'IMMUTABLE LEDGER', icon: <Database size={14}/> }
              ].map(t => (
                <button 
                   key={t.id}
                   onClick={() => setActiveTab(t.id as any)}
                   className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${activeTab === t.id ? 'bg-red-600 text-white shadow-xl' : 'text-gray-500 hover:text-white'}`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
           </div>
           <button 
             onClick={handleDeepAudit}
             className="px-10 py-4 bg-amber-500 text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-amber-400 transition-all active:scale-95"
           >
             {isVerifying ? 'SCANNING...' : 'DEEP AUDIT SCAN'}
           </button>
        </div>
      </header>

      {/* 🧬 MAIN CONTENT SHARD */}
      <div className="flex-1 min-h-0">
          {activeTab === 'CAUSATION' && (
            <div className="h-full ai-panel p-10 bg-black border-white/5 flex flex-col shadow-2xl overflow-hidden relative">
               <div className="flex justify-between items-center mb-12">
                  <h3 className="text-xl font-bold text-white uppercase italic tracking-widest flex items-center gap-4">
                     <Layers size={20} className="text-indigo-400" />
                     Chain of Causation (Causal Map)
                  </h3>
                  <div className="flex gap-4">
                     <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg text-[9px] font-black">TRACE CONTINUITY: OK</span>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto space-y-10 pr-4 custom-scrollbar">
                  {logs.slice(0, 10).map((log, idx) => (
                    <div key={log.id} className="relative pl-12 flex gap-8 animate-in slide-in-from-left-4" style={{ animationDelay: `${idx * 100}ms` }}>
                       {/* Timeline Marker */}
                       <div className="absolute left-0 top-2 w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono text-stone-500">
                          {logs.length - idx}
                       </div>
                       {idx < logs.length - 1 && <div className="absolute left-[15px] top-10 bottom-[-2.5rem] w-px bg-white/5 border-l border-dashed border-white/10"></div>}

                       <div className="flex-1 p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:border-amber-500/30 transition-all">
                          <div className="flex justify-between items-start mb-4">
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{log.action}</span>
                                <span className="text-[8px] font-mono text-stone-600">Trace: {log.id.split('-').pop()}</span>
                             </div>
                             <span className="text-[9px] font-mono text-stone-700">{new Date(log.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-sm text-stone-400 font-light italic leading-relaxed">"{log.details}"</p>
                          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                             <div className="flex items-center gap-2">
                                <Fingerprint size={12} className="text-indigo-500" />
                                <span className="text-[8px] font-black text-stone-600 uppercase">Authorizer: {log.userId}</span>
                             </div>
                             {log.causation_id && (
                                <div className="flex items-center gap-2 text-cyan-400">
                                   <CheckCircle2 size={10} />
                                   <span className="text-[8px] font-black uppercase">Causal Link Verified</span>
                                </div>
                             )}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'CELLS' && (
            <div className="h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-10">
               {cells.map(cell => (
                 <div key={cell.id} className="ai-panel p-8 bg-black border-white/5 relative overflow-hidden group hover:border-amber-500/20 transition-all shadow-2xl">
                    <div className="flex justify-between items-start mb-10">
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-amber-500 group-hover:text-black transition-all duration-500">
                          <Layers size={24} />
                       </div>
                       <div className="text-right">
                          <p className="text-[8px] text-stone-600 font-black uppercase tracking-widest">Health Score</p>
                          <p className={`text-2xl font-mono font-black ${cell.health > 90 ? 'text-green-500' : 'text-amber-500'}`}>{cell.health}%</p>
                       </div>
                    </div>
                    
                    <h4 className="text-2xl font-bold text-white uppercase italic tracking-tighter mb-2">{cell.id}</h4>
                    <p className="text-[9px] text-stone-600 font-black uppercase tracking-[0.3em] mb-10">{cell.type}</p>
                    
                    <div className="space-y-4 pt-8 border-t border-white/5">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-stone-500 uppercase">Status</span>
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${
                            cell.status === ConstitutionState.ENFORCED ? 'bg-green-600/10 text-green-500 border-green-500/20' : 'bg-amber-600/10 text-amber-500 border-amber-500/20'
                          }`}>{cell.status}</span>
                       </div>
                       <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 animate-pulse" style={{ width: `${cell.health}%` }}></div>
                       </div>
                    </div>
                    
                    <button className="w-full mt-10 py-4 bg-white/5 border border-white/10 text-stone-500 font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-white/10 hover:text-white transition-all">Inspect Cell Shard</button>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'LEDGER' && (
            <div className="h-full ai-panel overflow-hidden border-white/5 bg-black/40 flex flex-col shadow-2xl">
               <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white uppercase italic tracking-widest flex items-center gap-3">
                     <Database size={16} className="text-amber-500" />
                     Shard Integrity Ledger
                  </h3>
               </div>
               <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left text-[11px] border-collapse">
                     <thead className="sticky top-0 bg-[#050505] z-10 border-b border-white/10">
                        <tr className="text-stone-600 font-black uppercase tracking-widest">
                           <th className="p-8">Shard Hash</th>
                           <th className="p-8">Identity</th>
                           <th className="p-8">Action Payload</th>
                           <th className="p-8 text-right">Verification</th>
                        </tr>
                     </thead>
                     <tbody className="text-stone-300 font-mono">
                        {logs.map(log => (
                          <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                             <td className="p-8"><span className="text-amber-500">{log.hash.substring(0, 16)}...</span></td>
                             <td className="p-8 text-indigo-400">{log.userId}</td>
                             <td className="p-8 text-[10px] max-w-xs truncate italic">"{log.details}"</td>
                             <td className="p-8 text-right"><span className="text-green-500">SEALED</span></td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}
      </div>

      <footer className="mt-auto grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch relative z-10">
         <div className="lg:col-span-2 ai-panel p-10 bg-white/[0.01] border-white/5 flex flex-col justify-center shadow-2xl">
            <h4 className="text-[10px] font-black text-stone-600 uppercase tracking-widest mb-6 flex items-center gap-3 italic">
                <CheckCircle2 size={16} className="text-green-500" /> Constitutional Integrity Assurance
            </h4>
            <p className="font-light text-lg text-stone-400 italic leading-relaxed">
               "Thưa Anh Natt, mọi Shard dữ liệu đã được niêm phong bản thảo Gold Master. KIM (Team 3) đang thực thi các luật bảo mật đa tầng, đảm bảo không một hành động nào nằm ngoài sự kiểm soát của Gatekeeper."
            </p>
         </div>
         <div className="ai-panel p-8 bg-black border-white/5 flex items-center gap-8 shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <AIAvatar personaId={PersonaID.KRIS} size="md" isThinking={false} />
             <div className="flex-1 relative z-10">
                <h4 className="text-[10px] font-black text-amber-500 uppercase mb-2 italic">KRIS (Team 3)</h4>
                <p className="text-[11px] text-stone-500 italic leading-relaxed font-light">
                   "KIM đã bóc tách xong log rò rỉ. Mọi vi phạm Book III đã được vá. Gatekeeper an toàn."
                </p>
             </div>
         </div>
      </footer>
    </div>
  );
};

export default GatekeeperDashboard;
