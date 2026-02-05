
import React, { useState } from 'react';
// 🛠️ Fixed: Import casing for RFMData
import { RFMData } from '../types';

const RFMAnalysis: React.FC = () => {
  // Fix: Use correct segment values from the defined type ('VIP' | 'THÀNH VIÊN' | 'RỦI RO' | 'MỚI')
  const [data] = useState<RFMData[]>([
    { customerId: 'C-001', name: 'Nguyễn Văn A', recency: 5, frequency: 12, monetary: 450000000, score: 555, segment: 'VIP' },
    { customerId: 'C-002', name: 'Trần Thị B', recency: 45, frequency: 4, monetary: 15000000, score: 333, segment: 'THÀNH VIÊN' },
    { customerId: 'C-003', name: 'Lê Văn C', recency: 2, frequency: 20, monetary: 1200000000, score: 555, segment: 'VIP' },
    { customerId: 'C-004', name: 'Phạm Minh D', recency: 120, frequency: 1, monetary: 5000000, score: 111, segment: 'RỦI RO' },
    { customerId: 'C-005', name: 'Hoàng Lan E', recency: 10, frequency: 2, monetary: 25000000, score: 422, segment: 'MỚI' },
  ]);

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700 h-full overflow-y-auto">
      <header className="border-b border-white/5 pb-6">
        <h2 className="text-3xl font-serif gold-gradient mb-2 italic">Phân tích RFM & Customer Lifecycle</h2>
        <p className="text-gray-400">Tối ưu hóa hành vi khách hàng và định hình chiến lược VIP Brand Lab.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass p-10 rounded-[3rem] border border-amber-500/20 bg-amber-500/5">
          <h3 className="text-6xl font-serif text-amber-500 mb-2">2</h3>
          <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Khách hàng Whale (VIP)</p>
          <p className="text-[10px] text-amber-500/50 mt-2">Đóng góp 85% doanh thu hệ thống</p>
        </div>
        <div className="glass p-10 rounded-[3rem] border border-blue-500/20">
          <h3 className="text-6xl font-serif text-blue-400 mb-2">75%</h3>
          <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Tỷ lệ quay lại (Retention)</p>
          <p className="text-[10px] text-blue-400/50 mt-2">Dựa trên mô hình tham mưu của Kris</p>
        </div>
        <div className="glass p-10 rounded-[3rem] border border-red-500/20">
          <h3 className="text-6xl font-serif text-red-500 mb-2">1</h3>
          <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Khách hàng At-risk</p>
          <p className="text-[10px] text-red-500/50 mt-2">Cần kịch bản khôi phục ngay lập tức</p>
        </div>
      </div>

      <div className="glass p-8 rounded-[3rem] border border-white/5">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-gray-500 uppercase tracking-widest border-b border-white/10">
              <th className="pb-4 px-4">Khách hàng</th>
              <th className="pb-4 px-4">Recency (Ngày)</th>
              <th className="pb-4 px-4">Frequency (Lần)</th>
              <th className="pb-4 px-4">Monetary (Tổng)</th>
              <th className="pb-4 px-4">RFM Score</th>
              <th className="pb-4 px-4">Phân khúc</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {data.map((r, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-4 px-4">
                  <p className="font-bold text-white">{r.name}</p>
                  <span className="text-[9px] text-gray-500">{r.customerId}</span>
                </td>
                <td className="py-4 px-4 font-mono">{r.recency}</td>
                <td className="py-4 px-4 font-mono">{r.frequency}</td>
                <td className="py-4 px-4 font-mono font-bold">{r.monetary.toLocaleString()}</td>
                <td className="py-4 px-4">
                  <div className="flex space-x-1">
                    {String(r.score).split('').map((s, idx) => (
                      <span key={idx} className={`w-6 h-6 rounded flex items-center justify-center font-bold border ${
                        s === '5' ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-white/5 border-white/10 text-gray-500'
                      }`}>{s}</span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    r.segment === 'VIP' ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]' :
                    r.segment === 'RỦI RO' ? 'bg-red-500 text-white' :
                    'bg-white/10 text-gray-400'
                  }`}>{r.segment}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RFMAnalysis;
