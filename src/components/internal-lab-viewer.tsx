
import React, { useState, useEffect } from 'react';
import { ViewType, UserRole, PersonaID } from '../types';
import AIAvatar from './AIAvatar';

interface Props {
  view: ViewType;
}

const InternalLabViewer: React.FC<Props> = ({ view }) => {
  const [scannedData, setScannedData] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    setIsScanning(true);
    const mockShards = [
      `[SHARD_ID: 0x${Math.random().toString(16).slice(2, 10).toUpperCase()}] Initializing Stream...`,
      `[OMEGA_PROTOCOL] Accessing 19TB Cold Storage...`,
      `[IDENTITY_LINK] Authenticating Master Natt... OK`,
      `[DATA_DUMP] Segment: ${view.toUpperCase()}`,
      `[INTEGRITY] Hash check: 100% Valid`,
      `[READ_ONLY] Protocol enforced. No-write state active.`
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < mockShards.length) {
        setScannedData(prev => [...prev, mockShards[i]]);
        i += 1;
      } else {
        setIsScanning(false);
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [view]);

  return (
    <div className="h-full bg-black p-8 md:p-12 flex flex-col gap-10 overflow-hidden font-mono">
      <header className="flex justify-between items-start border-b border-red-500/20 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
             <span className="px-3 py-1 bg-red-600 text-white text-[9px] font-black rounded uppercase">Internal Lab Mode</span>
             <h2 className="text-4xl font-serif gold-gradient italic uppercase tracking-tighter italic">Scanning: {view.replace('_', ' ')}</h2>
          </div>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">Trạng thái: Chỉ đọc (Observe Only) • 19TB Shard Buffer</p>
        </div>
        <div className="text-right">
           <p className="text-[9px] text-red-500 font-black uppercase mb-1">Security Level</p>
           <p className="text-xl text-white font-black">OMEGA PRIME</p>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-10 min-h-0">
         <div className="lg:col-span-2 ai-panel p-8 bg-black border-red-500/10 shadow-[inset_0_0_50px_rgba(239,68,68,0.05)] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-6">
               <span className="text-[10px] text-gray-600 uppercase font-black tracking-widest italic">Raw Data Stream (Live)</span>
               {isScanning && <span className="text-red-500 text-[9px] animate-pulse font-black">SCANNING 19TB...</span>}
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 text-[11px] text-green-500/80">
               {scannedData.map((log, idx) => (
                 <p key={idx} className="animate-in slide-in-from-left-2 duration-300">
                    <span className="text-gray-700 mr-4">{idx + 1}.</span> {log}
                 </p>
               ))}
               {!isScanning && (
                 <div className="mt-10 p-10 border border-dashed border-white/5 rounded-3xl text-center opacity-20 italic">
                    <p className="text-lg">End of Shard Segment.</p>
                    <p className="text-xs">Tiếp tục soi các Node liên kết tại Navigator.</p>
                 </div>
               )}
            </div>
         </div>

         <div className="space-y-8">
            <div className="ai-panel p-8 bg-amber-500/5 border-amber-500/20 shadow-2xl">
               <div className="flex items-center gap-4 mb-6">
                  <AIAvatar personaId={PersonaID.THIEN} size="sm" isThinking={isScanning} />
                  <h4 className="text-sm font-black text-amber-500 uppercase tracking-widest">Cố vấn Thiên Lab</h4>
               </div>
               <p className="text-[12px] text-gray-400 italic leading-relaxed font-light">
                  "Thưa Anh Natt, Thiên đã mở cổng quan sát Node **{view}**. Ở chế độ này, Anh có thể soi toàn bộ 'xương cốt' của dữ liệu mà không sợ làm lệch sổ sách. Đây là môi trường an toàn tuyệt đối để Anh Audit trước khi vận hành."
               </p>
               <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                  <button className="w-full py-4 bg-white/5 border border-white/10 text-gray-600 text-[10px] font-black uppercase rounded-xl cursor-not-allowed">
                     🔒 Operations Locked
                  </button>
                  <p className="text-[8px] text-gray-700 text-center uppercase tracking-widest font-black italic">Read-only Shard Protection active</p>
               </div>
            </div>

            <div className="ai-panel p-8 bg-black/40 border-white/5 flex flex-col justify-between h-48">
               <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.4em]">Audit Trail Trace</p>
               <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="text-gray-700 font-bold uppercase">Data Weight:</span>
                     <span className="text-white font-mono">1.2 TB (Segment)</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="text-gray-700 font-bold uppercase">Consistency:</span>
                     <span className="text-green-500 font-black">100.0%</span>
                  </div>
               </div>
            </div>
         </div>
      </main>
    </div>
  );
};

export default InternalLabViewer;
