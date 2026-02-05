
import React, { useState, useEffect } from 'react';
import { ApprovalTicket, ApprovalStatus } from '../../types';
import { ApprovalEngine } from '../../services/approval/ApprovalWorkflowService';
import AIAvatar from '../AIAvatar';
import { PersonaID } from '../../types';

const ApprovalDashboard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ApprovalStatus | 'ALL'>('ALL');
  const [tickets, setTickets] = useState<ApprovalTicket[]>([]);
  const [stats, setStats] = useState(ApprovalEngine.getStats());
  const [selectedTicket, setSelectedTicket] = useState<ApprovalTicket | null>(null);

  // Auto-refresh simulation (WebSocket replacement)
  useEffect(() => {
    const refresh = () => {
        setTickets(ApprovalEngine.getTickets(activeFilter));
        setStats(ApprovalEngine.getStats());
    };
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [activeFilter]);

  const handleApprove = async (id: string) => {
      await ApprovalEngine.approveTicket(id, 'MASTER_NATT'); // Giả lập người duyệt là Master
      setTickets(ApprovalEngine.getTickets(activeFilter));
      setSelectedTicket(null);
  };

  const handleReject = async (id: string) => {
      const reason = prompt("Nhập lý do từ chối:");
      if (reason) {
          await ApprovalEngine.rejectTicket(id, 'MASTER_NATT', reason);
          setTickets(ApprovalEngine.getTickets(activeFilter));
          setSelectedTicket(null);
      }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      
      {/* STATS HEADER */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="ai-panel p-6 bg-amber-500/10 border-amber-500/30">
            <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Đang chờ duyệt</p>
            <p className="text-4xl font-mono font-black text-white mt-2">{stats.pending}</p>
        </div>
        <div className="ai-panel p-6 bg-green-500/10 border-green-500/30">
            <p className="text-[9px] font-black text-green-400 uppercase tracking-widest">Đã duyệt hôm nay</p>
            <p className="text-4xl font-mono font-black text-white mt-2">{stats.approvedToday}</p>
        </div>
        <div className="ai-panel p-6 bg-red-500/10 border-red-500/30">
            <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">Bị từ chối</p>
            <p className="text-4xl font-mono font-black text-white mt-2">{stats.rejectedToday}</p>
        </div>
        <div className="ai-panel p-6 bg-blue-500/10 border-blue-500/30">
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Thời gian phản hồi</p>
            <p className="text-4xl font-mono font-black text-white mt-2">{stats.avgResponseTime}</p>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
          
          {/* LEFT: TICKET LIST */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
              <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
                  <button
                      onClick={() => setActiveFilter('ALL')}
                      className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                          activeFilter === 'ALL' ? 'bg-white text-black' : 'bg-white/5 text-gray-500 hover:text-white'
                      }`}
                  >
                      ALL
                  </button>
                  <button
                      onClick={() => setActiveFilter(ApprovalStatus.PENDING)}
                      className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                          activeFilter === ApprovalStatus.PENDING ? 'bg-white text-black' : 'bg-white/5 text-gray-500 hover:text-white'
                      }`}
                  >
                      PENDING
                  </button>
                  <button
                      onClick={() => setActiveFilter(ApprovalStatus.APPROVED)}
                      className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                          activeFilter === ApprovalStatus.APPROVED ? 'bg-white text-black' : 'bg-white/5 text-gray-500 hover:text-white'
                      }`}
                  >
                      APPROVED
                  </button>
                  <button
                      onClick={() => setActiveFilter(ApprovalStatus.REJECTED)}
                      className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                          activeFilter === ApprovalStatus.REJECTED ? 'bg-white text-black' : 'bg-white/5 text-gray-500 hover:text-white'
                      }`}
                  >
                      REJECTED
                  </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-2">
                  {tickets.map(ticket => (
                      <div 
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
                            selectedTicket?.id === ticket.id ? 'bg-white/[0.08] border-white/20' : 'bg-black/40 border-white/5 hover:border-white/10'
                        }`}
                      >
                          <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-3">
                                  <span className={`w-2 h-2 rounded-full ${
                                      ticket.status === ApprovalStatus.PENDING ? 'bg-amber-500 animate-pulse' : 
                                      ticket.status === ApprovalStatus.APPROVED ? 'bg-green-500' : 'bg-red-500'
                                  }`}></span>
                                  <span className="text-xs font-bold text-white">{ticket.id}</span>
                              </div>
                              <span className="text-[9px] text-gray-500 font-mono">{new Date(ticket.requestedAt).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-end">
                              <div>
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{ticket.request.recordType} • {ticket.request.changeType}</p>
                                  <p className="text-sm text-white mt-1 italic">"{ticket.request.reason}"</p>
                              </div>
                              <div className="text-right">
                                  <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${
                                      ticket.request.priority === 'CRITICAL' ? 'bg-red-600 text-white' : 
                                      ticket.request.priority === 'HIGH' ? 'bg-amber-600 text-black' : 
                                      'bg-blue-600/20 text-blue-400'
                                  }`}>
                                      {ticket.request.priority}
                                  </span>
                              </div>
                          </div>
                      </div>
                  ))}
                  {tickets.length === 0 && (
                      <div className="text-center py-20 opacity-30">
                          <p className="text-4xl mb-4">📭</p>
                          <p className="text-xs font-black uppercase">Không có yêu cầu nào</p>
                      </div>
                  )}
              </div>
          </div>

          {/* RIGHT: DETAIL & ACTIONS */}
          <div className="ai-panel p-8 bg-white/[0.02] border-white/5 flex flex-col relative overflow-hidden">
              {selectedTicket ? (
                  <>
                      <div className="mb-8 pb-8 border-b border-white/5">
                          <h3 className="text-2xl font-serif gold-gradient italic uppercase tracking-tighter mb-4">Chi tiết Phê duyệt</h3>
                          <div className="space-y-4">
                              <div className="flex justify-between text-[11px]">
                                  <span className="text-gray-500 uppercase font-bold">Người yêu cầu:</span>
                                  <span className="text-white font-mono">{selectedTicket.request.requestedBy}</span>
                              </div>
                              <div className="p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-[10px] text-gray-300 overflow-auto max-h-40">
                                  <p className="text-indigo-400 font-bold mb-2">// Dữ liệu đề xuất:</p>
                                  <pre>{JSON.stringify(selectedTicket.request.proposedData, null, 2)}</pre>
                              </div>
                              {selectedTicket.status === ApprovalStatus.REJECTED && (
                                  <div className="p-4 bg-red-900/10 border border-red-500/20 rounded-xl">
                                      <p className="text-[10px] text-red-400 font-bold uppercase mb-1">Lý do từ chối:</p>
                                      <p className="text-xs text-white">{selectedTicket.rejectionReason}</p>
                                  </div>
                              )}
                          </div>
                      </div>

                      {selectedTicket.status === ApprovalStatus.PENDING ? (
                          <div className="mt-auto space-y-3">
                              <button 
                                  onClick={() => handleApprove(selectedTicket.id)}
                                  className="w-full py-4 bg-green-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-green-500 shadow-xl transition-all"
                              >
                                  PHÊ DUYỆT (APPROVE)
                              </button>
                              <button 
                                  onClick={() => handleReject(selectedTicket.id)}
                                  className="w-full py-4 bg-red-600/10 border border-red-600/30 text-red-500 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-all"
                              >
                                  TỪ CHỐI (REJECT)
                              </button>
                          </div>
                      ) : (
                          <div className="mt-auto text-center p-4 bg-white/5 rounded-xl border border-white/5">
                              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Trạng thái: {selectedTicket.status}</p>
                              <p className="text-[9px] text-gray-600 mt-1">Vào lúc: {new Date(selectedTicket.approvedAt || 0).toLocaleString()}</p>
                          </div>
                      )}
                  </>
              ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                      <div className="mb-6"><AIAvatar personaId={PersonaID.KRIS} size="md" /></div>
                      <p className="text-sm font-serif italic">"Chọn một yêu cầu để xem chi tiết và thực hiện quyền lực của Anh."</p>
                  </div>
              )}
          </div>

      </div>
    </div>
  );
};

export default ApprovalDashboard;
