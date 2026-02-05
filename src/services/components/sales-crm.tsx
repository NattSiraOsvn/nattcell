
import React, { useState, useMemo } from 'react';
import { Product, BusinessMetrics } from '../types';
import { PRODUCT_SEED_DATA } from '../constants';
import { PaymentEngine, PaymentResponse } from '../services/paymentService';

interface SalesCRMProps {
  logAction: (action: string, details: string, undoData?: any) => void;
  onBack?: () => void;
  metrics: BusinessMetrics;
  updateFinance: (data: Partial<BusinessMetrics>) => void;
}

const SalesCRM: React.FC<SalesCRMProps> = ({ logAction, updateFinance, metrics }) => {
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'browsing' | 'checkout' | 'processing' | 'success'>('browsing');
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', payment: 'CARD' as any });
  const [activePayment, setActivePayment] = useState<PaymentResponse | null>(null);
  
  // Promotion State
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Advanced Calculation Logic
  const subTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0), [cart]);
  
  const discountAmount = useMemo(() => subTotal * discountPercent, [subTotal, discountPercent]);
  
  const taxRate = 0.1; // 10% VAT
  const taxAmount = useMemo(() => (subTotal - discountAmount) * taxRate, [subTotal, discountAmount]);
  
  const totalAmount = useMemo(() => subTotal - discountAmount + taxAmount, [subTotal, discountAmount, taxAmount]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
    logAction('CART_ADD', `Thêm ${product.name} vào giỏ hàng.`);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const applyPromo = () => {
    const code = promoCode.toUpperCase();
    if (code === 'VIP') {
      setDiscountPercent(0.1); // 10%
      alert("Đã áp dụng mã VIP: Giảm 10%");
    } else if (code === 'OMEGA') {
      setDiscountPercent(0.2); // 20%
      alert("Đã áp dụng mã OMEGA: Giảm 20%");
    } else {
      setDiscountPercent(0);
      alert("Mã giảm giá không hợp lệ.");
    }
  };

  const startPaymentFlow = async () => {
    if (['VNPAY', 'MOMO', 'ZALOPAY'].includes(customerInfo.payment)) {
      setCheckoutStep('processing');
      const res = await PaymentEngine.createPayment({ 
        orderId: `ORD-${Date.now()}`, 
        amount: totalAmount, 
        provider: customerInfo.payment, 
        customerName: customerInfo.name 
      });
      setActivePayment(res);
      logAction('PAYMENT_START', `Khởi tạo ${customerInfo.payment} cho ${customerInfo.name} - Tổng: ${totalAmount.toLocaleString()}đ`);
    } else {
      finalizeOrder();
    }
  };

  const finalizeOrder = () => {
    logAction('CHECKOUT_COMPLETE', `Đơn hàng ${totalAmount.toLocaleString()}đ đã đẩy về module Sales & Tax.`);
    updateFinance({ revenue_pending: (metrics.revenue_pending || 0) + totalAmount });
    setCheckoutStep('success');
    setCart([]);
    setDiscountPercent(0);
    setPromoCode('');
  };

  return (
    <div className="h-full flex flex-col bg-transparent relative overflow-hidden animate-in fade-in duration-1000 no-scrollbar">
      
      {/* LUXURY SHOWROOM HEADER */}
      <header className="p-8 md:p-12 border-b border-white/5 flex justify-between items-center z-20 bg-black/20 backdrop-blur-md">
        <div>
          <h2 className="ai-headline text-4xl italic uppercase tracking-tighter">Luxury Terminal</h2>
          <p className="ai-sub-headline text-indigo-300/40 mt-2">Tam Luxury Showroom Interface v4.2</p>
        </div>
        <button 
          onClick={() => setShowCart(true)} 
          className="ai-panel px-10 py-5 bg-indigo-500/10 border-indigo-500/30 text-white font-black text-[10px] uppercase tracking-widest relative group hover:border-cyan-500/50"
        >
          Intelligence Cart {cart.length > 0 && <span className="ml-3 px-2 py-0.5 bg-cyan-400 text-black rounded font-black">{cart.length}</span>}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-8 md:p-12 no-scrollbar pb-32">
        {checkoutStep === 'browsing' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-[1600px] mx-auto">
            {PRODUCT_SEED_DATA.map(p => (
              <div key={p.id} className="ai-panel overflow-hidden flex flex-col group border-indigo-500/10">
                <div className="relative h-72 overflow-hidden">
                   <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" alt={p.name} />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                   <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 bg-black/60 border border-white/10 rounded text-[8px] font-black uppercase text-amber-500">Gold 18K</span>
                   </div>
                </div>
                <div className="p-8 space-y-5 bg-indigo-900/5">
                  <div>
                    <h3 className="text-white font-bold text-lg uppercase tracking-tight group-hover:text-cyan-300 transition-colors">{p.name}</h3>
                    <p className="text-[10px] text-indigo-400/50 uppercase mt-1 tracking-widest font-bold italic">{p.sku}</p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-2xl font-mono font-black text-white">{p.price.toLocaleString()} <span className="text-xs text-indigo-500 uppercase">đ</span></span>
                    <button 
                      onClick={() => addToCart(p)} 
                      className="w-12 h-12 rounded-2xl ai-panel bg-white/5 flex items-center justify-center text-2xl hover:bg-white hover:text-black transition-all shadow-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ... (Checkout and Payment steps remain the same) */}
        {checkoutStep === 'checkout' && (
          <div className="max-w-6xl mx-auto ai-panel p-12 animate-in zoom-in-95 border-indigo-500/30">
             <h3 className="ai-headline text-4xl text-center mb-12 italic uppercase tracking-tighter">Transmission Authorization</h3>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-8">
                   <div className="space-y-2">
                      <p className="ai-sub-headline ml-1">Client Identification</p>
                      <input type="text" placeholder="FULL NAME" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="w-full bg-black/60 border border-indigo-500/20 p-5 rounded-2xl text-white outline-none focus:border-cyan-500 transition-all font-bold uppercase tracking-widest text-xs" />
                   </div>
                   <div className="space-y-2">
                      <p className="ai-sub-headline ml-1">Secure Contact</p>
                      <input type="text" placeholder="PHONE NUMBER" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} className="w-full bg-black/60 border border-indigo-500/20 p-5 rounded-2xl text-white outline-none focus:border-cyan-500 transition-all font-mono tracking-[0.2em] text-xs" />
                   </div>
                   {/* ... Payment methods ... */}
                   <div className="space-y-3">
                      <p className="ai-sub-headline ml-1">Payment Node</p>
                      <div className="grid grid-cols-2 gap-3">
                         {['CARD', 'VNPAY', 'MOMO', 'ZALOPAY', 'CASH'].map(m => (
                           <button key={m} onClick={() => setCustomerInfo({...customerInfo, payment: m})} className={`py-4 rounded-xl border text-[9px] font-black tracking-widest uppercase transition-all ${customerInfo.payment === m ? 'bg-cyan-400 text-black border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'bg-black/40 border-indigo-500/20 text-gray-500 hover:text-white hover:border-indigo-500/50'}`}>{m}</button>
                         ))}
                      </div>
                   </div>
                </div>
                <div className="ai-panel p-8 bg-indigo-500/10 flex flex-col justify-between border-indigo-500/30">
                   {/* ... Breakdown ... */}
                   <div>
                      <p className="ai-sub-headline mb-6 border-b border-white/10 pb-4">Master Ledger Breakdown</p>
                      <div className="space-y-3 text-[11px]">
                         <div className="flex justify-between items-center text-gray-400">
                            <span>Tạm tính (Subtotal)</span>
                            <span className="font-mono">{subTotal.toLocaleString()} đ</span>
                         </div>
                         <div className="flex justify-between items-center text-amber-500">
                            <span>Giảm giá (Discount {discountPercent * 100}%)</span>
                            <span className="font-mono">-{discountAmount.toLocaleString()} đ</span>
                         </div>
                         <div className="flex justify-between items-center text-indigo-400">
                            <span>Thuế VAT (10%)</span>
                            <span className="font-mono">+{taxAmount.toLocaleString()} đ</span>
                         </div>
                      </div>
                      <div className="mt-6 pt-6 border-t border-white/10">
                         <div className="flex justify-between items-end">
                            <span className="text-sm font-black text-white uppercase tracking-widest">Total Net</span>
                            <span className="text-4xl font-mono font-black text-white leading-none">{totalAmount.toLocaleString()} <span className="text-sm text-indigo-500 font-light italic">đ</span></span>
                         </div>
                      </div>
                   </div>
                   <div className="mt-12 space-y-4">
                      <button onClick={startPaymentFlow} className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl hover:bg-cyan-400 transition-all active:scale-95">
                        AUTHORIZE TRANSACTION
                      </button>
                      <p className="text-[8px] text-indigo-400/50 text-center uppercase tracking-widest italic">Proceeding confirms VAT emission protocol</p>
                   </div>
                </div>
             </div>
          </div>
        )}

        {checkoutStep === 'processing' && (
          <div className="max-w-md mx-auto text-center ai-panel p-12 animate-in zoom-in-95 border-cyan-500/30 bg-cyan-500/5">
             <h4 className="ai-headline text-3xl mb-8 uppercase italic tracking-tighter">Node Synchronization</h4>
             <div className="bg-white p-6 rounded-[2.5rem] mb-10 shadow-2xl relative group overflow-hidden">
                {activePayment ? <img src={activePayment.qrCodeUrl} className="w-full grayscale group-hover:grayscale-0 transition-all duration-500" alt="QR" /> : <div className="h-64 flex items-center justify-center text-black font-black animate-pulse">GENERATING NODE...</div>}
                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/20 group-hover:bg-cyan-500/80 transition-colors"></div>
             </div>
             <p className="text-3xl font-mono font-black text-white mb-10">{totalAmount.toLocaleString()} đ</p>
             <div className="flex gap-4">
                <button onClick={() => setCheckoutStep('checkout')} className="flex-1 py-4 ai-panel border-white/10 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest">Back</button>
                <button onClick={finalizeOrder} className="flex-1 py-4 bg-green-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-500/20">Success Confirmed</button>
             </div>
          </div>
        )}

        {checkoutStep === 'success' && (
          <div className="text-center py-20 animate-in zoom-in-95 space-y-10">
             <div className="relative inline-block">
                <div className="absolute inset-0 bg-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="text-8xl relative z-10">💎</div>
             </div>
             <div>
                <h3 className="ai-headline text-5xl italic mb-4 uppercase tracking-tighter">Protocol Completed</h3>
                <p className="ai-sub-headline text-indigo-300/60 max-w-sm mx-auto leading-relaxed">Dữ liệu đã được băm vào chuỗi và sẵn sàng cho Can rà soát tại **Fiscal Control Hub**.</p>
             </div>
             <button onClick={() => setCheckoutStep('browsing')} className="px-12 py-5 ai-panel border-cyan-500/30 text-cyan-300 font-black text-[11px] uppercase tracking-[0.4em] hover:bg-cyan-500/10">Return to Terminal</button>
          </div>
        )}
      </main>

      {/* INTELLIGENCE CART OVERLAY */}
      {showCart && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setShowCart(false)}></div>
          <div className="w-full max-w-md bg-black/90 backdrop-blur-2xl border-l border-indigo-500/20 p-8 flex flex-col relative z-10 animate-in slide-in-from-right duration-500">
             <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
                <h3 className="ai-headline text-2xl italic uppercase tracking-tighter">In-Memory Node</h3>
                <button onClick={() => setShowCart(false)} className="text-white hover:text-cyan-400 text-xl">✕</button>
             </div>
             
             {/* Cart Items */}
             <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                {cart.map(item => (
                  <div key={item.product.id} className="flex gap-4 p-4 ai-panel border-white/5 bg-white/5 group hover:border-indigo-500/30 items-center">
                     <img src={item.product.image} className="w-16 h-16 rounded-xl object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="p" />
                     <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-xs tracking-tight truncate">{item.product.name}</p>
                        <p className="text-indigo-400 font-mono text-[10px] mt-1">{item.product.price.toLocaleString()} đ</p>
                     </div>
                     
                     <div className="flex items-center gap-2 bg-black/40 rounded-lg p-1 border border-white/5">
                        <button onClick={() => updateQuantity(item.product.id, -1)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded">-</button>
                        <span className="text-xs font-mono font-bold w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, 1)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded">+</button>
                     </div>
                     
                     <button onClick={() => removeItem(item.product.id)} className="text-red-500/50 hover:text-red-500 px-2 transition-colors">✕</button>
                  </div>
                ))}
                {cart.length === 0 && <p className="text-center py-20 text-gray-600 ai-sub-headline">Cart Empty</p>}
             </div>

             {/* Calculation & Promo */}
             <div className="pt-6 border-t border-indigo-500/10 mt-4 space-y-4">
                
                {/* Promo Code Input */}
                <div className="flex gap-2">
                   <input 
                     type="text" 
                     placeholder="PROMO CODE (VIP/OMEGA)" 
                     value={promoCode}
                     onChange={(e) => setPromoCode(e.target.value)}
                     className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] text-white outline-none focus:border-cyan-500 font-bold uppercase"
                   />
                   <button onClick={applyPromo} className="px-4 py-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all">Apply</button>
                </div>

                {/* Summary Table */}
                <div className="space-y-2 text-[11px] text-gray-400 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                   <div className="flex justify-between">
                      <span>Tạm tính</span>
                      <span className="font-mono text-white">{subTotal.toLocaleString()} đ</span>
                   </div>
                   {discountAmount > 0 && (
                     <div className="flex justify-between text-amber-500">
                        <span>Giảm giá ({discountPercent * 100}%)</span>
                        <span className="font-mono">-{discountAmount.toLocaleString()} đ</span>
                     </div>
                   )}
                   <div className="flex justify-between text-indigo-400">
                      <span>VAT (10%)</span>
                      <span className="font-mono">+{taxAmount.toLocaleString()} đ</span>
                   </div>
                   <div className="flex justify-between items-end pt-2 border-t border-white/10 mt-2">
                      <span className="font-black text-white uppercase">Tổng cộng</span>
                      <span className="text-xl font-mono font-black text-white">{totalAmount.toLocaleString()} đ</span>
                   </div>
                </div>

                <button 
                  disabled={cart.length === 0}
                  onClick={() => { setShowCart(false); setCheckoutStep('checkout'); }} 
                  className="w-full py-5 bg-white text-black font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl hover:bg-cyan-400 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                >
                   GO TO CHECKOUT
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesCRM;
