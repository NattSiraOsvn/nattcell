
import React, { useState, useEffect } from 'react';
import { SmartLinkEngine } from '../services/smartLinkEngine';
import { SalesCore } from '../services/salesCore';
import { AccountingEntry, UserRole, OrderItem, WarehouseLocation, ProductType, Department } from '../types';
import AIAvatar from './AIAvatar';
import { PersonaID } from '../types';

interface SmartLinkMapperProps {
  currentRole: UserRole;
  logAction: (action: string, details: string) => void;
}

const SmartLinkMapper: React.FC<SmartLinkMapperProps> = ({ currentRole, logAction }) => {
  const [entries, setEntries] = useState<AccountingEntry[]>([]);
  // 🛠️ Fixed: Use string union type directly to prevent TSX generic parsing error where <'ALL' is seen as a JSX tag.
  const [filter, setFilter] = useState<string>('ALL');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock Data Injection & Processing
  useEffect(() => {
    simulateDataLoading();
  }, []);

  const simulateDataLoading = async () => {
    setIsProcessing(true);
    
    // 1. Simulate Sales Order
    const mockOrder = SalesCore.createSalesOrder(
      'DIRECT_SALE' as any,
      { id: 'C1', name: 'NGUYỄN VĂN A', phone: '0909...', tier: 'VIP_GOLD', loyaltyPoints: 100 },
      // Fix: Added missing department property to UserPosition mock
      { id: 'S1', name: 'Sale 1', position: { id: 'P1', role: 'CONSULTANT' as any, department: Department.SALES, scope: [] }, kpiScore: 100 },
      // Fix: Added missing sku and total properties to satisfy OrderItem interface
      [{ 
        productId: 'P1', 
        productCode: 'SP001', 
        productName: 'Nhẫn Kim Cương', 
        productType: ProductType.FINISHED_GOOD, 
        sku: 'SP001',
        quantity: 1, 
        unitPrice: 50000000, 
        costPrice: 38000000, 
        discount: 0, 
        taxRate: 10, 
        total: 50000000,
        warehouseLocation: WarehouseLocation.HCM_HEADQUARTER
      }]
    );
    
    // 2. Simulate Bank Tx
    const mockTx = {
      id: 'TX9988',
      date: new Date().toISOString(),
      amount: 55000000,
      description: 'THU TIEN KHACH HANG NGUYEN VAN A',
      credit: 55000000,
      debit: 0,
      refNo: 'REF123',
      bankName: 'VCB',
      accountNumber: '...',
      type: 'INCOME',
      taxRate: 0,
      exchangeRate: 1,
      status: 'SYNCED' as any,
      processDate: ''
    };

    await new Promise(r => setTimeout(r, 1000)); 
    
    // 3. New Engine Logic: Multi-Entry Generation
    const salesEntries = SmartLinkEngine.generateFromSales(mockOrder); // Returns Array
    const entryFromBank = SmartLinkEngine.generateFromBank(mockTx as any);

    setEntries([...salesEntries, entryFromBank]);
    setIsProcessing(false);
  };

  const handlePostEntry = (id: string) => {
    setEntries(prev => prev.map(e => e.journalId === id ? { ...e, status: 'POSTED' } : e));
    logAction('ACCOUNTING_POST', `Đã ghi sổ cái bút toán ${id}`);
  };

  const filteredEntries = entries.filter(e => filter === 'ALL' || e.status === filter);

  const getJournalColor = (type?: string) => {
      switch(type) {
          case 'REVENUE': return 'border-blue-500/50 bg-blue-500/5';
          case 'COGS': return 'border-red-500/50 bg-red-500/5';
          case 'ALLOCATION': return 'border-purple-500/50 bg-purple-500/5';
          default: return 'border-white/10 bg-white/5';
      }
  };

  return (
    <div className="h-full flex flex-col bg-[#020202] p-8 md:p-12 overflow-y-auto no-scrollbar gap-10 animate-in fade-in duration-700 pb-40">
      
      <header className="flex flex-col lg:flex-row justify-between items-end gap-8 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-4 mb-3">
             <span className="text-4xl animate-pulse">🔗</span>
             <h2 className="ai-headline text-5xl italic uppercase tracking-tighter leading-none">Smart Link Mapper v2</h2>
          </div>
          <p className="ai-sub-headline text-indigo-300/40 ml-1 italic font-black tracking-[0.3em]">
             Multi-Journal Integration • TT200 Standard
          </p>
        </div>

        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 shrink-0">
           {(['ALL', 'DRAFT', 'LINKED', 'POSTED'] as const).map(f => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 filter === f ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
               }`}
             >
               {f}
             </button>
           ))}
        </div>
      </header>

      {/* INTELLIGENCE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 ai-panel p-10 bg-gradient-to-br from-indigo-900/10 to-transparent border-indigo-500/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl">🧠</div>
            <div className="flex items-center gap-6 mb-8 relative z-10">
               <AIAvatar personaId={PersonaID.THIEN} size="md" isThinking={isProcessing} />
               <div>
                  <h3 className="text-xl font-bold text-white uppercase italic tracking-widest">Thiên Strategic Core</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
                     {isProcessing ? 'ĐANG TÁCH BÚT TOÁN DOANH THU/GIÁ VỐN...' : 'HỆ THỐNG ĐÃ PHÂN LOẠI & ĐỊNH KHOẢN'}
                  </p>
               </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6 relative z-10">
               <div className="p-6 bg-black/40 rounded-3xl border border-white/5 text-center">
                  <p className="text-[9px] text-gray-500 font-black uppercase mb-2">Journals Created</p>
                  <p className="text-3xl font-mono font-black text-amber-500">{entries.length}</p>
               </div>
               <div className="p-6 bg-black/40 rounded-3xl border border-white/5 text-center">
                  <p className="text-[9px] text-gray-500 font-black uppercase mb-2">Auto-Matched</p>
                  <p className="text-3xl font-mono font-black text-green-400">100%</p>
               </div>
               <div className="p-6 bg-black/40 rounded-3xl border border-white/5 text-center">
                  <p className="text-[9px] text-gray-500 font-black uppercase mb-2">Pending Post</p>
                  <p className="text-3xl font-mono font-black text-blue-400">{entries.filter(e => e.status !== 'POSTED').length}</p>
               </div>
            </div>
         </div>

         <div className="ai-panel p-10 bg-black/40 border-white/10 flex flex-col justify-center items-center text-center">
            <button 
               onClick={simulateDataLoading}
               disabled={isProcessing}
               className="w-full py-6 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50"
            >
               {isProcessing ? 'PROCESSING...' : 'RUN SMART MAPPER'}
            </button>
            <p className="text-[9px] text-gray-600 mt-6 italic leading-relaxed">
               Engine sẽ tự động tách 1 Sales Order thành 2 bút toán: Doanh thu (Revenue) và Giá vốn (COGS) để đảm bảo nguyên tắc phù hợp.
            </p>
         </div>
      </div>

      {/* MAPPING TABLE */}
      <div className="space-y-6">
         {filteredEntries.map((entry) => (
            <div key={entry.journalId} className={`ai-panel p-0 overflow-hidden border ${getJournalColor(entry.journalType)} transition-all`}>
               <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                  <div className="flex items-center gap-4">
                     <span className={`text-[9px] font-black px-2 py-1 rounded text-black uppercase ${entry.journalType === 'REVENUE' ? 'bg-blue-400' : entry.journalType === 'COGS' ? 'bg-red-400' : 'bg-gray-400'}`}>
                        {entry.journalType || 'GENERAL'}
                     </span>
                     <span className="text-xs font-mono text-white">{entry.journalId}</span>
                     <span className="text-[10px] text-gray-500 font-bold uppercase ml-4">{new Date(entry.transactionDate).toLocaleDateString()}</span>
                  </div>
                  {entry.status !== 'POSTED' && (
                     <button onClick={() => handlePostEntry(entry.journalId)} className="px-6 py-2 bg-indigo-600 text-white text-[9px] font-black uppercase rounded-lg hover:bg-indigo-500 shadow-lg">Ghi sổ (Post)</button>
                  )}
               </div>
               
               <div className="p-6 bg-black/40">
                  <p className="text-xs text-gray-300 italic mb-6">Diễn giải: {entry.description}</p>
                  <div className="overflow-x-auto">
                     <table className="w-full text-[11px] text-left">
                        <thead>
                           <tr className="text-gray-500 font-black uppercase tracking-widest border-b border-white/10 pb-3">
                              <th className="pb-3">Tài khoản</th>
                              <th className="pb-3">Chi tiết</th>
                              <th className="pb-3 text-right">Nợ (Debit)</th>
                              <th className="pb-3 text-right">Có (Credit)</th>
                           </tr>
                        </thead>
                        <tbody>
                           {entry.entries.map((line, idx) => (
                              <tr key={idx} className="border-b border-white/5">
                                 <td className="py-4">
                                    <span className="text-white font-bold">{line.accountNumber}</span>
                                    <p className="text-[9px] text-gray-500 mt-1 uppercase">{line.accountName}</p>
                                 </td>
                                 <td className="py-4 text-gray-400 italic">{line.detail}</td>
                                 <td className="py-4 text-right font-mono text-white">{line.debit > 0 ? line.debit.toLocaleString() : '-'}</td>
                                 <td className="py-4 text-right font-mono text-white">{line.credit > 0 ? line.credit.toLocaleString() : '-'}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
               
               <div className="p-3 bg-white/[0.01] flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <span className="text-[8px] text-gray-600 font-black uppercase">Confidence:</span>
                     <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${entry.matchScore}%` }}></div>
                     </div>
                     <span className="text-[9px] font-mono text-green-500">{entry.matchScore}%</span>
                  </div>
                  {entry.aiNote && <p className="text-[9px] text-amber-500 italic">Advisor: {entry.aiNote}</p>}
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default SmartLinkMapper;
