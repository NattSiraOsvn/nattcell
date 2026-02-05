
/**
 * 🛰️ OFFLINE & SERVICE WORKER ENFORCER
 * Status: v2.2 - ENVIRONMENT_AWARE_STABLE
 */
export class OfflineService {
  private static instance: OfflineService;
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'omegaDB';
  private readonly STORE_NAME = 'offlineQueue';

  private constructor() {}

  static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService();
    }
    return OfflineService.instance;
  }

  /**
   * Initialize Offline Services with graceful degradation.
   * Prevents Service Worker registration in restricted sandbox environments.
   */
  async initialize(): Promise<boolean> {
    const origin = window.location.origin;
    const isGoogleAIStudio = origin.includes('scf.usercontent.goog');
    const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');

    console.log('[OfflineService] Checking node environment capabilities...');

    try {
      // 1. Always attempt to initialize local DB as it's safe and useful for transient caching
      await this.initDB();

      // 2. Service Worker logic
      if (!('serviceWorker' in navigator)) {
        console.info('[OfflineService] Service Workers not supported by this browser.');
        return false;
      }

      if (isGoogleAIStudio) {
        // Prevent attempting registration at all to avoid unavoidable origin mismatch errors
        console.info('[OfflineService] Google AI Studio sandbox detected - offline capabilities disabled (normal behavior).');
        console.info('[OfflineService] Skipping Service Worker registration to maintain system integrity.');
        return false;
      }

      // 3. Only attempt registration in supported environments (Local or Real Domain)
      try {
        const swUrl = './sw.js'; // Relative path
        const registration = await navigator.serviceWorker.register(swUrl, {
          scope: './',
          updateViaCache: 'none'
        });
        
        console.log('[OfflineService] Service Worker successfully sealed at scope:', registration.scope);
        return true;
      } catch (swError: any) {
        console.info('[OfflineService] ⓘ SW registration skipped or failed:', swError.message);
        return false;
      }

    } catch (dbError) {
      console.warn('[OfflineService] Local DB initialization failed:', dbError);
      return false;
    }
  }

  /**
   * Compatibility method for legacy calls.
   */
  async init(): Promise<void> {
    await this.initialize();
  }

  private initDB(): Promise<void> {
    return new Promise((resolve) => {
      if (!('indexedDB' in window)) {
        resolve();
        return;
      }

      const request = indexedDB.open(this.DB_NAME, 2);
      request.onerror = () => resolve();
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('appCache')) {
            db.createObjectStore('appCache', { keyPath: 'key' });
        }
      };
    });
  }

  async saveData(key: string, data: any, storeName: string = 'appCache'): Promise<void> {
    if (!this.db) return;
    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(storeName === this.STORE_NAME ? data : { key, data });
        request.onerror = () => resolve();
        request.onsuccess = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }

  async loadData(key: string, storeName: string = 'appCache'): Promise<any> {
    if (!this.db) return null;
    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);
        request.onerror = () => resolve(null);
        request.onsuccess = () => resolve(request.result?.data || request.result);
      } catch (e) {
        resolve(null);
      }
    });
  }

  isOnline(): boolean {
    return navigator.onLine;
  }
}

export default OfflineService.getInstance();
