// 👑 sovereign: anh_nat
import React, { useState } from 'react';
import * as icons from 'lucide-react';
import { view_type } from '../types.ts';

const AppShell: React.FC<{
  children: React.ReactNode;
  activeView: view_type;
  setActiveView: (v: view_type) => void;
  user: any;
}> = ({ children, activeView, setActiveView }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: view_type.dashboard, label: 'nexus core', icon: icons.LayoutDashboard },
    { id: view_type.warehouse, label: 'warehouse shard', icon: icons.Database },
    { id: view_type.sales_terminal, label: 'sales terminal', icon: icons.ShoppingCart },
    { id: view_type.chat, label: 'ai copilot', icon: icons.MessageSquare },
    { id: view_type.monitoring, label: 'system monitor', icon: icons.Activity }
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-stone-300">
      <aside className={`border-r border-white/5 bg-[#050505] transition-all duration-500 flex flex-col ${isSidebarOpen ? 'w-80' : 'w-24'}`}>
        <div className="p-8 flex items-center gap-4 border-b border-white/5">
          <div 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-black font-black cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          >
            ω
          </div>
          {isSidebarOpen && (
            <div>
              <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none">natt-os</h1>
              <p className="text-[9px] text-amber-500 font-bold tracking-widest uppercase mt-1">gold master</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                activeView === item.id ? 'bg-amber-500 text-black shadow-lg' : 'hover:bg-white/5 text-stone-500 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-black/40 backdrop-blur-xl">
           <div className="flex items-center gap-3">
              <icons.Shield size={16} className="text-red-500 animate-pulse" />
              <span className="text-[10px] font-black text-stone-600 uppercase tracking-[0.4em]">node_integrity_enforced</span>
           </div>
           <div className="flex items-center gap-6">
              <icons.Bell size={18} className="text-stone-700" />
              <div className="w-10 h-10 rounded-full bg-stone-900 border border-white/10" />
           </div>
        </header>
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppShell;