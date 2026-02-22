
import React, { useState, useEffect } from 'react';
import { EInvoice, EInvoiceStatus, BusinessMetrics, UserRole, PersonaID, EInvoiceItem } from '@/types.ts';
import { EInvoiceEngine } from '@/services/einvoiceservice.ts';
import { NotifyBus } from '@/services/notificationservice.ts';
import { FileCode, ShieldCheck, Send, CheckCircle2, Receipt, Cpu, Database, ChevronRight, Zap } from 'lucide-react';

interface SalesTaxModuleProps {
  logAction: (action: string, details: string) => void;
  metrics: BusinessMetrics;
  currentRole: UserRole;
}

const SalesTaxModule: React.FC<SalesTaxModuleProps> = ({ logAction, metrics, currentRole }) => {
  const [invoices, setInvoices] = useState<EInvoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<EInvoice | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewMode, setViewMode] = useState<'LEDGER' | 'WORKBENCH'>('LEDGER');

  useEffect(() => {
    // Khởi tạo một số hóa đơn mẫu để bóc tách
    const mockItems: EInvoiceItem[] = [
      { id: 'it1', name: 'Nhẫn Nam Rolex 18K', goldWeight: 3.5, goldPrice: 24000000, stonePrice: 350000000, laborPrice: 5000000, taxRate: 10, totalBeforeTax: 379000000 }
    ];
    
    const initialInv: EInvoice = {
      id: 'INV-2026-0001',
      orderId: 'ORD-9988',
      customerName: 'ANH NATT ADMIN',
      items: mockItems,
      totalAmount: 379000000,
      taxAmount: 37900000,
      vatRate: 10,
      status: EInvoiceStatus.DRAFT,
      createdAt: Date.now()
    };
    setInvoices([initialInv]);
  }, []);

  const handleSignInvoice = async (inv: EInvoice) => {
    setIsProcessing(true);
    try {
      // 1. Tạo XML
      const xml = EInvoiceEngine.generateXML(inv);
      inv.xmlPayload = xml;
      inv.status = EInvoiceStatus.XML_BUILT;
      
      await new Promise(r => setTimeout(r, 1000));
      
      // 2. Ký số (Simulated Token)
      const signature = await EInvoiceEngine.signInvoice(inv.id);
      inv.signatureHash = signature;
      inv.status = EInvoiceStatus.SIGNED;
      
      logAction('FISCAL_SIGN', `Đã ký số hóa đơn ${inv.id} chuẩn RSA-4096.`);
      
      // 3. Truyền tin lên TCT
      const result = await EInvoiceEngine.transmitToTaxAuthority(inv);
      if (result.success) {
          inv.status = EInvoiceStatus.ACCEPTED;
          inv.taxCode = result.taxCode;
          inv.issuedAt = Date.now();
          NotifyBus.push({
            type: 'SUCCESS',
            title: 'Hóa đơn đã được niêm phong TCT',
            content: `Mã CQT: ${inv.taxCode} đã được băm vào sổ cái.`,
            persona: PersonaID.CAN
          });
      }
    } finally {
      setIsProcessing(false);
      setInvoices([...invoices]);
    }
  };

  return (
    <div className="h-full flex flex-col p-8 lg:p-12 overflow-hidden gap-8 bg-[#020202] animate-in fade-in duration-700">
      <header className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-4">
             <span className="px-3 py-1 bg-amber-500/20 text-amber-500 text-[10px] font-black rounded-full border border-amber-500/30 uppercase tracking-widest">Self-Built Node v5.2</span>
             <h2 className="ai-headline text-5xl italic uppercase tracking-tighter text-white">Fiscal Terminal</h2>
          </div>
          <p className="ai-sub-headline text-stone-500 font-black uppercase tracking-[0.4em] mt-2">Bóc tách dòng hàng • Ký số RSA • Truyền tin Direct API</p>
        </div>
        
        <div className="flex bg-black/60 p-4 rounded-3xl border border-white/5 shadow-2xl">
            <div className="text-right">
                <p className="text-[9px] text-stone-600 uppercase font-black">Digital Token Status</p>
                <p className="text-sm font-black text-green-500 uppercase italic">SafeCA Online</p>
            </div>
        </div>
      </header>

      <div className="flex gap-4 mb-2">
         <button onClick={() => setViewMode('LEDGER')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'LEDGER' ? 'bg-amber-500 text-black shadow-lg' : 'bg-white/5 text-stone-500'}`}>1. Sổ cái hóa đơn</button>
         <button onClick={() => setViewMode('WORKBENCH')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'WORKBENCH' ? 'bg-amber-500 text-black shadow-lg' : 'bg-white/5 text-stone-500'}`}>2. Bóc tách XML (Workbench)</button>
      </div>

      <main className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0">
         {/* LEFT: CONTENT AREA */}
         <div className="xl:col-span-8 ai-panel overflow-hidden border-white/5 bg-black/40 flex flex-col shadow-2xl">
            {viewMode === 'LEDGER' ? (
               <div className="flex-1 overflow-y-auto no-scrollbar">
                  <table className="w-full text-left text-[11px] border-collapse">
                     <thead>
                        <tr className="text-stone-500 font-black uppercase tracking-widest border-b border-white/10 bg-black sticky top-0 z-10">
                           <th className="p-6">Mã Hóa Đơn / Khách hàng</th>
                           <th className="p-6 text-right">Tổng giá trị (Net)</th>
                           <th className="p-6 text-center">Trạng thái Shard</th>
                           <th className="p-6 text-right">Tác vụ</th>
                        </tr>
                     </thead>
                     <tbody className="text-stone-300">
                        {invoices.map(inv => (
                          <tr key={inv.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer ${selectedInvoice?.id === inv.id ? 'bg-white/[0.05]' : ''}`} onClick={() => setSelectedInvoice(inv)}>
                             <td className="p-6">
                                <p className="font-bold text-white uppercase">{inv.id}</p>
                                <p className="text-[9px] text-stone-600 font-mono mt-1">{inv.customerName}</p>
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
                                   <button onClick={(e) => { e.stopPropagation(); handleSignInvoice(inv); }} className="px-6 py-2 bg-white text-black rounded-xl text-[9px] font-black uppercase hover:bg-amber-500 transition-all shadow-xl">Ký Số</button>
                                )}
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            ) : (
               <div className="flex-1 flex flex-col p-10 font-mono">
                  <div className="flex justify-between items-center mb-6">
                     <span className="text-[10px] text-stone-600 uppercase tracking-widest italic">// Cấu trúc bóc tách XML - TCT Standard v2.0</span>
                     <button className="text-[9px] text-amber-500 underline uppercase font-black">Copy Payload</button>
                  </div>
                  <div className="flex-1 bg-black rounded-[2.5rem] border border-white/5 p-8 overflow-y-auto no-scrollbar shadow-inner text-green-500/80 leading-relaxed text-xs">
                     {selectedInvoice?.xmlPayload || "<!-- Chọn một hóa đơn để xem cấu trúc băm Shard XML -->"}
                  </div>
               </div>
            )}
         </div>

         {/* RIGHT: DETAIL & ADVISOR */}
         <div className="xl:col-span-4 flex flex-col gap-8">
            {selectedInvoice ? (
               <div className="ai-panel p-8 bg-white/[0.02] border-amber-500/20 flex flex-col gap-8 shadow-2xl animate-in slide-in-from-right-10">
                  <h3 className="text-xl font-bold text-white uppercase italic tracking-widest flex items-center gap-3">
                     <Receipt size={20} className="text-amber-500" />
                     Bản thảo chi tiết
                  </h3>

                  <div className="space-y-6">
                     <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Dòng hàng bóc tách (Vàng & Đá)</p>
                     <div className="space-y-4">
                        {selectedInvoice.items.map((item, idx) => (
                           <div key={idx} className="p-5 bg-black/60 rounded-[2rem] border border-white/5">
                              <p className="text-xs font-bold text-white uppercase mb-2">{item.name}</p>
                              <div className="grid grid-cols-2 gap-4 text-[9px] font-mono text-stone-500">
                                 <div>Vàng: {item.goldWeight} chỉ</div>
                                 <div className="text-right">Đá: {item.stonePrice.toLocaleString()} đ</div>
                                 <div>Công thợ: {item.laborPrice.toLocaleString()} đ</div>
                                 <div className="text-right text-amber-500">Thuế: {item.taxRate}%</div>
                              </div>
                              <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-end">
                                 <span className="text-[8px] font-black text-stone-600 uppercase">Thành tiền</span>
                                 <span className="text-sm font-black text-white">{item.totalBeforeTax.toLocaleString()} đ</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-3xl">
                     <div className="flex items-center gap-3 mb-3">
                        <ShieldCheck size={18} className="text-indigo-400" />
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Mã băm chữ ký (RSA-4096)</h4>
                     </div>
                     <p className="text-[9px] text-stone-600 font-mono break-all leading-relaxed">
                        {selectedInvoice.signatureHash || "Awaiting Sealing..."}
                     </p>
                  </div>
               </div>
            ) : (
               <div className="ai-panel p-12 border-dashed border-stone-800 flex flex-col items-center justify-center text-center opacity-30 flex-1">
                  <Database size={64} className="text-stone-700 mb-6" />
                  <p className="text-xl font-serif italic uppercase tracking-widest">Data Shard Awaiting Selection</p>
               </div>
            )}

            <div className="ai-panel p-8 bg-black border-white/5 flex items-center gap-6">
                <p className="text-[11px] text-stone-400 italic leading-relaxed font-light">
                   "Thưa Anh Natt, Can đã bóc tách định mức 'Vàng 18K' và 'Kim cương rời' cho hóa đơn này. Mọi mục **Công thợ** đã được đối soát với Shard nhân sự để đảm bảo tính hợp lệ của chi phí sản xuất."
                </p>
            </div>
         </div>
      </main>
    </div>
  );
};

export default SalesTaxModule;
