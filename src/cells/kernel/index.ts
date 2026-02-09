// Kernel Cells Exports
export * from './config-cell';
export * from './rbac-cell';
export * from './monitor-cell';
export * from './audit-cell';
export * from './security-cell';

// Kernel initialization
export async function initializeKernel(): Promise<void> {
  console.log('🏛️ Initializing NATT-OS Kernel...');
  
  // Initialize in dependency order
  const imports = await Promise.all([
    import('./config-cell'),
    import('./rbac-cell'),
    import('./monitor-cell'),
    import('./audit-cell'),
    import('./security-cell')
  ]);
  
  console.log('✅ Kernel cells initialized');
  
  // Transition to STATE_2
  const { stateRegistry } = await import('../../core/state');
  await stateRegistry.transitionTo(
    'STATE_2',
    [
      'config-cell:initialized',
      'rbac-cell:initialized',
      'monitor-cell:initialized',
      'audit-cell:initialized',
      'security-cell:initialized'
    ],
    true // Gatekeeper approval
  );
  
  console.log('🏛️ Constitutional State: STATE_2 (Kernel Core Bare Metal)');
}
