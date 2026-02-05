import React, { useState } from 'react';
import AIAvatar from './AIAvatar';
import { PersonaID, BusinessMetrics, UserRole, UserPosition, ActionLog, HeatLevel } from '../types';
import { ShardingService } from '../services/blockchainService';
import { useAuthority } from '../hooks/useAuthority';

interface ThienCommandCenterProps {
  metrics: BusinessMetrics;
  actionLogs: ActionLog[];
  currentRole: UserRole;
  currentPosition: UserPosition;
  updateFinance: (data: Partial<BusinessMetrics>) => void;
}

const ThienCommandCenter: React.FC<ThienCommandCenterProps> = ({ metrics, updateFinance, actionLogs, currentRole, currentPosition }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [commandLog, setCommandLog] = useState<string[]>([]);
  const [heat, setHeat] = useState<HeatLevel>(HeatLevel.LEVEL_1);

  // 1️⃣ Fix: Sử dụng Authority Source of Truth
  const auth = useAuthority(currentRole, currentPosition);

  const runDeepSync = async () => {
    if (!auth.isMaster) return alert("Hệ thống: Access Denied. Yêu cầu quyền CORE MASTER.");
    
    setIsScanning(true);
    setHeat(HeatLevel.LEVEL_3); 
    setCommandLog(prev => [`[${new Date().toLocaleTimeString()}] 🚀 KÍCH HOẠT OMEGA DEEP SCAN...`, ...prev]);
    
    const shards = ['FINANCE', 'SALES', 'LOGISTICS', 'JEWELRY_PROD'];
    for (const shard of shards) {
      await new Promise(r => setTimeout(r, 600));
      setCommandLog(prev => [`[${new Date().toLocaleTimeString()}] 🔍 Verifying Shard: ${shard}... OK`, ...prev]);
    }

    setTimeout(() => {
      const syncHash = ShardingService.generateShardHash({ metrics, timestamp: Date.now() });
      setCommandLog(prev => [
        `[${new Date().toLocaleTimeString()}] ✓ TRACE LOCKED: ${syncHash}`,
        `[${new Date().toLocaleTimeString()}] ✓ ĐÃ ĐỒNG BỘ 32 SHARD THÀNH CÔNG.`,
        ...prev
      ]);
      setIsScanning(false);
      setHeat(HeatLevel.LEVEL_1);
    }, 1000);
  };

  if (auth.level !== 'CORE') {
     return (
        <div className="h-full flex flex-col items-center justify-center opacity-40 text-center p-20">
           <span className="text-8xl mb-8 grayscale">🔱</span>
           <h3 className="text-3xl font-serif gold-gradient italic uppercase">Access Restricted</h3>
           <p className="text-sm text-gray-500 mt-4">Module này chỉ dành cho Hội đồng Quản trị (CORE LEVEL).</p>
        </div>
     );
  }

  const commandButtons = [
    { id: 'SYNC', label: 'FORCE OMEGA SYNC', icon: '🧬', action: runDeepSync, color: 'border-cyan-500' },
    { id: 'TAX', label: 'KÝ SỐ TCT', icon: '🔐', action: () => {}, color: 'border-amber-500' },
    { id: 'SHIELD', label: 'PHONG TỎA SHARD', icon: '🛡️', action: () => {}, color: 'border-red-500' },
    { id: 'RESTORE', label: 'ROLLBACK TRACE', icon: '🔄', action: () => {}, color: 'border-blue-500' },
  ];

  return (
    <div className={`p-8 max-w-[1600px] mx-auto h-full flex flex-col space-y-12 animate-in fade-in duration-1000 overflow-y-auto no-scrollbar pb-40 transition-all ${heat === HeatLevel.LEVEL_3 ? 'bg-black/60' : ''}`}>
      <header className="flex flex-col lg:flex-row items-end gap-20 border-b border-white/5 pb-10">
        <div className="flex-1">
           <div className="flex items-center gap-6 mb-4">
              <AIAvatar personaId={PersonaID.THIEN} size="lg" isThinking={isScanning} />
              <div>
                 <h2 className="text-5xl font-serif gold-gradient italic uppercase tracking-tighter leading-none">Trung Tâm Chỉ Huy Omega</h2>
                 <p className="text-gray-400 text-sm mt-2 font-light italic max-w-2xl leading-relaxed">
                   "Thưa Anh Natt, Thiên đã đồng bộ Shard Authority. Anh hiện đang nắm quyền kiểm soát CORE ({auth.trustScore}% Trust)."
                 </p>
              </div>
           </div>
        </div>
      </header>

      <div className="space-y-12 animate-in slide-in-from-right-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {commandButtons.map(btn => (
              <button
                key={btn.id}
                onClick={btn.action}
                disabled={isScanning}
                className={`glass p-10 rounded-[3rem] border-2 ${btn.color} hover:bg-white/[0.05] transition-all group active:scale-95 disabled:opacity-50 flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden`}
              >
                {isScanning && btn.id === 'SYNC' && <div className="absolute inset-0 bg-cyan-500/10 animate-pulse"></div>}
                <span className="text-5xl group-hover:scale-110 transition-transform">{btn.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">{btn.label}</span>
              </button>
            ))}
          </div>

          <div className="glass rounded-[4rem] border border-white/5 bg-black/60 flex flex-col shadow-2xl min-h-[450px]">
            <div className="p-10 border-b border-white/5 flex justify-between items-center">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">COMMAND ECHO LEDGER</h3>
               <div className="flex items-center gap-4">
                  <span className="text-[8px] text-cyan-400 font-mono">TRACE LOCKED</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,1)]"></div>
               </div>
            </div>
            <div className="flex-1 p-10 overflow-y-auto no-scrollbar font-mono text-xs space-y-4">
              {commandLog.map((log, i) => (
                <div key={i} className="flex gap-6 animate-in slide-in-from-left-4">
                  <span className="text-amber-500 shrink-0">EXECUTED ·</span>
                  <p className="text-gray-300 italic">{log}</p>
                </div>
              ))}
              {commandLog.length === 0 && (
                <p className="text-center py-20 opacity-20 uppercase tracking-[0.5em] font-black italic">Hệ thống đang chờ mật lệnh của Anh...</p>
              )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default ThienCommandCenter;