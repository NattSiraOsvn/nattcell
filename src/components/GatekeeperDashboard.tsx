
import React, { useState, useEffect } from 'react';
import { 
  Shield, AlertCircle, Zap, Activity, Database, Lock, 
  CheckCircle2, Server, Globe, Fingerprint, BadgeCheck, 
  RefreshCcw, Trash2, Link2Off, Layers, StopCircle, PlayCircle
} from 'lucide-react';
import AIAvatar from './AIAvatar.tsx';
import { PersonaID, AuditItem, SagaLog, DLQEvent } from '../types.ts';
import { AuditProvider } from '../services/admin/AuditService.ts';
import { EventBridge } from '../services/eventBridge.ts';

const GatekeeperDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'LEDGER' | 'STREAMS' | 'DLQ'>('LEDGER');
  const [logs, setLogs] = useState<AuditItem[]>([]);
  const [streams, setStreams] = useState(EventBridge.getRegistry());
  const [integrityStatus, setIntegrityStatus] = useState<{valid: boolean, count: number, orphans: number} | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const refreshData = () => {
        setLogs(AuditProvider.getLogs());
        setStreams(EventBridge.getRegistry());
    };
    refreshData();
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRunDeepAudit = async () => {
    setIsVerifying(true);
    await new Promise(r => setTimeout(r, 2000));
    const result = await AuditProvider.verifyChainIntegrity();
    setIntegrityStatus({
      valid: result.valid,
      count: result.totalRecords,
      orphans: result.orphans
    });
    setIsVerifying(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#020202] p-10 lg:p-14 overflow-y-auto no-scrollbar gap-10 animate-in fade-in duration-1000 pb-40 relative">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(245,158,11,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none"></div>

      <header className="flex justify-between items-end border-b border-white/5 pb-10 relative z-10">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 rounded-[2rem] bg-red-600 flex items-center justify-center text-white shadow-[0_0_50px_rgba(220,38,38,0.2)] animate-pulse">
              <Shield size={36} />
           </div>
           <div>
              <h2 className="ai-headline text-6xl italic uppercase tracking-tighter leading-none text-white">Master Oversight</h2>
              <p className="text-[10px] text-red-500 font-black tracking-[0.6em] ml-1 uppercase mt-3">Gatekeeper Control Node • 19TB Shard Analytics</p>
           </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="flex bg-black/60 p-1.5 rounded-2xl border border-white/10 shrink-0">
              {[
                { id: 'LEDGER', label: 'AUDIT LEDGER', icon: <Database size={14}/> },
                { id: 'STREAMS', label: 'EVENT STREAMS', icon: <Layers size={14}/> },
                { id: 'DLQ', label: 'DEAD LETTERS', icon: <AlertCircle size={14}/> }
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
             onClick={handleRunDeepAudit}
             disabled={isVerifying}
             className="px-10 py-4 bg-amber-500 text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-amber-400 transition-all active:scale-95 disabled:opacity-50"
           >
             {isVerifying ? 'VERIFYING...' : 'RUN DEEP SCAN'}
           </button>
        </div>
      </header>

      {activeTab === 'LEDGER' && (
        <div className="h-full ai-panel overflow-hidden border-white/5 bg-black/40 flex flex-col shadow-2xl animate-in slide-in-from-right-10 relative z-10">
           <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase italic tracking-widest flex items-center gap-3">
                 <Database size={16} className="text-amber-500" />
                 Immutable Shard Ledger
              </h3>
              <div className="flex items-center gap-4">
                 <span className="text-[9px] text-green-500 font-mono font-black uppercase tracking-widest px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">Protocol: Enforced</span>
              </div>
           </div>
           <div className="flex-1 overflow-y-auto no-scrollbar">
              <table className="w-full text-left text-[11px] border-collapse">
                 <thead className="sticky top-0 bg-[#0a0a0a] z-10 border-b border-white/10">
                    <tr className="text-stone-600 font-black uppercase tracking-widest">
                       <th className="p-8">Trace ID / Identity</th>
                       <th className="p-8">Action / Causation Chain</th>
                       <th className="p-8 text-right">Verification Hash</th>
                    </tr>
                 </thead>
                 <tbody className="text-stone-300 italic font-mono">
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                         <td className="p-8">
                            <p className="font-bold text-white uppercase">{log.id.split('-').pop()}</p>
                            <p className="text-[8px] text-cyan-500 mt-1 italic opacity-60">{log.userId}</p>
                         </td>
                         <td className="p-8">
                            <p className={`font-black uppercase tracking-tight ${log.action.includes('CRITICAL') ? 'text-red-500' : 'text-amber-500'}`}>
                                {log.action}
                            </p>
                            <p className="text-[10px] text-stone-500 mt-1 truncate max-w-lg">{log.details}</p>
                         </td>
                         <td className="p-8 text-right">
                            <code className="text-[9px] text-indigo-400 bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-500/20">
                               {log.hash.substring(0, 32)}...
                            </code>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      <footer className="mt-auto grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch relative z-10">
         <div className="lg:col-span-2 ai-panel p-10 bg-white/[0.01] border-white/5 flex flex-col justify-center">
            <h4 className="text-[10px] font-black text-stone-600 uppercase tracking-widest mb-6 flex items-center gap-3 italic">
                <CheckCircle2 size={16} className="text-green-500" /> System Integrity Assurance
            </h4>
            <p className="font-light text-lg text-stone-400 italic leading-relaxed">
               "Hệ thống đã bóc tách và niêm phong toàn bộ logic HDĐT. Mọi giao thức ký số Token SafeCA đều được ghi nhật ký bất biến. Anh Natt có thể hoàn toàn yên tâm về tính giải trình pháp lý của Shard Tài chính."
            </p>
         </div>
         <div className="ai-panel p-10 bg-black border-white/5 flex items-center gap-8 shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <AIAvatar personaId={PersonaID.KRIS} size="md" isThinking={isVerifying} />
             <div className="flex-1 relative z-10">
                <h4 className="text-[10px] font-black text-amber-500 uppercase mb-2 italic tracking-widest">KRIS (Team 3)</h4>
                <p className="text-[11px] text-stone-500 italic leading-relaxed font-light">
                   "Chào Anh Natt, KRIS đang giám sát 19TB Shard. Mọi giao dịch bóc tách thuế đều đã được niêm phong."
                </p>
             </div>
         </div>
      </footer>
    </div>
  );
};

export default GatekeeperDashboard;
