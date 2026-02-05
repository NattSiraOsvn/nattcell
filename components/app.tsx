// 👑 sovereign: anh_nat
import react from 'react';
import { view_type, user_role, department } from '../types.ts';
import app_shell from './app-shell.tsx';
import master_dashboard from './master-dashboard.tsx';

const app = () => {
  // 🛠️ usestate đã được ánh xạ lowercase
  const [active_view, set_active_view] = react.usestate(view_type.dashboard);

  const current_user = {
    role: user_role.master,
    position: { 
      id: 'master_01', 
      role: 'chairman', 
      department: department.hq, 
      scope: ['all'] 
    }
  };

  const render_content = () => {
    switch (active_view) {
      case view_type.dashboard:
        return react.create_element(master_dashboard, { user: current_user });
      default:
        return react.create_element('div', { 
          className: 'p-20 text-stone-600 font-mono italic' 
        }, '>> shard_sync_pending...');
    }
  };

  return react.create_element(app_shell, {
    active_view,
    set_active_view,
    user: current_user
  }, render_content());
};

export default app;