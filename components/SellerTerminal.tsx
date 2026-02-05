
import React, { useState, useMemo, useEffect } from 'react';
import { UserRole, UserPosition, PositionType, SellerReport, SellerIdentity, CustomerLead, PersonaID } from '../types';
import { SellerEngine } from '../services/sellerEngine';
import { NotifyBus } from '../services/notificationService';
import AIAvatar from './AIAvatar';
import { generatePersonaResponse } from '../services/geminiService';

interface SellerTerminalProps {
  currentRole: UserRole;
  currentPosition: UserPosition;
  logAction: (action: string, details: string) => void;
}

const SellerTerminal: React.FC<SellerTerminalProps> = ({ currentRole, currentPosition, logAction }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'order_engine' | 'manager_hub' | 'hidebox'>('dashboard');
  const [reports, setReports] = useState<SellerReport[]>([]);
  const [leads, setLeads] = useState<CustomerLead[]>([
     { id: 'L-001', name: 'NGUYỄN VĂN A', phone: '0901234567', source: 'Facebook Ads', ownerId: 'S-007', assignedDate: Date.now() - (10 * 86400000), expiryDate: Date.now() + (80 * 86400000), status: 'WARM', lastInteraction: Date.now() },
     { id: 'L-002', name: 'TRẦN THỊ B', phone: '0918888999', source: 'Giới thiệu', ownerId: 'S-007', assignedDate: Date.now() - (85 * 86400000), expiryDate: Date.now() + (5 * 86400000), status: 'HOT', lastInteraction: Date.now() - 86400000 },
     { id: 'L-003', name: 'LÊ VĂN C', phone: '0909000111', source: 'Zalo', ownerId: 'S-007', assignedDate: Date.now() - (70 * 86400000), expiryDate: Date.now() + (20 * 86400000), status: 'COLD', lastInteraction: Date.now() - (8 * 86400000) } // Inactive > 7 days
  ]);
  
  // Identity Setup
  const [me] = useState<SellerIdentity>({
    userId: 'S-007',
    /* Fix: currentPosition is an object, compare its role property with PositionType enum */
    fullName: currentPosition.role === PositionType.COLLABORATOR ? 'CTV Nguyễn Văn A' : 'Seller Lê Trọng Khôi',
    stars: 4,
    kpiPoints: 105, // > 100 means bonus multiplier
    violations: 0,
    role: currentRole,
    position: currentPosition,
    /* Fix: compare currentPosition.role property */
    isCollaborator: currentPosition.role === PositionType.COLLABORATOR,
    department: 'KINH_DOANH',
    gatekeeperBalance: 500000
  });

  // Commission Simulator State
  const [formData, setFormData] = useState({
    customer: '',
    phone: '',
    sku: '',
    shellVal: 0,
    stoneVal: 0,
    stoneType: 'NONE' as any
  });
  const [simulatedComm, setSimulatedComm] = useState<any>(null);

  const [hideBoxMsg, setHideBoxMsg] = useState('');
  const isManager = currentRole === UserRole.LEVEL_2 || currentRole === UserRole.LEVEL_3;

  useEffect(() => {
    // Real-time calculation when form changes
    if (formData.shellVal > 0 || formData.stoneVal > 0) {
      const comm = SellerEngine.calculateCommission({
        shellRevenue: formData.shellVal,
        stoneRevenue: formData.stoneVal,
        stoneType: formData.stoneType,
        isReportedWithin24h: true // Assume simulator is optimal
      }, me.kpiPoints);
      setSimulatedComm(comm);
    } else {
      setSimulatedComm(null);
    }
  }, [formData, me.kpiPoints]);

  const handleSubmitReport = () => {
    const commission = SellerEngine.calculateCommission({
      shellRevenue: formData.shellVal,
      stoneRevenue: formData.stoneVal,
      stoneType: formData.stoneType,
      isReportedWithin24h: SellerEngine.check24hRule(Date.now())
    }, me.kpiPoints);

    const newReport: SellerReport = {
      id: `REP-${Date.now()}`,
      sellerId: me.userId,
      sellerName: me.fullName,
      customerName: formData.customer,
      customerPhone: formData.phone,
      productSku: formData.sku,
      shellRevenue: formData.shellVal,
      stoneRevenue: formData.stoneVal,
      stoneType: formData.stoneType,
      depositAmount: 0,
      isReportedWithin24h: SellerEngine.check24hRule(Date.now()),
      status: 'PENDING',
      documents: {},
      commission,
      timestamp: Date.now()
    };

    setReports([newReport, ...reports]);
    logAction('SELLER_REPORT_SUBMIT', `Báo cáo đơn ${formData.sku} - Hoa hồng: ${commission.total.toLocaleString()}đ`);
    
    // Cập nhật Lead status nếu khớp SĐT
    const lead = leads.find(l => l.phone === formData.phone);
    if (lead) {
       setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: 'CONVERTED' } : l));
    }

    setActiveTab('dashboard');
    NotifyBus.push({ type: 'SUCCESS', title: 'Đã ghi nhận đơn hàng', content: `Hoa hồng tạm tính: ${commission.total.toLocaleString()} đ`, persona: PersonaID.CAN });
  };

  const handlePhieuSuggestion = async () => {
    alert("Phiêu đang phân tích dữ liệu thị trường để gợi ý Lead tiềm năng...");
    // Mock logic
    setTimeout(() => {
       const newLead: CustomerLead = {
          id: `L-AI-${Date.now()}`,
          name: 'KHÁCH HÀNG TIỀM NĂNG (AI)',
          phone: '09xxxxxxxxx',
          source: 'Phiêu Suggestion',
          ownerId: me.userId,
          assignedDate: Date.now(),
          expiryDate: Date.now() + (90 * 86400000),
          status: 'WARM',
          lastInteraction: Date.now()
       };
       setLeads([newLead, ...leads]);
       NotifyBus.push({ type: 'NEWS', title: 'Phiêu: New Lead', content: 'Đã phân bổ 01 Lead từ kho chung cho bạn.', persona: PersonaID.PHIEU });
    }, 1500);
  };

  const totalCommission = useMemo(() => reports.reduce((s, r) => s + r.commission.total, 0), [reports]);

  return (
    <div className="h-full flex flex-col bg-[#050505] p-8 md:p-12 overflow-y-auto no-scrollbar gap-10 animate-in fade-in duration-700 pb-32">
      
      {/* HEADER: IDENTITY & STATUS */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-4 mb-2">
             <span className="text-4xl">💼</span>
             <h2 className="ai-headline text-5xl italic uppercase tracking-tighter">
               {me.isCollaborator ? 'CTV HUB' : 'SELLER TERMINAL'}
             </h2>
          </div>
          <p className="ai-sub-headline text-indigo-300/40 mt-1 italic uppercase font-black tracking-[0.3em]">
             {me.isCollaborator ? 'Cộng tác viên (0 Lương cứng) • Hoa hồng 100%' : 'Nhân viên kinh doanh • Lương cứng + Hoa hồng'}
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="ai-panel px-6 py-3 border-amber-500/20 bg-amber-500/5 text-center">
              <p className="text-[8px] text-amber-500 font-black uppercase mb-1">Xếp hạng Node</p>
              <div className="flex gap-1 justify-center">
                 {Array.from({ length: me.stars }).map((_, i) => <span key={i} className="text-xs">⭐</span>)}
              </div>
              <p className="text-[9px] text-gray-500 mt-1 font-mono">{me.kpiPoints} KPI pts (x{(1 + (me.kpiPoints - 100)/100 * 0.5).toFixed(2)})</p>
           </div>
           <div className="ai-panel px-6 py-3 border-green-500/20 bg-green-500/5 text-center">
              <p className="text-[8px] text-green-400 font-black uppercase mb-1">Thu nhập (Commission)</p>
              <p className="text-xl font-mono font-black text-white">{totalCommission.toLocaleString()} <span className="text-xs">đ</span></p>
           </div>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 w-fit shrink-0 overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('dashboard')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>Tổng quan & Thu nhập</button>
        <button onClick={() => setActiveTab('leads')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === 'leads' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Timeline Lead (90 Ngày)</button>
        <button onClick={() => setActiveTab('order_engine')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === 'order_engine' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Tạo Đơn & Tính HH</button>
        {isManager && <button onClick={() => setActiveTab('manager_hub')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === 'manager_hub' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Quản Lý Team</button>}
        <button onClick={() => setActiveTab('hidebox')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === 'hidebox' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>HideBox (Ẩn danh)</button>
      </nav>

      <main className="flex-1">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="ai-panel p-8 bg-green-500/5 border-green-500/20">
                   <p className="ai-sub-headline text-green-400">HH Vỏ (5%)</p>
                   <p className="text-3xl font-mono font-black text-white mt-2">{(reports.reduce((s, r) => s + r.commission.shell, 0)).toLocaleString()} <span className="text-xs">đ</span></p>
                </div>
                <div className="ai-panel p-8 bg-blue-500/5 border-blue-500/20">
                   <p className="ai-sub-headline text-blue-400">HH Viên (2-5%)</p>
                   <p className="text-3xl font-mono font-black text-white mt-2">{(reports.reduce((s, r) => s + r.commission.stone, 0)).toLocaleString()} <span className="text-xs">đ</span></p>
                </div>
                <div className="ai-panel p-8 bg-amber-500/10 border-amber-500/20 md:col-span-2 relative overflow-hidden">
                   <div className="relative z-10">
                      <p className="ai-sub-headline text-amber-500">Tổng thực lãnh (Sau Gatekeeper)</p>
                      <p className="text-4xl font-mono font-black text-white mt-2">{totalCommission.toLocaleString()} <span className="text-xs">VND</span></p>
                      {me.isCollaborator && <p className="text-[9px] text-gray-500 italic mt-2">*CTV: Thu nhập = 100% Hoa hồng.</p>}
                   </div>
                   <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">💰</div>
                </div>
             </div>

             <div className="ai-panel overflow-hidden border-white/5 bg-black/20">
                <div className="p-6 border-b border-white/5 flex justify-between">
                   <h3 className="text-sm font-bold text-white uppercase tracking-widest">Lịch sử đơn hàng & Hoa hồng</h3>
                </div>
                <table className="w-full text-left text-[11px]">
                   <thead>
                      <tr className="ai-sub-headline text-white/40 border-b border-white/10 bg-white/5">
                         <th className="p-6">Thời gian</th>
                         <th className="p-6">Sản phẩm</th>
                         <th className="p-6 text-right">Doanh thu</th>
                         <th className="p-6 text-right text-amber-500">Hoa hồng</th>
                         <th className="p-6 text-center">Trạng thái</th>
                      </tr>
                   </thead>
                   <tbody className="text-gray-300">
                      {reports.map(r => (
                        <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                           <td className="p-6 font-mono text-[10px] opacity-60 italic">{new Date(r.timestamp).toLocaleString()}</td>
                           <td className="p-6 font-bold text-white uppercase">{r.productSku}</td>
                           <td className="p-6 text-right font-mono">{(r.shellRevenue + r.stoneRevenue).toLocaleString()} đ</td>
                           <td className="p-6 text-right font-mono font-black text-amber-500">{(r.commission.total).toLocaleString()} đ</td>
                           <td className="p-6 text-center">
                              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase text-gray-500">{r.status}</span>
                           </td>
                        </tr>
                      ))}
                      {reports.length === 0 && (
                        <tr>
                           <td colSpan={5} className="py-32 text-center opacity-10">
                              <p className="text-6xl mb-6">🧾</p>
                              <p className="text-2xl font-serif italic uppercase tracking-widest">Chưa có giao dịch trong kỳ</p>
                           </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {/* LEAD MANAGEMENT TAB (TIMELINE) */}
        {activeTab === 'leads' && (
           <div className="space-y-8 animate-in slide-in-from-right-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2 ai-panel overflow-hidden border-white/5 bg-black/40">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                       <h3 className="text-sm font-bold text-white uppercase tracking-widest">Timeline Khách hàng (Sở hữu 90 ngày)</h3>
                       <div className="flex gap-2">
                          <button onClick={handlePhieuSuggestion} className="px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 text-[9px] font-black uppercase rounded-lg hover:bg-purple-600 hover:text-white flex items-center gap-2">
                             <span>🤖</span> Phiêu Suggest
                          </button>
                          <button className="px-4 py-2 bg-blue-600 text-white text-[9px] font-black uppercase rounded-lg hover:bg-blue-500">+ Thêm Lead</button>
                       </div>
                    </div>
                    <table className="w-full text-left text-[11px]">
                       <thead>
                          <tr className="text-gray-500 font-black uppercase tracking-widest border-b border-white/10 bg-white/5">
                             <th className="p-6">Khách hàng</th>
                             <th className="p-6">Trạng thái</th>
                             <th className="p-6">Rủi ro (7 ngày)</th>
                             <th className="p-6">Sở hữu (90 ngày)</th>
                             <th className="p-6 text-right">Tương tác</th>
                          </tr>
                       </thead>
                       <tbody className="text-gray-300">
                          {leads.map(lead => {
                             const daysLeft = Math.ceil((lead.expiryDate - Date.now()) / (1000 * 60 * 60 * 24));
                             const inactiveDays = Math.floor((Date.now() - lead.lastInteraction) / (1000 * 60 * 60 * 24));
                             const isInactiveRisk = inactiveDays > 5; // Cảnh báo nếu > 5 ngày ko tương tác
                             const isReclaimed = SellerEngine.isLeadInactive(lead.lastInteraction);

                             return (
                               <tr key={lead.id} className={`border-b border-white/5 transition-colors ${isReclaimed ? 'opacity-40 bg-red-900/10' : 'hover:bg-white/[0.03]'}`}>
                                  <td className="p-6">
                                     <p className="font-bold text-white uppercase">{lead.name}</p>
                                     <p className="text-[9px] text-gray-500 font-mono mt-1">{lead.phone}</p>
                                  </td>
                                  <td className="p-6">
                                     <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${
                                        lead.status === 'HOT' ? 'bg-red-500/20 text-red-500' :
                                        lead.status === 'CONVERTED' ? 'bg-green-500/20 text-green-500' : 
                                        isReclaimed ? 'bg-gray-500/20 text-gray-500' : 'bg-blue-500/20 text-blue-400'
                                     }`}>{isReclaimed ? 'RECLAIMED' : lead.status}</span>
                                  </td>
                                  <td className="p-6">
                                     <p className={`font-mono font-bold ${isInactiveRisk ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
                                        {inactiveDays} ngày im lặng
                                     </p>
                                     <div className="w-full bg-white/10 h-1 mt-1 rounded-full overflow-hidden">
                                        <div className={`h-full ${isInactiveRisk ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${Math.min(100, (inactiveDays/7)*100)}%`}}></div>
                                     </div>
                                  </td>
                                  <td className="p-6">
                                     <p className="font-mono text-white">{daysLeft} ngày còn lại</p>
                                  </td>
                                  <td className="p-6 text-right">
                                     {!isReclaimed && <button className="text-cyan-400 hover:underline text-[9px] font-black uppercase">Cập nhật</button>}
                                  </td>
                               </tr>
                             );
                          })}
                       </tbody>
                    </table>
                 </div>
                 
                 <div className="space-y-8">
                    <div className="ai-panel p-8 bg-amber-500/5 border-amber-500/20">
                       <h4 className="ai-sub-headline text-amber-500 mb-4 flex items-center gap-2">
                          <AIAvatar personaId={PersonaID.CAN} size="sm" />
                          Quy tắc Sở hữu (Điều 9)
                       </h4>
                       <ul className="text-[11px] text-gray-400 space-y-3 italic list-disc list-inside leading-relaxed">
                          <li>Lead được bảo vệ trong <strong>90 ngày</strong> kể từ ngày gán.</li>
                          <li><span className="text-red-400 font-bold">CẢNH BÁO:</span> Nếu không có tương tác (Call/Meeting) trong <strong>07 ngày</strong>, Lead sẽ bị thu hồi tự động về kho chung.</li>
                          <li>Đơn hàng phát sinh trong thời hạn sở hữu sẽ tự động tính hoa hồng cho người nắm giữ.</li>
                       </ul>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* ORDER ENGINE TAB (CALCULATOR) */}
        {activeTab === 'order_engine' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in slide-in-from-bottom-6">
             <div className="lg:col-span-2 ai-panel p-10 space-y-8 bg-black/40 border-white/10">
                <h3 className="text-2xl font-bold italic border-b border-white/5 pb-6 uppercase tracking-tighter flex justify-between items-center">
                   <span>Commission Simulator v2.0</span>
                   {simulatedComm && <span className="text-xs bg-green-500 text-black px-3 py-1 rounded font-black uppercase">Live Preview</span>}
                </h3>
                
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <p className="ai-sub-headline ml-1">Tên Khách hàng</p>
                      <input type="text" onChange={e => setFormData({...formData, customer: e.target.value})} className="w-full bg-black/60 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-cyan-500 transition-all text-xs font-bold uppercase" placeholder="NGUYỄN VĂN B" />
                   </div>
                   <div className="space-y-2">
                      <p className="ai-sub-headline ml-1">Mã Sản Phẩm (SKU)</p>
                      <input type="text" onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full bg-black/60 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-cyan-500 transition-all font-mono text-xs" placeholder="NNA-ROLEX-01" />
                   </div>
                   <div className="space-y-2">
                      <p className="ai-sub-headline ml-1">Doanh thu Vỏ (VNĐ)</p>
                      <input type="number" onChange={e => setFormData({...formData, shellVal: Number(e.target.value)})} className="w-full bg-black/60 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-amber-500 transition-all font-mono text-lg" placeholder="0" />
                   </div>
                   <div className="space-y-2">
                      <p className="ai-sub-headline ml-1">Phân loại Đá (Quyết định % HH)</p>
                      <select onChange={e => setFormData({...formData, stoneType: e.target.value as any})} className="w-full bg-black/60 border border-white/10 p-5 rounded-2xl text-white outline-none appearance-none cursor-pointer text-xs font-black">
                         <option value="NONE">Không có viên chủ</option>
                         <option value="UNDER_4LY">Viên dưới 4 ly (5% HH)</option>
                         <option value="ROUND_OVER_4LY">Tròn trên 4 ly (2% HH)</option>
                         <option value="FANCY_SHAPE">Fancy Shape (3% HH)</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <p className="ai-sub-headline ml-1">Doanh thu Viên (VNĐ)</p>
                      <input type="number" onChange={e => setFormData({...formData, stoneVal: Number(e.target.value)})} className="w-full bg-black/60 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-amber-500 transition-all font-mono text-lg" placeholder="0" />
                   </div>
                   <div className="space-y-2 flex flex-col justify-end">
                      <button onClick={handleSubmitReport} className="w-full py-5 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl hover:bg-indigo-500 shadow-2xl transition-all">CHỐT ĐƠN & GHI NHẬN</button>
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                {simulatedComm ? (
                   <div className="ai-panel p-8 border-green-500/30 bg-green-500/5 shadow-2xl space-y-6">
                      <h4 className="ai-sub-headline text-green-500 mb-2 flex items-center gap-2">
                         <span className="text-xl">💰</span> Dự báo Hoa hồng
                      </h4>
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-2 text-[11px] text-gray-300">
                         <div className="flex justify-between"><span>HH Vỏ (5%):</span> <span className="font-mono">{simulatedComm.shell.toLocaleString()} đ</span></div>
                         <div className="flex justify-between"><span>HH Đá:</span> <span className="font-mono">{simulatedComm.stone.toLocaleString()} đ</span></div>
                         <div className="flex justify-between text-amber-500"><span>Hệ số KPI ({simulatedComm.kpiFactor}x):</span> <span className="font-mono font-bold">+{(simulatedComm.total - (simulatedComm.shell+simulatedComm.stone)).toLocaleString()} đ</span></div>
                         <div className="pt-2 border-t border-white/10 flex justify-between text-white font-bold text-lg"><span>TỔNG:</span> <span>{simulatedComm.total.toLocaleString()} đ</span></div>
                      </div>
                      <p className="text-[10px] text-gray-500 italic text-center">{simulatedComm.baseRate}</p>
                   </div>
                ) : (
                   <div className="ai-panel p-8 border-white/5 bg-black/20 flex flex-col items-center justify-center text-center opacity-40 h-64">
                      <p className="text-4xl mb-4">🧮</p>
                      <p className="text-xs font-black uppercase tracking-widest">Nhập số liệu để mô phỏng thu nhập</p>
                   </div>
                )}

                <div className="ai-panel p-8 border-red-500/30 bg-red-500/5 shadow-2xl">
                   <h4 className="ai-sub-headline text-red-500 mb-6 flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                      Cảnh báo Gatekeeper
                   </h4>
                   <p className="text-[13px] text-gray-300 italic leading-relaxed font-light">
                     "Anh {me.fullName} lưu ý: Đơn hàng phải được báo cáo trước 23h59 cùng ngày. Nếu trễ, 10% hoa hồng sẽ bị cắt vào quỹ chung."
                   </p>
                </div>
             </div>
          </div>
        )}

        {/* MANAGER HUB (NEW) */}
        {activeTab === 'manager_hub' && isManager && (
           <div className="space-y-8 animate-in slide-in-from-right-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="ai-panel p-8 bg-purple-500/5 border-purple-500/20">
                    <p className="ai-sub-headline text-purple-400">Team Revenue</p>
                    <p className="text-3xl font-mono font-black text-white mt-2">12.5 <span className="text-xs">Tỷ VND</span></p>
                 </div>
                 <div className="ai-panel p-8 bg-pink-500/5 border-pink-500/20">
                    <p className="ai-sub-headline text-pink-400">Pending Commissions</p>
                    <p className="text-3xl font-mono font-black text-white mt-2">12 <span className="text-xs">Yêu cầu</span></p>
                 </div>
                 <div className="ai-panel p-8 bg-indigo-500/5 border-indigo-500/20">
                    <p className="ai-sub-headline text-indigo-400">Lead Conversion</p>
                    <p className="text-3xl font-mono font-black text-white mt-2">32.5%</p>
                 </div>
              </div>
              
              <div className="ai-panel overflow-hidden border-white/5 bg-black/40">
                 <div className="p-6 border-b border-white/5">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Duyệt Hoa hồng Team</h3>
                 </div>
                 <table className="w-full text-left text-[11px]">
                    <thead>
                       <tr className="text-gray-500 font-black uppercase tracking-widest border-b border-white/10 bg-white/5">
                          <th className="p-6">Seller</th>
                          <th className="p-6">Đơn hàng</th>
                          <th className="p-6 text-right">Doanh thu</th>
                          <th className="p-6 text-right">Hoa hồng đề xuất</th>
                          <th className="p-6 text-right">Thao tác</th>
                       </tr>
                    </thead>
                    <tbody className="text-gray-300">
                       <tr className="border-b border-white/5">
                          <td className="p-6">NGUYỄN VĂN A (CTV)</td>
                          <td className="p-6">NNA-ROLEX-01</td>
                          <td className="p-6 text-right font-mono">250,000,000</td>
                          <td className="p-6 text-right font-mono text-amber-500">12,500,000</td>
                          <td className="p-6 text-right">
                             <button className="px-3 py-1 bg-green-600 text-white rounded text-[9px] font-black uppercase hover:bg-green-500">DUYỆT</button>
                          </td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </div>
        )}

        {/* HIDEBOX TAB */}
        {activeTab === 'hidebox' && (
           <div className="flex flex-col items-center justify-center h-full animate-in zoom-in-95">
              <div className="w-full max-w-2xl ai-panel p-12 bg-black border-white/10 relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl">🕵️</div>
                 <h3 className="text-3xl font-serif gold-gradient italic uppercase tracking-tighter mb-4">HideBox - Kênh Ẩn Danh</h3>
                 <p className="text-xs text-gray-500 italic mb-10 leading-relaxed max-w-lg">
                    "Mọi phản hồi tại đây đều được mã hóa và gửi trực tiếp tới Ban Kiểm Soát mà không kèm theo định danh của bạn. Hãy chia sẻ thẳng thắn vì sự phát triển chung."
                 </p>
                 <textarea 
                   value={hideBoxMsg}
                   onChange={e => setHideBoxMsg(e.target.value)}
                   className="w-full h-40 bg-white/5 border border-white/10 rounded-3xl p-6 text-sm text-white focus:border-amber-500 outline-none resize-none mb-8"
                   placeholder="Nhập nội dung góp ý, tố giác hoặc đề xuất..."
                 />
                 <button onClick={() => { logAction('HIDEBOX_SEND', 'Đã gửi phản hồi ẩn danh.'); alert('Đã gửi!'); setHideBoxMsg(''); }} className="w-full py-5 bg-white text-black font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl hover:bg-gray-200 transition-all">GỬI ẨN DANH</button>
              </div>
           </div>
        )}

      </main>
    </div>
  );
};

export default SellerTerminal;
