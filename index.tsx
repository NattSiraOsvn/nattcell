
// 👑 sovereign: anh_nat
import React from 'react';
import { createRoot } from 'react-dom/client';
import AppComponent from './app.tsx';

// 🛠️ Fixed: Use standard React DOM client methods
const rootEl = document.getElementById('root');

if (rootEl) {
  const root = createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <AppComponent />
    </React.StrictMode>
  );
}
