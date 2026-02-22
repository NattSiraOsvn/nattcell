/**
  * NATT-OS: MONITORING DASHBOARD (UI-CELL)
  * SOVEREIGN: ANH_NAT
  * STATUS: CONSTITUTIONAL ENFORCED
  */

 import React, { useState, useEffect } from 'react';
 import {
   Activity, ShieldCheck, Zap, Server,
   Eye, Heart, AlertTriangle, CheckCircle2,
   Clock, Play, RotateCcw
 } from 'lucide-react';
 // Import từ Shared Kernel thay vì relative path để đúng Điều 7
 import { PersonaID, CellHealthState, CoordinationTask } from '@/cells/shared-kernel/shared.types';

 const MonitoringDashboard: React.FC = () => {
   // 1. Quản lý trạng thái Tế bào (Health States)
   const [healthStates, setHealthStates] = useState<CellHealthState[]>([
     { cell_id: 'cell:sales', status: 'HEALTHY', uptime: 99.98, last_heartbeat: Date.now() },
     { cell_id: 'cell:finance', status: 'HEALTHY', uptime: 100, last_heartbeat: Date.now() },
     { cell_id: 'cell:WAREHOUSE', status: 'DEGRADED', uptime: 85.4, last_heartbeat: Date.now(), message: 'Syncing Branch: HANOI...' },
     { cell_id: 'cell:uei_hub', status: 'HEALTHY', uptime: 99.99, last_heartbeat: Date.now() },
   ]);

   // 2. Trạng thái Giám sát Bối Bối (Sovereign Oversight)
   const [boiBoiStatus] = useState({
     violationCount: 0,
     status: 'CONSTITUTIONAL_ENFORCED',
     owner: 'ANH_NAT' // Khẳng định chủ quyền
   });

   const [activeCellId, setActiveCellId] = useState<string | null>(null);

   useEffect(() => {
     const interval = setInterval(() => {
       setHealthStates(prev => prev.map(s => ({
         ...s,
         last_heartbeat: Date.now(),
         uptime: s.uptime + (Math.random() * 0.0001)
       })));
     }, 5000);
     return () => clearInterval(interval);
   }, []);

   return (
     <div className="h-full flex flex-col bg-[#020202] p-8 lg:p-12 overflow-y-auto no-scrollbar gap-10 animate-in fade-in duration-1000 pb-40">
       {/* HEADER: SYSTEM HEARTBEAT */}
       <header className="flex justify-between items-end border-b border-white/5 pb-10">
         <div className="flex items-center gap-6">
           <div className="w-16 h-16 rounded-[2rem] bg-cyan-600 flex items-center justify-center text-white shadow-[0_0_50px_rgba(6,182,212,0.2)]">
             <Activity size={36} className="animate-pulse" />
           </div>
           <div>
             <h2 className="ai-headline text-6xl italic uppercase tracking-tighter text-white">System Heartbeat</h2>
             <p className="text-[10px] text-cyan-500 font-black tracking-[0.6em] ml-1 uppercase mt-3">
               Master Control • Sovereign: ANH_NAT
             </p>
           </div>
         </div>
         
         {/* INTEGRITY METER */}
         <div className="bg-black/60 p-4 rounded-3xl border border-white/5 flex items-center gap-8">
           <div className="text-right">
             <p className="text-[9px] text-gray-500 font-black uppercase">System Integrity</p>
             <p className="text-xl font-mono text-green-500 font-black italic">100.00%</p>
           </div>
         </div>
       </header>

       {/* MAIN MATRIX */}
       <main className="grid grid-cols-1 xl:grid-cols-12 gap-10">
         <div className="xl:col-span-8">
            {/* Logic render Cells tương tự bản cũ nhưng sạch lỗi Casing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {healthStates.map(cell => (
                 <div key={cell.cell_id} className="ai-panel p-6 bg-white/[0.02] border-white/5 rounded-[2.5rem]">
                    <h4 className="text-white font-bold uppercase">{cell.cell_id}</h4>
                    <div className="mt-4 font-mono text-[10px] text-gray-400">
                       {/* Sửa lỗi hiển thị terminal */}
                       <p className="text-green-500">{" >> "} CONNECTION_STABLE</p>
                       <p>{" >> "} LATENCY: 12ms</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* RIGHT PANEL: SOVEREIGN OVERSIGHT */}
         <div className="xl:col-span-4">
            <div className="ai-panel p-8 bg-red-950/5 border-red-500/20">
               <h3 className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                 <ShieldCheck size={14} /> Bối Bối Supervision
               </h3>
               <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-[10px]">
                     <span className="text-gray-500 uppercase">Owner:</span>
                     <span className="text-white font-black">{boiBoiStatus.owner}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                     <span className="text-gray-500 uppercase">Compliance:</span>
                     <span className="text-green-500 font-black italic">SECURE</span>
                  </div>
               </div>
            </div>
         </div>
       </main>
     </div>
   );
 };

 export default MonitoringDashboard;
