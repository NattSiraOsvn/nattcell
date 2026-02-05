
import React, { useState, useEffect } from 'react';
import { EventBridge } from '../services/eventBridge.ts';
import { SagaLog } from '../types.ts';
import { Activity, RotateCcw, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface SagaVisualizerProps {
  correlationId?: string;
}

const SagaVisualizer: React.FC<SagaVisualizerProps> = ({ correlationId }) => {
  const [logs, setLogs] = useState<SagaLog[]>([]);

  useEffect(() => {
    const refresh = () => setLogs(EventBridge.getSagaHistory(correlationId));
    refresh();
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, [correlationId]);

  return (
    <div className="ai-panel p-8 bg-black/60 border-indigo-500/20 shadow-2xl flex flex-col gap-6">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
         <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.4em] flex items-center gap-3">
            <Activity size={16} className="animate-pulse" />
            Saga Flow Visualizer
         </h3>
         <span className="text-[9px] font-mono text-gray-600 uppercase">Real-time Orchestration</span>
      </div>

      <div className="space-y-6">
         {logs.length === 0 ? (
           <p className="text-center py-10 text-gray-700 italic text-[10px] uppercase tracking-widest">Đang lắng nghe tín hiệu từ các Shard...</p>
         ) : (
           logs.map((log, i) => (
             <div key={log.id} className="relative pl-10 animate-in slide-in-from-left-4" style={{ animationDelay: `${i * 100}ms` }}>
                {/* Timeline Line */}
                {i < logs.length - 1 && (
                  <div className="absolute left-[15px] top-8 bottom-[-1.5rem] w-px bg-white/5 border-l border-dashed border-white/10"></div>
                )}
                
                {/* Status Icon */}
                <div className={`absolute left-0 top-1 w-8 h-8 rounded-xl flex items-center justify-center border transition-all ${
                  log.status === 'COMPENSATING' ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' :
                  log.status === 'SUCCESS' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                  'bg-white/5 border-white/10 text-gray-500'
                }`}>
                   {log.status === 'COMPENSATING' ? <RotateCcw size={14} /> : <CheckCircle2 size={14} />}
                </div>

                <div className="flex flex-col gap-1">
                   <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${log.status === 'COMPENSATING' ? 'text-red-400' : 'text-indigo-400'}`}>
                         {log.step}
                      </span>
                      <span className="text-[8px] font-mono text-gray-600 italic flex items-center gap-1">
                        <Clock size={8} /> {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                   </div>
                   <p className="text-[11px] text-gray-400 italic font-light line-clamp-1">{log.details}</p>
                   {log.status === 'COMPENSATING' && (
                     <div className="mt-2 px-3 py-1 bg-red-900/20 border border-red-500/20 rounded-lg text-[8px] text-red-400 font-bold uppercase tracking-widest">
                        ⚠️ Compensation Rule Triggered: Restore State
                     </div>
                   )}
                </div>
             </div>
           ))
         )}
      </div>
    </div>
  );
};

export default SagaVisualizer;
