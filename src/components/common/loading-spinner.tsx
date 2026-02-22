import React from 'react';
export default function LoadingSpinner({ size = 24, message }: { size?: number; message?: string }) {
  return React.createElement('div', { className: 'loading-spinner', style: { width: size, height: size } },
    message ? React.createElement('span', null, message) : null
  );
}
