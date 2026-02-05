
import React, { useState, useEffect } from 'react';
import { PersonaID } from '../types';
import AIAvatar from './AIAvatar';

export type NotificationType = 'ORDER' | 'NEWS' | 'RISK' | 'SYSTEM';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  timestamp: number;
  isRead: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  persona?: PersonaID;
}

interface NotificationHubProps {
  notifications: AppNotification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
}

const NotificationHub: React.FC<NotificationHubProps> = ({ notifications, onClose, onMarkAsRead }) => {
  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-end p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="w-full max-w-lg h-[90vh] glass bg-black/80 border-l border-amber-500/30 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col overflow-hidden animate-in slide-in-from-right duration-500"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-10 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-amber-500/5 to-transparent">
           <div>
              <h3 className="text-3xl font-serif gold-gradient italic uppercase tracking-tighter">Omega Feed</h3>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1">Hệ thống truyền tin liên Shard</p>
           </div>
           <button onClick={onClose} className="text-2xl text-gray-500 hover:text-white transition-colors">✕</button>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-6">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
               <span className="text-8xl mb-6">📡</span>
               <p className="text-xl uppercase tracking-widest">Không có tín hiệu mới</p>
            </div>
          ) : (
            notifications.map(n => (
              <div 
                key={n.id} 
                onClick={() => onMarkAsRead(n.id)}
                className={`p-6 rounded-[2.5rem] border transition-all cursor-pointer group relative overflow-hidden ${
                  n.isRead ? 'bg-white/[0.02] border-white/5 opacity-60' : 
                  n.type === 'RISK' ? 'bg-red-500/5 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]' :
                  n.type === 'ORDER' ? 'bg-amber-500/5 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]' :
                  'bg-blue-500/5 border-blue-500/20'
                }`}
              >
                <div className="flex gap-6 items-start relative z-10">
                   <div className="shrink-0 mt-1">
                      {n.persona ? (
                        <AIAvatar personaId={n.persona} size="sm" />
                      ) : (
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                          n.type === 'RISK' ? 'bg-red-500/20 text-red-500' :
                          n.type === 'ORDER' ? 'bg-amber-500/20 text-amber-500' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                           {n.type === 'RISK' ? '⚠️' : n.type === 'ORDER' ? '💎' : '📢'}
                        </div>
                      )}
                   </div>
                   <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center">
                         <span className={`text-[8px] font-black uppercase tracking-widest ${
                            n.type === 'RISK' ? 'text-red-500' : 'text-amber-500'
                         }`}>
                            {n.type} • {n.priority}
                         </span>
                         <span className="text-[9px] text-gray-600 font-mono italic">{new Date(n.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <h4 className="text-white font-bold text-sm uppercase tracking-tight group-hover:text-cyan-400 transition-colors">{n.title}</h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed italic">{n.content}</p>
                   </div>
                </div>
                {!n.isRead && (
                  <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,1)]"></div>
                )}
              </div>
            ))
          )}
        </div>

        <footer className="p-8 border-t border-white/5 bg-black/40 text-center">
           <button className="text-[9px] font-black text-gray-600 uppercase hover:text-white transition-colors tracking-[0.3em]">Xóa tất cả lịch sử truyền tin</button>
        </footer>
      </div>
    </div>
  );
};

export default NotificationHub;
