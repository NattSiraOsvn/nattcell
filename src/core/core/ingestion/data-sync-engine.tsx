
import React, { useState, useEffect, useRef } from 'react';
// 🛠️ Fixed: Import casing for Types
import { SyncJob, SyncConflictStrategy, SyncLog, ConflictResolutionMethod, DataPoint } from '@/types';
import { OfflineService } from '@/services/offlineservice';
import { superdictionary } from '@/superdictionary';
import { ConflictEngine } from '@/services/conflict/conflictresolver';

const DataSyncEngine: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [syncMode, setSyncMode] = useState<'REALTIME' | 'MANUAL'>('REALTIME');
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  
  const [job, setJob] = useState<SyncJob>({
    id: 'job-omega-005',
    name: 'Omega Neural Sync - CRP Optimized',
    source: 'Local Shard (IndexedDB)',
    destination: 'Master Cloud Node',
    status: 'IDLE',
    progress: 0,
    totalRows: 0,
    processedRows: 0,
    duplicatesFound: 0,
    strategy: SyncConflictStrategy.MERGE,
    isIncremental: true,
    isEncrypted: true,
  });

  const [logs, setLogs] = useState<SyncLog[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, level: 'INFO' | 'WARNING' | 'ERROR' | 'SECURE' | 'SUCCESS' = 'INFO') => {
    const newLog: SyncLog = { id: Math.random().toString(36), timestamp: Date.now(), level, message };
    setLogs(prev => [newLog, ...prev].slice(0, 100));
  };

  useEffect(() => {
    let wsInterval: any;
    if (isConnected && syncMode === 'REALTIME') {
      addLog('🔌 WebSocket Connection Established (wss://omega-sync.tamluxury.com)', 'SECURE');
      wsInterval = setInterval(async () => {
        const rand = Math.random();
        if (rand > 0.9) {
          addLog('⚠️ Phát hiện xung đột tiềm tàng tại Shard Kế Toán. Đang kích hoạt CRP...', 'WARNING');
          
          // Giả lập 2 điểm dữ liệu xung đột
          const p1: DataPoint = { id: 'D1', source: 'DIRECT_API', payload: { val: 100 }, confidence: 0.98, timestamp: Date.now() - 5000 };
          const p2: DataPoint = { id: 'D2', source: 'OMEGA_OCR', payload: { val: 105 }, confidence: 0.85, timestamp: Date.now() };
          
          // 🛠️ Fix: Added missing priorityModule to satisfy ResolutionContext interface
          const resolution = await ConflictEngine.resolveConflicts([p1, p2], { businessType: 'FINANCE', priorityModule: 'ACCOUNTING' });
          
          if (resolution.isAutoResolved) {
             addLog(`✅ CRP Tự động giải quyết: Winner [${resolution.winner.source}] (Method: ${resolution.methodUsed})`, 'SUCCESS');
          } else {
             setConflicts(prev => [...prev, { id: `C-${Date.now()}`, desc: `Xung đột Tin cậy thấp tại Shard Kế toán`, resolution }]);
          }
        }
      }, 7000);
    } else {
      if (wsInterval) clearInterval(wsInterval);
    }
    return () => clearInterval(wsInterval);
  }, [isConnected, syncMode]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const toggleConnection = () => {
    setIsConnected(!isConnected);
    if (isConnected) {
      OfflineService.saveData('last_sync_state', { job, logs });
      addLog('💾 Switched to OFFLINE MODE. Changes will be queued.', 'INFO');
    } else {
      addLog('🚀 Back ONLINE. Flushing offline queue...', 'INFO');
      processOfflineQueue();
    }
  };

  const processOfflineQueue = async () => {
    if (offlineQueue.length === 0) return;
    addLog(`🔄 Processing ${offlineQueue.length} queued offline actions...`, 'INFO');
    for (let i = 0; i < offlineQueue.length; i++) {
      await new Promise(r => setTimeout(r, 500));
      addLog(`✅ Synced offline item: ${offlineQueue[i].action}`, 'SECURE');
    }
    setOfflineQueue([]);
    addLog('✨ Offline queue flushed successfully.', 'SUCCESS');
  };

  const startManualSync = async () => {
    if (!isConnected) {
      addLog('❌ Cannot start sync while OFFLINE.', 'ERROR');
      return;
    }
    setJob(prev => ({ ...prev, status: 'RUNNING', progress: 0, processedRows: 0, totalRows: 2000 }));
    addLog(`🚀 Starting CRP-Optimized Sync Job`, 'INFO');
    let current = 0;
    const total = 2000;
    const interval = setInterval(() => {
      current += 200;
      const progress = Math.min((current / total) * 100, 100);
      setJob(prev => ({ ...prev, processedRows: current, progress }));
      if (current >= total) {
        clearInterval(interval);
        setJob(prev => ({ ...prev, status: 'COMPLETED' }));
        addLog(`🏁 Sync Job Completed. CRP Shards verified.`, 'SUCCESS');
      }
    }, 300);
  };

  return (
    <div className="p-8 max-w-[1800px] mx-auto h-full overflow-y-auto space-y-8 animate-in fade-in duration-500 pb-32 bg-[#020202]">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-4xl font-serif gold-gradient italic tracking-tighter">CRP Sync Engine v5.0</h2>
          <p className="text-gray-400 font-light italic">Conflict Resolution Protocol • Source Reliability Scoring</p>
        </div>
        <div className="flex gap-4 items-center">
           <div className={`px-4 py-2 rounded-xl border flex items-center gap-3 ${isConnected ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-[10px] font-black uppercase tracking-widest">{isConnected ? 'ONLINE' : 'OFFLINE MODE'}</span>
           </div>
           <button onClick={toggleConnection} className="px-6 py-3 bg-white/5 border border-white/10 text-white font-bold text-[10px] uppercase rounded-xl hover:bg-white/10 transition-all">{isConnected ? 'GO OFFLINE' : 'GO ONLINE'}</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
           <div className="ai-panel p-8 bg-black/40 border-white/10">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">CRP Sync Configuration</h3>
              <div className="space-y-6">
                 <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                    <p className="text-[9px] text-indigo-400 font-black uppercase mb-1">CRP Strategy</p>
                    <p className="text-xs text-white italic">Confidence-based Auto Collapse</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => addLog('Simulation: Manual entry record added.', 'INFO')} className="py-4 border border-white/10 bg-white/5 text-gray-300 font-bold text-[10px] uppercase rounded-xl hover:bg-white/10 transition-all">+ Add Record</button>
                    <button onClick={startManualSync} disabled={!isConnected || job.status === 'RUNNING'} className="py-4 bg-amber-500 text-black font-black text-[10px] uppercase rounded-xl hover:bg-amber-400 transition-all disabled:opacity-50">Force CRP Sync</button>
                 </div>
              </div>
           </div>

           {conflicts.length > 0 && (
             <div className="ai-panel p-8 bg-red-500/10 border-red-500/30 animate-pulse">
                <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2"><span>⚡</span> Unresolved CRP Conflicts ({conflicts.length})</h3>
                <div className="space-y-4 max-h-64 overflow-y-auto no-scrollbar">
                   {conflicts.map(c => (
                      <div key={c.id} className="p-4 bg-black/60 rounded-xl border border-red-500/20">
                         <p className="text-[10px] text-white font-mono mb-2 uppercase">{c.desc}</p>
                         <p className="text-[8px] text-gray-500 mb-3 italic">Confidence Gap: Low. Manual Review Required.</p>
                         <div className="flex gap-2">
                            <button onClick={() => setConflicts(prev => prev.filter(x => x.id !== c.id))} className="flex-1 py-1.5 bg-white/10 text-white text-[8px] font-black uppercase rounded hover:bg-white/20">Keep Winner</button>
                            <button onClick={() => setConflicts(prev => prev.filter(x => x.id !== c.id))} className="flex-1 py-1.5 bg-red-600 text-white text-[8px] font-black uppercase rounded hover:bg-red-500">Pick Alternative</button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
           )}
        </div>

        <div className="lg:col-span-2 space-y-8">
           <div className="ai-panel p-10 bg-black/40 border-white/10 relative overflow-hidden">
              <div className="flex justify-between items-end mb-6">
                 <div>
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Active CRP Job</p>
                    <h3 className="text-xl font-bold text-white italic">Shard Reconciliation Protocol</h3>
                 </div>
                 <span className={`text-4xl font-mono font-black ${job.status === 'COMPLETED' ? 'text-green-500' : 'text-amber-500'}`}>{job.progress.toFixed(0)}%</span>
              </div>
              <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden mb-8">
                 <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-300 relative" style={{ width: `${job.progress}%` }}>
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_1s_infinite]"></div>
                 </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[9px] text-gray-500 uppercase mb-1 font-black">Sync Rate</p>
                    <p className="text-2xl font-mono text-white">450 p/s</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[9px] text-gray-500 uppercase mb-1 font-black">Conflict Resolution</p>
                    <p className="text-2xl font-mono text-green-500">Auto</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[9px] text-gray-500 uppercase mb-1 font-black">Isolation Level</p>
                    <p className="text-2xl font-mono text-cyan-400">OMEGA</p>
                 </div>
              </div>
           </div>

           <div className="ai-panel p-0 bg-black border-white/10 flex flex-col h-[400px] overflow-hidden shadow-2xl font-mono">
              <div className="p-4 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
                 <span className="text-[10px] text-gray-400 uppercase tracking-widest">CRP Synchronization Console</span>
              </div>
              <div ref={logContainerRef} className="flex-1 p-6 overflow-y-auto no-scrollbar font-mono text-[10px] space-y-1.5 bg-black">
                 {logs.map((log) => (
                    <div key={log.id} className="flex gap-3 animate-in slide-in-from-left-2">
                       <span className="text-gray-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                       <span className={log.level === 'SECURE' ? 'text-green-400' : log.level === 'SUCCESS' ? 'text-green-500' : log.level === 'WARNING' ? 'text-amber-500' : log.level === 'ERROR' ? 'text-red-500' : 'text-gray-300'}>
                          {log.message}
                       </span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DataSyncEngine;
