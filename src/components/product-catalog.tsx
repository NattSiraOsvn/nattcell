
import React, { useState, useMemo, useEffect } from 'react';
import { Product, CustomizationRequest, BusinessMetrics, UserPosition } from '@/types';
import ProductCard from './productcard';
import ProductDetailModal from './productdetailmodal';
import CustomizationRequestModal from './customizationrequest';
import FilterPanel from './filterpanel';
import { PersonaID } from '@/types';
import { PaymentEngine, PaymentResponse } from '@/services/paymentservice';
import { ShowroomAPI } from '@/services/showroom/api'; // ✅ INTEGRATED: Use Shared API
import { ShowroomProduct } from '@/types/showroom';
import LoadingSpinner from './common/loadingspinner';

interface ProductCatalogProps {
  logAction: (action: string, details: string) => void;
  metrics: BusinessMetrics;
  updateFinance: (data: Partial<BusinessMetrics>) => void;
}

type ShowroomView = 'GALLERY' | 'CHECKOUT' | 'PAYMENT' | 'RECEIPT';

// Adapter to convert ShowroomProduct to Product (Legacy Compatibility)
const adaptProduct = (sp: ShowroomProduct): Product => ({
  id: sp.id,
  sku: sp.sku,
  name: sp.name,
  price: sp.price,
  description: sp.description,
  image: sp.media[0]?.url || '',
  images: sp.media.map(m => m.url),
  videos: [],
  minOrder: 1,
  moqUnit: 'chiếc',
  stock: 10, // Mock stock from API
  category: 'Showroom',
  tags: [],
  specifications: sp.specs.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {}),
  leadTime: 7,
  supplier: { id: 's1', maNhaCungCap: 'TL-ADMIN', tenNhaCungCap: 'Tam Luxury Master', diaChi: 'HCMC', maSoThue: '0300000001' },
  rating: 5,
  reviews: 0,
  isVerifiedSupplier: true,
  tradeAssurance: true,
  status: sp.status as any,
  isCustomizable: true
});

const ProductCatalog: React.FC<ProductCatalogProps> = ({ logAction, updateFinance, metrics }) => {
  const [currentView, setCurrentView] = useState<ShowroomView>('GALLERY');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load Data from ShowroomAPI
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const productData = await ShowroomAPI.getRelatedProducts();
        const mainProduct = await ShowroomAPI.getProduct('NNA-ROLEX-OMEGA');
        const allProducts = [mainProduct, ...productData].map(adaptProduct);
        setProducts(allProducts);
      } catch (e) {
        console.error("Failed to load showroom data", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '', notes: '' });
  const [paymentMethod, setPaymentMethod] = useState<'VNPAY' | 'MOMO' | 'ZALOPAY' | 'COD'>('VNPAY');
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  // Gallery State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCustomization, setShowCustomization] = useState(false);
  const [filters, setFilters] = useState({ category: '', minPrice: 0, maxPrice: 500000000, verifiedOnly: false, tradeAssurance: false, supplierName: '', searchTerm: '' });

  // Computed Values
  const subTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0), [cart]);
  const taxAmount = subTotal * 0.1; // 10% VAT
  const totalAmount = subTotal + taxAmount;

  // --- ACTIONS ---
  const handleAddToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveItem = (productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const initPayment = async () => {
    if (!customerInfo.name || !customerInfo.phone) return alert("Vui lòng điền thông tin khách hàng.");
    setIsProcessing(true);
    const newOrderId = `ORD-${Date.now().toString().slice(-8)}`;
    setOrderId(newOrderId);
    try {
      if (paymentMethod !== 'COD') {
        const res = await PaymentEngine.createPayment({
          orderId: newOrderId,
          amount: totalAmount,
          provider: paymentMethod as any,
          customerName: customerInfo.name
        });
        setPaymentData(res);
      }
      setCurrentView('PAYMENT');
    } catch (e) { console.error(e); } finally { setIsProcessing(false); }
  };

  const confirmOrder = () => {
    logAction('ORDER_CONFIRMED', `Đơn hàng ${orderId} thành công. Khách: ${customerInfo.name}. Tổng: ${totalAmount.toLocaleString()}đ`);
    updateFinance({ revenue_pending: (metrics.revenue_pending || 0) + totalAmount });
    setCurrentView('RECEIPT');
  };

  const resetFlow = () => {
    setCart([]);
    setCustomerInfo({ name: '', phone: '', address: '', notes: '' });
    setPaymentData(null);
    setCurrentView('GALLERY');
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (filters.searchTerm) {
        const s = filters.searchTerm.toLowerCase();
        return p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s);
      }
      return true;
    });
  }, [products, filters]);

  // --- RENDER HELPERS ---
  const ProgressStepper = ({ current }: { current: ShowroomView }) => {
    const steps = ['CHECKOUT', 'PAYMENT', 'RECEIPT'];
    const currentIdx = steps.indexOf(current);
    return (
      <div className="flex items-center justify-center gap-4 mb-10 w-full max-w-lg mx-auto">
        {steps.map((step, idx) => (
          <React.Fragment key={step}>
            <div className={`flex items-center gap-2 ${idx <= currentIdx ? 'opacity-100' : 'opacity-30'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border transition-all ${idx < currentIdx ? 'bg-green-500 border-green-500 text-black' : idx === currentIdx ? 'bg-amber-500 border-amber-500 text-black' : 'bg-transparent border-white text-white'}`}>
                {idx < currentIdx ? '✓' : idx + 1}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${idx === currentIdx ? 'text-amber-500' : 'text-gray-500'}`}>{step}</span>
            </div>
            {idx < steps.length - 1 && <div className={`flex-1 h-0.5 min-w-[40px] transition-all ${idx < currentIdx ? 'bg-green-500' : 'bg-white/10'}`}></div>}
          </React.Fragment>
        ))}
      </div>
    );
  };

  if (loading) return <LoadingSpinner message="Đồng bộ dữ liệu Showroom..." />;

  // --- SUB-VIEWS RENDERERS ---

  const renderGallery = () => (
    <div className="flex h-full">
      <FilterPanel filters={filters} onFilterChange={setFilters} />
      <div className="flex-1 p-8 overflow-y-auto no-scrollbar pb-40 relative flex flex-col">
        <header className="mb-10 flex justify-between items-end sHRink-0">
          <div className="space-y-2">
            <h1 className="ai-headline text-6xl uppercase italic tracking-tighter leading-none">Luxury Storefront</h1>
            <p className="ai-sub-headline text-gray-500 font-black tracking-[0.5em] ml-1">Omega Unified Showroom</p>
          </div>
          <div className="flex gap-4 items-center">
             <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">🔍</span>
                <input type="text" value={filters.searchTerm} onChange={(e) => setFilters({...filters, searchTerm: e.target.value})} placeholder="SEARCH SKU..." className="bg-black/40 border border-white/10 rounded-2xl pl-10 pr-6 py-3 text-[10px] text-amber-500 focus:border-amber-500/50 outline-none w-64 uppercase font-black tracking-widest transition-all"/>
             </div>
             <button onClick={() => setCurrentView('CHECKOUT')} className="relative px-6 py-3 bg-amber-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-all shadow-lg active:scale-95">
               Giỏ hàng ({cart.reduce((a,b) => a + b.quantity, 0)})
               {cart.length > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center animate-pulse">{cart.length}</span>}
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} onCustomize={() => { setSelectedProduct(product); setShowCustomization(true); }} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderCheckout = () => (
    <div className="h-full p-10 md:p-20 overflow-y-auto no-scrollbar bg-[#050505] animate-in slide-in-from-right-10 duration-500">
       <button onClick={() => setCurrentView('GALLERY')} className="mb-8 text-gray-500 hover:text-white flex items-center gap-2 text-xs uppercase font-black tracking-widest transition-colors">← Quay lại Showroom</button>
       <ProgressStepper current="CHECKOUT" />
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
             <h2 className="ai-headline text-4xl uppercase italic tracking-tighter">Order Manifest</h2>
             <div className="space-y-4">
                {cart.length === 0 ? (<p className="text-gray-500 italic py-10 text-center border border-dashed border-white/10 rounded-3xl">Giỏ hàng trống.</p>) : (
                   cart.map((item, idx) => (
                      <div key={idx} className="flex gap-6 p-4 bg-white/[0.02] border border-white/5 rounded-3xl items-center group hover:border-amber-500/30 transition-all">
                         <img src={item.product.image} className="w-20 h-20 rounded-2xl object-cover" />
                         <div className="flex-1">
                            <h4 className="text-white font-bold text-sm uppercase">{item.product.name}</h4>
                            <p className="text-[10px] text-amber-500 font-mono mt-1">{item.product.price.toLocaleString()} đ</p>
                         </div>
                         <div className="flex items-center gap-3 bg-black/40 rounded-xl p-2 border border-white/5">
                            <button onClick={() => handleUpdateQuantity(item.product.id, -1)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white">-</button>
                            <span className="text-xs font-mono font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => handleUpdateQuantity(item.product.id, 1)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white">+</button>
                         </div>
                         <button onClick={() => handleRemoveItem(item.product.id)} className="text-red-500/50 hover:text-red-500 px-2">✕</button>
                      </div>
                   ))
                )}
             </div>
             {cart.length > 0 && (
                <div className="ai-panel p-8 bg-black/40 border-white/10 space-y-3">
                   <div className="flex justify-between text-xs text-gray-400"><span>Tạm tính</span><span className="font-mono">{subTotal.toLocaleString()} đ</span></div>
                   <div className="flex justify-between text-xs text-indigo-400"><span>VAT (10%)</span><span className="font-mono">+{taxAmount.toLocaleString()} đ</span></div>
                   <div className="flex justify-between text-xl font-black text-white pt-4 border-t border-white/10 mt-2"><span className="uppercase tracking-widest">Tổng Net</span><span className="font-mono">{totalAmount.toLocaleString()} đ</span></div>
                </div>
             )}
          </div>
          <div className="space-y-8">
             <div className="space-y-6 bg-white/[0.02] p-10 rounded-[3rem] border border-amber-500/20">
                <div className="space-y-2"><label className="text-[9px] font-black text-gray-500 uppercase ml-2">Họ tên *</label><input type="text" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value.toUpperCase()})} className="w-full bg-black/60 border border-white/10 rounded-2xl p-5 text-white uppercase font-bold outline-none focus:border-amber-500 transition-all" placeholder="NGUYỄN VĂN A" /></div>
                <div className="space-y-2"><label className="text-[9px] font-black text-gray-500 uppercase ml-2">Số điện thoại *</label><input type="text" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} className="w-full bg-black/60 border border-white/10 rounded-2xl p-5 text-white font-mono outline-none focus:border-amber-500 transition-all" placeholder="0909xxxxxx" /></div>
                <div className="space-y-2"><label className="text-[9px] font-black text-gray-500 uppercase ml-2">Địa chỉ giao hàng</label><input type="text" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} className="w-full bg-black/60 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-amber-500 transition-all" placeholder="Số nhà, Đường, Quận/Huyện..." /></div>
                <div className="pt-6"><label className="text-[9px] font-black text-gray-500 uppercase ml-2 mb-3 block">Phương thức thanh toán</label><div className="grid grid-cols-2 gap-3">{['VNPAY', 'MOMO', 'ZALOPAY', 'COD'].map(m => (<button key={m} onClick={() => setPaymentMethod(m as any)} className={`py-4 rounded-xl border text-[10px] font-black tracking-widest uppercase transition-all ${paymentMethod === m ? 'bg-amber-500 text-black border-amber-500 shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}>{m}</button>))}</div></div>
                <button disabled={cart.length === 0 || isProcessing} onClick={initPayment} className="w-full py-6 bg-amber-500 text-black font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.3)] hover:bg-amber-400 transition-all active:scale-95 disabled:opacity-50 mt-8">{isProcessing ? 'ĐANG KHỞI TẠO NODE...' : 'TIẾP TỤC THANH TOÁN →'}</button>
             </div>
          </div>
       </div>
    </div>
  );

  const renderPayment = () => (
    <div className="h-full flex flex-col items-center justify-center p-10 bg-black/95 relative animate-in zoom-in-95 duration-500">
       <button onClick={() => setCurrentView('CHECKOUT')} className="absolute top-10 left-10 text-gray-500 hover:text-white text-xs font-black uppercase tracking-widest">← Quay lại</button>
       <ProgressStepper current="PAYMENT" />
       <div className="bg-white text-black p-12 rounded-[4rem] shadow-2xl max-w-lg w-full relative overflow-hidden mt-8">
          <div className="text-center mb-10"><h3 className="text-3xl font-bold uppercase tracking-tighter mb-2">Quét mã thanh toán</h3><p className="text-xs font-mono text-gray-500">{orderId}</p></div>
          <div className="aspect-square bg-gray-100 rounded-[3rem] flex items-center justify-center mb-10 relative overflow-hidden border-4 border-black">
             {paymentMethod === 'COD' ? (<div className="text-center"><span className="text-6xl mb-4 block">🚚</span><p className="text-sm font-black uppercase tracking-widest">Thanh toán khi nhận hàng</p></div>) : (paymentData ? <img src={paymentData.qrCodeUrl} className="w-full h-full object-cover" /> : <div className="animate-pulse font-black uppercase">Đang tạo mã QR...</div>)}
          </div>
          <div className="space-y-4 text-center"><p className="text-4xl font-mono font-black tracking-tight">{totalAmount.toLocaleString()} đ</p><p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Giao dịch được bảo mật bởi Omega Shard</p></div>
          <button onClick={confirmOrder} className="w-full mt-10 py-5 bg-black text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl hover:scale-[1.02] transition-transform shadow-xl">TÔI ĐÃ THANH TOÁN</button>
       </div>
    </div>
  );

  const renderReceipt = () => (
    <div className="h-full flex flex-col items-center justify-center p-10 bg-[#020202] animate-in fade-in duration-1000">
       <ProgressStepper current="RECEIPT" />
       <div className="w-full max-w-3xl text-center space-y-12 ai-panel p-16 border-white/10 bg-black/60 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
          <div className="relative inline-block"><div className="absolute inset-0 bg-green-500 blur-[100px] opacity-20 animate-pulse"></div><div className="w-32 h-32 rounded-[3rem] bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-6xl shadow-2xl border-4 border-black relative z-10 mx-auto">✓</div></div>
          <div><h2 className="ai-headline text-5xl italic uppercase tracking-tighter mb-4">Giao Dịch Thành Công</h2><p className="text-gray-400 text-lg italic font-light max-w-md mx-auto">"Cảm ơn Anh/Chị {customerInfo.name}. Đơn hàng {orderId} đã được niêm phong vào sổ cái và gửi tới bộ phận Hậu cần."</p></div>
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto"><div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl"><p className="text-[9px] text-gray-500 uppercase font-black mb-1">Mã tham chiếu</p><p className="text-xl text-amber-500 font-mono font-bold">{orderId}</p></div><div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl"><p className="text-[9px] text-gray-500 uppercase font-black mb-1">Tổng thanh toán</p><p className="text-xl text-white font-mono font-bold">{totalAmount.toLocaleString()} đ</p></div></div>
          <div className="flex gap-6 justify-center pt-8"><button onClick={resetFlow} className="px-12 py-5 bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-gray-200 transition-all shadow-xl">QUAY VỀ GIAN HÀNG</button><button className="px-12 py-5 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-white/10 transition-all">XUẤT HÓA ĐƠN</button></div>
       </div>
    </div>
  );

  return (
    <div className="flex h-full bg-[#030303] animate-in fade-in duration-1000 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      {currentView === 'GALLERY' && renderGallery()}
      {currentView === 'CHECKOUT' && renderCheckout()}
      {currentView === 'PAYMENT' && renderPayment()}
      {currentView === 'RECEIPT' && renderReceipt()}

      {selectedProduct && !showCustomization && (
        <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={handleAddToCart} onRequestCustomization={() => setShowCustomization(true)} />
      )}
      {selectedProduct && showCustomization && (
        <CustomizationRequestModal product={selectedProduct} onClose={() => { setSelectedProduct(null); setShowCustomization(false); }} onSubmit={(req) => { logAction('RFQ_CUSTOM_SUBMIT', `Gửi yêu cầu SX Master cho ${selectedProduct.name}`); setShowCustomization(false); setSelectedProduct(null); }} />
      )}
    </div>
  );
};

export default ProductCatalog;
