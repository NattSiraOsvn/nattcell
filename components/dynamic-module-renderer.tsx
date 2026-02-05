// 👑 sovereign: anh_nat
import react from 'react';
import { view_type } from '../types.ts';
import master_dashboard from './master-dashboard.tsx';

const dynamic_module_renderer = (props: any) => {
  const { view } = props;

  switch (view) {
    case view_type.dashboard:
      return react.create_element(master_dashboard, null);
    default:
      return react.create_element('div', { className: 'p-20 text-stone-800 italic font-mono' }, '>> awaiting_shard_sync...');
  }
};

export default dynamic_module_renderer;