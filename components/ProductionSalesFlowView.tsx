
import React, { useState, useEffect, useRef } from 'react';
/* Fix: Import SalesChannel from types directly */
import { SalesChannel } from '../types';
import { FlowEngine, FlowLog } from '../services/productionSalesFlow';
import AIAvatar from './AIAvatar';
import { PersonaID } from '../types';

const ProductionSalesFlowView: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [materialType, setMaterialType] = useState('GOLD_18K');
  const [quantity, setQuantity] = useState(1); // kg
  const [channel, setChannel] = useState<SalesChannel>(SalesChannel.WHOLESALE);
  
  const [logs, setLogs] = useState<FlowLog[]>([]);
  const [result, setResult] = useState<any>(null);
  
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return FlowEngine.subscribe((newLogs) => {
      setLogs(newLogs);
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = 0;
      }
    });
  }, []);

  const handleStartFlow = async () => {
    setIsRunning(true);
    setResult(null);
    try {
      const res = await FlowEngine.fullFlow(materialType, quantity, channel);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const steps = [
    { id: 'IMPORT', label: 'Nhập Khẩu', icon: '🚢', color: 'blue' },
    { id: 'PRODUCTION', label: 'Sản Xuất', icon: '🏭', color: 'orange' },
    { id: 'DISTRIBUTION', label: 'Phân Phối', icon: '🚚', color: 'purple' },
    { id: 'SALES', label: 'Bán Hàng', icon: '💰', color: 'green' },
    { id: 'FINANCE', label: 'Tài Chính', icon: '📊', color: 'amber' }
  ];

  const getCurrentStepIndex = () => {
    if (logs.length === 0) return -1;
    const lastLog = logs[0]; // Newest first
    const stepIds = steps.map(s => s.id);
    // Find the highest index that has appeared in logs
    let maxIdx = -1;
    for(const log of logs) {
        const idx = stepIds.indexOf(log.step);
        if (idx > maxIdx) maxIdx = idx;
    }
    // Alternatively, just check the latest log's step
    return stepIds.indexOf(lastLog.step);
  };

  const currentStepIdx = getCurrentStepIndex();

  return (
    <div className="p-8 md:p-12 h-full overflow-y-auto no-scrollbar bg-[#020202] animate-in fade-in duration-700 pb-32">
      <header className="mb-12 border-b border-white/5 pb-8 flex justify-between items-end">
        <div>
           <div className="flex items-center gap-4 mb-2">
              <span className="text-4xl">🔄</span>
              <h2 className="ai-headline text-5xl italic uppercase tracking-tighter">Production Sales Flow</h2>
           </div>
           <p className="ai-sub-headline text-gray-500 font-black tracking-[0.3em] ml-1">Quy trình End-to-End: Từ Nguyên liệu đến Doanh thu</p>
        </div>
        
        {!isRunning && !result && (
           <div className="flex gap-4 items-end">
              <div className="space-y-1">
                 <label className="text-[9px] font-black text-gray-500 uppercase">Nguyên liệu</label>
                 <select value={materialType} onChange={e => setMaterialType(e.target.value)} className="w-32 bg-black border border-white/10 rounded-lg p-2 text-[10px] text-white font-bold outline-none">
                    <option value="GOLD_18K">Vàng 18K</option>
                    <option value="GOLD_24K">Vàng 24K</option>
                    <option value="DIAMOND_ROUGH">Kim cương Thô</option>
                 </select>
              </div>
              <div className="space-y-1">
                 <label className="text-[9px] font-black text-gray-500 uppercase">Số lượng (kg/carat)</label>
                 <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-20 bg-black border border-white/10 rounded-lg p-2 text-[10px] text-white font-bold outline-none text-center" />
              </div>
              <div className="space-y-1">
                 <label className="text-[9px] font-black text-gray-500 uppercase">Kênh bán</label>
                 <select value={channel} onChange={e => setChannel(e.target.value as any)} className="w-32 bg-black border border-white/10 rounded-lg p-2 text-[10px] text-white font-bold outline-none">
                    <option value={SalesChannel.WHOLESALE}>Bán Sỉ</option>
                    <option value={SalesChannel.ONLINE}>Online</option>
                    <option value={SalesChannel.DIRECT_SALE}>Showroom</option>
                 </select>
              </div>
              <button 
                onClick={handleStartFlow}
                className="px-8 py-3 bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-amber-400 shadow-xl active:scale-95 transition-all h-fit"
              >
                KÍCH HOẠT QUY TRÌNH
              </button>
           </div>
        )}
      </header>

      {/* PIPELINE VISUALIZATION */}
      <div className="ai-panel p-12 bg-gradient-to-r from-white/[0.02] to-transparent border-white/10 mb-12 relative overflow-hidden">
         {isRunning && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-[shimmer_2s_infinite]"></div>}
         
         <div className="flex justify-between items-center relative z-10">
            {steps.map((step, i) => {
               const isActive = i === currentStepIdx;
               const isDone = i < currentStepIdx;
               const isPending = i > currentStepIdx;

               return (
                  <div key={step.id} className="flex flex-col items-center gap-4 relative group">
                     {/* Connector Line */}
                     {i < steps.length - 1 && (
                        <div className="absolute top-8 left-full w-[calc(100vw/5-4rem)] h-0.5 bg-white/5 -z-10">
                           <div className={`h-full bg-${step.color}-500 transition-all duration-500 ${isDone ? 'w-full' : 'w-0'}`}></div>
                        </div>
                     )}
                     
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border-2 transition-all duration-500 ${
                        isActive ? `bg-${step.color}-500 text-black border-${step.color}-500 scale-110 shadow-[0_0_30px_rgba(255,255,255,0.2)]` : 
                        isDone ? `bg-${step.color}-500/20 text-${step.color}-500 border-${step.color}-500/50` : 
                        'bg-black border-white/10 text-gray-700'
                     }`}>
                        {step.icon}
                     </div>
                     <div className="text-center">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${isActive || isDone ? 'text-white' : 'text-gray-600'}`}>{step.label}</p>
                        {isActive && <span className="text-[8px] text-amber-500 animate-pulse">PROCESSING...</span>}
                     </div>
                  </div>
               );
            })}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-[500px]">
         {/* LIVE LOGS */}
         <div className="ai-panel p-8 bg-black/40 border-white/10 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-6 shrink-0">
               <h3 className="text-sm font-bold text-white uppercase tracking-widest">Nhật Ký Vận Hành (Live Ledger)</h3>
               <div className="flex gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[9px] text-green-500 font-black">REALTIME</span>
               </div>
            </div>
            <div ref={logContainerRef} className="flex-1 overflow-y-auto no-scrollbar space-y-3 font-mono text-[10px]">
               {logs.map((log, i) => (
                  <div key={i} className="flex gap-4 animate-in slide-in-from-left-4 border-l border-white/10 pl-4 py-1 hover:border-amber-500 transition-colors">
                     <span className="text-gray-500 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                     <span className={`font-black w-24 shrink-0 uppercase ${
                        log.step === 'ERROR' ? 'text-red-500' :
                        log.step === 'FINANCE' ? 'text-amber-500' :
                        'text-cyan-400'
                     }`}>{log.step}</span>
                     <span className="text-gray-300 italic">{log.detail}</span>
                  </div>
               ))}
               {logs.length === 0 && <p className="text-gray-600 italic text-center mt-20">Sẵn sàng khởi chạy quy trình...</p>}
            </div>
         </div>

         {/* RESULT CARD */}
         <div className="space-y-8">
            {result ? (
               <div className="ai-panel p-10 bg-amber-500/[0.03] border-amber-500/20 h-full flex flex-col justify-center animate-in zoom-in-95">
                  <div className="flex items-center gap-6 mb-8">
                     <AIAvatar personaId={PersonaID.CAN} size="md" />
                     <div>
                        <h4 className="text-xl font-bold text-amber-500 uppercase italic">Báo cáo Hiệu quả (P&L)</h4>
                        <p className="text-[10px] text-gray-500 font-black tracking-widest uppercase">Commerce Core Analysis</p>
                     </div>
                  </div>
                  
                  <div className="space-y-6">
                     <div className="flex justify-between items-end border-b border-white/5 pb-2">
                        <span className="text-[11px] text-gray-400 font-bold uppercase">Doanh thu</span>
                        <span className="text-2xl font-mono font-black text-white">{result.financialReport.totalRevenue.toLocaleString()} đ</span>
                     </div>
                     <div className="flex justify-between items-end border-b border-white/5 pb-2">
                        <span className="text-[11px] text-gray-400 font-bold uppercase">Giá vốn (COGS)</span>
                        <span className="text-xl font-mono font-bold text-red-400">-{result.financialReport.cogs.toLocaleString()} đ</span>
                     </div>
                     <div className="flex justify-between items-end border-b border-white/5 pb-2">
                        <span className="text-[11px] text-gray-400 font-bold uppercase">Chi phí (OpEx)</span>
                        <span className="text-xl font-mono font-bold text-red-400">-{result.financialReport.opex.toLocaleString()} đ</span>
                     </div>
                     <div className="pt-4 mt-4 bg-green-500/10 p-6 rounded-2xl border border-green-500/20">
                        <div className="flex justify-between items-center">
                           <span className="text-sm font-black text-green-500 uppercase tracking-widest">Lợi Nhuận Ròng</span>
                           <span className="text-3xl font-mono font-black text-white">{result.financialReport.netProfit.toLocaleString()} đ</span>
                        </div>
                        <p className="text-right text-[10px] text-green-400 font-bold mt-2">Margin: {result.financialReport.margin.toFixed(2)}%</p>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="ai-panel p-10 bg-black/20 border-white/5 h-full flex flex-col items-center justify-center text-center opacity-40">
                  <p className="text-8xl mb-6 grayscale">📊</p>
                  <p className="text-xl font-serif uppercase tracking-widest">Financial Node Standby</p>
                  <p className="text-xs mt-4 uppercase font-black text-gray-500 tracking-[0.2em]">Kết quả tài chính sẽ hiển thị sau khi quy trình hoàn tất.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default ProductionSalesFlowView;
