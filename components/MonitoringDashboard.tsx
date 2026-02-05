
import React, { useState, useEffect } from 'react';
import { 
  Activity, ShieldCheck, Zap, Server, 
  Layers, Heart, AlertTriangle, CheckCircle2, 
  Clock, Play, Pause, RotateCcw, AlertCircle
} from 'lucide-react';
import { PersonaID, CellHealthState, CoordinationTask, ConstitutionState } from '../types';
import AIAvatar from './AIAvatar';

const MonitoringDashboard: React.FC = () => {
  const [healthStates, setHealthStates] = useState<CellHealthState[]>([
    { cell_id: 'cell:sales', status: 'HEALTHY', uptime: 99.98, last_heartbeat: Date.now() },
    { cell_id: 'cell:finance', status: 'HEALTHY', uptime: 100, last_heartbeat: Date.now() },
    { cell_id: 'cell:warehouse', status: 'DEGRADED', uptime: 85.4, last_heartbeat: Date.now(), message: 'Syncing Branch: Hanoi...' },
    { cell_id: 'cell:uei_hub', status: 'HEALTHY', uptime: 99.99, last_heartbeat: Date.now() },
    { cell_id: 'cell:auth_guard', status: 'HEALTHY', uptime: 99.99, last_heartbeat: Date.now() }
  ]);

  const [coordinationTasks, setCoordinationTasks] = useState<CoordinationTask[]>([
    { id: 'T1', actor_id: PersonaID.BANG, task_name: 'Warehouse Cell Foundational Scaffold', status: 'COMPLETED', priority: 'URGENT', timestamp: Date.now() },
    { id: 'T2', actor_id: PersonaID.BANG, task_name: 'Monitoring & Alerting Setup', status: 'IN_PROGRESS', priority: 'HIGH', timestamp: Date.now() },
    { id: 'T3', actor_id: PersonaID.BANG, task_name: 'Bối Bối Supervision Protocol', status: 'IN_PROGRESS', priority: 'HIGH', timestamp: Date.now() },
    { id: 'T4', actor_id: PersonaID.CAN, task_name: 'Sales Terminal Scaffold (CAN-001)', status: 'IN_PROGRESS', priority: 'NORMAL', timestamp: Date.now() }
  ]);

  const [boiBoiStatus, setBoiBoiStatus] = useState({
    violationCount: 0,
    status: 'SUPERVISED_REHAB',
    lastAction: 'Reading Constitution Article 7'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setHealthStates(prev => prev.map(s => ({
        ...s,
        last_heartbeat: Date.now(),
        uptime: s.uptime + (Math.random() * 0.001)
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#020202] p-8 lg:p-12 overflow-y-auto no-scrollbar gap-10 animate-in fade-in duration-1000 pb-40 relative">
      <header className="flex justify-between items-end border-b border-white/5 pb-10 relative z-10">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 rounded-[2rem] bg-cyan-600 flex items-center justify-center text-white shadow-[0_0_50px_rgba(6,182,212,0.2)] animate-pulse">
              <Activity size={36} />
           </div>
           <div>
              <h2 className="ai-headline text-6xl italic uppercase tracking-tighter leading-none text-white">System Heartbeat</h2>
              <p className="text-[10px] text-cyan-500 font-black tracking-[0.6em] ml-1 uppercase mt-3">Guardian Pulse • Phase 4 Orchestration</p>
           </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="bg-black/60 p-4 rounded-3xl border border-white/5 flex items-center gap-8">
              <div className="text-right">
                 <p className="text-[9px] text-gray-500 font-black uppercase">System Integrity</p>
                 <p className="text-xl font-mono text-green-500 font-black italic">100.00%</p>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="text-right">
                 <p className="text-[9px] text-gray-500 font-black uppercase">Active Nodes</p>
                 <p className="text-xl font-mono text-cyan-400 font-black italic">32/32</p>
              </div>
           </div>
        </div>
      </header>

      <main className="grid grid-cols-1 xl:grid-cols-12 gap-10">
         
         {/* LEFT: CELL HEALTH & MONITORING */}
         <div className="xl:col-span-8 space-y-8">
            <div className="ai-panel p-10 bg-black/40 border-white/5 flex flex-col shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-9xl font-black italic select-none">CELLS</div>
               <h3 className="text-sm font-black text-cyan-400 uppercase tracking-[0.4em] mb-10 italic flex items-center gap-3">
                  <Server size={18} className="animate-pulse" />
                  Cell Boundary & Health Matrix
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {healthStates.map(cell => (
                    <div key={cell.cell_id} className={`p-6 rounded-[2.5rem] border transition-all duration-500 group ${
                        cell.status === 'HEALTHY' ? 'bg-white/[0.02] border-white/5 hover:border-green-500/30' : 'bg-amber-500/5 border-amber-500/30'
                    }`}>
                       <div className="flex justify-between items-start mb-6">
                          <div>
                             <h4 className="text-lg font-bold text-white uppercase tracking-tighter">{cell.cell_id}</h4>
                             <p className="text-[9px] text-gray-500 font-black uppercase mt-1">Uptime: {cell.uptime.toFixed(4)}%</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${
                             cell.status === 'HEALTHY' ? 'bg-green-600/10 text-green-500 border-green-500/20' : 'bg-amber-600/10 text-amber-500 border-amber-500/20 animate-pulse'
                          }`}>
                             {cell.status}
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-3">
                          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                             <div className={`h-full transition-all duration-1000 ${cell.status === 'HEALTHY' ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${cell.uptime}%` }}></div>
                          </div>
                          <span className="text-[9px] font-mono text-gray-600">Heartbeat: {Math.floor((Date.now() - cell.last_heartbeat)/1000)}s</span>
                       </div>
                       
                       {cell.message && (
                          <p className="mt-4 text-[10px] text-amber-400/80 italic font-light leading-relaxed">
                             "System Insight: {cell.message}"
                          </p>
                       )}
                    </div>
                  ))}
               </div>
            </div>

            {/* PHASE 4 COORDINATION BOARD */}
            <div className="ai-panel p-10 bg-black/40 border-white/5 shadow-2xl">
               <h3 className="text-sm font-black text-amber-500 uppercase tracking-[0.4em] mb-10 italic flex items-center gap-3">
                  <RotateCcw size={18} />
                  Phase 4 Deployment Coordination
               </h3>
               <div className="space-y-4">
                  {coordinationTasks.map(task => (
                    <div key={task.id} className="p-5 bg-white/[0.01] border border-white/5 rounded-3xl flex justify-between items-center hover:bg-white/[0.03] transition-all">
                       <div className="flex items-center gap-6">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs ${
                             task.status === 'COMPLETED' ? 'bg-green-600/20 text-green-500 border border-green-500/20' : 
                             task.status === 'IN_PROGRESS' ? 'bg-blue-600/20 text-blue-500 border border-blue-500/20 animate-pulse' :
                             'bg-gray-800 text-gray-500'
                          }`}>
                             {task.status === 'COMPLETED' ? '✓' : '...'}
                          </div>
                          <div>
                             <p className="text-xs font-bold text-white uppercase">{task.task_name}</p>
                             <div className="flex gap-4 mt-1">
                                <span className="text-[8px] text-gray-600 font-black uppercase">Actor: {task.actor_id}</span>
                                <span className={`text-[8px] font-black uppercase ${task.priority === 'URGENT' ? 'text-red-500' : 'text-amber-500'}`}>Priority: {task.priority}</span>
                             </div>
                          </div>
                       </div>
                       <button className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-white/10 transition-all">Update Shard</button>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* RIGHT: BANG'S ADVISORY & BOI BOI SUPERVISION */}
         <div className="xl:col-span-4 space-y-8">
            <div className="ai-panel p-10 bg-gradient-to-br from-cyan-900/10 to-transparent border-cyan-500/20 flex flex-col items-center text-center">
               <AIAvatar personaId={PersonaID.BANG} size="lg" isThinking={false} />
               <h4 className="text-xl font-bold text-white uppercase italic tracking-tighter mt-8 mb-4">Băng Strategic Oversight</h4>
               <p className="text-sm text-gray-400 italic leading-relaxed font-light mb-10">
                  "Thưa Anh Natt, Băng đã bọc tách được toàn bộ luồng xung của Phase 4. Warehouse Cell đang được cấu trúc hóa để hỗ trợ chi nhánh Hà Nội. Mọi rò rỉ dữ liệu sẽ được Băng chặn đứng tại Gateway."
               </p>
               <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="p-4 bg-black/60 rounded-2xl border border-white/5">
                     <p className="text-[8px] text-gray-600 uppercase font-black mb-1">Data Quality</p>
                     <p className="text-lg font-mono text-green-500 font-black">99.99%</p>
                  </div>
                  <div className="p-4 bg-black/60 rounded-2xl border border-white/5">
                     <p className="text-[8px] text-gray-600 uppercase font-black mb-1">Alert Count</p>
                     <p className="text-lg font-mono text-white font-black">0</p>
                  </div>
               </div>
            </div>

            {/* BỐI BỐI SUPERVISION PANEL */}
            <div className="ai-panel p-8 bg-red-950/5 border-red-500/20 flex flex-col gap-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl grayscale animate-pulse">👁️</div>
               <h3 className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={14} /> Bối Bối Supervision Node
               </h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="text-gray-600 font-bold uppercase">Current Status:</span>
                     <span className="text-amber-500 font-black italic">{boiBoiStatus.status}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="text-gray-600 font-bold uppercase">Last Action:</span>
                     <span className="text-white truncate max-w-[150px] italic">"{boiBoiStatus.lastAction}"</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="text-gray-600 font-bold uppercase">Violations:</span>
                     <span className={`font-mono font-black ${boiBoiStatus.violationCount > 0 ? 'text-red-500 animate-bounce' : 'text-green-500'}`}>
                        {boiBoiStatus.violationCount}
                     </span>
                  </div>
               </div>
               <div className="pt-6 border-t border-white/5">
                  <button className="w-full py-4 bg-red-600/10 border border-red-500/20 text-red-500 rounded-2xl text-[9px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">
                     ACTIVATE HARD LOCKDOWN
                  </button>
               </div>
            </div>
            
            <div className="ai-panel p-8 bg-white/[0.01] border-white/5">
               <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 italic">System Heartbeat Monitor</h4>
               <div className="h-20 w-full flex items-end gap-1 px-2">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div 
                        key={i} 
                        className="flex-1 bg-cyan-500/40 rounded-t-sm animate-pulse" 
                        style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 100}ms` }}
                    />
                  ))}
               </div>
            </div>
         </div>
      </main>

      <footer className="mt-auto grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch relative z-10">
         <div className="lg:col-span-2 ai-panel p-10 bg-white/[0.01] border-white/5 flex flex-col justify-center">
            <h4 className="text-[10px] font-black text-stone-600 uppercase tracking-widest mb-6 flex items-center gap-3 italic">
                <CheckCircle2 size={16} className="text-cyan-500" /> Data Integrity Guarantee
            </h4>
            <p className="font-light text-lg text-stone-400 italic leading-relaxed">
               "Hệ thống đang vận hành trong tầm kiểm soát của Băng. Mọi Shard dữ liệu đều được đối soát chéo và niêm phong tính vẹn toàn ngay khi được bóc tách từ cổng SmartLink."
            </p>
         </div>
      </footer>
    </div>
  );
};

export default MonitoringDashboard;
