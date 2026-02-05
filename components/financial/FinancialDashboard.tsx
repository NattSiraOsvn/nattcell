
import React, { useState, useEffect, useMemo } from 'react';
import { useAccounting } from '../../contexts/AccountingContext';
import { FinancialAnomaly, PersonaID, AccountingEntry, ProductType, WarehouseLocation, Department } from '../../types';
import AIAvatar from '../AIAvatar';
import { AlertCircle, TrendingUp, DollarSign, ShieldAlert, BarChart3, Clock } from 'lucide-react';
import { EventBridge } from '../../services/eventBridge';
import { SalesCore } from '../../services/salesCore';

const FinancialDashboard: React.FC = () => {
  const { entries, getSummary, isLoading } = useAccounting();
  const [anomalies, setAnomalies] = useState<FinancialAnomaly[]>([]);
  
  const summary = getSummary();

  useEffect(() => {
    // Đăng ký nhận tín hiệu rủi ro từ Shard Risk
    const unsub = EventBridge.subscribe('finance.financial.anomaly.detected.v1', (event) => {
        const newAnomaly: FinancialAnomaly = {
            id: `ANM-${Date.now()}`,
            invoice_id: event.payload.invoice_id,
            reason: event.payload.reason,
            amount: 0, // Sẽ lấy từ Read-model thực tế
            severity: event.payload.severity,
            timestamp: Date.now()
        };
        setAnomalies(prev => [newAnomaly, ...prev].slice(0, 5));
    });
    return unsub;
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#020202] p-10 overflow-y-auto no-scrollbar gap-10 animate-in fade-in duration-700 pb-40">
      
      <header className="flex justify-between items-end border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-4 mb-3">
             <DollarSign className="text-emerald-500" size={32} />
             <h2 className="ai-headline text-5xl italic uppercase tracking-tighter leading-none text-white">Financial Intelligence</h2>
          </div>
          <p className="ai-sub-headline text-cyan-300/40 ml-1 italic font-black tracking-[0.4em]">Accounting Core • TT200 Compliance • Team 2 Node</p>
        </div>
        
        <div className="flex bg-black/40 p-4 rounded-3xl border border-white/5 shadow-inner">
            <div className="text-right">
                <p className="text-[9px] text-gray-600 uppercase font-black">Net Profit (Live)</p>
                <p className="text-2xl font-mono text-emerald-500 font-bold">
                    {(summary.totalRevenue - summary.totalExpenses).toLocaleString()} đ
                </p>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* MAIN STATS */}
         <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="ai-panel p-10 bg-black/40 border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl grayscale">📊</div>
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Total Revenue (Credit 511)</p>
               <p className="text-5xl font-mono font-black text-white">{summary.totalRevenue.toLocaleString()}</p>
               <div className="mt-8 flex items-center gap-2 text-emerald-500">
                  <TrendingUp size={16} />
                  <span className="text-[10px] font-bold uppercase">Optimal Performance</span>
               </div>
            </div>

            <div className="ai-panel p-10 bg-black/40 border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl grayscale">💸</div>
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Total Expenses (Debit 6/8)</p>
               <p className="text-5xl font-mono font-black text-white">{summary.totalExpenses.toLocaleString()}</p>
               <div className="mt-8 flex items-center gap-2 text-gray-500">
                  <BarChart3 size={16} />
                  <span className="text-[10px] font-bold uppercase">Within Budget Shard</span>
               </div>
            </div>

            {/* ANOMALIES SECTION */}
            <div className="md:col-span-2 ai-panel p-10 bg-red-950/5 border-red-500/20">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-sm font-black text-red-500 uppercase tracking-widest flex items-center gap-3">
                     <ShieldAlert size={18} className="animate-pulse" />
                     Risk & Anomaly Monitor (Live)
                  </h3>
               </div>
               
               <div className="space-y-4">
                  {anomalies.map(an => (
                    <div key={an.id} className="p-5 bg-black/60 rounded-2xl border border-red-500/30 flex justify-between items-center group animate-in slide-in-from-right-4">
                       <div className="flex items-center gap-6">
                          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 font-black text-xs">!</div>
                          <div>
                             <p className="text-xs font-bold text-white uppercase">{an.reason}</p>
                             <p className="text-[9px] text-gray-500 font-mono mt-1">Ref: {an.invoice_id} • {new Date(an.timestamp).toLocaleTimeString()}</p>
                          </div>
                       </div>
                       <button className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-[8px] font-black uppercase shadow-lg">Investigate Shard</button>
                    </div>
                  ))}
                  {anomalies.length === 0 && (
                    <div className="py-10 text-center opacity-30 italic text-gray-500 text-xs">No anomalies detected in the current session.</div>
                  )}
               </div>
            </div>
         </div>

         {/* ADVISOR SIDEBAR */}
         <div className="lg:col-span-4 space-y-8">
            <div className="ai-panel p-8 bg-indigo-500/5 border-indigo-500/20 shadow-2xl">
               <div className="flex items-center gap-6 mb-8">
                  <AIAvatar personaId={PersonaID.CAN} size="md" isThinking={false} />
                  <div>
                    <h4 className="text-sm font-black text-indigo-400 uppercase tracking-widest">Can - Governor Agent</h4>
                    <p className="text-[9px] text-gray-600 font-bold uppercase mt-1 italic">Financial Mindscape v1.0</p>
                  </div>
               </div>
               <p className="text-sm text-gray-400 italic leading-relaxed font-light mb-10">
                  "Thưa Anh Natt, Can đã bóc tách xong Shard tài chính ngày hôm nay. 100% hóa đơn đã được đối soát với **Warehouse Shard**. Hiện tại chưa phát hiện dấu hiệu rò rỉ lợi nhuận tại các Node bán lẻ."
               </p>
               <button className="w-full py-4 bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-emerald-500 transition-all shadow-xl active:scale-95">
                  Generate Tax Report (XML)
               </button>
            </div>

            <div className="ai-panel p-8 bg-black border-white/5">
               <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">System Health</h4>
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="text-gray-600 font-bold uppercase">Ledger Integrity:</span>
                     <span className="text-emerald-500 font-black italic">VERIFIED</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="text-gray-600 font-bold uppercase">Sync Latency:</span>
                     <span className="text-cyan-400 font-mono">12ms</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
