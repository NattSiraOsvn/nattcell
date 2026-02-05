
import React, { useState } from 'react';
import { Product, CustomizationRequest, EngravingConfig, MaterialOverride } from '../types';
import AIAvatar from './AIAvatar';

interface CustomizationRequestProps {
  product: Product;
  onClose: () => void;
  onSubmit: (request: CustomizationRequest) => void;
}

const CustomizationRequestModal: React.FC<CustomizationRequestProps> = ({ product, onClose, onSubmit }) => {
  const [step, setStep] = useState<'form' | 'checking' | 'success'>('form');
  const [quantity, setQuantity] = useState(product.minOrder);
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [specs, setSpecs] = useState<Record<string, string>>({});
  
  // Advanced Options State
  const [engraving, setEngraving] = useState<EngravingConfig>({
    enabled: false,
    text: '',
    font: 'CLASSIC',
    location: 'INSIDE'
  });

  const [material, setMaterial] = useState<MaterialOverride>({
    goldColor: 'YELLOW',
    goldPurity: '18K',
    stoneClass: 'VVS1'
  });

  const [packaging, setPackaging] = useState<'STANDARD' | 'PREMIUM_WOOD' | 'VELVET_LUXURY' | 'VAULT_BOX'>('STANDARD');
  const [options, setOptions] = useState({
    samples: false,
    logo: false
  });

  const handleSpecChange = (key: string, value: string) => {
    setSpecs(prev => ({ ...prev, [key]: value }));
  };

  const handleProcessSubmission = () => {
    setStep('checking');
    setTimeout(() => {
      setStep('success');
    }, 2500);
  };

  const confirmAndClose = () => {
    const hash = '0x' + Math.random().toString(16).slice(2, 40).toUpperCase();
    const finalRequest: CustomizationRequest = {
      specifications: specs,
      quantity,
      deadline,
      notes,
      samples: options.samples,
      logo: options.logo,
      packaging,
      engraving: engraving.enabled ? engraving : undefined,
      materialOverride: material,
      hash
    };
    onSubmit(finalRequest);
  };

  const packagingOptions = [
    { id: 'STANDARD', label: 'Tiêu chuẩn', desc: 'Hộp nhung đỏ cơ bản', icon: '📦' },
    { id: 'PREMIUM_WOOD', label: 'Hộp Gỗ Master', desc: 'Gỗ óc chó, lót da', icon: '🪵' },
    { id: 'VELVET_LUXURY', label: 'Nhung Cao Cấp', desc: 'Thiết kế riêng cho BST', icon: '🎀' },
    { id: 'VAULT_BOX', label: 'Vault Box', desc: 'Két bảo mật + Bảo hiểm', icon: '🔒' }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500">
      <div className="ai-panel w-full max-w-6xl bg-[#050505] border-amber-500/30 overflow-hidden flex flex-col shadow-[0_0_150px_rgba(245,158,11,0.1)] rounded-[4rem] max-h-[95vh]">
        
        {/* HEADER */}
        <header className="p-8 border-b border-white/10 bg-gradient-to-r from-amber-500/5 to-transparent flex justify-between items-center shrink-0">
           <div>
              <div className="flex items-center gap-4 mb-2">
                 <span className="px-3 py-1 bg-amber-500 text-black text-[9px] font-black rounded-full uppercase tracking-widest">Protocol Master</span>
                 <h3 className="text-3xl font-serif gold-gradient italic uppercase tracking-tighter leading-none">Bản Thảo Chế Tác Riêng</h3>
              </div>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-2">
                 <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                 Custom Fabrication Node • Tam Luxury Master Studio
              </p>
           </div>
           <button onClick={onClose} className="w-12 h-12 flex items-center justify-center text-3xl text-gray-600 hover:text-white transition-colors">✕</button>
        </header>

        {/* CONTENT WIZARD */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-10">
          
          {step === 'form' && (
            <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-700">
               {/* Product Identity Node */}
               <div className="flex flex-col md:flex-row gap-8 p-6 bg-white/[0.02] border border-white/5 rounded-[3rem] shadow-inner items-center">
                  <div className="w-24 h-24 rounded-[2rem] overflow-hidden border border-white/10 shrink-0">
                     <img src={product.image} className="w-full h-full object-cover" alt="product" />
                  </div>
                  <div className="flex-1 space-y-2 text-center md:text-left">
                     <h4 className="text-xl font-bold text-white uppercase tracking-tight italic">{product.name}</h4>
                     <p className="text-[10px] text-gray-500 italic leading-relaxed max-w-lg">
                        "Anh đang khởi tạo một giao thức sản xuất đặc thù. Vui lòng xác định các thông số Shard bên dưới để Kris bóc tách định mức."
                     </p>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  
                  {/* COL 1: SPECS & QTY */}
                  <div className="space-y-8">
                     <section>
                        <h5 className="ai-sub-headline text-amber-500 mb-6">Thông số kỹ thuật (Base Specs)</h5>
                        <div className="grid grid-cols-1 gap-4">
                           {Object.keys(product.specifications).map(key => (
                             <div key={key} className="space-y-1">
                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-2">{key}</label>
                                <input 
                                  type="text" 
                                  placeholder={`Mặc định: ${product.specifications[key]}`}
                                  onChange={(e) => handleSpecChange(key, e.target.value)}
                                  className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-amber-500 outline-none transition-all shadow-inner"
                                />
                             </div>
                           ))}
                        </div>
                     </section>

                     <section>
                        <h5 className="ai-sub-headline text-cyan-400 mb-6">Sản lượng & Deadline</h5>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-2">Số lượng</label>
                              <div className="flex bg-black/60 border border-white/10 rounded-2xl p-2 items-center">
                                 <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 text-gray-500 hover:text-white">−</button>
                                 <input 
                                    type="number" 
                                    value={quantity} 
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="flex-1 bg-transparent text-center font-mono font-bold text-white outline-none"
                                 />
                                 <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 text-gray-500 hover:text-white">+</button>
                              </div>
                           </div>
                           <div className="space-y-1">
                              <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-2">Hạn bàn giao</label>
                              <input 
                                 type="date" 
                                 value={deadline}
                                 onChange={(e) => setDeadline(e.target.value)}
                                 className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-xs text-amber-500 outline-none focus:border-amber-500 transition-all font-mono"
                              />
                           </div>
                        </div>
                     </section>
                  </div>

                  {/* COL 2: ADVANCED MATERIAL & LASER */}
                  <div className="space-y-8">
                     <section>
                        <h5 className="ai-sub-headline text-purple-400 mb-6">Vật liệu đặc thù (Override)</h5>
                        <div className="space-y-4">
                           <div className="space-y-1">
                              <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-2">Màu & Tuổi Vàng</label>
                              <div className="grid grid-cols-2 gap-2">
                                <select 
                                  value={material.goldColor} 
                                  onChange={(e) => setMaterial({...material, goldColor: e.target.value as any})}
                                  className="bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white outline-none"
                                >
                                  <option value="YELLOW">Vàng Vàng</option>
                                  <option value="WHITE">Vàng Trắng</option>
                                  <option value="ROSE">Vàng Hồng</option>
                                </select>
                                <select 
                                  value={material.goldPurity} 
                                  onChange={(e) => setMaterial({...material, goldPurity: e.target.value as any})}
                                  className="bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white outline-none"
                                >
                                  <option value="18K">18K (AU750)</option>
                                  <option value="14K">14K (AU585)</option>
                                  <option value="24K">24K (9999)</option>
                                </select>
                              </div>
                           </div>
                           <div className="space-y-1">
                              <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-2">Phẩm cấp Đá chủ</label>
                              <select 
                                value={material.stoneClass} 
                                onChange={(e) => setMaterial({...material, stoneClass: e.target.value as any})}
                                className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white outline-none"
                              >
                                <option value="VVS1">Kim cương GIA - VVS1 (D-F)</option>
                                <option value="VVS2">Kim cương GIA - VVS2 (G-H)</option>
                                <option value="VS1">Kim cương GIA - VS1</option>
                                <option value="CZ_MASTER">Đá CZ Master 8 Arrows</option>
                              </select>
                           </div>
                        </div>
                     </section>

                     <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                        <div className="flex justify-between items-center mb-4">
                           <h5 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                              <span className="text-lg">✒️</span> Khắc Laser
                           </h5>
                           <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={engraving.enabled} onChange={(e) => setEngraving({...engraving, enabled: e.target.checked})} />
                              <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                           </label>
                        </div>
                        
                        {engraving.enabled && (
                           <div className="space-y-3 animate-in slide-in-from-top-2">
                              <input 
                                type="text" 
                                placeholder="Nội dung khắc (VD: Forever Love)" 
                                value={engraving.text}
                                onChange={(e) => setEngraving({...engraving, text: e.target.value})}
                                className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white outline-none font-mono"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                 <select 
                                    value={engraving.font}
                                    onChange={(e) => setEngraving({...engraving, font: e.target.value as any})}
                                    className="bg-black/60 border border-white/10 rounded-xl p-2 text-[10px] text-gray-300 outline-none"
                                 >
                                    <option value="CLASSIC">Classic</option>
                                    <option value="SCRIPT">Script (Bay bướm)</option>
                                    <option value="SERIF">Serif (Có chân)</option>
                                 </select>
                                 <select 
                                    value={engraving.location}
                                    onChange={(e) => setEngraving({...engraving, location: e.target.value as any})}
                                    className="bg-black/60 border border-white/10 rounded-xl p-2 text-[10px] text-gray-300 outline-none"
                                 >
                                    <option value="INSIDE">Lòng trong</option>
                                    <option value="OUTSIDE">Đai ngoài</option>
                                 </select>
                              </div>
                              <p className="text-[9px] text-amber-500/60 italic text-center font-serif mt-2">Preview: {engraving.text || '...'}</p>
                           </div>
                        )}
                     </section>
                  </div>

                  {/* COL 3: PACKAGING & FINAL */}
                  <div className="space-y-8">
                     <section>
                        <h5 className="ai-sub-headline text-green-400 mb-6">Quy cách Đóng gói (Packaging)</h5>
                        <div className="grid grid-cols-2 gap-3">
                           {packagingOptions.map(opt => (
                              <button
                                 key={opt.id}
                                 onClick={() => setPackaging(opt.id as any)}
                                 className={`p-3 rounded-2xl border flex flex-col items-center text-center transition-all ${
                                    packaging === opt.id 
                                    ? 'bg-amber-500/10 border-amber-500 text-amber-500 shadow-lg' 
                                    : 'bg-white/[0.02] border-white/5 text-gray-500 hover:bg-white/5'
                                 }`}
                              >
                                 <span className="text-2xl mb-2">{opt.icon}</span>
                                 <span className="text-[9px] font-bold uppercase">{opt.label}</span>
                                 <span className="text-[8px] font-light mt-1 opacity-70">{opt.desc}</span>
                              </button>
                           ))}
                        </div>
                     </section>

                     <section>
                        <h5 className="ai-sub-headline text-white/40 mb-4">Giao thức phụ trợ</h5>
                        <div className="space-y-3">
                           <label className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl cursor-pointer group hover:bg-white/[0.05]">
                              <div className="flex items-center gap-3">
                                 <span className="text-lg">🧪</span>
                                 <span className="text-[10px] font-bold text-gray-300 uppercase">Mẫu sáp (Wax Sample)</span>
                              </div>
                              <input type="checkbox" checked={options.samples} onChange={e => setOptions({...options, samples: e.target.checked})} className="w-4 h-4 rounded border-indigo-500 accent-indigo-500" />
                           </label>
                           <label className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl cursor-pointer group hover:bg-white/[0.05]">
                              <div className="flex items-center gap-3">
                                 <span className="text-lg">🏷️</span>
                                 <span className="text-[10px] font-bold text-gray-300 uppercase">Khắc Logo Master</span>
                              </div>
                              <input type="checkbox" checked={options.logo} onChange={e => setOptions({...options, logo: e.target.checked})} className="w-4 h-4 rounded border-amber-500 accent-amber-500" />
                           </label>
                        </div>
                     </section>

                     <section>
                        <h5 className="ai-sub-headline text-amber-500 mb-4">Ghi chú đặc biệt</h5>
                        <textarea 
                           value={notes}
                           onChange={(e) => setNotes(e.target.value)}
                           className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-xs text-gray-300 h-24 focus:border-amber-500 outline-none transition-all font-light italic leading-relaxed shadow-inner resize-none"
                           placeholder="VD: Cần hột chủ nước D, độ sạch IF tối thượng..."
                        />
                     </section>
                  </div>
               </div>
            </div>
          )}

          {step === 'checking' && (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-12 animate-in zoom-in-95 duration-1000">
               <div className="relative">
                  <div className="w-48 h-48 rounded-full border-2 border-amber-500/20 flex items-center justify-center">
                     <div className="w-40 h-40 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">🧬</div>
               </div>
               <div>
                  <h3 className="text-4xl font-serif gold-gradient italic uppercase tracking-tighter mb-4">Neural Node Checking...</h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed italic font-light">
                     "Thiên đang bóc tách định mức hao hụt và rà soát quỹ thời gian xưởng cho Anh Natt. Vui lòng chờ trong giây lát."
                  </p>
               </div>
            </div>
          )}

          {step === 'success' && (
            <div className="h-full flex flex-col items-center justify-center py-10 text-center animate-in fade-in duration-1000">
               <div className="relative mb-12">
                  <div className="absolute inset-0 bg-green-500 blur-[80px] opacity-10 animate-pulse"></div>
                  <div className="w-40 h-40 rounded-[3rem] bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-7xl shadow-[0_0_50px_rgba(34,197,94,0.3)] border-4 border-black relative z-10">✓</div>
               </div>
               
               <h3 className="text-5xl font-serif gold-gradient italic uppercase tracking-tighter mb-6 leading-none">Bản thảo đã được băm Shard</h3>
               <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed italic mb-12">
                  "Giao thức yêu cầu sản xuất đã được niêm phong vào chuỗi khối. Kris đã gửi bản vẽ sơ bộ tới **Factory Shard**."
               </p>

               <div className="w-full max-w-xl bg-black/60 border border-white/10 rounded-[2.5rem] p-10 space-y-6 shadow-inner text-left">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                     <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Protocol ID</span>
                     <span className="text-[10px] text-amber-500 font-mono font-black">TL-CUSTOM-{Date.now().toString().slice(-6)}</span>
                  </div>
                  {engraving.enabled && (
                     <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Laser Engraving</span>
                        <span className="text-[10px] text-white font-serif italic">"{engraving.text}"</span>
                     </div>
                  )}
                  <div className="grid grid-cols-2 gap-8 pt-4">
                     <div>
                        <p className="text-[9px] text-gray-700 font-black uppercase mb-1">Target Quantity</p>
                        <p className="text-xl font-mono text-white">{quantity} PCS</p>
                     </div>
                     <div>
                        <p className="text-[9px] text-gray-700 font-black uppercase mb-1">Packaging</p>
                        <p className="text-xl font-mono text-white">{packaging.replace('_', ' ')}</p>
                     </div>
                  </div>
               </div>
            </div>
          )}

        </div>

        {/* FOOTER ACTIONS */}
        <footer className="p-8 border-t border-white/10 bg-black flex justify-between items-center shrink-0">
           {step === 'form' ? (
             <>
               <button onClick={onClose} className="px-10 py-4 border border-white/10 text-gray-500 font-black text-[10px] uppercase rounded-2xl hover:text-white transition-all tracking-widest">Abort protocol</button>
               <button 
                 onClick={handleProcessSubmission}
                 disabled={!deadline || quantity < 1}
                 className="px-16 py-4 bg-amber-500 text-black font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.2)] hover:bg-amber-400 transition-all active:scale-95 disabled:opacity-20"
               >
                 XÁC THỰC BẢN THẢO →
               </button>
             </>
           ) : step === 'success' ? (
             <button 
               onClick={confirmAndClose}
               className="w-full py-5 bg-white text-black font-black text-[11px] uppercase tracking-[0.5em] rounded-[2rem] hover:bg-green-400 transition-all shadow-2xl active:scale-95"
             >
               HOÀN TẤT & ĐẨY VỀ XƯỞNG MASTER
             </button>
           ) : (
             <div className="w-full text-center py-4">
                <p className="text-[10px] text-gray-700 uppercase font-black tracking-widest animate-pulse italic">Cổng truyền tin đang được bảo mật...</p>
             </div>
           )}
        </footer>
      </div>
    </div>
  );
};

export default CustomizationRequestModal;
