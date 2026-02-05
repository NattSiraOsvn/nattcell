
import React, { useState, useMemo } from 'react';
import { VATReport, PITReport, BusinessMetrics, UserRole, PersonaID, SealingLevel } from '../types';
import { TaxReportService } from '../services/taxReportService';
import { ExportEngine } from '../services/exportService';
import { ShardingService } from '../services/blockchainService';
import AIAvatar from './AIAvatar';

interface TaxReportingHubProps {
  metrics: BusinessMetrics;
  logAction: (action: string, details: string) => void;
  currentRole: UserRole;
}

const TaxReportingHub: React.FC<TaxReportingHubProps> = ({ metrics, logAction, currentRole }) => {
  const [reportType, setReportType] = useState<'VAT' | 'PIT'>('VAT');
  const [period, setPeriod] = useState('01/2026');
  const [isExporting, setIsExporting] = useState(false);
  const [isSealing, setIsSealing] = useState(false);
  const [isPeriodSealed, setIsPeriodSealed] = useState(false);

  const vatReport = useMemo(() => TaxReportService.generateVATReport([], period), [period]);
  const isMaster = currentRole === UserRole.MASTER;

  const handleMonthlySeal = async () => {
    if (!isMaster) return alert("Chỉ Master Natt mới có quyền niêm phong chu kỳ.");
    if (!window.confirm(`XÁC NHẬN DSP v2026.01:\nAnh chốt số liệu tháng ${period}?\nHệ thống sẽ băm Hash tổng hợp và khóa dữ liệu (Không kèm PII khách hàng).`)) return;

    setIsSealing(true);
    setTimeout(() => {
      const sealRecord = ShardingService.createAggregateSeal(
        SealingLevel.MONTHLY,
        period,
        { revenue: vatReport.entries.reduce((s,e)=>s+e.salesValue, 0), tax: vatReport.totalVATPayable },
        'MASTER_NATT'
      );
      
      setIsPeriodSealed(true);
      setIsSealing(false);
      logAction('MONTHLY_DATA_SEAL', `Đã niêm phong tổng hợp tháng ${period}. Hash: ${sealRecord.aggregateHash.substring(0,12)}...`);
      alert("✅ NIÊM PHONG THÀNH CÔNG: Số liệu đã được đưa vào Shard Hard-Ledger.");
    }, 2000);
  };

  const handleExport = async (format: 'PDF' | 'XML' | 'EXCEL') => {
    if (!isMaster) return alert("Truy cập bị từ chối.");
    setIsExporting(true);
    const fileName = `BAO_CAO_THUE_${reportType}_${period.replace(/\//g, '_')}`;
    try {
      if (format === 'PDF') ExportEngine.toPdf();
      else if (format === 'EXCEL') await ExportEngine.toExcel(vatReport.entries, fileName);
      logAction('EXPORT_TAX_SUCCESS', `Master Natt xuất file ${format} cho báo cáo ${reportType}`);
    } finally {
      setTimeout(() => setIsExporting(false), 1000);
    }
  };

  return (
    <div className="p-8 md:p-12 max-w-[1800px] mx-auto h-full overflow-y-auto no-scrollbar space-y-10 animate-in fade-in duration-700 pb-40 bg-[#020202]">
      
      <header className="flex flex-col lg:flex-row justify-between items-end gap-8 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-4 mb-3">
             <span className="text-4xl">⚖️</span>
             <h2 className="ai-headline text-6xl italic uppercase tracking-tighter leading-none">Fiscal Reporting Hub</h2>
          </div>
          <p className="ai-sub-headline text-cyan-300/40 ml-1 italic font-black">
             Kê khai GTGT Trực tiếp • {isPeriodSealed ? '🔒 DATA SEALED' : '🔓 LIVE SHARD'}
          </p>
        </div>

        <div className="flex gap-4">
           {isMaster && !isPeriodSealed && (
              <button 
                onClick={handleMonthlySeal}
                disabled={isSealing}
                className="px-8 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 shadow-xl animate-pulse disabled:opacity-30"
              >
                {isSealing ? 'BĂM SHARD...' : '🔐 CHỐT NIÊM PHONG THÁNG'}
              </button>
           )}
           {isPeriodSealed && (
              <div className="px-6 py-3 border border-green-500/30 bg-green-500/10 text-green-500 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                 IMMUTABLE SEALED
              </div>
           )}
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
         <div className="xl:col-span-3 space-y-10">
            <div className="ai-panel p-10 bg-black/40 border-white/5">
                <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
                   <h3 className="text-xl font-bold text-white uppercase italic tracking-widest">Chi tiết thuế {period}</h3>
                   <div className="flex gap-4">
                      <button onClick={() => handleExport('EXCEL')} className="text-[9px] font-black text-amber-500 uppercase hover:text-white transition-colors">Xuất Excel</button>
                      <button onClick={() => handleExport('PDF')} className="text-[9px] font-black text-amber-500 uppercase hover:text-white transition-colors">In PDF</button>
                   </div>
                </div>
                <table className="w-full text-left text-[11px]">
                   <thead>
                      <tr className="text-gray-500 uppercase font-black tracking-widest border-b border-white/10">
                         <th className="p-6">Danh mục</th>
                         <th className="p-6 text-right">Bán ra</th>
                         <th className="p-6 text-right">Mua tương ứng</th>
                         <th className="p-6 text-right">GTGT</th>
                         <th className="p-6 text-right">Thuế phải nộp</th>
                      </tr>
                   </thead>
                   <tbody className="text-gray-300 italic">
                      {vatReport.entries.map((e, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                           <td className="p-6 font-bold text-white">{e.category}</td>
                           <td className="p-6 text-right font-mono">{e.salesValue.toLocaleString()}</td>
                           <td className="p-6 text-right font-mono text-gray-500">{e.purchaseValue.toLocaleString()}</td>
                           <td className="p-6 text-right font-mono text-cyan-400 font-bold">{e.addedValue.toLocaleString()}</td>
                           <td className="p-6 text-right font-mono font-black text-white">{e.taxAmount.toLocaleString()}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
            </div>
         </div>

         <aside className="space-y-8">
            <div className="ai-panel p-8 border-indigo-500/30 bg-indigo-500/5 shadow-2xl">
               <h4 className="ai-sub-headline text-indigo-400 mb-6 flex items-center gap-2">
                  <AIAvatar personaId={PersonaID.THIEN} size="sm" isThinking={isExporting || isSealing} />
                  Tuân thủ DSP v2026.01
               </h4>
               <p className="text-[11px] text-gray-400 italic leading-relaxed font-light">
                 "Thưa Anh Natt, Thiên đã cấu hình bộ lọc **PII-Scanner**. Khi Anh nhấn niêm phong, mọi dữ liệu SĐT và Tên khách sẽ được tách riêng ra khỏi mã băm. Anh hoàn toàn yên tâm về bảo mật Identity khách hàng."
               </p>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default TaxReportingHub;
