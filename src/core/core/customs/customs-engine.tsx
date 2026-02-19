
import React, { useState, useRef } from 'react';
// 🛠️ Fixed: Import casing for Types
import { CustomsDeclaration, CustomsDeclarationItem, PersonaID, ActionPlan } from '@/types';
import { CustomsRobotEngine } from '@/services/customsservice';
import { NotifyBus } from '@/services/notificationservice';

type ExtendedDeclaration = CustomsDeclaration & { actionPlans: ActionPlan[] };

const CustomsIntelligence: React.FC = () => {
  const [declarations, setDeclarations] = useState<ExtendedDeclaration[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [humanMode, setHumanMode] = useState(true);
  const [activeGroup, setActiveGroup] = useState<number>(3); // Mặc định hiển thị tab Đặc tính (GEM)
  const [selectedDecl, setSelectedDecl] = useState<ExtendedDeclaration | null>(null); // Để xem chi tiết Timeline/Compliance
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    NotifyBus.push({
      type: 'NEWS',
      title: 'Customs Robot: Kích hoạt Shard',
      content: `Bắt đầu bóc tách ${files.length} tờ khai. Logic: ImportDeclarationParser v2.0`,
      persona: PersonaID.THIEN
    });

    try {
      const results = await CustomsRobotEngine.batchProcess(Array.from(files));
      setDeclarations(prev => [...results, ...prev]);
      if (results.length > 0) setSelectedDecl(results[0]); // Auto select first new one
      
      const highPriorityActions = results.flatMap(r => r.actionPlans).filter(a => a.priority === 'URGENT').length;
      
      NotifyBus.push({
        type: highPriorityActions > 0 ? 'RISK' : 'SUCCESS',
        title: 'Phân tích Hoàn tất',
        content: `Đã niêm phong ${results.length} tờ khai. Phát hiện ${highPriorityActions} rủi ro khẩn cấp.`,
        persona: PersonaID.THIEN
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const groups = [
    { id: 1, name: "I. ĐỊNH DANH & HÀNH ĐỘNG", cols: ["Số TK / Luồng", "Đề xuất xử lý (AI Action)", "Bộ phận thực thi"] },
    { id: 2, name: "II. DÒNG HÀNG CHI TIẾT", cols: ["STT", "Mã HS", "Mô tả", "Validation"] },
    { id: 3, name: "III. ĐẶC TÍNH (GEM - 4C)", cols: ["Loại", "Shape", "Color / Clarity", "Weight (CT)", "GIA Certificate"] },
    { id: 9, name: "IX. THUẾ GTGT", cols: ["Trị giá tính thuế", "Thuế suất", "Tiền thuế"] },
  ];

  return (
    <div className="p-8 max-w-[1800px] mx-auto h-full overflow-y-auto space-y-8 animate-in fade-in duration-700 pb-40 no-scrollbar">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded uppercase tracking-tighter shadow-lg shadow-blue-500/20">Customs Robot v3.0</span>
            <h2 className="text-4xl font-serif gold-gradient italic tracking-tighter">Customs Intelligence</h2>
          </div>
          <p className="text-gray-400 font-light italic">Hệ thống bóc tách Tờ khai & Kim cương (GIA Integration) • Risk & Compliance Check</p>
        </div>
        <div className="flex items-center gap-6">
           <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-10 h-5 rounded-full transition-all relative ${humanMode ? 'bg-amber-500' : 'bg-white/10'}`} onClick={() => setHumanMode(!humanMode)}>
                 <div className={`absolute top-1 w-3 h-3 rounded-full bg-black transition-all ${humanMode ? 'left-6' : 'left-1'}`}></div>
              </div>
              <span className="text-[10px] font-black text-gray-500 group-hover:text-white uppercase tracking-widest">Human-Mode</span>
           </label>
           <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleUpload} accept=".xlsx,.xls,.pdf" />
           <button 
             onClick={() => fileInputRef.current?.click()}
             disabled={isProcessing}
             className="px-10 py-4 bg-amber-500 text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-amber-400 shadow-xl active:scale-95 disabled:opacity-30"
           >
             {isProcessing ? '⌛ ANALYZING...' : '🚀 NẠP BATCH TỜ KHAI'}
           </button>
        </div>
      </header>

      {/* DASHBOARD ANALYTICS (When a declaration is selected) */}
      {selectedDecl && selectedDecl.riskAssessment && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in slide-in-from-top-4">
           {/* 1. RISK GAUGE */}
           <div className={`ai-panel p-8 border rounded-[2.5rem] relative overflow-hidden ${
              selectedDecl.riskAssessment.level === 'CRITICAL' ? 'bg-red-950/10 border-red-500/50' : 
              selectedDecl.riskAssessment.level === 'HIGH' ? 'bg-amber-950/10 border-amber-500/50' : 
              'bg-blue-950/10 border-blue-500/50'
           }`}>
              <h3 className="text-sm font-black uppercase tracking-widest mb-6">Đánh giá Rủi ro (AI Risk Score)</h3>
              <div className="flex items-center gap-8">
                 <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                       <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                       <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" 
                          strokeDasharray={351.86} 
                          strokeDashoffset={351.86 - (351.86 * selectedDecl.riskAssessment.score) / 100}
                          className={selectedDecl.riskAssessment.level === 'CRITICAL' ? 'text-red-500' : selectedDecl.riskAssessment.level === 'HIGH' ? 'text-amber-500' : 'text-blue-500'} 
                       />
                    </svg>
                    <span className="absolute text-3xl font-mono font-black">{selectedDecl.riskAssessment.score}</span>
                 </div>
                 <div className="space-y-2 flex-1">
                    {selectedDecl.riskAssessment.factors.map((f, i) => (
                       <div key={i} className="flex justify-between items-center text-[10px] bg-black/40 p-2 rounded-lg border border-white/5">
                          <span className="text-gray-300">{f.description}</span>
                          <span className="text-red-400 font-bold">+{f.weight}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* 2. TIMELINE TRACKER */}
           <div className="xl:col-span-2 ai-panel p-8 bg-black/40 border-white/10 relative">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Lộ trình Thông quan (Tracking)</h3>
              <div className="flex items-center justify-between relative px-4">
                 <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10"></div>
                 {selectedDecl.trackingTimeline?.map((step, i) => (
                    <div key={step.id} className="flex flex-col items-center gap-3">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-[10px] font-black z-10 bg-black ${
                          step.status === 'COMPLETED' ? 'border-green-500 text-green-500' :
                          step.status === 'PROCESSING' ? 'border-amber-500 text-amber-500 animate-pulse' :
                          'border-gray-700 text-gray-700'
                       }`}>
                          {i + 1}
                       </div>
                       <div className="text-center">
                          <p className={`text-[10px] font-bold uppercase ${step.status === 'COMPLETED' ? 'text-white' : 'text-gray-600'}`}>{step.label}</p>
                          <p className="text-[8px] text-gray-500 italic mt-1">{step.location || step.notes || ''}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {isProcessing && (
        <div className="glass p-12 rounded-[4rem] border border-amber-500/30 bg-amber-500/5 relative overflow-hidden animate-pulse">
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center space-x-8">
               <div className="w-16 h-16 rounded-3xl bg-amber-500/20 flex items-center justify-center text-3xl">🧠</div>
               <div>
                  <p className="text-[11px] text-gray-500 uppercase font-black tracking-[0.3em] mb-2">Neural Analysis in Progress</p>
                  <p className="text-2xl font-bold text-amber-500">Đang quét Regex Kim cương & Mã HS & Trade Rules...</p>
               </div>
            </div>
            <div className="flex gap-2">
               {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: `${i*200}ms`}}></div>)}
            </div>
          </div>
        </div>
      )}

      {declarations.length > 0 && (
        <div className="space-y-8 animate-in slide-in-from-bottom-6">
           <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {groups.map(g => (
                <button 
                  key={g.id} 
                  onClick={() => setActiveGroup(g.id)}
                  className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeGroup === g.id ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-gray-500 border-white/5 hover:text-white'}`}
                >
                  {g.name}
                </button>
              ))}
           </div>

           <div className="ai-panel p-10 bg-black/40 border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.02] text-[150px] font-serif italic select-none">SHARD</div>
              <div className="overflow-x-auto no-scrollbar">
                 <table className="w-full text-left text-[11px] border-collapse min-w-[1200px]">
                    <thead>
                       <tr className="text-gray-500 uppercase font-black tracking-widest border-b border-white/10 pb-6">
                          {activeGroup === 1 ? (
                             <>
                                <th className="p-6">Số Tờ Khai / Luồng</th>
                                <th className="p-6">Đề xuất xử lý (AI Action Plan)</th>
                                <th className="p-6">Bộ phận thực thi</th>
                                <th className="p-6 text-right">Thao tác</th>
                             </>
                          ) : (
                             <>
                                <th className="p-6">Tờ khai</th>
                                {groups.find(g => g.id === activeGroup)?.cols.map((col, i) => <th key={i} className="p-6">{col}</th>)}
                             </>
                          )}
                       </tr>
                    </thead>
                    <tbody className="text-gray-300">
                       {declarations.map((dec, idx) => (
                         <React.Fragment key={idx}>
                            {activeGroup === 1 ? (
                               <tr 
                                 className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer ${selectedDecl?.header.declarationNumber === dec.header.declarationNumber ? 'bg-white/[0.05]' : ''}`}
                                 onClick={() => setSelectedDecl(dec)}
                               >
                                  <td className="p-6 align-top">
                                     <p className="text-white font-bold text-sm">{dec.header.declarationNumber}</p>
                                     <div className="mt-2 flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${dec.header.streamCode === 'RED' ? 'bg-red-500 animate-pulse' : dec.header.streamCode === 'YELLOW' ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                                        <span className={`text-[9px] font-black uppercase ${dec.header.streamCode === 'RED' ? 'text-red-500' : dec.header.streamCode === 'YELLOW' ? 'text-amber-500' : 'text-green-500'}`}>Luồng {dec.header.streamCode}</span>
                                     </div>
                                     {dec.compliance && !dec.compliance.isCompliant && (
                                        <span className="block mt-2 text-[8px] bg-red-900/50 text-red-300 px-2 py-1 rounded border border-red-500/30">⚠️ VI PHẠM TUÂN THỦ</span>
                                     )}
                                  </td>
                                  <td className="p-6 align-top">
                                     <div className="space-y-3">
                                        {dec.actionPlans.map((plan, pIdx) => (
                                           <div key={pIdx} className="flex gap-3">
                                              <span className={`mt-0.5 px-2 py-0.5 rounded text-[7px] font-black uppercase h-fit ${
                                                 plan.priority === 'URGENT' ? 'bg-red-600 text-white' : 
                                                 plan.priority === 'HIGH' ? 'bg-amber-600 text-black' : 
                                                 'bg-white/10 text-gray-400'
                                              }`}>
                                                 {plan.priority}
                                              </span>
                                              <div>
                                                 <p className="text-white font-bold text-xs">{plan.action}</p>
                                                 <p className="text-[9px] text-gray-500 italic mt-0.5">{plan.reason}</p>
                                              </div>
                                           </div>
                                        ))}
                                     </div>
                                  </td>
                                  <td className="p-6 align-top">
                                     <div className="space-y-4">
                                        {dec.actionPlans.map((plan, pIdx) => (
                                           <div key={pIdx} className="h-8 flex items-center">
                                              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{plan.department}</span>
                                           </div>
                                        ))}
                                     </div>
                                  </td>
                                  <td className="p-6 text-right align-top">
                                     <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[8px] font-black uppercase hover:bg-indigo-500 transition-all shadow-lg active:scale-95">Kích hoạt Quy trình</button>
                                  </td>
                               </tr>
                            ) : (
                               dec.items.map((item, i) => (
                                 <tr key={i} className={`border-b border-white/5 hover:bg-white/[0.02] ${item.validationErrors?.length ? 'bg-red-900/10' : ''}`}>
                                    <td className="p-6 text-[9px] text-gray-500 font-mono">{dec.header.declarationNumber}</td>
                                    {activeGroup === 2 && (
                                      <>
                                         <td className="p-6 font-mono text-cyan-400 font-bold">{item.hsCode}</td>
                                         <td className="p-6 max-w-xs truncate italic">"{item.description}"</td>
                                         <td className="p-6">
                                            {item.validationErrors && item.validationErrors.length > 0 ? (
                                               <div className="flex flex-col gap-1">
                                                  {item.validationErrors.map((err, ei) => (
                                                     <span key={ei} className="text-[9px] text-red-400 font-bold uppercase">⚠️ {err}</span>
                                                  ))}
                                               </div>
                                            ) : <span className="text-green-500 text-[9px] font-black uppercase">✓ OK</span>}
                                         </td>
                                      </>
                                    )}
                                    {activeGroup === 3 && (
                                      <>
                                         <td className="p-6 font-black text-amber-500">{item.gemType}</td>
                                         <td className="p-6">{item.shape || '-'}</td>
                                         <td className="p-6">
                                            <span className="text-white font-bold">{item.color || '?'}</span> 
                                            <span className="mx-1 text-gray-600">/</span> 
                                            <span className="text-blue-400 font-bold">{item.clarity || '?'}</span>
                                         </td>
                                         <td className="p-6 font-mono font-black text-white">{item.weightCT ? `${item.weightCT} CT` : '-'}</td>
                                         <td className="p-6">
                                            {item.certNumber ? (
                                                <span className="text-cyan-400 font-mono font-bold bg-cyan-900/20 px-2 py-1 rounded">{item.certNumber}</span>
                                            ) : <span className="text-gray-600 italic">N/A</span>}
                                         </td>
                                      </>
                                    )}
                                    {activeGroup === 9 && (
                                      <>
                                         <td className="p-6 font-mono">{item.vatTaxableValue.toLocaleString()} đ</td>
                                         <td className="p-6 font-bold">{item.vatRate}%</td>
                                         <td className="p-6 font-mono font-black text-white">{item.vatAmount.toLocaleString()} đ</td>
                                      </>
                                    )}
                                 </tr>
                               ))
                            )}
                         </React.Fragment>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {declarations.length === 0 && !isProcessing && (
        <div className="py-48 text-center opacity-20 italic flex flex-col items-center">
           <div className="text-[140px] mb-10 grayscale">🚢</div>
           <p className="text-4xl font-serif uppercase tracking-[0.4em]">Customs Ledger Ready</p>
           <p className="text-xs mt-6 uppercase font-black text-amber-500 tracking-[0.2em]">Nạp tờ khai để Robot phân tích hành động & điều phối kho.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="glass p-10 rounded-[3rem] border border-amber-500/20 bg-amber-500/5 shadow-2xl">
            <h4 className="text-[10px] text-amber-500 font-black uppercase tracking-widest mb-6 flex items-center gap-3">
               Logic Phân Tích (Thiên)
            </h4>
            <p className="text-[13px] text-gray-400 italic leading-relaxed font-light">
              "Robot đã được nạp luật 3 tầng: 
              1. Luồng Đỏ &#x2192; Báo Pháp chế. 
              2. Mã HS 7102 &#x2192; Báo Phòng Kiểm định. 
              3. Thuế &gt; 500tr &#x2192; Báo CFO. 
              Mọi hành động đều được đề xuất tự động để Anh duyệt lệnh nhanh nhất."
            </p>
         </div>
         <div className="glass p-10 rounded-[3rem] border border-blue-500/20 bg-blue-500/5 shadow-2xl">
            <h4 className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-6">Xác thực rủi ro (Kris)</h4>
            <p className="text-[13px] text-gray-400 italic leading-relaxed font-light">
              "Thuật toán **Risk Assessment** đã quét 52 cột. Lưu ý các lô hàng có Risk Score &gt; 80 (CRITICAL). Vui lòng kiểm tra kỹ chứng từ nguồn gốc (C/O, Kimberley) trước khi thông quan."
            </p>
         </div>
      </div>
    </div>
  );
};

export default CustomsIntelligence;
