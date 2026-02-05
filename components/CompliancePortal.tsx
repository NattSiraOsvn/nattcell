
import React, { useState, useEffect } from 'react';
import ComplianceDashboard from './compliance/ComplianceDashboard.tsx';
import PolicyManager from './compliance/PolicyManager.tsx';
import CertificationManager from './compliance/CertificationManager.tsx';
import AIAvatar from './AIAvatar.tsx';
import { PersonaID, ComplianceRequest, AssessmentResult } from '../types.ts';
import { ComplianceProvider } from '../services/compliance/ComplianceService.ts';
import { ShieldCheck, ClipboardList, Gauge, AlertCircle, Clock } from 'lucide-react';

const CompliancePortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'POLICIES' | 'CERTIFICATIONS' | 'REQUESTS' | 'ASSESSMENTS'>('OVERVIEW');
  const [requests, setRequests] = useState<ComplianceRequest[]>([]);
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);

  useEffect(() => {
    ComplianceProvider.getRequests().then(setRequests);
    ComplianceProvider.getAssessments().then(setAssessments);
  }, []);

  return (
    <div className="h-full flex flex-col p-6 lg:p-10 overflow-hidden bg-[#020202] pb-40 animate-in fade-in duration-700 relative">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      <header className="flex flex-col lg:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10 mb-8 shrink-0">
        <div>
           <div className="flex items-center gap-4 mb-2">
              <ShieldCheck className="text-indigo-400" size={40} />
              <h2 className="ai-headline text-5xl italic uppercase tracking-tighter text-white">Compliance Node</h2>
           </div>
           <p className="ai-sub-headline text-cyan-400 font-black tracking-[0.3em] mt-2 italic uppercase">Governance & Regulatory Shard • v5.1</p>
        </div>
        
        <nav className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 shrink-0 overflow-x-auto no-scrollbar">
           {[
             { id: 'OVERVIEW', label: 'TỔNG QUAN', icon: '📊' },
             { id: 'REQUESTS', label: 'YÊU CẦU', icon: '📩' },
             { id: 'POLICIES', label: 'CHÍNH SÁCH', icon: '📜' },
             { id: 'CERTIFICATIONS', label: 'CHỨNG CHỈ', icon: '💎' },
             { id: 'ASSESSMENTS', label: 'ĐÁNH GIÁ', icon: '⚖️' }
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-3 whitespace-nowrap ${activeTab === tab.id ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-gray-500 hover:text-white'}`}
             >
               <span>{tab.icon}</span> {tab.label}
             </button>
           ))}
        </nav>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar">
          {activeTab === 'OVERVIEW' && <ComplianceDashboard />}
          {activeTab === 'POLICIES' && <PolicyManager />}
          {activeTab === 'CERTIFICATIONS' && <CertificationManager />}
          
          {activeTab === 'REQUESTS' && (
             <div className="space-y-6 animate-in slide-in-from-bottom-6">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-xl font-bold text-white uppercase italic tracking-widest flex items-center gap-3">
                      <ClipboardList size={20} className="text-amber-500" />
                      Compliance Workflow Requests
                   </h3>
                   <span className="text-[10px] font-mono text-gray-500">Node: REQ_LEDGER_01</span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                   {requests.map(req => (
                     <div key={req.id} className="ai-panel p-8 bg-black/40 border-white/5 group hover:border-amber-500/30 transition-all flex justify-between items-center">
                        <div className="flex items-center gap-8">
                           <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl grayscale group-hover:grayscale-0 transition-all">📂</div>
                           <div>
                              <div className="flex items-center gap-3 mb-1">
                                 <span className="text-[9px] font-mono text-amber-500">{req.code}</span>
                                 <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase ${req.priority === 'HIGH' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400'}`}>{req.priority}</span>
                                 <h4 className="text-sm font-bold text-white uppercase">{req.title}</h4>
                              </div>
                              <p className="text-[10px] text-gray-500 italic">Mục tiêu: {req.type} • Hạn: {new Date(req.dueDate).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-8">
                           <span className="px-3 py-1 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[8px] font-black uppercase tracking-widest">{req.status}</span>
                           <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-white/10">Xử lý Shard</button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          )}

          {activeTab === 'ASSESSMENTS' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                   {assessments.map(ass => (
                     <div key={ass.id} className="ai-panel p-10 bg-gradient-to-br from-indigo-900/10 to-transparent border-indigo-500/20 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl italic font-serif grayscale">
                           {ass.score}%
                        </div>
                        <div className="flex justify-between items-start mb-8 relative z-10">
                           <div>
                              <div className="flex items-center gap-3 mb-2">
                                 <Gauge size={16} className="text-indigo-400" />
                                 <span className="text-[9px] font-mono text-indigo-500 uppercase tracking-widest">{ass.code}</span>
                              </div>
                              <h3 className="text-3xl font-bold text-white uppercase italic tracking-tighter leading-none">{ass.entityName}</h3>
                           </div>
                           <div className="text-right">
                              <p className="text-4xl font-mono font-black text-cyan-400">{ass.score}</p>
                              <p className="text-[8px] text-gray-600 font-black uppercase mt-1">Audit Score</p>
                           </div>
                        </div>

                        <div className="space-y-4 mb-10 relative z-10">
                           {ass.findings.map((f, i) => (
                             <div key={i} className="flex items-center gap-3 text-xs text-gray-400 italic font-light">
                                <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
                                <span>{f}</span>
                             </div>
                           ))}
                        </div>

                        <div className="flex justify-between items-center pt-8 border-t border-white/5 relative z-10">
                           <div className="flex gap-4">
                              <div className="flex items-center gap-2">
                                 <Clock size={12} className="text-gray-600" />
                                 <span className="text-[9px] text-gray-500 font-bold uppercase">{new Date(ass.assessmentDate).toLocaleDateString()}</span>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${ass.passed ? 'bg-green-600/10 text-green-500 border border-green-500/20' : 'bg-red-600/10 text-red-500 border border-red-500/20'}`}>
                                 {ass.passed ? '✓ PASSED' : '✕ FAILED'}
                              </div>
                           </div>
                           <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase shadow-lg hover:bg-indigo-500">View Shard Report</button>
                        </div>
                     </div>
                   ))}
                </div>
            </div>
          )}
      </main>

      <footer className="mt-auto pt-8 border-t border-white/5 flex items-center gap-8 shrink-0">
          <div className="flex items-center gap-6 ai-panel p-6 bg-indigo-500/5 border-indigo-500/20 max-w-4xl">
              <AIAvatar personaId={PersonaID.KRIS} size="sm" isThinking={false} />
              <div>
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 italic">Kris - Chief Compliance Officer</h4>
                  <p className="text-[11px] text-gray-400 italic leading-relaxed font-light">
                      "Thưa Anh Natt, Kris đã đồng bộ các bản đánh giá từ Shard **Kho vận** và **Kế toán**. Hiện tại Risk Score toàn hệ thống đang ở mức 12 (NOMINAL). Tuy nhiên, Anh cần lưu ý yêu cầu gia hạn chứng chỉ GIA cho lô hàng ngày 15/04 tới."
                  </p>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default CompliancePortal;
