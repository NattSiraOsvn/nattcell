
import React, { useState, useMemo } from 'react';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  desc: string;
  vendor: string;
  type: string;
  risk: number;
}

const FinanceAudit: React.FC = () => {
  // Mock Data với ngày tháng cụ thể để test bộ lọc
  const [transactions] = useState<Transaction[]>([
    { id: 'TX-001', date: '2025-01-21', amount: 1200000000, desc: 'Thanh toán lô kim cương thô', vendor: 'Unknown', type: 'Payment', risk: 75 },
    { id: 'TX-002', date: '2025-01-15', amount: 45000000, desc: 'Mua phôi đúc trang sức', vendor: 'Gia Công A', type: 'Purchase', risk: 10 },
    { id: 'TX-003', date: '2025-01-10', amount: 500000000, desc: 'Thanh toán hột chủ GIA', vendor: 'Đá Quý B', type: 'Payment', risk: 35 },
    { id: 'TX-004', date: '2024-12-25', amount: 85000000, desc: 'Phí vận chuyển quốc tế', vendor: 'Logistics Pro', type: 'Service', risk: 5 },
    { id: 'TX-005', date: '2024-12-01', amount: 250000000, desc: 'Chi lương thợ tháng 11', vendor: 'Nội bộ', type: 'Payroll', risk: 0 },
  ]);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const taxDeadlines = [
    { type: 'VAT (GTGT)', deadline: '20 hàng tháng', status: 'Warning', penalty: '0.02%' },
    { type: 'TNCN', deadline: '20 hàng tháng', status: 'Optimal', penalty: '0.05%' },
    { type: 'TNDN', deadline: '30/03, 30/06...', status: 'Upcoming', penalty: '0.05%' },
  ];

  // Logic lọc giao dịch theo ngày
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const txDate = new Date(tx.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && txDate < start) return false;
      if (end && txDate > end) return false;
      return true;
    });
  }, [transactions, startDate, endDate]);

  const resetFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto h-full overflow-y-auto space-y-8 animate-in fade-in duration-700 pb-20 no-scrollbar">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-red-600 text-white text-[8px] font-black rounded uppercase">Accounting Engine v9.6</span>
            <h2 className="text-4xl font-serif gold-gradient italic">Finance & Tax Intelligence</h2>
          </div>
          <p className="text-gray-400 font-light italic">Hệ thống kế toán TT200 tích hợp bộ lọc thời gian & Risk Scoring AI.</p>
        </div>
        
        {/* Date Filter Controls */}
        <div className="flex flex-wrap items-center gap-4 bg-white/5 p-4 rounded-[2rem] border border-white/10 backdrop-blur-xl">
          <div className="flex flex-col">
            <label className="text-[8px] text-gray-500 uppercase font-black ml-2 mb-1">Từ ngày | From</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] text-amber-500 focus:border-amber-500 outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[8px] text-gray-500 uppercase font-black ml-2 mb-1">Đến ngày | To</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] text-amber-500 focus:border-amber-500 outline-none"
            />
          </div>
          <button 
            onClick={resetFilter}
            className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-[9px] font-black uppercase transition-all border border-white/10"
          >
            Đặt lại | Reset
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-10 rounded-[3.5rem] border border-white/5 shadow-2xl bg-gradient-to-br from-white/[0.02] to-transparent">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold flex items-center italic">
                <span className="mr-3">🚩</span> Risk Scoring Analysis
              </h3>
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                Hiển thị {filteredTransactions.length} giao dịch
              </span>
            </div>
            
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="text-gray-500 uppercase tracking-widest border-b border-white/10 pb-4">
                    <th className="pb-4 px-4 font-black">Ngày | ID</th>
                    <th className="pb-4 px-4 font-black">Số tiền</th>
                    <th className="pb-4 px-4 font-black">Diễn giải</th>
                    <th className="pb-4 px-4 font-black">Đối tác</th>
                    <th className="pb-4 px-4 font-black">Risk Score</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {filteredTransactions.map(tx => (
                    <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                      <td className="py-5 px-4 font-mono">
                         <p className="text-white font-bold">{tx.date}</p>
                         <p className="text-[9px] text-gray-600">{tx.id}</p>
                      </td>
                      <td className="py-5 px-4 font-mono font-bold text-lg text-white">
                        {tx.amount.toLocaleString()} đ
                      </td>
                      <td className="py-5 px-4 max-w-xs">
                        <p className="text-gray-400 group-hover:text-white transition-colors truncate italic">
                          {tx.desc || 'Thiếu diễn giải!'}
                        </p>
                      </td>
                      <td className={`py-5 px-4 font-bold ${tx.vendor === 'Unknown' ? 'text-red-400 animate-pulse' : 'text-gray-300'}`}>
                        {tx.vendor}
                      </td>
                      <td className="py-5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden w-24">
                            <div 
                              className={`h-full transition-all duration-1000 ${
                                tx.risk > 50 ? 'bg-red-500' : tx.risk > 20 ? 'bg-amber-500' : 'bg-green-500'
                              }`} 
                              style={{ width: `${tx.risk}%` }}
                            ></div>
                          </div>
                          <span className="font-mono text-[10px] font-bold">{tx.risk}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-32 text-center opacity-20">
                         <div className="flex flex-col items-center">
                            <span className="text-8xl mb-6">🔍</span>
                            <p className="text-2xl font-serif italic uppercase tracking-widest">Không có dữ liệu trong khoảng này</p>
                         </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-8 rounded-[3rem] border border-amber-500/20 bg-amber-500/5 shadow-2xl">
            <h3 className="text-lg font-bold mb-6 flex items-center text-amber-500 uppercase tracking-widest text-[10px]">
              <span className="mr-2 text-lg">📅</span> Lịch Thuế & Compliance
            </h3>
            <div className="space-y-4">
              {taxDeadlines.map((d, i) => (
                <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-all">
                  <div>
                    <p className="text-white font-bold text-xs group-hover:text-amber-500 transition-colors">{d.type}</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">{d.deadline}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${
                      d.status === 'Warning' ? 'bg-red-500 text-white animate-pulse' : 'bg-green-500 text-black'
                    }`}>{d.status}</span>
                    <p className="text-[9px] text-gray-600 mt-1">Phạt: {d.penalty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-8 rounded-[3rem] border border-blue-500/20 bg-blue-500/5 shadow-2xl">
            <h4 className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-4 flex items-center">
               <span className="mr-2 text-lg">🧠</span> Cố Vấn | Advisor: THIÊN
            </h4>
            <div className="text-[11px] text-gray-400 leading-relaxed italic space-y-4">
              <p>
                "Anh Natt lưu ý: Các giao dịch trong kỳ đang được lọc để đối soát chính xác với tờ khai. Hệ thống phát hiện rủi ro cao tại các giao dịch không tên trên 1 tỷ đồng."
              </p>
              <p className="text-amber-500 font-bold border-t border-white/5 pt-4">
                Khuyến nghị: Cần bổ sung hóa đơn điện tử e-invoice từ MISA/VNPT để hợp lệ hóa chi phí TNDN trước khi chốt kỳ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceAudit;
