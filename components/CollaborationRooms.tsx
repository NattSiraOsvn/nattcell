
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { RoomConfig, PersonaID, ChatMessage, RoomSettings, BusinessMetrics, UserRole, UserPosition, PositionType, JoinRequest } from '../types';
import { PERSONAS } from '../constants';
import { generatePersonaResponse } from '../services/geminiService';
import AIAvatar from './AIAvatar';

interface CollaborationRoomsProps {
  currentRole: UserRole;
  currentPosition: UserPosition;
  logAction: (action: string, details: string) => void;
  metrics: BusinessMetrics;
}

const CollaborationRooms: React.FC<CollaborationRoomsProps> = ({ currentRole, currentPosition, logAction }) => {
  const [rooms, setRooms] = useState<RoomConfig[]>([
    { 
      id: 'STRATEGIC', 
      name: 'Hầm Chiến Lược', 
      icon: '🏛️', 
      color: 'amber',
      creatorId: 'MASTER',
      /* Fix: members list should use role strings from PositionType enum */
      members: [PositionType.CFO, PositionType.CEO, PositionType.GENERAL_MANAGER],
      pendingRequests: [],
      settings: { antiSpam: true, blockPersonas: [], autoDeleteMessages: false, encryptionLevel: 'OMEGA', isMuted: false, joinCode: 'NATT99', allowCalls: true, allowVoice: true, allowImport: true }
    },
    { 
      id: 'FACTORY', 
      name: 'Điều Phối Xưởng', 
      icon: '⚙️', 
      color: 'blue',
      creatorId: 'MASTER',
      /* Fix: members list should use role strings from PositionType enum */
      members: [PositionType.CFO, PositionType.PROD_DIRECTOR, PositionType.CASTING_MANAGER],
      pendingRequests: [],
      settings: { antiSpam: true, blockPersonas: [], autoDeleteMessages: false, encryptionLevel: 'TIÊU CHUẨN', isMuted: false, joinCode: 'PROD25', allowCalls: true, allowVoice: true, allowImport: true }
    }
  ]);

  const [activeRoomId, setActiveRoomId] = useState('STRATEGIC');
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    STRATEGIC: [{ id: '1', role: 'model', personaId: PersonaID.THIEN, content: 'Chào Anh Natt, phòng Chiến Lược đã được kích hoạt mã hóa OMEGA. Thiên sẵn sàng tham mưu.', timestamp: Date.now(), type: 'text' }],
    FACTORY: [{ id: '2', role: 'model', personaId: PersonaID.KRIS, content: 'Kris đang giám sát định mức hao hụt tại Shard Sản xuất.', timestamp: Date.now(), type: 'text' }]
  });

  const [input, setInput] = useState('');
  const [activeCallType, setActiveCallType] = useState<'VOICE' | 'VIDEO' | null>(null);
  const [callingMember, setCallingMember] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  
  // State cho Modal xác nhận hành động
  const [confirmModal, setConfirmModal] = useState<{ show: boolean; title: string; onConfirm: () => void } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isMaster = currentRole === UserRole.MASTER || currentRole === UserRole.LEVEL_1;
  const activeRoom = useMemo(() => rooms.find(r => r.id === activeRoomId) || rooms[0], [rooms, activeRoomId]);
  /* Fix: members list is string[], currentPosition is object, compare currentPosition.role */
  const isMember = useMemo(() => activeRoom.members.includes(currentPosition.role) || isMaster, [activeRoom, currentPosition, isMaster]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, activeRoomId]);

  const openConfirmModal = (title: string, onConfirm: () => void) => {
    setConfirmModal({ show: true, title, onConfirm });
  };

  const handleJoinRoom = () => {
    const targetRoom = rooms.find(r => r.settings.joinCode === joinCodeInput);
    if (!targetRoom) {
      alert("❌ Mã Code không hợp lệ hoặc không tồn tại.");
      return;
    }

    const newRequest: JoinRequest = {
      id: Math.random().toString(36).substring(7),
      userId: 'USER_IDENT',
      userName: 'Nhân sự Natt-OS',
      userPosition: currentPosition,
      timestamp: Date.now(),
      status: 'PENDING'
    };

    setRooms(prev => prev.map(r => r.id === targetRoom.id ? { ...r, pendingRequests: [...r.pendingRequests, newRequest] } : r));
    alert(`📡 Đã gửi yêu cầu vào phòng ${targetRoom.name}. Vui lòng chờ Giám đốc duyệt.`);
    setShowJoinModal(false);
    setJoinCodeInput('');
  };

  const handleApproveRequest = (roomId: string, requestId: string) => {
    openConfirmModal("Anh có chắc chắn muốn duyệt nhân sự này gia nhập Shard hội thoại bảo mật?", () => {
      setRooms(prev => prev.map(r => {
        if (r.id === roomId) {
          const req = r.pendingRequests.find(pr => pr.id === requestId);
          if (!req) return r;
          return {
            ...r,
            /* Fix: members is string[], push req.userPosition.role string */
            members: [...r.members, req.userPosition.role],
            pendingRequests: r.pendingRequests.filter(pr => pr.id !== requestId)
          };
        }
        return r;
      }));
      logAction('CHAT_ROOM_JOIN_APPROVED', `Đã duyệt thành viên vào phòng ${roomId}`);
      setConfirmModal(null);
    });
  };

  const handleIndividualCall = (member: string, type: 'VOICE' | 'VIDEO') => {
    setCallingMember(member);
    setActiveCallType(type);
    logAction('CHAT_PRIVATE_LINK', `Khởi tạo cuộc gọi ${type} cho Identity: ${member}`);
  };

  const handleSend = async () => {
    if (!input.trim() || !isMember) return;

    if (editingMessageId) {
       setMessages(prev => ({
         ...prev,
         [activeRoomId]: prev[activeRoomId].map(m => m.id === editingMessageId ? { 
           ...m, 
           content: input, 
           isEdited: true, 
           history: [...(m.history || []), { content: m.content, timestamp: Date.now() }] 
         } : m)
       }));
       setEditingMessageId(null);
       setInput('');
       return;
    }

    const userMsg: ChatMessage = {
      id: Math.random().toString(36),
      role: 'user',
      personaId: PersonaID.THIEN,
      content: input,
      timestamp: Date.now(),
      type: 'text'
    };

    setMessages(prev => ({ ...prev, [activeRoomId]: [...(prev[activeRoomId] || []), userMsg] }));
    setInput('');

    const res = await generatePersonaResponse(activeRoomId === 'STRATEGIC' ? PersonaID.THIEN : PersonaID.KRIS, input);
    const modelMsg: ChatMessage = {
      id: Math.random().toString(36),
      role: 'model',
      personaId: activeRoomId === 'STRATEGIC' ? PersonaID.THIEN : PersonaID.KRIS,
      content: res.text,
      timestamp: Date.now(),
      type: 'text'
    };
    setMessages(prev => ({ ...prev, [activeRoomId]: [...(prev[activeRoomId] || []), modelMsg] }));
  };

  return (
    <div className="flex h-full bg-[#020202] relative overflow-hidden">
      
      {/* SIDEBAR: DANH SÁCH PHÒNG */}
      <div className="w-80 border-r border-white/5 flex flex-col bg-black/40 backdrop-blur-3xl shrink-0">
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif gold-gradient italic uppercase tracking-widest">Natt-OS Chat</h2>
              <button onClick={() => setShowJoinModal(true)} className="w-8 h-8 rounded-lg bg-amber-500 text-black flex items-center justify-center text-xl font-bold hover:scale-105 transition-transform">+</button>
           </div>
           <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs">🔍</span>
              <input type="text" placeholder="Tìm hội thoại..." className="w-full bg-black/60 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[10px] text-white outline-none focus:border-amber-500/50" />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2">
           {rooms.map(r => (
             <button 
               key={r.id} 
               onClick={() => setActiveRoomId(r.id)}
               className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all relative group ${
                 activeRoomId === r.id ? 'bg-amber-500/10 border border-amber-500/20 shadow-lg shadow-amber-500/5' : 'hover:bg-white/[0.03]'
               }`}
             >
                <div className={`w-12 h-12 rounded-2xl bg-${r.color}-500/20 border border-${r.color}-500/30 flex items-center justify-center text-2xl`}>{r.icon}</div>
                <div className="flex-1 text-left">
                   <p className="text-[11px] font-black text-white uppercase tracking-wider">{r.name}</p>
                   <p className="text-[9px] text-gray-500 italic mt-1 truncate">Mã hóa: {r.settings.encryptionLevel}</p>
                </div>
                {r.pendingRequests.length > 0 && isMaster && (
                   <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[8px] font-black flex items-center justify-center animate-pulse">
                      {r.pendingRequests.length}
                   </span>
                )}
             </button>
           ))}
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col relative bg-black/20">
        
        {/* ROOM HEADER */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md z-10">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">{activeRoom.icon}</div>
              <div>
                 <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">{activeRoom.name}</h3>
                 <p className="text-[8px] text-gray-600 uppercase tracking-widest mt-1">
                   {activeRoom.members.length} Members • {isMember ? 'AUTHENTICATED' : 'ACCESS RESTRICTED'}
                 </p>
              </div>
           </div>

           <div className="flex gap-4">
              {isMember && activeRoom.settings.allowCalls && (
                <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                   <button onClick={() => setActiveCallType('VOICE')} className="w-10 h-10 rounded-lg hover:bg-white/10 transition-colors text-lg" title="Global Audio Call">📞</button>
                   <button onClick={() => setActiveCallType('VIDEO')} className="w-10 h-10 rounded-lg hover:bg-white/10 transition-colors text-lg" title="Global Video Call">📹</button>
                </div>
              )}
              <button onClick={() => setShowSettings(!showSettings)} className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${showSettings ? 'bg-amber-500 text-black border-amber-500' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}>⚙️</button>
           </div>
        </header>

        {/* MESSAGES LIST */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 no-scrollbar scroll-smooth">
           {!isMember ? (
             <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                <div className="text-[120px] mb-8 grayscale">🛡️</div>
                <h3 className="text-3xl font-serif gold-gradient italic uppercase">Shard Dữ liệu bị Khóa</h3>
                <p className="max-w-md mt-6 text-sm text-gray-500 leading-relaxed font-light italic">
                   "Phòng hội thoại này yêu cầu xác thực cấp cao. Anh vui lòng nhập mã Code để gửi yêu cầu phê duyệt gia nhập Node."
                </p>
                <button onClick={() => setShowJoinModal(true)} className="mt-12 px-12 py-4 bg-amber-500 text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:bg-amber-400">NHẬP MÃ CODE GIA NHẬP</button>
             </div>
           ) : (
             messages[activeRoomId]?.map((msg) => (
               <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group relative`}>
                  <div className={`max-w-[75%] flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                     <div className="shrink-0 mt-1">
                        {msg.role === 'model' ? <AIAvatar personaId={msg.personaId} size="sm" isThinking={false} /> : <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[10px] font-black text-amber-500">YOU</div>}
                     </div>
                     <div className="space-y-2">
                        <div className={`p-6 rounded-[2.5rem] border transition-all ${
                          msg.role === 'user' ? 'bg-amber-500/10 border-amber-500/30 text-amber-50' : 'bg-white/5 border-white/10 text-gray-300'
                        }`}>
                           {msg.role === 'model' && <p className="text-[9px] text-amber-500 font-black uppercase mb-3 tracking-[0.2em]">{msg.personaId} Advisor</p>}
                           <div className="text-sm font-light leading-relaxed italic whitespace-pre-wrap">{msg.content}</div>
                           {msg.isEdited && <span className="block mt-2 text-[7px] text-gray-600 font-black uppercase italic tracking-widest">Đã chỉnh sửa (Immutable History)</span>}
                        </div>
                        {msg.role === 'user' && (
                           <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingMessageId(msg.id); setInput(msg.content); }} className="text-[8px] font-black uppercase text-gray-600 hover:text-cyan-400">Chỉnh sửa</button>
                              <span className="text-[8px] font-black uppercase text-red-900/40 cursor-not-allowed" title="Master Natt rule: No deletion">Không thể xóa</span>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
             ))
           )}
        </div>

        {/* INPUT BAR */}
        {isMember && (
          <div className="p-8 border-t border-white/5 bg-black/60 backdrop-blur-3xl">
             <div className="max-w-5xl mx-auto flex items-end gap-5">
                {activeRoom.settings.allowImport && (
                   <button onClick={() => fileInputRef.current?.click()} className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-amber-500/50 transition-all text-xl">📎</button>
                )}
                <input type="file" ref={fileInputRef} className="hidden" />
                
                <div className="flex-1 relative">
                   {editingMessageId && <div className="absolute -top-10 left-4 px-3 py-1 bg-cyan-600 text-white text-[8px] font-black rounded uppercase animate-in slide-in-from-bottom-2">Đang chỉnh sửa giao thức...</div>}
                   <textarea 
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     placeholder={editingMessageId ? "Nhập nội dung mới..." : "Nhập mật lệnh..."}
                     className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 text-sm text-white focus:border-amber-500/50 outline-none resize-none no-scrollbar shadow-inner"
                     rows={1}
                     onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                   />
                </div>
                
                <button 
                  onClick={handleSend}
                  className="w-16 h-16 bg-amber-500 text-black rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.2)] hover:bg-amber-400 active:scale-95 transition-all mb-0.5"
                >
                  🚀
                </button>
             </div>
             <p className="text-center text-[8px] text-gray-700 font-black uppercase mt-4 tracking-[0.4em]">Protocol: Encrypted Peer-to-Peer Shard Access</p>
          </div>
        )}

        {/* CALL INTERFACE OVERLAY */}
        {activeCallType && (
          <div className="absolute inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
             <div className="relative mb-20">
                <div className="w-64 h-64 rounded-full border-2 border-amber-500/20 flex items-center justify-center">
                   <div className="w-56 h-56 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-40 h-40 rounded-[3rem] bg-amber-500/10 flex items-center justify-center text-8xl shadow-[0_0_100px_rgba(245,158,11,0.2)] animate-pulse">
                      {callingMember ? '👤' : '👥'}
                   </div>
                </div>
             </div>
             <div className="text-center space-y-4">
                <h3 className="text-4xl font-serif gold-gradient italic uppercase tracking-widest">
                   {activeCallType} {callingMember ? 'PRIVATE LINK' : 'NODE CONNECTING'}
                </h3>
                {callingMember && <p className="text-sm text-gray-400 font-black uppercase tracking-[0.3em]">{callingMember}</p>}
                <p className="text-sm text-amber-500 font-mono tracking-widest uppercase animate-pulse">Establishing Secure Neural Link...</p>
             </div>
             <div className="mt-24 flex gap-12">
                <button onClick={() => { setActiveCallType(null); setCallingMember(null); }} className="w-20 h-20 rounded-full bg-red-600 text-white text-3xl flex items-center justify-center shadow-2xl hover:scale-110 transition-all">✕</button>
                <div className="w-20 h-20 rounded-full bg-white/10 text-white text-3xl flex items-center justify-center border border-white/20">🔇</div>
             </div>
          </div>
        )}

        {/* ROOM SETTINGS, MEMBERS & APPROVALS DRAWER */}
        {showSettings && (
          <div className="absolute top-24 right-10 w-[450px] glass border border-white/10 rounded-[3rem] p-10 shadow-2xl z-50 animate-in slide-in-from-top-4 flex flex-col gap-10 max-h-[80vh] overflow-y-auto no-scrollbar">
             <header className="flex justify-between items-center border-b border-white/5 pb-6">
                <h3 className="text-sm font-black uppercase text-amber-500 tracking-[0.3em]">Cấu Hình Shard Phòng</h3>
                <button onClick={() => setShowSettings(false)} className="text-white/20 hover:text-white">✕</button>
             </header>

             {/* MEMBERS SECTION WITH INDIVIDUAL CALLS */}
             <section>
                <p className="text-[10px] text-gray-500 font-black uppercase mb-6 tracking-widest flex justify-between">
                   <span>Thành viên Shard ({activeRoom.members.length})</span>
                   <span className="text-green-500 italic">Connected</span>
                </p>
                <div className="space-y-4">
                   {activeRoom.members.map((member, i) => (
                      <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center group hover:border-amber-500/30 transition-all">
                         <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs">👤</div>
                            <div>
                               <p className="text-[11px] font-bold text-white uppercase">{member}</p>
                               <p className="text-[8px] text-gray-600 font-black uppercase">Identity Verified</p>
                            </div>
                         </div>
                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleIndividualCall(member, 'VOICE')} className="p-2 bg-white/5 hover:bg-amber-500/20 border border-white/5 rounded-lg text-sm" title="Gọi riêng">📞</button>
                            <button onClick={() => handleIndividualCall(member, 'VIDEO')} className="p-2 bg-white/5 hover:bg-cyan-500/20 border border-white/5 rounded-lg text-sm" title="Video riêng">📹</button>
                         </div>
                      </div>
                   ))}
                </div>
             </section>

             {/* REQUESTS FOR MASTER */}
             {isMaster && activeRoom.pendingRequests.length > 0 && (
                <section>
                   <p className="text-[10px] text-red-500 font-black uppercase mb-6 flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      Yêu cầu gia nhập Shard ({activeRoom.pendingRequests.length})
                   </p>
                   <div className="space-y-4">
                      {activeRoom.pendingRequests.map(req => (
                        <div key={req.id} className="p-5 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center">
                           <div>
                              <p className="text-xs font-bold text-white uppercase">{req.userName}</p>
                              {/* Fix: userPosition is object, access role property */}
                              <p className="text-[9px] text-gray-500 italic uppercase mt-1">{req.userPosition.role}</p>
                           </div>
                           <div className="flex gap-2">
                              <button onClick={() => handleApproveRequest(activeRoom.id, req.id)} className="px-4 py-2 bg-green-600 text-white text-[8px] font-black rounded uppercase hover:bg-green-500 transition-all">DUYỆT</button>
                              <button className="px-4 py-2 border border-red-500/30 text-red-500 text-[8px] font-black rounded uppercase hover:bg-red-500/10">BÁC BỎ</button>
                           </div>
                        </div>
                      ))}
                   </div>
                </section>
             )}

             <section className="space-y-6">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest border-b border-white/5 pb-2">Quyền hạn & Mã hóa</p>
                <div className="space-y-5">
                   <div className="flex justify-between items-center">
                      <span className="text-[11px] text-gray-300 font-bold uppercase">Mã Join Shard</span>
                      <code className="bg-amber-500 text-black px-3 py-1 rounded font-black text-xs">{activeRoom.settings.joinCode}</code>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-[11px] text-gray-400 font-bold uppercase">Mã hóa OMEGA</span>
                      <span className="text-[10px] text-green-500 font-black italic">ACTIVE</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-[11px] text-gray-400 font-bold uppercase">Chống rò rỉ dữ liệu</span>
                      <span className="text-[10px] text-cyan-400 font-black italic">HIGH-LEVEL</span>
                   </div>
                </div>
             </section>

             <div className="pt-6 border-t border-white/5">
                <button 
                   onClick={() => openConfirmModal("Anh có chắc chắn muốn rời khỏi Node hội thoại chiến lược này?", () => { alert("Đã rời phòng."); setConfirmModal(null); })}
                   className="w-full py-4 glass text-red-400 border border-red-500/20 rounded-xl text-[10px] font-black uppercase hover:bg-red-500/10"
                >
                   Rời khỏi Node hội thoại
                </button>
             </div>
          </div>
        )}

      </div>

      {/* CONFIRM ACTION MODAL (Re-usable for sensitive actions) */}
      {confirmModal && confirmModal.show && (
         <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in zoom-in-95 duration-300">
            <div className="ai-panel w-full max-w-lg p-12 bg-black border-red-500/20 rounded-[3.5rem] shadow-2xl text-center space-y-10 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
               <div className="text-6xl mb-6">🛡️</div>
               <h3 className="text-3xl font-serif gold-gradient italic uppercase tracking-tighter">Xác nhận hành động</h3>
               <p className="text-xs text-gray-500 italic leading-relaxed px-8">
                  {confirmModal.title}
               </p>
               
               <div className="flex gap-4">
                  <button onClick={() => setConfirmModal(null)} className="flex-1 py-5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-gray-500 hover:text-white transition-all">Hủy bỏ</button>
                  <button onClick={confirmModal.onConfirm} className="flex-1 py-5 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl hover:bg-red-500 active:scale-95 transition-all">Xác nhận thực thi</button>
               </div>
            </div>
         </div>
      )}

      {/* JOIN CODE MODAL */}
      {showJoinModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in zoom-in-95 duration-500">
           <div className="ai-panel w-full max-md p-12 bg-black border-amber-500/30 rounded-[3.5rem] shadow-2xl text-center space-y-10">
              <div className="text-6xl mb-6">🔐</div>
              <h3 className="text-3xl font-serif gold-gradient italic uppercase tracking-tighter">Xác thực Gia nhập Shard</h3>
              <p className="text-xs text-gray-500 italic leading-relaxed">Vui lòng nhập mã Code do Anh Natt hoặc Giám đốc cung cấp để đồng bộ tri thức phòng.</p>
              
              <input 
                type="text" 
                value={joinCodeInput}
                onChange={e => setJoinCodeInput(e.target.value.toUpperCase())}
                placeholder="NHẬP CODE TẠI ĐÂY..."
                className="w-full bg-black/60 border border-white/10 rounded-2xl p-6 text-2xl font-mono text-center text-amber-500 tracking-[0.5em] focus:border-amber-500 outline-none transition-all shadow-inner"
                maxLength={6}
              />

              <div className="flex gap-4">
                 <button onClick={() => setShowJoinModal(false)} className="flex-1 py-5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-gray-500 hover:text-white">Hủy bỏ</button>
                 <button onClick={handleJoinRoom} className="flex-1 py-5 bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl hover:bg-amber-400 active:scale-95">Xác thực Code</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CollaborationRooms;
