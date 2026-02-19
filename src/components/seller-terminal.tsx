
import React, { useState, useMemo, useEffect } from 'react';
import { UserRole, UserPosition, PositionType, SellerReport, SellerIdentity, CustomerLead, PersonaID } from '@/types';
import { SellerEngine } from '@/services/sellerengine';
import { NotifyBus } from '@/services/notificationservice';

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
  
  const [me] = useState<SellerIdentity>({
    userId: 'S-007',
    // Fix: currentPosition is an object, access its .role property for comparison
    fullName: currentPosition.role === PositionType.COLLABORATOR ? 'CTV Nguyễn Văn A' : 'Seller Lê Trọng Khôi',
    stars: 4,
    kpiPoints: 105,
    violations: 0,
    role: currentRole,
    position: currentPosition,
    // Fix: currentPosition is an object, access its .role property for comparison
    isCollaborator: currentPosition.role === PositionType.COLLABORATOR,
    department: 'KINH_DOANH',
    gatekeeperBalance: 500000
  });

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
    if (formData.shellVal > 0 || formData.stoneVal > 0) {
      const comm = SellerEngine.calculateCommission({
        shellRevenue: formData.shellVal,
        stoneRevenue: formData.stoneVal,
        stoneType: formData.stoneType,
        isReportedWithin24h: true
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
    
    const lead = leads.find(l => l.phone === formData.phone);
    if (lead) {
       setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: 'CONVERTED' } : l));
    }

    setActiveTab('dashboard');
    NotifyBus.push({ type: 'SUCCESS', title: 'Đã ghi nhận đơn hàng', content: `Hoa hồng tạm tính: ${commission.total.toLocaleString()} đ`, persona: PersonaID.CAN });
  };

  const handlePhieuSuggestion = async () => {
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
  };

  const totalCommission = useMemo(() => reports.reduce((s, r) => s + r.commission.total, 0), [reports]);

  return (
    <div className="h-full flex flex-col bg-[#050505] p-8 md:p-12 overflow-y-auto no-scrollbar gap-10 animate-in fade-in duration-700 pb-32">
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
              <p className="text-[9px] text-gray-500 mt-1 font-mono">{me.kpiPoints} KPI pts</p>
           </div>
           <div className="ai-panel px-6 py-3 border-green-500/20 bg-green-500/5 text-center">
              <p className="text-[8px] text-green-400 font-black uppercase mb-1">Thu nhập (Commission)</p>
              <p className="text-xl font-mono font-black text-white">{totalCommission.toLocaleString()} <span className="text-xs">đ</span></p>
           </div>
        </div>
      </header>

      <nav className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 w-fit shrink-0 overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('dashboard')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>Tổng quan & Thu nhập</button>
        <button onClick={() => setActiveTab('leads')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === 'leads' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Timeline Lead (90 Ngày)</button>
        <button onClick={() => setActiveTab('order_engine')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === 'order_engine' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Tạo Đơn & Tính HH</button>
        {isManager && <button onClick={() => setActiveTab('manager_hub')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === 'manager_hub' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Quản Lý Team</button>}
        <button onClick={() => setActiveTab('hidebox')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === 'hidebox' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>HideBox (Ẩn danh)</button>
      </nav>

      <main className="flex-1">
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
                   </div>
                   <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">💰</div>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SellerTerminal;
