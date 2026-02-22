
import React, { useState, useEffect, useRef } from 'react';
import { QuantumBrain } from '@/services/quantumengine';
import { QuantumState, ConsciousnessField, QuantumEvent } from '@/types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';
import { PersonaID } from '@/types';

/**
 * ============================================================
 * UI ORCHESTRATION STATE (NON-CONSTITUTIONAL)
 * ------------------------------------------------------------
 * These useState hooks are for visualization & interaction only.
 * They do NOT represent NATT-OS system states.
 * They do NOT trigger StateManager or Gatekeeper.
 *
 * Constitutional State Transitions MUST go tHRough:
 * Cell Intent → StateManager → GatekeeperCore → AuditTrail
 * ============================================================
 */

const QuantumFlowOrchestrator: React.FC = () => {
  const [state, setState] = useState<QuantumState | null>(null);
  const [consciousness, setConsciousness] = useState<ConsciousnessField | null>(null);
  const [events, setEvents] = useState<QuantumEvent[]>([]);
  const [waveData, setWaveData] = useState<{t: number, v: number}[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const unsub = QuantumBrain.subscribe((newState, newCons) => {
        setState(newState);
        setConsciousness(newCons);
        setEvents([...QuantumBrain.getEvents()].reverse().slice(0, 5)); // Lấy 5 sự kiện mới nhất
        
        // Update Wave Chart Data
        setWaveData(prev => {
            const now = Date.now();
            const newVal = Math.sin(now / 500) * newState.waveFunction.amplitude * newState.coherence;
            const newData = [...prev, { t: now, v: newVal }];
            return newData.slice(-50); // Keep last 50 points
        });
    });

    return unsub;
  }, []);

  // Neural Field Visualization (Canvas Animation)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: {x: number, y: number, vx: number, vy: number, life: number}[] = [];

    const render = () => {
       if (!state) return;
       ctx.clearRect(0, 0, canvas.width, canvas.height);
       
       // Create new particles based on entropy
       if (Math.random() < state.entropy / 100) {
           particles.push({
               x: Math.random() * canvas.width,
               y: Math.random() * canvas.height,
               vx: (Math.random() - 0.5) * 2,
               vy: (Math.random() - 0.5) * 2,
               life: 1.0
           });
       }

       // Draw Connections (Entanglement)
       ctx.strokeStyle = `rgba(0, 255, 255, ${state.coherence * 0.5})`;
       ctx.lineWidth = 1;
       ctx.beginPath();
       for (let i = 0; i < particles.length; i++) {
           for (let j = i + 1; j < particles.length; j++) {
               const dx = particles[i].x - particles[j].x;
               const dy = particles[i].y - particles[j].y;
               const dist = Math.sqrt(dx*dx + dy*dy);
               if (dist < 100) {
                   ctx.moveTo(particles[i].x, particles[i].y);
                   ctx.lineTo(particles[j].x, particles[j].y);
               }
           }
       }
       ctx.stroke();

       // Update & Draw Particles
       for (let i = particles.length - 1; i >= 0; i--) {
           const p = particles[i];
           p.x += p.vx;
           p.y += p.vy;
           p.life -= 0.01;
           
           ctx.fillStyle = `rgba(255, 165, 0, ${p.life})`;
           ctx.beginPath();
           ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
           ctx.fill();

           if (p.life <= 0) particles.splice(i, 1);
       }

       animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [state]);

  if (!state || !consciousness) return <div className="p-20 text-center text-amber-500 font-mono animate-pulse">BOOTING QUANTUM CORE...</div>;

  return (
    <div className="h-full flex flex-col bg-[#020202] p-8 overflow-hidden gap-8 animate-in fade-in duration-1000 relative">
       
       {/* QUANTUM BACKGROUND OVERLAY */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.05)_0%,_transparent_70%)] pointer-events-none"></div>

       <header className="flex justify-between items-end z-10">
          <div>
             <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl animate-[spin_10s_linear_infinite]">⚛️</span>
                <h2 className="ai-headline text-5xl italic uppercase tracking-tighter gold-gradient">Quantum Flow Orchestrator</h2>
             </div>
             <p className="ai-sub-headline text-cyan-400 font-black tracking-[0.4em] ml-1">Hệ thần kinh doanh nghiệp phi tuyến tính v1.0</p>
          </div>
          <div className="flex gap-6">
             <div className="text-right">
                <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Coherence (Độ kết hợp)</p>
                <div className="w-40 h-2 bg-gray-800 rounded-full overflow-hidden">
                   <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: `${state.coherence * 100}%` }}></div>
                </div>
             </div>
             <div className="text-right">
                <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">System Entropy</p>
                <div className="w-40 h-2 bg-gray-800 rounded-full overflow-hidden">
                   <div className={`h-full transition-all duration-300 ${state.entropy > 50 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(100, state.entropy)}%` }}></div>
                </div>
             </div>
          </div>
       </header>

       <main className="grid grid-cols-1 xl:grid-cols-3 gap-8 flex-1 min-h-0 z-10">
          
          {/* LEFT: NEURAL FIELD VISUALIZER */}
          <div className="xl:col-span-2 ai-panel p-0 relative overflow-hidden bg-black border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.1)] flex flex-col">
             <div className="absolute top-4 left-6 z-20">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Neural Field Activity</h3>
                <p className="text-[9px] text-cyan-500 font-mono mt-1">Superposition Count: {state.superpositionCount}</p>
             </div>
             <canvas ref={canvasRef} width={800} height={500} className="w-full h-full opacity-80" />
             
             {/* Wave Function Chart at Bottom */}
             <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent p-4">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={waveData}>
                      <Area type="monotone" dataKey="v" stroke="#f59e0b" fill="rgba(245, 158, 11, 0.1)" strokeWidth={2} />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* RIGHT: CONSCIOUSNESS MONITOR */}
          <div className="flex flex-col gap-6">
             {/* STATUS CARD */}
             <div className={`ai-panel p-8 transition-all duration-500 ${
                consciousness.mood === 'CRITICAL' ? 'bg-red-900/10 border-red-500/50' : 
                consciousness.mood === 'CAUTIOUS' ? 'bg-amber-900/10 border-amber-500/50' : 
                'bg-blue-900/10 border-blue-500/50'
             }`}>
                <div className="flex justify-between items-start mb-6">
                   <h3 className="text-xl font-bold text-white uppercase italic tracking-widest">Consciousness Field</h3>
                   <div className={`w-3 h-3 rounded-full animate-ping ${
                      consciousness.mood === 'CRITICAL' ? 'bg-red-500' : 
                      consciousness.mood === 'CAUTIOUS' ? 'bg-amber-500' : 'bg-green-500'
                   }`}></div>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between text-[10px] uppercase font-black text-gray-400">
                      <span>Awareness Level</span>
                      <span className="text-white">{consciousness.awarenessLevel.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-[10px] uppercase font-black text-gray-400">
                      <span>Mood State</span>
                      <span className={`text-white px-2 py-0.5 rounded border ${
                         consciousness.mood === 'CRITICAL' ? 'border-red-500 text-red-500' : 
                         consciousness.mood === 'CAUTIOUS' ? 'border-amber-500 text-amber-500' : 'border-green-500 text-green-500'
                      }`}>{consciousness.mood}</span>
                   </div>
                   <div className="flex justify-between text-[10px] uppercase font-black text-gray-400">
                      <span>Last Collapse</span>
                      <span className="text-white font-mono">{new Date(consciousness.lastCollapse).toLocaleTimeString()}</span>
                   </div>
                </div>
                <button 
                   onClick={() => QuantumBrain.manualCollapse()}
                   className="w-full mt-8 py-4 bg-white/5 border border-white/10 hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/50 transition-all rounded-xl text-[9px] font-black uppercase tracking-[0.2em]"
                >
                   Manual Wave Collapse (Observer Effect)
                </button>
             </div>

             {/* EVENT STREAM */}
             <div className="flex-1 ai-panel p-6 bg-black/40 border-white/10 overflow-hidden flex flex-col">
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Quantum Event Stream</h4>
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
                   {events.map(e => (
                      <div key={e.id} className="p-3 bg-white/[0.03] border border-white/5 rounded-xl group hover:bg-white/[0.08] transition-all">
                         <div className="flex justify-between items-start mb-1">
                            <span className="text-[9px] font-bold text-white truncate w-32">{e.type}</span>
                            <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded ${
                               e.status === 'SUPERPOSITION' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                            }`}>{e.status}</span>
                         </div>
                         <div className="flex gap-2 mt-2">
                            <div className="h-1 bg-red-900/30 flex-1 rounded-full overflow-hidden" title="Risk">
                               <div className="h-full bg-red-500" style={{ width: `${e.sensitivityVector.risk * 100}%` }}></div>
                            </div>
                            <div className="h-1 bg-amber-900/30 flex-1 rounded-full overflow-hidden" title="Financial">
                               <div className="h-full bg-amber-500" style={{ width: `${e.sensitivityVector.financial * 100}%` }}></div>
                            </div>
                            <div className="h-1 bg-blue-900/30 flex-1 rounded-full overflow-hidden" title="Temporal">
                               <div className="h-full bg-blue-500" style={{ width: `${e.sensitivityVector.temporal * 100}%` }}></div>
                            </div>
                         </div>
                         {e.decision && <p className="text-[8px] text-cyan-400 mt-2 italic">➜ {e.decision}</p>}
                      </div>
                   ))}
                </div>
             </div>
          </div>
       </main>
    </div>
  );
};

export default QuantumFlowOrchestrator;
