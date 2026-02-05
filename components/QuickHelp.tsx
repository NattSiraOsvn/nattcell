
import React, { useState } from 'react';
// 🛠️ Fixed: Import casing for PersonaID
import { PersonaID } from '../types';
import AIAvatar from './AIAvatar';

interface QuickHelpProps {
  onClose: () => void;
}

const QuickHelp: React.FC<QuickHelpProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'FAQ' | 'GUIDES' | 'CHECKLIST' | 'ASSISTANT'>('FAQ');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'Chào Anh Natt, Thiên có thể hỗ trợ gì về thủ tục Hải quan hôm nay?' }
  ]);

  const faqs = [
    { q: 'Mã HS cho Kim cương thô?', a: '7102.10.00 (Thuế NK 0%, VAT 10%)' },
    { q: 'Hồ sơ xin C/O Form E?', a: 'Cần Invoice, Packing List, B/L, Tờ khai hải quan thông quan.' },
    { q: 'Quy trình luồng Đỏ?', a: 'Kiểm hóa thực tế 100%. Cần chuẩn bị hàng hóa tại kho TCS/NCTS để công chức kiểm tra.' },
    { q: 'Hao hụt vàng cho phép?', a: 'Đúc: 1.5% | Nguội: 0.8% | Xi: 0.5% (Theo quy định nội bộ Tâm Luxury).' },
  ];

  const guides = [
    { title: 'Bước 1: Chuẩn bị chứng từ', desc: 'Hợp đồng, Invoice, PL, C/O (nếu có).' },
    { title: 'Bước 2: Khai báo VNACCS', desc: 'Truy cập ECUS, nhập liệu 52 chỉ tiêu.' },
    { title: 'Bước 3: Lấy kết quả phân luồng', desc: 'Xanh (Thông quan), Vàng (Duyệt hồ sơ), Đỏ (Kiểm hóa).' },
    { title: 'Bước 4: Nộp thuế & Lệ phí', desc: 'Thanh toán qua cổng 24/7 của VietinBank/Vietcombank.' },
  ];

  const checklist = [
    { id: 'inv', label: 'Commercial Invoice (Gốc/Sao y)', checked: false },
    { id: 'pl', label: 'Packing List (Chi tiết quy cách)', checked: false },
    { id: 'bl', label: 'Bill of Lading (Vận đơn chủ)', checked: false },
    { id: 'co', label: 'C/O (Chứng nhận xuất xứ)', checked: false },
    { id: 'ins', label: 'Insurance Policy (Bảo hiểm)', checked: false },
    { id: 'kim', label: 'Kimberley Process (Nếu là Kim cương thô)', checked: false },
  ];

  const [checklistState, setChecklistState] = useState(checklist);

  const toggleCheck = (id: string) => {
    setChecklistState(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleChat = () => {
    if (!chatInput.trim()) return;
    setChatHistory(prev => [...prev, { role: 'user', content: chatInput }]);
    
    // Simulate AI thinking and response
    setTimeout(() => {
      let response = "Thiên đang tra cứu quy định mới nhất...";
      if (chatInput.toLowerCase().includes('thuế')) response = "Thuế nhập khẩu vàng nguyên liệu là 0%, VAT 10%. Trang sức thành phẩm chịu thuế NK 25%.";
      else if (chatInput.toLowerCase().includes('hs')) response = "Vui lòng cung cấp mô tả chi tiết hàng hóa để Thiên tra mã HS chính xác.";
      else response = `Đã ghi nhận câu hỏi: "${chatInput}". Đang kết nối tới cơ sở dữ liệu luật...`;

      setChatHistory(prev => [...prev, { role: 'ai', content: response }]);
    }, 800);
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="glass w-full max-w-4xl h-[85vh] flex flex-col rounded-[3rem] border border-amber-500/20 relative shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
           <div className="flex items-center gap-4">
              <span className="text-4xl">🆘</span>
              <div>
                 <h2 className="text-2xl font-serif gold-gradient italic">Trợ Lý Nghiệp Vụ</h2>
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Customs & Compliance Support</p>
              </div>
           </div>
           <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors">✕</button>
        </div>

        <div className="flex flex-1 overflow-hidden">
           {/* Sidebar */}
           <div className="w-64 bg-black/40 border-r border-white/5 p-6 space-y-2">
              {[
                { id: 'FAQ', label: 'Hỏi Đáp Thường Gặp', icon: '❓' },
                { id: 'GUIDES', label: 'Quy Trình Chi Tiết', icon: '📝' },
                { id: 'CHECKLIST', label: 'Hồ Sơ Bắt Buộc', icon: '✅' },
                { id: 'ASSISTANT', label: 'Trợ Lý AI Live', icon: '🤖' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition-all ${activeTab === tab.id ? 'bg-amber-500 text-black font-bold shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                   <span>{tab.icon}</span>
                   <span className="text-[10px] uppercase font-black tracking-widest">{tab.label}</span>
                </button>
              ))}
           </div>

           {/* Content */}
           <div className="flex-1 p-8 overflow-y-auto no-scrollbar bg-black/20">
              {activeTab === 'FAQ' && (
                 <div className="space-y-4 animate-in slide-in-from-right-4">
                    {faqs.map((f, i) => (
                       <div key={i} className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl">
                          <h4 className="text-amber-500 font-bold text-sm mb-2">Q: {f.q}</h4>
                          <p className="text-gray-300 text-xs leading-relaxed">A: {f.a}</p>
                       </div>
                    ))}
                 </div>
              )}

              {activeTab === 'GUIDES' && (
                 <div className="space-y-6 animate-in slide-in-from-right-4">
                    {guides.map((g, i) => (
                       <div key={i} className="flex gap-4">
                          <div className="flex flex-col items-center">
                             <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500 text-blue-400 flex items-center justify-center font-black text-xs">{i + 1}</div>
                             {i < guides.length - 1 && <div className="w-0.5 h-full bg-white/10 my-1"></div>}
                          </div>
                          <div className="pb-6">
                             <h4 className="text-white font-bold text-sm uppercase tracking-wide">{g.title}</h4>
                             <p className="text-gray-400 text-xs mt-1">{g.desc}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              )}

              {activeTab === 'CHECKLIST' && (
                 <div className="space-y-3 animate-in slide-in-from-right-4">
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-6">
                       <p className="text-[10px] text-amber-500 font-bold italic">Lưu ý: Thiếu 1 trong các chứng từ này có thể dẫn đến việc tờ khai bị treo hoặc chuyển luồng đỏ.</p>
                    </div>
                    {checklistState.map((item) => (
                       <label key={item.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${item.checked ? 'bg-green-500/10 border-green-500/30' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'}`}>
                          <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${item.checked ? 'bg-green-500 border-green-500 text-black' : 'border-gray-600'}`}>
                             {item.checked && '✓'}
                          </div>
                          <span className={`text-xs font-bold uppercase ${item.checked ? 'text-green-400' : 'text-gray-400'}`}>{item.label}</span>
                          <input type="checkbox" className="hidden" checked={item.checked} onChange={() => toggleCheck(item.id)} />
                       </label>
                    ))}
                 </div>
              )}

              {activeTab === 'ASSISTANT' && (
                 <div className="flex flex-col h-full animate-in slide-in-from-right-4">
                    <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar mb-4">
                       {chatHistory.map((msg, i) => (
                          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                             {msg.role === 'ai' ? <AIAvatar personaId={PersonaID.THIEN} size="sm" /> : <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs">👤</div>}
                             <div className={`p-4 rounded-2xl text-xs max-w-[80%] leading-relaxed ${msg.role === 'user' ? 'bg-amber-500 text-black' : 'bg-white/10 text-gray-200'}`}>
                                {msg.content}
                             </div>
                          </div>
                       ))}
                    </div>
                    <div className="flex gap-2 relative">
                       <input 
                         type="text" 
                         value={chatInput}
                         onChange={(e) => setChatInput(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                         placeholder="Nhập câu hỏi nghiệp vụ..." 
                         className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-amber-500 outline-none"
                       />
                       <button onClick={handleChat} className="px-4 py-2 bg-amber-500 rounded-xl text-black font-bold hover:bg-amber-400 transition-all">➤</button>
                    </div>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default QuickHelp;
