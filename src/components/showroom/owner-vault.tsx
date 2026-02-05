
import React from 'react';
import { Lock } from 'lucide-react';

export const OwnerVault: React.FC<{ location?: string }> = ({ location }) => {
  if (!location) return null;
  
  return (
    <div className="mt-6 p-4 bg-red-950/10 border border-red-500/20 rounded-2xl flex items-center gap-4">
       <Lock size={16} className="text-red-500" />
       <div>
          <p className="text-[9px] text-red-400 font-black uppercase tracking-widest">Private Vault</p>
          <p className="text-xs text-gray-300 italic">Vị trí: {location} (Access Restricted)</p>
       </div>
    </div>
  );
};
