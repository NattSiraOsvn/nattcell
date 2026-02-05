
import React, { useState, useEffect } from 'react';
import { Utilities, AIScoringConfig, DetectedContext } from '../services/documentAI';
import ModuleRegistry, { MODULE_REGISTRY } from '../services/moduleRegistry';
import { UserRole, ModuleConfig, PersonaID, OperationRecord, DictionaryVersion } from '../types';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, 
  ResponsiveContainer, Tooltip
} from 'recharts';
import AIAvatar from './AIAvatar';
import { RecoverySystem } from '../services/recoveryEngine';
import ApprovalDashboard from './approval/ApprovalDashboard';
import { DictApproval, ChangeProposal } from '../services/dictionaryApprovalService';
import { DictService } from '../services/dictionaryService';

const AdminConfigHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'modules' | 'core' | 'approval' | 'recovery' | 'versions'>('matrix');
  const [scoringConfig, setScoringConfig] = useState<AIScoringConfig>(Utilities.documentAI.getConfig());
  const [modules, setModules] = useState<ModuleConfig[]>(ModuleRegistry.getAllModules());
  const [isSaving, setIsSaving] = useState(false);
  const [globalSettings, setGlobalSettings] = useState({
    systemName: 'Natt-OS Unified',
    version: '3.1.26',
    autoLockDelay: 300000,
    confidenceThreshold: 75,
    allowGuest: false
  });

  const [deadLetter, setDeadLetter] = useState<OperationRecord[]>([]);
  const [proposals, setProposals] = useState<ChangeProposal[]>([]);
  const [versions, setVersions] = useState<DictionaryVersion[]>([]);
  const [isRollingBack, setIsRollingBack] = useState(false);

  useEffect(() => {
    if (activeTab === 'recovery') {
       setDeadLetter(RecoverySystem.getDeadLetterQueue());
    }
    if (activeTab === 'approval') {
       setProposals(DictApproval.getPendingProposals());
    }
    if (activeTab === 'versions') {
       setVersions(DictService.getVersions());
    }
  }, [activeTab]);

  const handleWeightChange = (key: keyof AIScoringConfig['weights'], value: number) => {
    setScoringConfig(prev => ({
      ...prev,
      weights: { ...prev.weights, [key]: value }
    }));
  };

  const handleKeywordChange = (context: DetectedContext, newKeywords: string) => {
    const list = newKeywords.split(',').map(k => k.trim()).filter(k => k);
    setScoringConfig(prev => ({
      ...prev,
      keywords: { ...prev.keywords, [context]: list }
    }));
  };

  const saveMatrix = () => {
    setIsSaving(true);
    setTimeout(() => {
      Utilities.documentAI.updateConfig(scoringConfig);
      setIsSaving(false);
      alert("✅ Neural Matrix Updated Successfully!");
    }, 800);
  };

  const toggleModule = (id: string) => {
    const updated = modules.map(m => m.id === id ? { ...m, active: !m.active } : m);
    setModules(updated);
    const mod = updated.find(m => m.id === id);
    if (mod) ModuleRegistry.registerModule(mod);
  };

  const handleReview = async (id: string, decision: 'APPROVE' | 'REJECT') => {
      await DictApproval.reviewChange(id, decision, 'MASTER_NATT');
      setProposals(DictApproval.getPendingProposals());
  };

  const handleReplay = async (id: string) => {
      await RecoverySystem.replayOperation(id);
      setDeadLetter(RecoverySystem.getDeadLetterQueue());
      alert(`Đã khôi phục thành công tác vụ ${id}`);
  };

  const handleRollback = async (versionId: string) => {
    if (!window.confirm("CẢNH BÁO: Khôi phục phiên bản Từ điển cũ?")) return;
    setIsRollingBack(true);
    try {
      await DictService.rollbackTo(versionId);
      setVersions(DictService.getVersions());
      alert("✅ Rollback successful.");
    } catch (e) {
      alert("❌ Lỗi hệ thống.");
    } finally {
      setIsRollingBack(false);
    }
  };

  const radarData = Object.entries(scoringConfig.weights).map(([key, val]) => ({
    subject: key,
    A: (val as number) * 100, 
    fullMark: 100
  }));

  return (
    <div className="h-full bg-[#020202] flex flex-col overflow-hidden animate-in fade-in duration-700">
      
      {/* HEADER */}
      <header className="p-8 border-b border-white/5 flex flex-col lg:flex-row justify-between items-end bg-black/40 backdrop-blur-xl shrink-0 gap-4">
        <div>
           <div className="flex items-center gap-4 mb-2">
              <AIAvatar personaId={PersonaID.THIEN} size="sm" />
              <h2 className="ai-headline text-4xl italic uppercase tracking-tighter">Admin Core Hub</h2>
           </div>
           <p className="ai-sub-headline text-gray-500 font-black tracking-[0.3em] ml-1">System Configuration & Neural Tuning</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar max-w-full">
           {['matrix', 'modules', 'core', 'approval', 'recovery', 'versions'].map(tab => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap relative ${
                 activeTab === tab ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-gray-500 hover:text-white'
               }`}
             >
               {tab === 'recovery' && deadLetter.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center animate-bounce text-[8px] font-black">
                     {deadLetter.length}
                  </span>
               )}
               {tab.charAt(0).toUpperCase() + tab.slice(1)}
             </button>
           ))}
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-8">
        
        {activeTab === 'matrix' && (
           <div className="h-full grid grid-cols-1 xl:grid-cols-3 gap-10 overflow-y-auto no-scrollbar pb-20">
              <div className="ai-panel p-10 bg-black/40 border-amber-500/20 shadow-2xl flex flex-col">
                 <h3 className="text-xl font-bold text-amber-500 uppercase tracking-widest mb-8 flex items-center gap-3">⚖️ Weights</h3>
                 <div className="flex-1 flex flex-col justify-center items-center relative mb-8">
                    <div className="w-full h-64">
                       <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                             <PolarGrid stroke="#333" />
                             <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }} />
                             <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                             <Radar name="Weights" dataKey="A" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                             <Tooltip />
                          </RadarChart>
                       </ResponsiveContainer>
                    </div>
                 </div>
                 <div className="space-y-6">
                    {Object.entries(scoringConfig.weights).map(([key, val]) => (
                       <div key={key} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
                             <span>{key}</span>
                             <span className="text-amber-500">{((val as number) * 100).toFixed(0)}%</span>
                          </div>
                          <input type="range" min="0" max="1" step="0.05" value={val as number} onChange={(e) => handleWeightChange(key as any, parseFloat(e.target.value))} className="w-full accent-amber-500" />
                       </div>
                    ))}
                 </div>
              </div>

              <div className="xl:col-span-2 ai-panel p-10 bg-white/[0.02] border-white/5 overflow-y-auto no-scrollbar">
                 <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                    <h3 className="text-xl font-bold text-white uppercase tracking-widest">Context Dictionary</h3>
                    <button onClick={saveMatrix} disabled={isSaving} className="px-6 py-3 bg-green-600 text-white font-black text-[10px] uppercase rounded-xl hover:bg-green-500 transition-all shadow-lg">{isSaving ? 'SAVING...' : 'SAVE CONFIG'}</button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(Object.keys(scoringConfig.keywords) as DetectedContext[]).map(ctx => (
                       <div key={ctx} className="p-6 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-500/30 transition-all">
                          <h4 className="text-sm font-bold text-white uppercase mb-4">{ctx}</h4>
                          <textarea className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-gray-300 font-mono h-24 focus:border-amber-500 outline-none resize-none" value={(scoringConfig.keywords[ctx] || []).join(', ')} onChange={(e) => handleKeywordChange(ctx, e.target.value)} />
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'recovery' && (
            <div className="h-full overflow-y-auto no-scrollbar pb-20">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-2xl font-bold text-red-500 uppercase tracking-widest italic">Dead Letter Queue & Shard Repair</h3>
                   <div className="px-4 py-2 bg-red-950/20 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono">
                      Failed Operations: {deadLetter.length}
                   </div>
                </div>
                
                {deadLetter.length === 0 ? (
                    <div className="text-center py-48 opacity-20 flex flex-col items-center">
                        <span className="text-9xl mb-8 grayscale">🛡️</span>
                        <p className="text-3xl font-serif italic uppercase tracking-widest">No Failures Detected</p>
                        <p className="text-xs font-black uppercase text-green-500 mt-4 tracking-widest">All Shards are healthy and nominal.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {deadLetter.map(op => (
                            <div key={op.id} className="ai-panel p-8 bg-red-900/10 border-red-500/30 group hover:bg-red-900/20 transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-5 text-8xl">⚠️</div>
                                <div className="flex flex-col lg:flex-row justify-between items-start gap-10 relative z-10">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="px-3 py-1 bg-red-600 text-white text-[9px] font-black rounded uppercase">{op.type}</span>
                                            <span className="text-white font-mono text-xs">{op.id}</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-white uppercase tracking-tight mb-2">Module: {op.module}</h4>
                                        <div className="p-4 bg-black/60 rounded-xl border border-red-500/20 font-mono text-[11px] text-red-200">
                                            <p className="font-black text-red-500 uppercase mb-2">Trace-ID Error Output:</p>
                                            {op.error}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 shrink-0">
                                        <button onClick={() => handleReplay(op.id)} className="px-10 py-5 bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-green-400 shadow-2xl transition-all active:scale-95">
                                            REPLAY SHARD
                                        </button>
                                        <button className="px-8 py-4 border border-white/10 text-gray-500 font-black text-[10px] uppercase rounded-2xl hover:text-white transition-all">
                                            DISCARD NODE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {activeTab === 'approval' && <ApprovalDashboard />}
        {activeTab === 'versions' && (
           <div className="h-full overflow-y-auto no-scrollbar pb-20">
              <h3 className="text-xl font-bold text-cyan-400 uppercase tracking-widest mb-8">Dictionary Version History</h3>
              <div className="space-y-4">
                 {versions.map((ver, idx) => (
                    <div key={ver.id} className={`p-6 rounded-2xl border transition-all ${idx === 0 ? 'bg-cyan-500/5 border-cyan-500/30' : 'bg-white/[0.02] border-white/5'}`}>
                       <div className="flex justify-between items-center">
                          <div>
                             <div className="flex items-center gap-3">
                                <span className="text-xl font-mono font-black text-white">v{ver.versionNumber}</span>
                                {idx === 0 && <span className="px-2 py-0.5 bg-cyan-500 text-black text-[8px] font-black rounded">LATEST</span>}
                             </div>
                             <p className="text-xs text-gray-400 italic mt-2">"{ver.metadata.reason}" • {ver.createdBy}</p>
                          </div>
                          {idx > 0 && (
                             <button onClick={() => handleRollback(ver.id)} disabled={isRollingBack} className="px-6 py-2 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase rounded-xl hover:bg-cyan-500 hover:text-black transition-all">Rollback</button>
                          )}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {activeTab === 'modules' && (
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto no-scrollbar pb-20">
              {modules.map(mod => (
                 <div key={mod.id} className={`p-6 rounded-[2.5rem] border transition-all ${mod.active ? 'bg-white/[0.02] border-white/10 shadow-xl' : 'opacity-40 grayscale border-white/5'}`}>
                    <div className="flex justify-between items-start mb-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">{mod.icon}</div>
                          <div>
                             <h4 className="text-sm font-bold text-white uppercase tracking-tight">{mod.title}</h4>
                             <code className="text-[9px] text-gray-500 font-mono">{mod.id}</code>
                          </div>
                       </div>
                       <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={mod.active} onChange={() => toggleModule(mod.id)} />
                          <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                       </label>
                    </div>
                    <div className="space-y-3">
                       <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Allowed Roles</p>
                       <div className="flex flex-wrap gap-2">
                          {mod.allowedRoles.map(role => (
                             <span key={role} className="px-2 py-1 rounded border border-white/10 bg-white/5 text-[8px] font-bold text-gray-400">{role.split(' (')[0]}</span>
                          ))}
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        )}

        {activeTab === 'core' && (
           <div className="h-full flex items-center justify-center">
              <div className="w-full max-w-2xl ai-panel p-12 bg-black/60 border-white/10 shadow-2xl relative overflow-hidden">
                 <h3 className="text-3xl font-serif gold-gradient italic uppercase tracking-tighter mb-10">Global Configuration</h3>
                 <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">System Name</label>
                          <input type="text" value={globalSettings.systemName} onChange={(e) => setGlobalSettings({...globalSettings, systemName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm font-bold outline-none" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Lock Delay (ms)</label>
                          <input type="number" value={globalSettings.autoLockDelay} onChange={(e) => setGlobalSettings({...globalSettings, autoLockDelay: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-amber-500 font-mono text-sm font-bold outline-none" />
                       </div>
                    </div>
                    <button className="w-full py-5 bg-white text-black font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl hover:bg-gray-200 transition-all">APPLY SETTINGS</button>
                 </div>
              </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default AdminConfigHub;
