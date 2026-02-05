import React, { useState, useEffect } from 'react';
import { EInvoice, EInvoiceStatus, BusinessMetrics, UserRole, PersonaID } from '../types.ts';
import { EInvoiceEngineService } from '../services/eInvoiceService.ts';
import { NotifyBus } from '../services/notificationService.ts';
import AIAvatar from './AIAvatar.tsx';
import { 
  FileCode, ShieldCheck, Send, CheckCircle2, 
  Receipt, Search, Eye, Cpu, Database, 
  LayoutList, Code2, LockKeyhole
} from 'lucide-react';

interface SalesTaxModuleProps {
  logAction: (action: string, details: string) => void;
  metrics: BusinessMetrics;
  currentRole: UserRole;
}

const SalesTaxModule: React.FC<SalesTaxModuleProps> = ({ logAction, metrics, currentRole }) => {
  const [invoices, setInvoices] = useState<EInvoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<EInvoice | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'LEDGER' | 'WORKBENCH'>('LEDGER');

  useEffect(() => {
    // Khởi tạo dữ liệu mẫu nếu Ledger trống
    const currentLogs = EInvoiceEngineService.getInvoices();
    if (currentLogs.length === 0) {
        EInvoiceEngineService.createDraftFromOrder({
            id: 'ORD-MASTER-001',
            customerName: 'ANH NATT (CHAIRMAN)',
            total: 450000000,
            items: [
                { name: 'Nhẫn Nam Rolex Custom 18K', goldWeight: 3.5, stonePrice: 380000000, laborPrice: 15000000, total: 450000000 }
            ]
        });
    }
    setInvoices(EInvoiceEngineService.getInvoices());
  }, []);

  const handleIssuance = async (inv: EInvoice) => {
    setIsProcessing(true);
    const success = await EInvoiceEngineService.processIssuance(inv.id);
    setIsProcessing(false);
    
    if (success) {
        logAction('FISCAL_SEAL', `Phát hành HDĐT ${inv.id} thành công. Mã CQT đã được cấp.`);
        NotifyBus.push({
            type: 'SUCCESS',
            title: 'Hóa đơn đã được niêm phong',
            content: `Hóa đơn ${inv.id} đã hoàn tất truyền tin lên Cổng Thuế.`,
            persona: PersonaID.CAN
        });
    }
    setInvoices([...EInvoiceEngineService.getInvoices()]);
  };

  return (
    <div className="h-full flex flex-col p-8 lg:p-12 overflow-hidden gap-8 bg-[#020202] animate-in fade-in duration-700">
      <header className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-4 mb-3">
             <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <LockKeyhole size={24} />
             </div>
             <h2 className="ai-headline text-5xl italic uppercase tracking-tighter text-indigo-400">Fiscal Terminal</h2>
          </div>
          <p className="ai-sub-headline text-gray-500 font-black uppercase tracking-[0.4em] ml-1">Hệ thống HDĐT Tự xây dựng • SafeCA Token Integration</p>
        </div>
        
        <div className="flex bg-black/40 p-4 rounded-3xl border border-white/5 shadow-2xl items-center gap-6">
            <div className="text-right">
                <p className="text-[9px] text-gray-600 uppercase font-black">Digital Token Node</p>
                <p className="text-sm font-black text-green-500 uppercase italic">SafeCA Online</p>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-right">
                <p className="text-[9px] text-gray-600 uppercase font-black">Ledger Count</p>
                <p className="text-xl font-mono text-amber-500 font-bold">{invoices.length}</p>
            </div>
        </div>
      </header>

      <div className="flex gap-4">
          <button onClick={() => setActiveTab('LEDGER')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'LEDGER' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-gray-500'}`}>
             <LayoutList size={14}/> 1. Sổ cái HDĐT
          </button>
          <button onClick={() => setActiveTab('WORKBENCH')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'WORKBENCH' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-gray-500'}`}>
             <Code2 size={14}/> 2. Workbench bóc tách
          </button>
      </div>

      <main className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0">
         {/* LEFT AREA: CONTENT */}
         <div className="xl:col-span-8 ai-panel overflow-hidden border-white/5 bg-black/40 flex flex-col shadow-2xl relative">
            {activeTab === 'LEDGER' ? (
               <div className="flex-1 overflow-y-auto no-scrollbar">
                  <table className="w-full text-left text-[11px] border-collapse">
                     <thead>
                        <tr className="text-gray-500 font-black uppercase tracking-widest border-b border-white/10 bg-black sticky top-0 z-10">
                           <th className="p-6">Mã Hóa Đơn / Khách hàng</th>
                           <th className="p-6 text-right">Tổng thanh toán</th>
                           <th className="p-6 text-center">Trạng thái</th>
                           <th className="p-6 text-right">Tác vụ</th>
                        </tr>
                     </thead>
                     <tbody className="text-gray-300 italic">
                        {invoices.map(inv => (
                          <tr key={inv.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors group ${selectedInvoice?.id === inv.id ? 'bg-indigo-500/5' : ''}`} onClick={() => setSelectedInvoice(inv)}>
                             <td className="p-6">
                                <p className="font-bold text-white uppercase">{inv.id}</p>
                                <p className="text-[8px] text-gray-600 font-mono mt-1">{inv.customerName}</p>
                             </td>
                             <td className="p-6 text-right font-mono font-black text-lg text-white">
                                {(inv.totalAmount + inv.taxAmount).toLocaleString()} đ
                             </td>
                             <td className="p-6 text-center">
                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${
                                    inv.status === EInvoiceStatus.ACCEPTED ? 'bg-green-600/10 text-green-500 border-green-500/30' : 
                                    inv.status === EInvoiceStatus.SIGNED ? 'bg-blue-600/10 text-blue-500 border-blue-500/30' :
                                    'bg-amber-500/10 text-amber-500 border-amber-500/30 animate-pulse'
                                }`}>{inv.status}</span>
                             </td>
                             <td className="p-6 text-right">
                                {inv.status === EInvoiceStatus.DRAFT && (
                                   <button 
                                      onClick={(e) => { e.stopPropagation(); handleIssuance(inv); }}
                                      disabled={isProcessing}
                                      className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase hover:bg-indigo-500 shadow-lg active:scale-95 disabled:opacity-30"
                                   >
                                      Ký Số & Phát Hành
                                   </button>
                                )}
                                {inv.status === EInvoiceStatus.ACCEPTED && (
                                   <button className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-colors"><Eye size={16}/></button>
                                )}
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            ) : (
               <div className="flex-1 flex flex-col p-10 font-mono text-[11px] text-indigo-400 space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                     <span className="uppercase font-black text-gray-600 tracking-widest">// Cấu trúc XML bóc tách - TCT Standard v2.0</span>
                     <button className="text-[9px] font-black text-amber-500 underline uppercase">Copy Payload</button>
                  </div>
                  <pre className="flex-1 bg-black/60 rounded-[2.5rem] p-10 overflow-auto border border-white/5 text-green-500/80 leading-relaxed shadow-inner no-scrollbar">
                     {selectedInvoice?.xmlPayload || "<!-- Chọn một bản ghi từ sổ cái để bóc tách cấu trúc XML -->"}
                  </pre>
               </div>
            )}
         </div>

         {/* RIGHT AREA: DETAILS & AI ADVISOR */}
         <div className="xl:col-span-4 flex flex-col gap-8">
            {selectedInvoice ? (
               <div className="ai-panel p-8 bg-white/[0.02] border-indigo-500/30 flex flex-col gap-8 shadow-2xl animate-in slide-in-from-right-10">
                  <h3 className="text-xl font-bold text-white uppercase italic tracking-widest flex items-center gap-3">
                     <Receipt size={20} className="text-indigo-400" />
                     Invoice Details
                  </h3>

                  <div className="space-y-6">
                     <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Dòng hàng bóc tách (itemized)</p>
                     <div className="space-y-4">
                        {selectedInvoice.items?.map((item, idx) => (
                           <div key={idx} className="p-5 bg-black/40 rounded-[2rem] border border-white/5 group hover:border-amber-500/30 transition-all">
                              <div className="flex justify-between items-start mb-3">
                                 <h4 className="text-xs font-bold text-white uppercase">{item.name}</h4>
                                 <span className="text-[9px] font-mono text-amber-500">{item.taxRate}% VAT</span>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-[9px] text-gray-500 font-mono italic">
                                 <div>Công thợ: {item.laborPrice.toLocaleString()} đ</div>
                                 <div className="text-right">Đá: {item.stonePrice.toLocaleString()} đ</div>
                              </div>
                              <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-end">
                                 <span className="text-[8px] font-black text-gray-600 uppercase">Thành tiền (Net)</span>
                                 <span className="text-sm font-black text-white">{item.totalBeforeTax.toLocaleString()} đ</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {selectedInvoice.signatureHash && (
                    <div className="p-6 bg-indigo-950/20 border border-indigo-500/40 rounded-3xl">
                       <div className="flex items-center gap-3 mb-3">
                          <ShieldCheck size={18} className="text-indigo-400" />
                          <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Mã băm Chữ ký số (RSA)</h4>
                       </div>
                       <p className="text-[9px] text-gray-600 font-mono break-all leading-relaxed">
                          {selectedInvoice.signatureHash}
                       </p>
                    </div>
                  )}

                  {selectedInvoice.taxCode && (
                     <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-3xl text-center">
                        <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Mã xác thực của CQT</p>
                        <p className="text-xl font-mono font-black text-white">{selectedInvoice.taxCode}</p>
                     </div>
                  )}
               </div>
            ) : (
               <div className="ai-panel p-12 border-dashed border-white/10 opacity-20 flex flex-col items-center justify-center text-center flex-1">
                  <Database size={64} className="text-indigo-400 mb-6 grayscale" />
                  <p className="text-xl font-serif italic uppercase tracking-widest">Shard Fiscal Node<br/>Awaiting Selection</p>
               </div>
            )}

            <div className="ai-panel p-8 bg-black border-white/5 flex items-center gap-6">
                <AIAvatar personaId={PersonaID.CAN} size="sm" />
                <p className="text-[11px] text-gray-400 italic leading-relaxed font-light">
                   "Thưa Anh Natt, Can đang rà soát bóc tách dòng hàng cho hệ thống hóa đơn tự thân. Mọi mục **Công thợ** đã được đối soát với Shard nhân sự để đảm bảo tính hợp lệ của chi phí sản xuất trước khi băm XML."
                </p>
            </div>
         </div>
      </main>
    </div>
  );
};

export default SalesTaxModule;