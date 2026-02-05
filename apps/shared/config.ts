
/**
 * ⚙️ SHARED CONFIGURATION - TEAM 2
 * Quản lý các tham số vận hành cho Finance & HR Services.
 */
export const config = {
  // Database Mock (In-browser storage)
  database: {
    finance: {
      storageKey: 'NATT_OS_FINANCE_DB',
      provider: 'IndexedDB/LocalStorage'
    },
    hr: {
      storageKey: 'NATT_OS_HR_DB',
      provider: 'IndexedDB/LocalStorage'
    },
  },
  
  // Event Bus Configuration
  eventBus: {
    type: 'internal-bridge', // Hoặc 'pubsub' trong tương lai
    emulatorHost: null,
  },
  
  // Security
  security: {
    encryptionAlgorithm: 'AES-256-GCM',
    sealingProtocol: 'OMEGA_V2'
  },
  
  // Feature Flags
  features: {
    enableAudit: true,
    enableIdempotency: true,
    enableCompensation: true,
    mockMode: false,
  },
} as const;
