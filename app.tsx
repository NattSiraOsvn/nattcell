// 👑 sovereign: anh_nat
import React, { useState } from 'react';
import { view_type, user_role, department } from './types.ts';
import AppShell from './components/app-shell.tsx';
import MasterDashboard from './components/master-dashboard.tsx';
import ChatTerminal from './components/chat-terminal.tsx';

const App = () => {
  const [activeView, setActiveView] = useState<view_type>(view_type.dashboard);
  
  const currentUser = {
    role: user_role.master,
    position: { 
      id: 'master_01', 
      role: 'chairman', 
      department: department.hq, 
      scope: ['all'] 
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case view_type.dashboard:
        return <MasterDashboard user={currentUser} />;
      case view_type.chat:
        return <ChatTerminal />;
      default:
        return (
          <div className="p-20 text-stone-700 font-mono italic">
            {`>> shard_sync_pending: ${activeView}...`}
          </div>
        );
    }
  };

  return (
    <AppShell 
      activeView={activeView} 
      setActiveView={setActiveView} 
      user={currentUser}
    >
      {renderContent()}
    </AppShell>
  );
};

export default App;