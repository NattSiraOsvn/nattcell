
import React, { useState, useEffect } from 'react';
import { Policy, PolicyStatus, PolicyType, PersonaID } from '../../types.ts';
import { ComplianceProvider } from '../../services/compliance/ComplianceService.ts';
import LoadingSpinner from '../common/LoadingSpinner.tsx';
import AIAvatar from '../AIAvatar.tsx';
import { FileText, Edit, Trash2, Eye, Share2, Download, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const PolicyManager: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await ComplianceProvider.getPolicies();
    setPolicies(res);
    setLoading(false);
  };

  const filteredPolicies = policies.filter(p => filter === 'ALL' || p.status === filter);

  // Statistics Calculation
  const stats = {
    total: policies.length,
    active: policies.filter(p => p.status === PolicyStatus.ACTIVE).length,
    requireReview: policies.filter(p => {
        if (!p.reviewDate) return false;
        const daysDiff = Math.ceil((p.reviewDate - Date.now()) / (86400000));
        return daysDiff <= 30;
    }).length,
    expired: policies.filter(p => p.status === PolicyStatus.ARCHIVED).length
  };

  if (loading) return <LoadingSpinner message="Bóc tách Ledger chính sách..." />;

  const getStatusStyle = (status: PolicyStatus) => {
    switch (status) {
      case PolicyStatus.ACTIVE: return 'bg-green-500/10 text-green-500 border-green-500/30';
      case PolicyStatus.UNDER_REVIEW: return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      case PolicyStatus.ARCHIVED: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
      default: return 'bg-white/5 text-white/40 border-white/10';
    }
  };

  const getTypeStyle = (type: PolicyType) => {
    switch (type) {
      case PolicyType.INTERNAL_POLICY: return 'text-blue-400';
      case PolicyType.EXTERNAL_REGULATION: return 'text-purple-400';
      case PolicyType.PROCEDURE: return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700 pb-20">
      
      {/* STATISTICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Policies', val: stats.total, color: 'text-white' },
          { label: 'Active State', val: stats.active, color: 'text-green-500' },
          { label: 'Require Review', val: stats.requireReview, color: 'text-amber-500' },
          { label: 'Expired/Archived', val: stats.expired, color: 'text-red-500' }
        ].map((s, i) => (
          <div key={i} className="ai-panel p-6 bg-black/40 border-white/5 flex flex-col justify-between">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{s.label}</p>
            <p className={`text-4xl font-mono font-black mt-2 ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        
        {/* POLICY LEDGER TABLE */}
        <div className="xl:col-span-3 ai-panel overflow-hidden border-white/5 bg-black/40 flex flex-col shadow-2xl">
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-4">
              {['ALL', 'ACTIVE', 'UNDER_REVIEW', 'DRAFT'].map(f => (
                <button 
                  key={f} 
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase border transition-all ${
                    filter === f ? 'bg-amber-500 text-black border-amber-500' : 'bg-white/5 text-gray-500 border-white/5 hover:text-white'
                  }`}
                >
                  {f.replace('_', ' ')}
                </button>
              ))}
            </div>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg hover:bg-indigo-500 transition-all flex items-center gap-2">
               <FileText size={14} /> New Policy
            </button>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-[11px] border-collapse">
               <thead>
                  <tr className="text-gray-500 font-black uppercase tracking-widest border-b border-white/10 bg-black">
                     <th className="p-6">Mã / Tiêu đề</th>
                     <th className="p-6">Phân loại</th>
                     <th className="p-6">Trạng thái</th>
                     <th className="p-6">Review Date</th>
                     <th className="p-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="text-gray-300">
                  {filteredPolicies.map(p => {
                    const reviewDate = p.reviewDate ? new Date(p.reviewDate) : null;
                    const daysDiff = reviewDate ? Math.ceil((reviewDate.getTime() - Date.now()) / (86400000)) : Infinity;
                    const isUrgent = daysDiff <= 30;

                    return (
                      <tr 
                        key={p.id} 
                        onClick={() => setSelectedPolicy(p)}
                        className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer group ${selectedPolicy?.id === p.id ? 'bg-white/[0.05]' : ''}`}
                      >
                        <td className="p-6">
                           <p className="font-bold text-white uppercase group-hover:text-amber-500 transition-colors">{p.title}</p>
                           <p className="text-[9px] text-gray-600 font-mono mt-1">{p.policyCode}</p>
                        </td>
                        <td className="p-6">
                           <span className={`text-[10px] font-bold uppercase ${getTypeStyle(p.type)}`}>
                             {p.type.replace('_', ' ')}
                           </span>
                        </td>
                        <td className="p-6">
                           <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${getStatusStyle(p.status)}`}>
                              {p.status}
                           </span>
                        </td>
                        <td className="p-6">
                           <div className={`flex items-center gap-2 font-mono ${isUrgent ? 'text-amber-500' : 'text-gray-500'}`}>
                             {reviewDate ? reviewDate.toLocaleDateString() : 'N/A'}
                             {isUrgent && <Clock size={12} className="animate-pulse" />}
                           </div>
                        </td>
                        <td className="p-6 text-right">
                           <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"><Eye size={14}/></button>
                              <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"><Edit size={14}/></button>
                              <button className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                           </div>
                        </td>
                      </tr>
                    );
                  })}
               </tbody>
            </table>
          </div>
        </div>

        {/* DETAIL DRAWER / AI ADVISOR */}
        <div className="space-y-8 flex flex-col h-full">
           {selectedPolicy ? (
              <div className="ai-panel p-10 bg-black border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.05)] animate-in slide-in-from-right-10 flex flex-col flex-1">
                 <div className="flex justify-between items-start mb-8">
                    <div>
                       <h4 className="text-xl font-bold text-white uppercase italic tracking-tighter leading-tight">Policy Bóc tách</h4>
                       <span className="text-[9px] text-amber-500 font-mono uppercase tracking-widest">{selectedPolicy.policyCode}</span>
                    </div>
                    <button onClick={() => setSelectedPolicy(null)} className="text-white/20 hover:text-white transition-colors">✕</button>
                 </div>

                 <div className="space-y-8 flex-1">
                    <div className="space-y-3">
                       <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Mô tả tóm lược</p>
                       <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                          <p className="text-xs text-gray-400 italic font-light leading-relaxed">"{selectedPolicy.description}"</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-5 bg-white/[0.02] border border-white/5 rounded-[2rem] text-center">
                          <p className="text-[8px] text-gray-600 uppercase font-black mb-2">Effective Date</p>
                          <p className="text-xs text-white font-mono">{new Date(selectedPolicy.effectiveDate).toLocaleDateString()}</p>
                       </div>
                       <div className="p-5 bg-white/[0.02] border border-white/5 rounded-[2rem] text-center">
                          <p className="text-[8px] text-gray-600 uppercase font-black mb-2">Owner Node</p>
                          <p className="text-xs text-white uppercase font-bold truncate">{selectedPolicy.ownerId}</p>
                       </div>
                    </div>
                    
                    <div className="pt-4 space-y-3">
                       <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Giao thức tác vụ</p>
                       <div className="grid grid-cols-2 gap-3">
                          <button className="py-4 bg-white text-black rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl flex items-center justify-center gap-2">
                             <Download size={12}/> PDF
                          </button>
                          <button className="py-4 bg-indigo-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center justify-center gap-2">
                             <Share2 size={12}/> Sign
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           ) : (
              <div className="ai-panel p-12 border-dashed border-white/10 opacity-20 flex flex-col items-center justify-center text-center h-[400px]">
                 <span className="text-6xl mb-6 grayscale">📚</span>
                 <p className="text-[10px] uppercase font-black tracking-[0.4em] leading-relaxed">Chọn chính sách để bóc tách thông số kỹ thuật</p>
              </div>
           )}

           <div className="ai-panel p-8 bg-indigo-500/5 border-indigo-500/20 mt-auto">
              <div className="flex items-center gap-4 mb-6">
                 <AIAvatar personaId={PersonaID.KRIS} size="sm" isThinking={false} />
                 <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Compliance Assistant</h4>
              </div>
              <p className="text-[11px] text-gray-400 italic leading-relaxed font-light">
                 "Thưa Anh Natt, Kris đã đối soát các chính sách hiện hành với sổ cái **SmartLink**. Mọi thay đổi về định mức vàng 18K (AU750) bắt buộc phải được băm Hash và niêm phong bởi **MASTER_NATT** trước khi có hiệu lực."
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default PolicyManager;
