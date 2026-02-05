
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Product, ExchangeItem, BusinessMetrics, UserRole, 
  PersonaID, QuoteRequest, QuoteResult, UserPosition, 
  IdentityData, AlertLevel 
} from '../../types';
import { PRODUCT_SEED_DATA } from '../../constants';
import { NotifyBus } from '../../services/notificationService';
import { PaymentEngine, PaymentResponse } from '../../services/paymentService';
import { 
  extractGuarantyData, extractCCCDData, generateIdentityHash 
} from '../../services/geminiService';
import { FraudGuard } from '../../services/fraudGuard'; 
import AIAvatar from '../../components/AIAvatar';
import SagaVisualizer from '../../components/SagaVisualizer';
import { PricingRuntime } from '../../services/pricing/pricing-runtime';
import { Natt3DIcon } from '../../components/common/Natt3DIcon';
import { Calculator, ShieldCheck, FileText, Zap, ChevronRight, Info } from 'lucide-react';
import { AuditProvider } from '../../services/admin/AuditService';
import { SalesProvider } from './sales.service';

interface SalesTerminalProps {
  metrics?: BusinessMetrics;
  updateFinance?: (data: Partial<BusinessMetrics>) => void;
  logAction?: (action: string, details: string) => void;
  currentRole?: UserRole;
  currentPosition?: UserPosition; 
}

const SaleTerminal: React.FC<SalesTerminalProps> = ({ 
  metrics, updateFinance, logAction, currentRole, currentPosition 
}) => {
  const [step, setStep] = useState<'customer' | 'products' | 'pricing' | 'confirmation'>('customer');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [exchangeItems, setExchangeItems] = useState<ExchangeItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  // PRICING STATE
  const [quoteRequest, setQuoteRequest] = useState<QuoteRequest>({
    product_group: 'Bông Tai',
    specs: {
      weight: 1.2,
      designText: '',
      unit: 'Chiếc',
      stonePrice: 0,
      gold_ratio: 750
    },
    customer_tier: 'NORMAL',
    channel: 'SHOWROOM_HCM'
  });
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);

  const mockCustomers = [
    { id: 'C-998', name: 'ANH NATT MASTER', phone: '0901234567', type: 'VIP_DIAMOND', tier: 'S-VIP' },
    { id: 'C-442', name: 'CHỊ LAN HIRONO', phone: '0918888999', type: 'GOLD_MEMBER', tier: 'VIP' }
  ];

  const handleSelectCustomer = async (cust: any) => {
    setSelectedCustomer(cust);
    setQuoteRequest(prev => ({ ...prev, customer_tier: cust.tier as any }));
    if(logAction) logAction('SALES', `CUSTOMER_IDENTIFIED: ${cust.id}`);
    setStep('pricing');
  };

  const executePricing = async () => {
    setIsProcessing(true);
    try {
      const correlationId = crypto.randomUUID();
      const res = await PricingRuntime.handleQuote(quoteRequest, correlationId);
      setQuoteResult(res);
    } catch (e: any) {
      alert(`⚠️ Lỗi tính giá: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalize = async () => {
    if (!quoteResult || !selectedCustomer) return;
    setIsProcessing(true);
    
    try {
      // Gọi SalesService trong Cell
      const order = await SalesProvider.createOrder({
        customer: { name: selectedCustomer.name, phone: selectedCustomer.phone },
        items: [{ productId: 'CUSTOM', productName: `Chế tác ${quoteRequest.product_group}`, quantity: 1 }],
        total: quoteResult.total_price
      });

      if(logAction) logAction('SALES', `ORDER_SEALED: ${order.id}`);
      setStep('confirmation');
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper for Exchange
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleGDBScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
      // Logic from legacy component merged here for completeness if needed
      // For now, keeping core flow
      alert("Giao thức quét GĐB đang được đồng bộ.");
  };

  return (
    <div className="h-full flex flex-col bg-[#020202] p-8 lg:p-12 overflow-y-auto no-scrollbar gap-10 animate-in fade-in duration-1000 pb-40">
      
      <header className="flex justify-between items-end border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-4 mb-3">
             <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-black shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                <Natt3DIcon type="audit" size={24} />
             </div>
             <h2 className="ai-headline text-5xl italic uppercase tracking-tighter leading-none text-white">SaleTerminal Runtime</h2>
          </div>
          <p className="ai-sub-headline text-cyan-300/40 ml-1 italic font-black uppercase tracking-[0.4em]">
            Gold Master Edition • Cell Isolated
          </p>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 min-h-0">
          {/* LEFT: WORK AREA */}
          <div className="lg:col-span-8 space-y-8">
             {step === 'customer' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-left-4">
                   {mockCustomers.map(cust => (
                      <div 
                        key={cust.id} 
                        onClick={() => handleSelectCustomer(cust)}
                        className="ai-panel p-10 bg-black border-white/5 group hover:border-amber-500/40 cursor-pointer transition-all relative overflow-hidden"
                      >
                         <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl">👤</div>
                         <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest mb-4">{cust.type}</p>
                         <h4 className="text-3xl font-bold text-white uppercase italic tracking-tight">{cust.name}</h4>
                         <p className="text-xs font-mono text-gray-500 mt-2">{cust.phone}</p>
                         <div className="mt-10 flex justify-end items-center gap-2 text-[10px] font-black text-amber-500/40 group-hover:text-amber-500 transition-colors">
                            XÁC THỰC IDENTITY <ChevronRight size={14} />
                         </div>
                      </div>
                   ))}
                </div>
             )}

             {step === 'pricing' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in slide-in-from-bottom-4">
                   {/* PRICING FORM */}
                   <div className="ai-panel p-10 bg-black/40 border-white/10 space-y-8 shadow-2xl">
                      <h3 className="text-2xl font-serif italic text-white uppercase tracking-widest flex items-center gap-3">
                         <Calculator size={20} className="text-amber-500" /> Specs Configuration
                      </h3>
                      <div className="space-y-6">
                         <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-black uppercase ml-2">Nhóm sản phẩm</label>
                            <select 
                               value={quoteRequest.product_group} 
                               onChange={e => setQuoteRequest({...quoteRequest, product_group: e.target.value as any})}
                               className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-xs text-white outline-none focus:border-amber-500"
                            >
                               <option>Bông Tai</option>
                               <option>Dây chuyền</option>
                               <option>Nhẫn</option>
                            </select>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                               <label className="text-[10px] text-gray-500 font-black uppercase ml-2">Trọng lượng (Gram)</label>
                               <input 
                                  type="number" 
                                  value={quoteRequest.specs.weight}
                                  onChange={e => setQuoteRequest({...quoteRequest, specs: {...quoteRequest.specs, weight: parseFloat(e.target.value)}})}
                                  className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-xs text-white font-mono"
                               />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] text-gray-500 font-black uppercase ml-2">Đơn vị</label>
                               <select 
                                  value={quoteRequest.specs.unit}
                                  onChange={e => setQuoteRequest({...quoteRequest, specs: {...quoteRequest.specs, unit: e.target.value as any}})}
                                  className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-xs text-white"
                               >
                                  <option>Chiếc</option>
                                  <option>Đôi</option>
                               </select>
                            </div>
                         </div>
                      </div>
                      <button 
                         onClick={executePricing}
                         disabled={isProcessing}
                         className="w-full py-5 bg-amber-500 text-black font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl hover:bg-amber-400 transition-all active:scale-95 shadow-xl shadow-amber-500/10"
                      >
                         {isProcessing ? 'ĐANG CHẠY ENGINE...' : 'EXECUTE PRICING NODE'}
                      </button>
                   </div>

                   {/* LIVE PREVIEW RESULT */}
                   <div className="flex flex-col gap-8">
                      {quoteResult ? (
                         <div className="ai-panel p-10 bg-gradient-to-br from-indigo-900/20 to-black border-indigo-500/30 animate-in zoom-in-95">
                            <div className="flex justify-between items-start mb-8">
                               <div>
                                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Báo giá Shard</p>
                                  <h4 className="text-4xl font-mono font-black text-white italic">{quoteResult.total_price.toLocaleString()} đ</h4>
                               </div>
                               <ShieldCheck className="text-green-500" size={32} />
                            </div>
                            <button 
                               onClick={handleFinalize}
                               className="w-full mt-10 py-5 bg-white text-black font-black text-[10px] uppercase tracking-[0.5em] rounded-2xl hover:bg-green-500 shadow-2xl"
                            >
                               NIÊM PHONG & CHỐT ĐƠN
                            </button>
                         </div>
                      ) : (
                         <div className="ai-panel p-16 border-dashed border-white/10 flex flex-col items-center justify-center text-center opacity-30 h-full">
                            <Zap size={48} className="mb-6" />
                            <p className="text-xl font-serif italic uppercase">Awaiting Computation</p>
                         </div>
                      )}
                   </div>
                </div>
             )}

             {step === 'confirmation' && (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-in zoom-in-95 duration-1000">
                   <div className="w-40 h-40 rounded-[3rem] bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-7xl shadow-2xl border-4 border-black mx-auto mb-10">✓</div>
                   <h2 className="ai-headline text-5xl italic uppercase tracking-tighter gold-gradient mb-4">Saga Completed</h2>
                   <p className="text-gray-400 text-lg font-light italic max-w-md mx-auto mb-12">
                      Đơn hàng đã được băm Shard và lưu trữ tại Ledger trung tâm.
                   </p>
                   <button onClick={() => window.location.reload()} className="px-12 py-5 bg-white text-black font-black text-[11px] uppercase rounded-full">Khởi tạo giao dịch mới</button>
                </div>
             )}
          </div>

          {/* RIGHT: LEDGER VIEW */}
          <div className="lg:col-span-4 space-y-8">
             <div className="ai-panel p-8 bg-black/60 border-indigo-500/20 shadow-2xl flex flex-col min-h-[500px]">
                <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-8 border-b border-white/5 pb-4 flex items-center gap-2">
                   <FileText size={12} /> Live Trace Ledger
                </h3>
                <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar font-mono text-[10px]">
                   {selectedCustomer && (
                     <div className="p-4 bg-white/5 rounded-xl space-y-2 border-l-2 border-amber-500">
                        <p className="text-gray-500">>> IDENTITY_BOUND</p>
                        <p className="text-white">{selectedCustomer.name}</p>
                        <p className="text-amber-500">Tier: {selectedCustomer.tier}</p>
                     </div>
                   )}
                   {quoteResult && (
                     <div className="p-4 bg-white/5 rounded-xl space-y-4 animate-in slide-in-from-bottom-2">
                        <p className="text-gray-500">>> PRICING_V1_SEALED</p>
                        <p className="text-cyan-400">Total: {quoteResult.total_price.toLocaleString()} đ</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
      </main>
    </div>
  );
};

export default SaleTerminal;
