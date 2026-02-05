
import React from 'react';
// 🛠️ Fixed: Import casing for ViewType and UserRole from types.ts
import { view_type as ViewType, user_role as UserRole } from '../types';
import { ModuleRegistry } from '../services/moduleRegistry';
import { LayoutGrid, Terminal, Shield } from 'lucide-react';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  currentRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, currentRole }) => {
  const modules = ModuleRegistry.getAllModules().filter(m => 
    m.active && (currentRole === UserRole.master || m.allowedRoles.includes(currentRole))
  );

  return (
    <aside className="w-80 h-full bg-black border-r border-white/5 flex flex-col p-6 space-y-8 z-50">
      <div className="flex items-center gap-4 px-4 py-6 border-b border-white/5">
        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-black font-black">Ω</div>
        <div>
          <h2 className="text-xl font-black text-white tracking-tighter">NATT-OS</h2>
          <p className="text-[9px] text-amber-500 uppercase font-black tracking-widest">Sovereign Edition</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
        {modules.map(mod => (
          <button
            key={mod.id}
            onClick={() => setActiveView(mod.id as any)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
              activeView === mod.id ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-500 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="text-xl">{mod.icon}</span>
            <span className="text-xs font-black uppercase tracking-widest">{mod.title}</span>
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-white/5">
        <button 
          onClick={() => setActiveView(ViewType.chat)}
          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Terminal size={18} /> AI Copilot
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
