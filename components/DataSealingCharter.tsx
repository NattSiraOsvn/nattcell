
import React from 'react';

const DataSealingCharter: React.FC = () => {
  return (
    <div className="p-8 md:p-16 max-w-5xl mx-auto h-full overflow-y-auto no-scrollbar bg-black text-white animate-in fade-in duration-1000 pb-40">
      <div className="border-2 border-amber-500/30 p-12 rounded-[4rem] bg-gradient-to-br from-amber-950/10 to-transparent relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 text-[200px] font-serif italic text-amber-500 pointer-events-none">NATT</div>
        
        <header className="text-center mb-20">
          <h1 className="text-5xl font-serif gold-gradient italic uppercase tracking-tighter mb-4">Hiến Chương Dữ Liệu</h1>
          <p className="text-amber-500 font-black text-[10px] uppercase tracking-[0.5em]">(Chính sách Niêm phong & Bảo toàn Tính toàn vẹn – DSP v2026.01)</p>
          <div className="w-24 h-1 bg-amber-500 mx-auto mt-8 rounded-full shadow-[0_0:15px_rgba(245,158,11,0.5)]"></div>
        </header>

        <section className="space-y-16">
          <div className="space-y-6">
            <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest border-b border-white/5 pb-4 flex items-center gap-3">
              <span className="text-xl">I.</span> NGUYÊN TẮC CỐT LÕI
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8">
              {[
                { t: "Dữ liệu vận hành", d: "Là dữ liệu 'sống' đang thực thi → KHÔNG thực hiện băm niêm phong." },
                { t: "Dữ liệu chốt sổ", d: "BẮT BUỘC niêm phong tổng hợp sau báo cáo." },
                { t: "Chu kỳ pháp lý", d: "Tuân thủ nghiêm ngặt lịch nộp thuế, không theo cảm tính kỹ thuật." },
                { t: "Bảo mật danh tính", d: "TUYỆT ĐỐI KHÔNG băm/niêm phong dữ liệu cá nhân khách hàng." }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                   <p className="text-xs font-bold text-white uppercase tracking-tight">{item.t}</p>
                   <p className="text-[11px] text-gray-400 italic font-light leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest border-b border-white/5 pb-4 flex items-center gap-3">
              <span className="text-xl">II.</span> PHÂN TẦNG NIÊM PHONG (LAYERING)
            </h3>
            <div className="space-y-8 pl-8">
               <div className="relative pl-6 border-l border-blue-500/30">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-blue-500"></div>
                  <h4 className="text-xs font-bold text-blue-400 uppercase">Tầng 1: Dữ liệu Vận hành (Trực tiếp)</h4>
                  <p className="text-[11px] text-gray-500 mt-2">Chế độ: Nhật ký AuditLog mềm. Cho phép điều chỉnh nghiệp vụ sai sót mà không phá vỡ cấu trúc chuỗi khối.</p>
               </div>
               <div className="relative pl-6 border-l border-amber-500/30">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-amber-500 shadow-[0_0:10px_rgba(245,158,11,1)]"></div>
                  <h4 className="text-xs font-bold text-amber-500 uppercase">Tầng 2: Chu kỳ Thuế Tháng (Niêm phong Tổng hợp)</h4>
                  <p className="text-[11px] text-gray-500 mt-2">Thời điểm: Sau khi nộp tờ khai (GTGT, TNCN). Băm Hash tổng hợp (Doanh thu, Thuế, Chi phí). Không băm thông tin cá nhân khách hàng.</p>
               </div>
               <div className="relative pl-6 border-l border-red-500/30">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-red-600 shadow-[0_0:10px_rgba(220,38,38,1)]"></div>
                  <h4 className="text-xs font-bold text-red-500 uppercase">Tầng 3: Quyết toán Năm (Niêm phong Pháp lý vĩnh viễn)</h4>
                  <p className="text-[11px] text-gray-500 mt-2">Xác lập Merkle Root vĩnh cửu sau khi ký Báo cáo tài chính. Không thể sửa đổi trừ khi có quyết định điều chỉnh từ cơ quan Nhà nước.</p>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest border-b border-white/5 pb-4 flex items-center gap-3">
              <span className="text-xl">III.</span> TRÁCH NHIỆM CON NGƯỜI
            </h3>
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 italic font-light text-[11px] text-gray-400 leading-loose">
               "Hệ thống (Thiên/Can/Kris) được quyền ghi nhớ và gợi ý, nhưng chỉ Con Người mới có thẩm quyền chốt số. Mọi hành động niêm phong đều được định danh cá nhân chịu trách nhiệm, sẵn sàng giải trình trước Kiểm toán và Pháp luật."
            </div>
          </div>
        </section>

        <footer className="mt-24 border-t border-amber-500/20 pt-12 flex flex-col items-center gap-4">
           <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/30 rounded-3xl flex items-center justify-center text-3xl shadow-[0_0:30px_rgba(245,158,11,0.1)]">🔱</div>
           <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Master Protocol Đang Kích Hoạt</p>
           <p className="text-[9px] text-gray-700 font-mono italic">Xác thực bởi Identity: 0xNATT_MASTER_SIGNATURE_2026</p>
        </footer>
      </div>
    </div>
  );
};

export default DataSealingCharter;
