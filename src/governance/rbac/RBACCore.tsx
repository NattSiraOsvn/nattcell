import React, { useState, useEffect } from 'react';
import { RBACProvider } from '../services/rbacservice';
import { RBACRole, RBACPermission, UserRole, Permission, ModuleID, PersonaID } from '../../types';
import { RBACGuard } from '../services/authservice';
import AIAvatar from './aiavatar';

const RBACManager: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.ADMIN);
  // Fixed: safely get values from enums
  const roles = (Object.keys(UserRole) as Array<keyof typeof UserRole>).map(k => UserRole[k]);
  const modules = (Object.keys(ModuleID) as Array<keyof typeof ModuleID>).map(k => ModuleID[k]);
  const permissions = ['read', 'write', 'delete', 'approve', 'audit'];

  const getMatrix = (role: UserRole) => RBACGuard.getPermissions(role);

  return (
    <div className="p-8 md:p-12 max-w-[1800px] mx-auto h-full overflow-y-auto no-scrollbar space-y-12 animate-in fade-in duration-1000 pb-40">
      
      <header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-4 mb-3">
             <span className="text-4xl">🔐</span>
             <h2 className="ai-headline text-6xl italic uppercase tracking-tighter leading-none">RBAC Protocol Terminal</h2>
          </div>
          <p className="ai-sub-headline text-cyan-300/40 ml-1 italic font-black">Thiết lập Ma trận Quyền hạn Identity • Omega Security v5.0</p>
        </div>
        
        <div className="flex bg-black/40 p-2 rounded-[2rem] border border-white/10 backdrop-blur-xl overflow-x-auto no-scrollbar">
           {roles.map(role => (
             <button
               key={role}
               onClick={() => setSelectedRole(role)}
               className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                 selectedRole === role ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'text-gray-500 hover:text-white'
               }`}
             >
               {role.split(' (')[0]}
             </button>
           ))}
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
         
         <div className="xl:col-span-3 space-y-10">
            <div className="ai-panel overflow-hidden border-white/5 bg-black/40 shadow-2xl relative">
               <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-[120px] font-serif italic select-none">MATRIX</div>
               
               <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                       <tr className="bg-white/[0.03] border-b border-white/10">
                          <th className="p-8 text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] w-64">Module / Shard</th>
                          {permissions.map((p) => (
                            <th key={p as string} className="p-8 text-center text-[9px] font-black text-gray-500 uppercase tracking-widest">{p}</th>
                          ))}
                       </tr>
                    </thead>
                    <tbody>
                       {modules.map((module) => {
                          const rolePerms = getMatrix(selectedRole)[module] || [];
                          return (
                            <tr key={module as string} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                               <td className="p-8">
                                  <div className="flex items-center gap-4">
                                     <div className="w-1.5 h-6 bg-cyan-500/20 group-hover:bg-cyan-500 transition-colors rounded-full"></div>
                                     <span className="text-white font-bold text-sm uppercase tracking-tight">{module}</span>
                                  </div>
                               </td>
                               {permissions.map((p) => {
                                  const hasP = rolePerms[p as string] === true;
                                  return (
                                    <td key={p as string} className="p-8 text-center">
                                       <div className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center border-2 transition-all ${
                                         hasP ? 'bg-amber-500/10 border-amber-500 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-white/[0.02] border-white/10 text-gray-800'
                                       }`}>
                                          {hasP ? '✓' : '✕'}
                                       </div>
                                    </td>
                                  );
                               })}
                            </tr>
                          );
                       })}
                    </tbody>
                 </table>
               </div>
            </div>

            <div className="p-10 glass rounded-[3rem] border border-amber-500/20 bg-amber-500/5 relative overflow-hidden">
               <div className="flex items-center gap-10">
                  <div className="w-20 h-20 bg-amber-500 text-black rounded-3xl flex items-center justify-center text-4xl shadow-2xl">⚖️</div>
                  <div className="space-y-2">
                     <h4 className="text-xl font-serif gold-gradient italic uppercase tracking-widest">Quy tắc Shard Quyền hạn</h4>
                     <p className="text-xs text-gray-400 font-light italic leading-relaxed">
                        Mọi thay đổi trên ma trận này sẽ được ghi nhận vào Blockchain Shard Log. Anh Natt lưu ý: Quyền "SIGN" và "EXPORT" trên module TÀI CHÍNH là nhạy cảm nhất, chỉ cấp cho Identity có độ tín nhiệm cao.
                     </p>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-10">
            <div className="ai-panel p-8 border-indigo-500/30 bg-indigo-500/5 shadow-xl flex flex-col items-center text-center">
               <AIAvatar personaId={PersonaID.KRIS} size="lg" isThinking={false} />
               <h4 className="ai-sub-headline text-indigo-400 mt-8 mb-4">Identity Guard (Kris)</h4>
               <p className="text-[12px] text-indigo-100/70 italic leading-relaxed font-light mb-8">
                  "Chào Anh Natt, Kris đang giám sát ma trận quyền. Hệ thống hiện tại đang ở trạng thái bảo mật OMEGA. Thiên đã bóc tách xong log truy cập của ngày hôm nay, 100% Identity đều tuân thủ đúng Shard quyền."
               </p>
               <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase text-gray-500 hover:text-white hover:border-indigo-500/50 transition-all">Xuất Identity Audit Log</button>
            </div>

            <div className="ai-panel p-8 bg-black/60 border-white/5">
               <h4 className="ai-sub-headline text-gray-500 mb-6 uppercase italic">Quick Statistics</h4>
               <div className="space-y-6">
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="text-gray-600 font-bold uppercase">Active Admins:</span>
                     <span className="text-amber-500 font-black italic">01 (Anh Natt)</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="text-gray-600 font-bold uppercase">Signers Node:</span>
                     <span className="text-cyan-400 font-black italic">03 Nodes</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="text-gray-600 font-bold uppercase">Compliance Score:</span>
                     <span className="text-green-500 font-black italic">100%</span>
                  </div>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
};

export default RBACManager;