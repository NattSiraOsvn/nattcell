import React, { useState } from 'react';
import { UserRole, PersonaID, ApprovalStatus, RefundRequest } from '../types';
import AIAvatar from './AIAvatar';

const PaymentHub: React.FC<{ currentRole: UserRole }> = ({ currentRole }) => {
  const [activeTab, setActiveTab] = useState<'QR' | 'RECON' | 'REFUND'>('QR');
  const [refunds, setRefunds] = useState<RefundRequest[]>([
    { id: 'REF-001', orderId: 'ORD-5542', amount: 45000000, reason: 'Khách đổi ý/Lỗi ni tay', status: ApprovalStatus.PENDING, requestedBy: 'SELLER-07', evidence: [], timestamp: Date.now() }
  ]);

  const handleApproveRefund = (id: string) => {
    if (currentRole !== UserRole.MASTER && currentRole !== UserRole.LEVEL_1) {
        alert("Chỉ Quản trị cấp cao mới có quyền phê duyệt Hoàn tiền.");
        return;
    }
    setRefunds(prev => prev.map(r => r.id === id ? { ...r, status: ApprovalStatus.APPROVED } : r));
    alert("✅ Đã phê duyệt lệnh hoàn tiền qua Cổng Bank.");
  };

  return (
    <div className="h-full flex flex-col p-8 bg-[#020202] overflow-y-auto no-scrollbar gap-10 animate-in fade-in duration-700 pb-40">
      <header className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
           <h2 className="ai-headline text-5xl italic uppercase tracking-tighter">Finance Hub</h2>
           <p className="ai-sub-headline text-cyan-300/40 font-black tracking-[0.4em] mt-2">Đối soát liên Shard • Refund Workflow v2.0</p>
        </div>
        <nav className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 shrink-0">
           {['QR', 'RECON', 'REFUND'].map(t => (
             <button 
                key={t} 
                onClick={() => setActiveTab(t as any)} 
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === t ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}
             >
                {t === 'QR' ? 'Cổng Thanh Toán' : t === 'RECON' ? 'Đối Soát Bank' : 'Hoàn Tiền (Refund)'}
             </button>
           ))}
        </nav>
      </header>

      {activeTab === 'RECON' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           <div className="lg:col-span-2 ai-panel p-10 bg-black/40 border-white/5 flex flex-col h-[600px]">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-sm font-bold text-white uppercase tracking-widest italic">Bank Statement Analysis</h3>
                 <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase animate-pulse">RUN DAILY JOB</button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                 {[1, 2, 3].map(i => (
                    <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] flex justify-between items-center group hover:bg-white/[0.05] transition-all">
                       <div className="flex items-center gap-6">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">🏦</div>
                          <div>
                             <p className="text-white font-bold text-sm uppercase">Giao dịch VCB #889{i}</p>
                             <p className="text-[8px] text-gray-500 mt-1 uppercase font-black">Ref: ORD-224{i} • Shard: SALES</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-green-500 font-mono font-black text-sm">MATCHED</p>
                          <p className="text-[10px] text-white mt-1">45.000.000 đ</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="space-y-8">
              <div className="ai-panel p-8 bg-indigo-500/5 border-indigo-500/20 shadow-2xl">
                 <div className="flex items-center gap-4 mb-6">
                    <AIAvatar personaId={PersonaID.CAN} size="sm" />
                    <h4 className="text-sm font-black text-indigo-400 uppercase tracking-widest">Can - Auditor</h4>
                 </div>
                 <p className="text-[11px] text-gray-400 italic leading-relaxed font-light">
                   "Thưa Anh Natt, Can đã hoàn tất đối soát 1.250 giao dịch trong ngày. Phát hiện 01 trường hợp 'Double Payment' tại Node HCM. Can đã tự động khởi tạo lệnh Refund để Anh duyệt."
                 </p>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'REFUND' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           <div className="lg:col-span-2 ai-panel overflow-hidden border-white/5 bg-black/40">
              <table className="w-full text-left text-[11px]">
                 <thead>
                    <tr className="text-gray-500 font-black uppercase border-b border-white/10 bg-black">
                       <th className="p-6">ID / Ngày</th>
                       <th className="p-6">Đơn hàng</th>
                       <th className="p-6 text-right">Số tiền</th>
                       <th className="p-6 text-center">Trạng thái</th>
                       <th className="p-6 text-right">Thao tác</th>
                    </tr>
                 </thead>
                 <tbody className="text-gray-300">
                    {refunds.map(r => (
                       <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                          <td className="p-6 font-mono text-[10px]">{r.id}</td>
                          <td className="p-6 font-bold text-white uppercase">{r.orderId}</td>
                          <td className="p-6 text-right font-mono text-red-400">{r.amount.toLocaleString()} đ</td>
                          <td className="p-6 text-center">
                             <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${r.status === ApprovalStatus.PENDING ? 'bg-amber-500 text-black animate-pulse' : 'bg-green-600 text-white'}`}>{r.status}</span>
                          </td>
                          <td className="p-6 text-right">
                             {r.status === ApprovalStatus.PENDING && (
                                <button onClick={() => handleApproveRefund(r.id)} className="px-4 py-2 bg-green-600 text-white rounded-lg text-[9px] font-black uppercase hover:bg-green-500">Phê duyệt</button>
                             )}
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           <aside className="ai-panel p-8 bg-red-500/5 border-red-500/20">
              <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-6 flex items-center gap-3">
                 <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                 Quy tắc Hoàn tiền (Điều 12)
              </h4>
              <ul className="text-[11px] text-gray-400 space-y-4 italic leading-relaxed list-disc list-inside">
                 <li>Mọi lệnh Refund phải có bằng chứng đối soát từ Bank.</li>
                 <li>Giá trị > 10M bắt buộc Master Natt ký số.</li>
                 <li>Dữ liệu hoàn hàng phải được Warehouse xác nhận nhập kho Physical trước khi nhả tiền.</li>
              </ul>
           </aside>
        </div>
      )}

      {activeTab === 'QR' && (
        <div className="py-20 text-center opacity-30 italic">
           <span className="text-9xl mb-8 grayscale">💳</span>
           <p className="text-2xl font-serif uppercase tracking-[0.5em]">Payment Node Ready</p>
        </div>
      )}
    </div>
  );
};

export default PaymentHub;