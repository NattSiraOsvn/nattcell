import React from 'react';

interface SecurityOverlayProps {
  userId?: string;
  reason?: string;
}

export const SecurityOverlay: React.FC<SecurityOverlayProps> = ({ userId, reason }) => {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(220,0,0,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>🔒 OMEGA LOCKDOWN</h1>
        <p>User: {userId}</p>
        <p>Reason: {reason}</p>
      </div>
    </div>
  );
};

// Window event listener cho OMEGA_LOCKDOWN
if (typeof window !== 'undefined') {
  window.addEventListener('OMEGA_LOCKDOWN', (e: any) => {
    console.error('[SECURITY] LOCKDOWN TRIGGERED', e.detail);
  });
}

export default SecurityOverlay;
