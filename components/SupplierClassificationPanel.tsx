
import React, { useState, useEffect, useMemo } from 'react';
import { Supplier, PersonaID } from '../types';
import { SupplierEngine } from '../services/supplier/SupplierEngine';
import { GmailIntelligence } from '../services/gmailService';
import { ExportEngine } from '../services/exportService';
import AIAvatar from './AIAvatar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

export const SupplierClassificationPanel: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    const mockData: Supplier[] = [
      { id: '1', maNhaCungCap: 'WG_HK', tenNhaCungCap: 'World Gems Hong Kong', diaChi: 'Kowloon, HK', maSoThue: '', transactionAmount: 2500000000, loaiNCC: 'NUOC_NGOAI', email: 'sales@worldgems.hk', sentimentScore: 0.92, ghiChu: 'Diamond Prime Supplier' },
      { id: '2', maNhaCungCap: 'SJC_VN', tenNhaCungCap: 'SJC Vietnam', diaChi: 'Q1, HCM', maSoThue: '0300608670', transactionAmount: 850000000, loaiNCC: 'TO_CHUC', email: 'info@sjc.vn', sentimentScore: 0.75, ghiChu: 'Vàng miếng và trang sức' },
      { id: '3', maNhaCungCap: 'PACK_VN', tenNhaCungCap: 'Vĩnh Khang Packaging', diaChi: 'Bình Tân, HCM', maSoThue: '0312456789', transactionAmount: 45000000, loaiNCC: 'TO_CHUC', email: 'vinhkhang@print.vn', sentimentScore: 0.45, ghiChu: 'Bao bì in ấn cao cấp' },
      { id: '4', maNhaCungCap: 'ST_LOG', tenNhaCungCap: 'Showtrans Logistics', diaChi: 'Q7, HCM', maSoThue: '0314455667', transactionAmount: 120000000, loaiNCC: 'TO_CHUC', email: 'ops@showtrans.vn', sentimentScore: 0.88, ghiChu: 'Vận chuyển hàng giá trị cao' }
    ];

    const enhanced = mockData.map(s => ({
      ...s,
      ...SupplierEngine.analyzeStrategicFit(s)
    }));
    setSuppliers(enhanced);
  }, []);

  const groupStats = useMemo(() => {
     const dist = suppliers.reduce((acc: any, s) => {
        s.nhomHangChinh?.forEach((g: string) => {
           acc[g] = (acc[g] || 0) + 1;
        });
        return acc;
     }, {});
     return Object.entries(dist).map(([name, value]) => ({ name: name.replace('_', ' '), value }));
  }, [suppliers]);

  const handleExport = async () => {
    setLoading(true);
    await ExportEngine.toExcel(suppliers, `SUPPLIER_STRATEGIC_REPORT`);
    setLoading(false);
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.8) return 'text-green-500';
    if (score > 0.6) return 'text-amber-500';
    return 'text-red-500';
  };

  const recommendations = selectedSupplier ? SupplierEngine.getActionRecommendations(selectedSupplier) : [];

  return (
    <div className="h-full flex flex-col p-8 bg-[#020202] overflow-y-auto no-scrollbar animate-in fade-in duration-700 pb-40">
      <header className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/5 pb-8 gap-6">
        <div>
          <h2 className="ai-headline text-5xl italic uppercase tracking-tighter">Supplier Node Hub</h2>
          <p className="ai-sub-headline text-cyan-300/40 mt-2 font-black tracking-[0.4em]">Phân loại chiến lược & Phân tích Sentiment v2.0</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleExport} className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
            <span>📊</span> EXPORT STRATEGIC WORKBOOK
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        <div className="ai-panel p-8 bg-black/40 border-white/5 flex flex-col justify-between hover:border-indigo-500/30 transition-all">
           <p className="text-[9px] text-gray-500 font-black uppercase mb-4">Tổng số Shard Đối tác</p>
           <p className="text-5xl font-mono font-black text-white">{suppliers.length}</p>
        </div>
        <div className="ai-panel p-8 bg-blue-500/5 border-blue-500/20">
           <p className="text-[9px] text-blue-400 font-black uppercase mb-4">Node Tiềm Năng (Whales)</p>
           <p className="text-5xl font-mono font-black text-white">{suppliers.filter(s => s.coTienNang).length}</p>
        </div>
        <div className="ai-panel p-8 bg-green-500/5 border-green-500/20">
           <p className="text-[9px] text-green-400 font-black uppercase mb-4">Tỷ lệ Tin cậy (AVG)</p>
           <p className="text-5xl font-mono font-black text-white">{(suppliers.reduce((a,b) => a + (b.sentimentScore || 0), 0) / suppliers.length * 100).toFixed(0)}%</p>
        </div>
        <div className="ai-panel p-8 bg-red-500/5 border-red-500/20">
           <p className="text-[9px] text-red-400 font-black uppercase mb-4">Cảnh báo rủi ro</p>
           <p className="text-5xl font-mono font-black text-red-500">{suppliers.filter(s => (s.sentimentScore || 0) < 0.5).length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* BẢNG NCC CHI TIẾT */}
         <div className="lg:col-span-2 ai-panel overflow-hidden border-white/5 bg-black/40 shadow-2xl">
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
               <h3 className="text-sm font-bold text-white uppercase tracking-widest italic">Node Discovery Ledger</h3>
               <div className="flex gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[9px] text-green-500 font-black uppercase tracking-widest">Shard Sync Active</span>
               </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-left text-[11px]">
                  <thead>
                     <tr className="text-gray-500 uppercase font-black tracking-widest border-b border-white/10 bg-black">
                        <th className="p-6">Định danh Node</th>
                        <th className="p-6">Ngành hàng</th>
                        <th className="p-6">Quy mô / Xu hướng</th>
                        <th className="p-6 text-center">Sentiment</th>
                        <th className="p-6 text-right">Chi phí (Net)</th>
                     </tr>
                  </thead>
                  <tbody className="text-gray-300">
                     {suppliers.map(s => (
                       <tr 
                        key={s.id} 
                        onClick={() => setSelectedSupplier(s)}
                        className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer ${selectedSupplier?.id === s.id ? 'bg-white/[0.05]' : ''}`}
                       >
                          <td className="p-6">
                             <p className="font-bold text-white uppercase">{s.tenNhaCungCap}</p>
                             <p className="text-[9px] text-gray-600 font-mono mt-1">{s.maNhaCungCap} • {s.loaiNCC}</p>
                          </td>
                          <td className="p-6">
                             <div className="flex flex-wrap gap-1">
                                {s.nhomHangChinh?.map(g => (
                                   <span key={g} className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] font-black rounded uppercase">
                                      {g.replace('_', ' ')}
                                   </span>
                                ))}
                             </div>
                          </td>
                          <td className="p-6">
                             <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase ${
                                   s.quyMo === 'LON' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
                                }`}>{s.quyMo}</span>
                                <span className={s.xuHuong === 'TANG' ? 'text-green-500' : s.xuHuong === 'GIAM' ? 'text-red-500' : 'text-gray-500'}>
                                   {s.xuHuong === 'TANG' ? '📈' : s.xuHuong === 'GIAM' ? '📉' : '➡️'}
                                </span>
                             </div>
                          </td>
                          <td className="p-6 text-center">
                             <span className={`text-lg font-mono font-black ${getSentimentColor(s.sentimentScore || 0)}`}>
                                {((s.sentimentScore || 0) * 100).toFixed(0)}%
                             </span>
                          </td>
                          <td className="p-6 text-right font-mono text-white font-bold">
                             {(s.transactionAmount || 0).toLocaleString()} đ
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* AI ADVISOR & RECOMMENDATIONS */}
         <div className="space-y-8">
            <div className="ai-panel p-8 bg-black/40 border-white/5">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Phân bổ ngành hàng (Global)</h3>
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie data={groupStats} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {groupStats.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={['#f59e0b', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6'][index % 5]} />
                            ))}
                         </Pie>
                         <Tooltip />
                      </PieChart>
                   </ResponsiveContainer>
                </div>
            </div>

            {selectedSupplier ? (
               <div className="ai-panel p-8 bg-amber-500/[0.03] border-amber-500/20 animate-in zoom-in-95">
                  <div className="flex items-center gap-4 mb-6">
                     <AIAvatar personaId={PersonaID.KRIS} size="sm" isThinking={false} />
                     <h4 className="text-sm font-black text-amber-500 uppercase tracking-widest">Kris Smart Recommendations</h4>
                  </div>
                  
                  <div className="space-y-4">
                     {recommendations.map((rec, i) => (
                        <div key={i} className={`p-4 rounded-2xl border ${
                           rec.type === 'critical' ? 'bg-red-500/10 border-red-500/30' : 
                           rec.type === 'opportunity' ? 'bg-green-500/10 border-green-500/30' : 
                           'bg-amber-500/10 border-amber-500/30'
                        }`}>
                           <p className="text-[10px] font-black uppercase mb-1">{rec.title}</p>
                           <p className="text-[11px] text-gray-200 italic leading-relaxed">{rec.action}</p>
                        </div>
                     ))}
                     {recommendations.length === 0 && <p className="text-[10px] text-gray-600 text-center">Node vận hành ổn định. Không có khuyến nghị mới.</p>}
                  </div>
               </div>
            ) : (
               <div className="ai-panel p-12 border-dashed border-white/10 opacity-20 flex flex-col items-center justify-center text-center h-64">
                  <p className="text-5xl mb-6">🔬</p>
                  <p className="text-xs uppercase font-black tracking-widest">Chọn một Node để bóc tách khuyến nghị</p>
               </div>
            )}

            <div className="ai-panel p-8 bg-indigo-500/5 border-indigo-500/20">
               <div className="flex items-center gap-4 mb-6">
                  <AIAvatar personaId={PersonaID.THIEN} size="sm" isThinking={false} />
                  <h4 className="text-sm font-black text-indigo-400 uppercase tracking-widest">Tham mưu Thiên</h4>
               </div>
               <p className="text-[11px] text-gray-400 italic leading-relaxed font-light">
                  "Thưa Anh Natt, dữ liệu bóc tách cho thấy các nhà cung cấp nhóm **KIM CƯƠNG** đang có xu hướng thắt chặt hạn mức nợ. Thiên đề xuất Anh chuyển dịch 15% ngân sách sang các Node tại Hong Kong để tối ưu thanh khoản."
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SupplierClassificationPanel;
