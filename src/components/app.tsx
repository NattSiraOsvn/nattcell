
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Factory, ShieldCheck, 
  Users, Settings, Crown, Cpu, Layers, 
  Zap, User, Activity, Box, Sparkles, Loader2, X,
  Terminal, MessageSquare, Monitor, Send, Menu, ShieldAlert
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { ViewType, UserRole, PersonaID, PositionType, Department } from '@/types';
// FIX: Using kebab-case file names as per Article 11 and provided file components/dynamic-module-renderer.tsx
import DynamicModuleRenderer from './dynamic-module-renderer.tsx';
// FIX: Using kebab-case file name as per Article 11

// 🛠️ UI ENGINE IMPORTS
import { HapticEngine } from '@/haptic/hapticengine';
import { PhysicsEngine } from '@/physics/physicsengine';
import { useMotionSensor } from '@/motion/usemotionsensor';
import { useContextualUI } from '@/context/usecontextualui';
import { useStaggeredAnimation } from '@/animation/usestaggeredanimation';
import { DataPoint3D } from '@/data-3d/datapoint3d.tsx';
import { UIRuntimeProvider } from '@/core/uiruntime.tsx';

/**
 * 🛠️ NATT-OS QUANTUM RUNTIME v8.0
 * Unified UI Orchestration Engine
 */

interface ClusterScreen {
  name: string;
  view: ViewType;
  detail: string;
  icon: React.ReactNode;
}

interface Cluster {
  id: number;
  name: string;
  icon: React.ReactElement;
  themeColor: string;
  role: string;
  ux: string;
  screens: ClusterScreen[];
  aiFeature?: {
    label: string;
    prompt: string;
    useSearch?: boolean;
  };
  dataPoints?: { x: number; y: number; z: number; value: string }[];
}

interface SystemBlock {
  id: string;
  name: string;
  fullName: string;
  clusters: Cluster[];
}

// 🛠️ Fixed: Renamed component to App to fix missing name error in wrapper.
const App = () => {
  // --- CORE ENGINE STATES ---
  const [activeBlock, setActiveBlock] = useState(0);
  const [activeCluster, setActiveCluster] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>(ViewType.DASHBOARD); 
  const [showAiModal, setShowAiModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, clientX: 0, clientY: 0 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState<{text: string} | null>(null);

  // --- UI ENGINE HOOKS ---
  const { motion, update: updateMotion } = useMotionSensor();
  const uiMode = useContextualUI(currentTime, motion.normalizedIntensity, 'work'); // default role
  const staggeredIndices = useStaggeredAnimation(5, 120);

  // --- SYSTEM STRUCTURE ---
  const systemStructure: SystemBlock[] = useMemo(() => [
    {
      id: "I", name: "CORE OPS", fullName: "VẬN HÀNH KINH DOANH LƯỢNG TỬ",
      clusters: [
        {
          id: 1, name: "BÁN HÀNG & CX", icon: <ShoppingCart size={18} />, themeColor: "from-amber-600/20 to-orange-950/10", role: "heavy",
          ux: "Commerce Quantum: Luồng tiền kim loại nóng. Định danh khách hàng 11 chiều.",
          screens: [
            { name: "Retail Operations", view: ViewType.sales_terminal, detail: "POS Terminal Omega, bóc tách hóa đơn chuẩn RSA.", icon: <ShoppingCart size={24}/> },
            { name: "Warehouse Shard", view: ViewType.WAREHOUSE, detail: "Quản lý tồn kho đa điểm, băm Hash vật tư real-time.", icon: <Box size={24}/> },
            { name: "Customer CRM", view: ViewType.chat, detail: "Hồ sơ Identity, phân nhóm RFM tự động qua AI.", icon: <Users size={24}/> }
          ],
          dataPoints: [
            { x: 20, y: 30, z: 40, value: "1.2B VND" },
            { x: 70, y: 50, z: 80, value: "85% Yield" }
          ]
        },
        {
          id: 2, name: "SẢN XUẤT", icon: <Factory size={18} />, themeColor: "from-blue-600/20 to-cyan-950/10", role: "heavy",
          ux: "The Quantum Forge: Thép lượng tử. Digital Twin nhà máy 3D.",
          screens: [
            { name: "MES Control", view: ViewType.production_manager, detail: "Kế hoạch sản xuất, giám sát định mức hao hụt 1.5%.", icon: <Layers size={24}/> },
            { name: "Financial Audit", view: ViewType.sales_tax, detail: "Đối soát dòng tiền, niêm phong thuế DSP v2026.", icon: <ShieldCheck size={24}/> }
          ]
        }
      ]
    },
    {
      id: "II", name: "GROWTH", fullName: "ĐỘNG CƠ TĂNG TRƯỞNG OMEGA",
      clusters: [
        {
          id: 11, name: "COMMAND", icon: <Crown size={18} />, themeColor: "from-yellow-600/20 to-amber-950/10", role: "heavy",
          ux: "The THRone of Oversight: Quyền lực tuyệt đối. Mật lệnh niêm phong.",
          aiFeature: { label: "✨ Kịch bản 2027", prompt: "Xây dựng dự thảo chiến lược tăng trưởng 2027 dựa trên 19TB dữ liệu bóc tách." },
          screens: [
            { name: "War Room", view: ViewType.command, detail: "Chỉ số sinh tồn chiến lược, giám sát Shard rủi ro.", icon: <Crown size={24}/> },
            { name: "System Monitor", view: ViewType.monitoring, detail: "Xung nhịp hệ thống, phát hiện rò rỉ Identity.", icon: <Activity size={24}/> }
          ]
        }
      ]
    }
  ], []);

  const currentBlock = systemStructure[activeBlock];
  const currentCluster = currentBlock.clusters[activeCluster];

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Update Motion Engine
    updateMotion(clientX, clientY);

    // Apply Physics to Camera Rotation
    const targetX = ((clientY / innerHeight) - 0.5) * 12;
    const targetY = ((clientX / innerWidth) - 0.5) * -12;
    
    const nextX = PhysicsEngine.applySpring(mousePos.x, targetX, 0).position;
    const nextY = PhysicsEngine.applySpring(mousePos.y, targetY, 0).position;

    setMousePos({ x: nextX, y: nextY, clientX, clientY });
  }, [mousePos, updateMotion]);

  const callGemini = async (prompt: string, useSearch = false) => {
    HapticEngine.vibrate('confirm');
    HapticEngine.simulateForce(0.7);
    setIsGenerating(true);
    setShowAiModal(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
            systemInstruction: "Bạn là Omega AI v8.0. Trợ lý chiến lược tối cao cho Master Natt.",
            tools: useSearch ? [{ googleSearch: {} }] : undefined
        }
      });
      setAiResponse({ text: response.text || "Thiên đang bóc tách..." });
    } catch (e) {
      setAiResponse({ text: "Quantum Link Failure." });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!mounted) return null;

  return (
    <div 
      onMouseMove={handleMouseMove}
      className={`flex h-screen text-slate-400 font-sans overflow-hidden relative transition-all duration-1000 mode-${uiMode}`}
      style={{ 
        perspective: '2000px',
        background: uiMode === 'night' ? '#010102' : '#020203'
      }}
    >
      {/* 🔮 LAYER: QUANTUM AMBIENT */}
      <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 transition-opacity duration-1000" style={{ background: `radial-gradient(circle at ${mousePos.clientX}px ${mousePos.clientY}px, rgba(245, 158, 11, ${0.05 * motion.normalizedIntensity}) 0%, transparent 70%)` }}></div>
      </div>

      {/* 📁 SIDEBAR (72 WIDTH) */}
      <aside className={`w-72 h-full border-r border-white/5 flex flex-col z-50 bg-black/60 backdrop-blur-3xl transition-all duration-700 ${activeView !== ViewType.DASHBOARD ? 'translate-x-[-100%] opacity-0' : 'translate-x-0 opacity-100'}`}>
          <div className="p-8 flex items-center gap-5 border-b border-white/5">
             <div 
              className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-black font-black text-2xl shadow-[0_0_30px_rgba(245,158,11,0.2)] icon-alive icon-heavy"
              onClick={() => { HapticEngine.vibrate('heavy'); HapticEngine.simulateForce(0.8); }}
             >Ω</div>
             <div>
               <h1 className="font-black text-white text-lg uppercase leading-none tracking-tighter">NATT-OS</h1>
               <span className="text-[9px] text-amber-500 font-black tracking-widest uppercase mt-1 opacity-60">Quantum v8.0</span>
             </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-8 space-y-4 custom-scrollbar">
            {systemStructure.map((block, idx) => (
              <button
                key={block.id}
                onClick={() => { setActiveBlock(idx); setActiveCluster(0); setActiveView(ViewType.DASHBOARD); HapticEngine.vibrate('click'); }}
                className={`w-full text-left p-5 rounded-[2rem] group flex items-start gap-4 border transition-all duration-500 ${
                  activeBlock === idx ? 'bg-white/5 border-white/10 shadow-2xl' : 'hover:bg-white/5 border-transparent'
                }`}
              >
                <div className={`p-2.5 rounded-xl transition-all duration-500 ${activeBlock === idx ? 'bg-amber-500 text-black shadow-lg scale-110' : 'text-slate-600'}`}>
                  <Layers size={18} />
                </div>
                <div className="flex-1">
                  <div className={`text-[8px] font-black tracking-widest mb-1 uppercase ${activeBlock === idx ? 'text-amber-500' : 'text-slate-700'}`}>{block.id} // CORE</div>
                  <div className={`text-[11px] font-black transition-colors ${activeBlock === idx ? 'text-white' : 'text-slate-500'}`}>{block.name}</div>
                </div>
              </button>
            ))}
          </nav>
      </aside>

      {/* 🌍 MAIN RUNTIME STAGE */}
      <div 
        className={`flex-1 flex flex-col relative z-10 transition-all duration-1000 ease-out`}
        style={{ transform: `rotateX(${mousePos.x}deg) rotateY(${mousePos.y}deg) translateZ(0px)` }}
      >
        <header className="h-20 flex items-center px-12 gap-8 z-30 border-b border-white/5 bg-black/40 backdrop-blur-xl">
          <div className="flex-1 flex items-center gap-4 overflow-x-auto no-scrollbar">
            {currentBlock.clusters.map((cluster, idx) => (
              <button
                key={cluster.id}
                onClick={() => { setActiveCluster(idx); setActiveView(ViewType.DASHBOARD); HapticEngine.vibrate('click'); }}
                className={`group relative px-6 py-2.5 rounded-xl transition-all duration-700 ${
                  activeCluster === idx ? 'text-white' : 'text-stone-500 hover:text-stone-300'
                }`}
              >
                {activeCluster === idx && <div className="absolute inset-0 bg-white/5 rounded-xl border border-white/10 shadow-2xl animate-spatial-pop shadow-amber-500/5"></div>}
                <div className="relative z-10 flex items-center gap-3">
                   <span className={`transition-all duration-700 ${activeCluster === idx ? 'text-amber-500 scale-125' : ''}`}>
                      {React.cloneElement(cluster.icon as React.ReactElement<any>, { size: 16 })}
                   </span>
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">{cluster.name}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-6 border-l border-white/5 pl-6">
             <div onClick={() => callGemini("Báo cáo tình trạng hệ thống hôm nay cho Master Natt.")} className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center cursor-pointer text-amber-500 hover:bg-amber-500 hover:text-black transition-all group">
                <Sparkles size={18} className="group-hover:animate-spin-slow" />
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
                <User size={18} className="text-slate-500" />
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-12 lg:p-14 custom-scrollbar relative">
          <div className="max-w-7xl mx-auto">
            {activeView === ViewType.DASHBOARD ? (
              <div className="space-y-16">
                {/* 🏰 BREAKTHROUGH HERO */}
                <section className="relative p-16 lg:p-20 rounded-[4rem] overflow-hidden border border-white/10 shadow-[0_80px_160px_rgba(0,0,0,0.7)] bg-black/40 group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${currentCluster.themeColor} opacity-30 transition-all duration-1000`}></div>
                  
                  {/* Data Points 3D Injection */}
                  <div className="absolute inset-0 pointer-events-none">
                    {currentCluster.dataPoints?.map((dp, i) => (
                      <DataPoint3D key={i} {...dp} />
                    ))}
                  </div>

                  <div className="relative z-10 flex flex-col lg:flex-row items-end justify-between gap-14">
                    <div className="space-y-10">
                      <div className="flex items-center gap-8">
                        <div className={`p-8 rounded-[3rem] bg-black/70 border border-white/10 text-amber-500 shadow-2xl icon-alive ${currentCluster.role === 'heavy' ? 'icon-heavy' : 'icon-ai'}`}>
                          {React.cloneElement(currentCluster.icon as React.ReactElement<any>, { size: 48 })}
                        </div>
                        <div>
                          <span className="text-[12px] font-black text-amber-500 tracking-[0.8em] uppercase opacity-60">Quantum Cluster {currentCluster.id} // NODE_ACTIVE</span>
                          <div className="flex gap-2.5 mt-5">
                              {[1,2,3,4,5].map(i => <div key={i} className="w-14 h-1.5 bg-amber-500/10 rounded-full overflow-hidden"><div className="h-full bg-amber-500 animate-shimmer-fast" style={{ width: `${20*i}%`, animationDelay: `${i*0.2}s` }}></div></div>)}
                          </div>
                        </div>
                      </div>
                      <h2 className="text-8xl font-black text-white tracking-tighter uppercase leading-[0.85] drop-shadow-2xl italic">{currentCluster.name}</h2>
                      <p className="text-slate-400 italic text-2xl border-l-4 border-amber-500 pl-12 max-w-4xl leading-relaxed opacity-70 group-hover:opacity-100 transition-all duration-1000 font-light">"{currentCluster.ux}"</p>
                    </div>
                    {currentCluster.aiFeature && (
                      <button onClick={() => callGemini(currentCluster.aiFeature!.prompt, currentCluster.aiFeature!.useSearch)} className="p-14 rounded-[3.5rem] bg-amber-500 hover:bg-amber-400 text-black shadow-2xl flex flex-col items-center gap-6 active:scale-90 border-4 border-black/10 group/ai transition-all duration-500">
                        <Sparkles size={56} className="group-hover/ai:rotate-180 transition-transform duration-1000" />
                        <span className="font-black uppercase text-[10px] tracking-[0.6em]">{currentCluster.aiFeature!.label}</span>
                      </button>
                    )}
                  </div>
                </section>

                {/* 💎 DATA TILES - STAGGERED */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-40">
                  {currentCluster.screens.map((screen, idx) => (
                    <div key={idx} 
                      onClick={() => { setActiveView(screen.view); HapticEngine.vibrate('confirm'); }}
                      className={`group relative bg-[#0c0c0e]/90 border border-white/5 hover:border-amber-500/30 rounded-[3.5rem] p-12 transition-all duration-700 cursor-pointer shadow-2xl flex flex-col h-[480px] hover:-translate-y-8 active:scale-95 overflow-hidden ${staggeredIndices.includes(idx) ? 'animate-spatial-pop opacity-100' : 'opacity-0'}`}
                    >
                       <div className="mb-auto flex items-center justify-between relative z-10">
                          <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-amber-500 group-hover:scale-125 transition-all duration-700 icon-alive icon-fluid shadow-inner">
                            {React.cloneElement(screen.icon as React.ReactElement<any>, { size: 36 })}
                          </div>
                          <span className="text-[10px] font-black text-slate-700 font-mono tracking-widest uppercase italic">#NODE_0x{idx+1}</span>
                       </div>
                       <div className="mt-16 relative z-10">
                          <h4 className="text-4xl font-black text-white group-hover:text-amber-500 transition-colors uppercase tracking-tighter mb-6 leading-none italic">{screen.name}</h4>
                          <p className="text-lg text-slate-500 font-medium leading-relaxed opacity-50 group-hover:opacity-100 transition-all duration-1000 line-clamp-4">{screen.detail}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="animate-spatial-in">
                 <div className="flex justify-between items-center mb-10">
                    <button onClick={() => { setActiveView(ViewType.DASHBOARD); HapticEngine.vibrate('confirm'); }} className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] transition-all">← Back to Resonance Hub</button>
                 </div>
                 <div className="ai-panel p-1 rounded-[3.5rem] border border-white/5 shadow-2xl overflow-hidden bg-black/20">
                    <DynamicModuleRenderer 
                       view={activeView}
                       setActiveView={setActiveView}
                       currentRole={UserRole.ADMIN}
                       currentPosition={{ id: 'ADMIN', role: PositionType.CHAIRMAN, department: Department.HEADQUARTER, scope: ['ALL'] }}
                       metrics={{ revenue: 449120, revenue_pending: 0, goldInventory: 850, productionProgress: 96, invoicesIssued: 156, riskScore: 12, lastUpdate: Date.now(), totalTaxDue: 0, totalPayroll: 0, currentOperatingCost: 0, importVolume: 0, pendingApprovals: 0, cadPending: 0, totalCogs: 0, totalOperating: 0 }}
                       actionLogs={[]}
                       logAction={() => {}}
                       updateFinance={() => {}}
                    />
                 </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ✨ AI MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-12 bg-black/98 backdrop-blur-[120px] animate-spatial-pop">
          <div className="relative w-full max-w-5xl bg-[#0c0c0e] border-2 border-white/10 rounded-[5rem] shadow-[0_100px_200px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-16 border-b border-white/5 flex items-center justify-between bg-amber-500/5">
              <div className="flex items-center gap-12">
                <div className="w-24 h-24 rounded-[2.5rem] bg-amber-500 flex items-center justify-center text-black shadow-2xl animate-pulse">
                   <Sparkles size={56} />
                </div>
                <h3 className="font-black text-white uppercase tracking-[0.5em] text-3xl italic">OMEGA NEURAL SYNTHESIS</h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="w-16 h-16 rounded-[2rem] hover:bg-white/5 flex items-center justify-center text-slate-500 transition-all border border-white/5"><X size={40} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-20 custom-scrollbar text-xl text-slate-200 leading-relaxed font-light italic">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-16">
                  <Loader2 size={100} className="animate-spin text-amber-500" />
                  <p className="text-2xl font-black text-amber-500 uppercase tracking-[1em] animate-pulse">Synthesizing Shard...</p>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: aiResponse?.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-500 font-black">$1</strong>').replace(/\n/g, '<br/>') || "" }} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🚀 TASKBAR */}
      <footer className={`fixed bottom-10 left-1/2 -translate-x-1/2 h-20 px-10 bg-[#0c0c0e]/60 backdrop-blur-3xl border border-white/10 rounded-[48px] flex items-center gap-12 z-[500] shadow-[0_40px_80px_rgba(0,0,0,0.8)] transition-all duration-1000 hover:scale-[1.02] ${activeView !== ViewType.DASHBOARD ? 'opacity-20 scale-95 blur-sm translate-y-24' : ''}`}>
          <div className="flex items-center gap-8">
            {[LayoutDashboard, Terminal, MessageSquare, Monitor, Settings].map((Icon, i) => (
              <div key={i} onClick={() => HapticEngine.vibrate('click')} className="group relative p-4 rounded-[1.5rem] hover:bg-white/10 cursor-pointer transition-all duration-700 hover:scale-125 hover:-translate-y-6 active:scale-90">
                <Icon size={24} className="text-slate-500 group-hover:text-amber-500 transition-colors" />
                {i === 0 && <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_20px_#f59e0b] animate-pulse"></div>}
              </div>
            ))}
          </div>
          <div className="h-10 w-[2px] bg-white/10 rounded-full"></div>
          <div className="flex flex-col items-end min-w-[180px]">
             <span className="text-[9px] font-black text-stone-600 tracking-[0.4em] uppercase mb-1">Quantum_CHRonos</span>
             <span className="text-3xl font-black text-white tracking-tighter font-mono leading-none">
               {currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
             </span>
          </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        :root { --physics-core: cubic-bezier(0.4, 0, 0.2, 1); --physics-light: cubic-bezier(0.34, 1.56, 0.64, 1); }
        .icon-alive { position: relative; transform-style: preserve-3d; animation: icon-breathe 8s infinite var(--physics-core); }
        .icon-heavy { animation-duration: 10s; } .icon-fluid { animation-duration: 7s; } .icon-ai { animation-duration: 5s; }
        @keyframes icon-breathe { 0%, 100% { transform: translateZ(0px) scale(1); } 40% { transform: translateZ(25px) scale(1.05) rotateX(8deg); } }
        .animate-spatial-pop { animation: spatial-pop 0.9s var(--physics-light) backwards; }
        @keyframes spatial-pop { 0% { transform: scale(0.85) translateZ(-150px); opacity: 0; filter: blur(20px); } 100% { transform: scale(1) translateZ(0); opacity: 1; filter: blur(0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(245, 158, 11, 0.15); border-radius: 10px; }
        .animate-shimmer-fast { animation: shimmer-fast 1.2s infinite linear; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); background-size: 200% 100%; }
        @keyframes shimmer-fast { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}} />
    </div>
  );
};

// 🛠️ ROOT WRAPPER FOR RUNTIME INTEGRITY
const AppWrapped = () => {
    return (
        <UIRuntimeProvider role="command">
            <App />
        </UIRuntimeProvider>
    );
}

export default AppWrapped;
