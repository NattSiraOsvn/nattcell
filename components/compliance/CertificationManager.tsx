
import React, { useState, useEffect } from 'react';
import { Certification, PersonaID } from '../../types.ts';
import { CertificationProvider } from '../../services/compliance/CertificationService.ts';
import LoadingSpinner from '../common/LoadingSpinner.tsx';
import AIAvatar from '../AIAvatar.tsx';

const CertificationManager: React.FC = () => {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [cData, sData] = await Promise.all([
      CertificationProvider.getCerts(),
      CertificationProvider.getStatistics()
    ]);
    setCerts(cData);
    setStats(sData);
    setLoading(false);
  };

  const handleRenew = async (certId: string) => {
    if (!window.confirm("Bắt đầu quy trình gia hạn cho chứng chỉ này?")) return;
    try {
      const now = Date.now();
      await CertificationProvider.renewCertification(certId, {
        issueDate: now,
        expiryDate: now + (365 * 86400000) // Gia hạn 1 năm
      });
      await loadData();
      alert("✅ Đã khởi tạo yêu cầu gia hạn.");
    } catch (e) {
      alert("❌ Lỗi gia hạn.");
    }
  };

  const filteredCerts = certs.filter(c => {
    // 45: Fix: Status ARCHIVED is now part of the union, comparison is valid
    if (filter === 'ALL') return c.status !== 'ARCHIVED';
    return c.status === filter;
  });

  if (loading || !stats) return <LoadingSpinner message="Đang kết nối Shard Chứng chỉ..." />;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
      
      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Tổng số Node', val: stats.total, color: 'text-white' },
          { label: 'Đang hiệu lực', val: stats.active, color: 'text-green-500' },
          { label: 'Sắp hết hạn', val: stats.expiringSoon, color: 'text-amber-500' },
          { label: 'Chờ xác thực', val: stats.pendingVerification, color: 'text-blue-400' }
        ].map((s, i) => (
          <div key={i} className="ai-panel p-6 bg-black/40 border-white/5">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{s.label}</p>
            <p className={`text-4xl font-mono font-black mt-2 ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        
        {/* CERTIFICATE LEDGER */}
        <div className="xl:col-span-3 ai-panel overflow-hidden border-white/5 bg-black/40 flex flex-col shadow-2xl">
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
            <div className="flex gap-4">
              {['ALL', 'ACTIVE', 'EXPIRED', 'PENDING'].map(f => (
                <button 
                  key={f} 
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase border transition-all ${
                    filter === f ? 'bg-amber-500 text-black border-amber-500' : 'bg-white/5 text-gray-500 border-white/5 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg hover:bg-indigo-500">
              + Add Certification
            </button>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-[11px] border-collapse">
               <thead>
                  <tr className="text-gray-500 font-black uppercase tracking-widest border-b border-white/10 bg-black">
                     <th className="p-6">Số hiệu / Tiêu đề</th>
                     <th className="p-6">Tổ chức cấp</th>
                     <th className="p-6">Thời hạn (Expiry)</th>
                     <th className="p-6">Trạng thái</th>
                     <th className="p-6 text-right">Thao tác</th>
                  </tr>
               </thead>
               <tbody className="text-gray-300">
                  {filteredCerts.map(cert => {
                    const daysLeft = cert.expiryDate ? Math.ceil((cert.expiryDate - Date.now()) / 86400000) : Infinity;
                    const isUrgent = daysLeft < 30 && cert.status === 'ACTIVE';

                    return (
                      <tr key={cert.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                        <td className="p-6">
                           <p className="font-bold text-white uppercase group-hover:text-amber-500 transition-colors">{cert.title}</p>
                           <p className="text-[9px] text-gray-600 font-mono mt-1">{cert.certificateNumber}</p>
                        </td>
                        <td className="p-6">
                           <span className="text-gray-400 italic">{cert.issuingBody}</span>
                        </td>
                        <td className="p-6">
                           <p className={`font-mono ${isUrgent ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
                             {cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString() : 'Vĩnh viễn'}
                           </p>
                           {isUrgent && <span className="text-[7px] font-black text-red-600 uppercase">Renew Soon!</span>}
                        </td>
                        <td className="p-6">
                           <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                             cert.status === 'ACTIVE' ? 'bg-green-600/10 border-green-500 text-green-500' :
                             cert.status === 'EXPIRED' ? 'bg-red-600/10 border-red-500 text-red-500' :
                             'bg-amber-600/10 border-amber-500 text-amber-500'
                           }`}>
                             {cert.status}
                           </span>
                        </td>
                        <td className="p-6 text-right">
                           <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              {/* 134: Fix: status PENDING is now part of the union type, comparison is valid */}
                              {cert.status !== 'PENDING' && (
                                <button onClick={() => handleRenew(cert.id)} className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[8px] font-black uppercase hover:bg-amber-500 hover:text-black">Renew</button>
                              )}
                              <button className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[8px] font-black uppercase hover:text-white">Verify</button>
                           </div>
                        </td>
                      </tr>
                    );
                  })}
               </tbody>
            </table>
          </div>
        </div>

        {/* SIDEBAR: ADVISOR & RULES */}
        <div className="space-y-8">
           <div className="ai-panel p-8 bg-amber-500/[0.03] border-amber-500/20">
              <div className="flex items-center gap-4 mb-6">
                 <AIAvatar personaId={PersonaID.KRIS} size="sm" isThinking={false} />
                 <h4 className="text-sm font-black text-amber-500 uppercase tracking-widest">Kris - Cert Guard</h4>
              </div>
              <p className="text-[11px] text-gray-400 italic leading-relaxed font-light">
                 "Thưa Anh Natt, hệ thống Cron Job đã quét toàn bộ Shard chứng chỉ. Mọi chứng chỉ kim cương GIA nhập khẩu đều được đối soát với **Customs Ledger**. Lưu ý các chứng chỉ PNJ Lab nội bộ cần được verify lại chữ ký số của chuyên viên giám định."
              </p>
           </div>

           <div className="ai-panel p-8 bg-black border-white/5">
              <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-6">Quy tắc Gia hạn</h4>
              <ul className="text-[10px] text-gray-500 space-y-4 list-disc list-inside italic font-light">
                 <li>Tự động thông báo qua Email Hub trước <strong>30 ngày</strong>.</li>
                 <li>Mọi bản gia hạn phải được định danh <strong>MASTER_NATT</strong> ký duyệt.</li>
                 <li>Bản cũ sẽ được băm vào Shard **ARCHIVED** và không thể sửa đổi.</li>
              </ul>
           </div>
        </div>

      </div>
    </div>
  );
};

export default CertificationManager;
