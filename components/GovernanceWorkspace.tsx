
import React, { useState, useEffect } from 'react';
import { UserRole, TxStatus, GovernanceTransaction, AuditTrailEntry, ModuleID, Permission } from '../types';
import { RBACEngine } from '../services/rbacEngine';

interface GovernanceWorkspaceProps {
  currentRole: UserRole;
  logAction: (action: string, details: string) => void;
}

const GovernanceWorkspace: React.FC<GovernanceWorkspaceProps> = ({ currentRole, logAction }) => {
  const [transactions, setTransactions] = useState<GovernanceTransaction[]>([
    {
      id: 'TX-2025-001',
      period: '2025-01',
      status: 'CHỜ PHÊ DUYỆT',
      type: 'BÁN HÀNG',
      amount: 450000000,
      counterparty: 'Khách hàng VIP Natt',
      description: 'Nhẫn Nam Rolex Custom Diamond - Hột chủ 7.2ly',
      date: '2025-01-22',
      attachments: [{ id: 'doc1', name: 'invoice_v1.xml', url: '#' }],
      flags: [{ level: 'TRUNG BÌNH', message: 'Cảnh báo: Chênh lệch giá vốn dự kiến 2%' }],
      auditTrail: [
        { id: 'a1', timestamp: Date.now() - 3600000, userId: 'OPERATOR_1', role: UserRole.LEVEL_4, action: 'KHỞI TẠO', hash: '0x8f3c...29a1' }
      ]
    }
  ]);

  const [selectedTx, setSelectedTx] = useState<GovernanceTransaction | null>(null);

  const isMaster = currentRole === UserRole.MASTER;

  // Kiểm tra quyền nút bấm thời gian thực thông qua RBACEngine
  // 1️⃣ Fix: Sử dụng Permission Enum thay vì String literal để kiểm tra quyền
  const canApprove = RBACEngine.getPermissionMatrix(currentRole)[ModuleID.FINANCE]?.includes(Permission.APPROVE);
  const canSign = RBACEngine.getPermissionMatrix(currentRole)[ModuleID.FINANCE]?.includes(Permission.SIGN);

  const updateTxStatus = (id: string, newStatus: TxStatus) => {
    // 2️⃣ Fix: Map trạng thái sang Permission Enum tương ứng thay vì string literal
    const requiredAction = (newStatus === 'SẴN SÀNG KÝ' || newStatus === 'BỊ TRẢ LẠI') ? Permission.APPROVE : 
                          (newStatus === 'ĐÃ KÝ SỐ') ? Permission.SIGN : Permission.VIEW;
    
    const isAuthorized = RBACEngine.getPermissionMatrix(currentRole)[ModuleID.FINANCE]?.includes(requiredAction);
    
    if (!isAuthorized) {
      alert(`⚠️ TRUY CẬP BỊ TỪ CHỐI: Vai trò ${currentRole} không có quyền thực hiện hành động ${requiredAction}.`);
      return;
    }

    const hash = '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 10);
    const newAudit: AuditTrailEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      userId: `AUTH_${currentRole}`,
      role: currentRole,
      action: newStatus,
      hash
    };

    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, status: newStatus, auditTrail: [...tx.auditTrail, newAudit] } : tx));
    logAction(`GOVERNANCE_PROTOCOL_${newStatus}`, `Bản ghi ${id} đã được xác thực mã hóa bởi ${currentRole}.`);
    
    if (selectedTx?.id === id) {
       setSelectedTx({ ...selectedTx, status: newStatus, auditTrail: [...selectedTx.auditTrail, newAudit] });
    }
  };

  return (
    <div className="p-8 md:p-12 max-w-[1800px] mx-auto h-full space-y-10 animate-in fade-in duration-500 pb-32 no-scrollbar">
      
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
         <div>
            <h2 className="ai-headline text-4xl uppercase tracking-tighter italic">Quản Trị Ma Trận Quyền</h2>
            <p className="ai-sub-headline text-indigo-300 mt-2">Xác thực giao dịch đa tầng • Immutable Audit Trail v5.0</p>
         </div>
         <div className="flex gap-4">
            <div className="ai-panel px-6 py-3 border-cyan-500/20 bg-cyan-500/5">
               <p className="ai-sub-headline text-cyan-400">Node Cluster</p>
               <p className="text-xl font-black text-white uppercase tracking-widest">{currentRole.split('(')[0]}</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
         
         <div className="xl:col-span-3 ai-panel overflow-hidden border-indigo-500/30">
            <div className="p-6 border-b border-indigo-500/20 bg-indigo-900/10 flex justify-between items-center">
               <h3 className="ai-sub-headline">Sổ Cái Nghiệp Vụ • Dynamic Workflow</h3>
               <div className="flex gap-4">
                  <span className="text-[9px] font-black text-gray-500 uppercase px-3 py-1 bg-white/5 rounded">Filter: Finance Module</span>
               </div>
            </div>
            
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="ai-sub-headline text-white/40 border-b border-indigo-500/10 bg-white/5">
                       <th className="p-6">Giao dịch / Node</th>
                       <th className="p-6">Đối tượng</th>
                       <th className="p-6 text-right">Giá trị VND</th>
                       <th className="p-6 text-center">Trạng thái Workflow</th>
                       <th className="p-6">Ủy quyền</th>
                    </tr>
                  </thead>
                  <tbody className="text-indigo-100">
                    {transactions.map(tx => (
                      <tr key={tx.id} onClick={() => setSelectedTx(tx)} className={`border-b border-indigo-500/5 hover:bg-indigo-500/10 transition-colors cursor-pointer group ${selectedTx?.id === tx.id ? 'bg-indigo-500/20' : ''}`}>
                         <td className="p-6">
                            <p className="font-mono font-bold text-cyan-300 group-hover:text-white uppercase">{tx.id}</p>
                            <p className="text-[9px] text-indigo-400/60 font-black mt-1 uppercase italic">{tx.date}</p>
                         </td>
                         <td className="p-6">
                            <div className="flex flex-col gap-1">
                               <span className="font-bold text-sm tracking-tight text-white uppercase">{tx.counterparty}</span>
                               <span className="text-[10px] text-indigo-400 italic">"{tx.description}"</span>
                            </div>
                         </td>
                         <td className="p-6 text-right font-mono font-bold text-lg text-white">
                            {tx.amount.toLocaleString()}
                         </td>
                         <td className="p-6 text-center">
                            <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${
                              tx.status === 'SẴN SÀNG KÝ' ? 'bg-amber-500/20 border-amber-500 text-amber-500 animate-pulse' :
                              tx.status === 'CHỜ PHÊ DUYỆT' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' :
                              tx.status === 'ĐÃ KÝ SỐ' ? 'bg-green-500/20 border-green-500 text-green-400' :
                              'bg-white/5 border-white/20 text-white/40'
                            }`}>
                               {tx.status}
                            </span>
                         </td>
                         <td className="p-6">
                            <div className="flex gap-2">
                               {tx.auditTrail.slice(-2).map((a, i) => (
                                 <div key={i} className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[8px] font-bold text-gray-500" title={`${a.role}: ${a.action}`}>
                                   {a.role[0]}
                                 </div>
                               ))}
                            </div>
                         </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* DETAIL PANEL WITH WORKFLOW CONTROLS */}
         <div className="space-y-8">
            {selectedTx ? (
              <div className="ai-panel p-8 space-y-8 animate-in slide-in-from-right-10 duration-500 border-cyan-500/30 bg-black/40 shadow-[0_0_50px_rgba(34,211,238,0.05)]">
                 <div className="flex justify-between items-center">
                    <h4 className="ai-sub-headline text-cyan-400 italic tracking-[0.2em]">Node Verification</h4>
                    <button onClick={() => setSelectedTx(null)} className="text-white/20 hover:text-white transition-colors text-xl">✕</button>
                 </div>

                 <div className="space-y-6">
                    <div className="p-6 bg-indigo-500/5 rounded-3xl border border-indigo-500/20">
                       <p className="ai-sub-headline mb-5 opacity-40 italic">Lịch sử Băm (Blockchain Audit)</p>
                       <div className="space-y-5">
                          {selectedTx.auditTrail.map((audit, i) => (
                             <div key={audit.id} className="relative pl-6 border-l border-indigo-500/20">
                                <div className={`absolute left-[-4.5px] top-0 w-2 h-2 rounded-full ${i === selectedTx.auditTrail.length - 1 ? 'bg-cyan-500 animate-ping' : 'bg-indigo-500'}`}></div>
                                <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">{audit.action}</p>
                                <p className="text-[8px] font-mono text-gray-500 truncate mt-1">{audit.hash}</p>
                                <p className="text-[7px] text-gray-700 mt-1 uppercase font-bold">{audit.userId} • {new Date(audit.timestamp).toLocaleTimeString()}</p>
                             </div>
                          ))}
                       </div>
                    </div>

                    {selectedTx.flags.map((f, i) => (
                       <div key={i} className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl">
                          <div className="flex items-center gap-3 mb-2">
                             <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                             <p className="text-[9px] text-red-400 font-black uppercase tracking-widest">Risk Flag</p>
                          </div>
                          <p className="text-[11px] text-red-200 italic leading-relaxed">"{f.message}"</p>
                       </div>
                    ))}
                 </div>

                 <div className="pt-8 border-t border-indigo-500/10 space-y-4">
                    {/* HÀNH ĐỘNG DỰA TRÊN QUYỀN RBAC THỰC TẾ */}
                    {canApprove && selectedTx.status === 'CHỜ PHÊ DUYỆT' && (
                       <div className="grid grid-cols-2 gap-4">
                          <button onClick={() => updateTxStatus(selectedTx.id, 'BỊ TRẢ LẠI')} className="py-4 rounded-2xl border border-red-500/30 text-red-400 text-[10px] font-black uppercase hover:bg-red-500/10 transition-all">Bác bỏ</button>
                          <button onClick={() => updateTxStatus(selectedTx.id, 'SẴN SÀNG KÝ')} className="py-4 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase hover:bg-indigo-500 shadow-xl shadow-indigo-500/20 transition-all">Phê duyệt</button>
                       </div>
                    )}

                    {canSign && selectedTx.status === 'SẴN SÀNG KÝ' && (
                       <button onClick={() => updateTxStatus(selectedTx.id, 'ĐÃ KÝ SỐ')} className="w-full py-6 bg-red-600 text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-[2rem] hover:bg-red-700 shadow-[0_0_40px_rgba(220,38,38,0.3)] flex items-center justify-center gap-4 transition-all active:scale-95">
                          <span>🔐</span> KÝ GIAO THỨC MASTER
                       </button>
                    )}

                    {!canApprove && !canSign && selectedTx.status !== 'ĐÃ KÝ SỐ' && (
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center opacity-40">
                         <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest leading-relaxed">Bạn chỉ có quyền xem (Read-only)<br/>với bản ghi này.</p>
                      </div>
                    )}

                    {selectedTx.status === 'ĐÃ KÝ SỐ' && (
                      <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-[2rem] text-center">
                         <p className="text-xl mb-2">📄</p>
                         <p className="text-[10px] text-green-500 font-black uppercase tracking-[0.2em]">BẢN GHI ĐÃ NIÊM PHONG</p>
                         {isMaster && (
                           <button className="mt-4 px-6 py-2 bg-green-500 text-black text-[9px] font-black uppercase rounded-lg hover:bg-green-400">Tải File Đã Ký</button>
                         )}
                      </div>
                    )}
                 </div>
              </div>
            ) : (
              <div className="ai-panel p-12 border-dashed border-indigo-500/20 opacity-30 h-[600px] flex flex-col items-center justify-center text-center">
                 <span className="text-7xl mb-8 grayscale animate-pulse">🏛️</span>
                 <p className="ai-sub-headline">Audit Node Empty</p>
                 <p className="text-[9px] text-white/40 mt-4 uppercase tracking-[0.2em] max-w-[200px] mx-auto leading-relaxed">Vui lòng chọn giao dịch từ sổ cái để thực thi giao thức phê duyệt.</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default GovernanceWorkspace;
