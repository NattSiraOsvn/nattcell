
import React from 'react';

export const ReservationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
       <div className="w-full max-w-lg bg-[#0a0a0a] border border-amber-500/30 rounded-[3rem] p-10 shadow-2xl relative">
          <button onClick={onClose} className="absolute top-6 right-8 text-2xl text-gray-500 hover:text-white">✕</button>
          
          <h3 className="text-2xl font-serif gold-gradient italic uppercase tracking-tighter mb-2">Đặt Hẹn Xem Mẫu</h3>
          <p className="text-xs text-gray-500 mb-8">Chuyên viên tư vấn sẽ chuẩn bị sản phẩm tại phòng VIP.</p>
          
          <div className="space-y-4">
             <input type="text" placeholder="Họ Tên Quý Khách" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white outline-none focus:border-amber-500 transition-all" />
             <input type="text" placeholder="Số điện thoại" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white outline-none focus:border-amber-500 transition-all" />
             <div className="grid grid-cols-2 gap-4">
                <input type="date" className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-gray-300 outline-none" />
                <input type="time" className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-gray-300 outline-none" />
             </div>
          </div>

          <button onClick={onClose} className="w-full mt-8 py-4 bg-amber-500 text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-amber-400 transition-all shadow-lg">
             Xác nhận Lịch Hẹn
          </button>
       </div>
    </div>
  );
};
