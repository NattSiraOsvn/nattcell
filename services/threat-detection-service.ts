
import { NotifyBus } from './notificationService';
import { PersonaID, AlertLevel, InputMetrics, InputPersona } from '../types';
import { ShardingService } from './blockchainService';
import { QuantumBuffer } from './quantumBufferService';
import { Calibration } from './calibration/CalibrationEngine';

// --- TYPES ---
export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'STAGING';
export type ThreatType = 'DOS_ATTACK' | 'MALICIOUS_FILE' | 'SPAM_BEHAVIOR' | 'ANOMALY' | 'BOT_DETECTED' | 'HONEYPOT_TRIGGER';

export interface SecurityThreat {
  id: string;
  type: ThreatType;
  level: ThreatLevel;
  details: string;
  timestamp: number;
  hash?: string;
  status: 'DETECTED' | 'BLOCKED' | 'MITIGATED' | 'LOGGED_TO_SERVER' | 'STAGED';
  sessionId: string;
  clientIP: string;
  userAgent: string;
}

export interface SecurityConfig {
  sensitivity: 'LOW' | 'MEDIUM' | 'HIGH' | 'ADAPTIVE';
  autoBlock: boolean;
  siemEndpoint?: string;
}

export interface SystemHealth {
  cpuLoad: number;
  memoryUsage: number;
  activeConnections: number;
  integrityStatus: 'SECURE' | 'COMPROMISED' | 'CHECKING';
  cpmMetrics?: InputMetrics;
}

class BehavioralTracker {
  private keyStamps: number[] = [];
  private clickStamps: number[] = [];
  private readonly WINDOW_MS = 60000; // 1 Minute window

  trackKey() { this.keyStamps.push(Date.now()); this.clean(); }
  trackClick() { this.clickStamps.push(Date.now()); this.clean(); }

  private clean() {
    const now = Date.now();
    this.keyStamps = this.keyStamps.filter(t => now - t < this.WINDOW_MS);
    this.clickStamps = this.clickStamps.filter(t => now - t < this.WINDOW_MS);
  }

  getMetrics(): InputMetrics {
    const intensity = (this.keyStamps.length / 300) + (this.clickStamps.length / 60); // Heuristic
    return {
      currentCPM: this.keyStamps.length,
      keystrokes: this.keyStamps.length,
      clicks: this.clickStamps.length,
      intensity: Math.min(1.0, intensity)
    };
  }
}

class ThreatDetectionService {
  private static instance: ThreatDetectionService;
  private tracker = new BehavioralTracker();
  private listeners: ((threat: SecurityThreat) => void)[] = [];
  private blockedEntities: Set<string> = new Set();
  
  private sessionId: string;
  private clientIP: string = '127.0.0.1'; // Mock
  
  private config: SecurityConfig = {
    sensitivity: 'ADAPTIVE',
    autoBlock: true,
    siemEndpoint: '/api/v1/security/log'
  };

  private healthMetrics: SystemHealth = {
    cpuLoad: 12,
    memoryUsage: 34,
    activeConnections: 1,
    integrityStatus: 'SECURE'
  };

  private constructor() {
    this.sessionId = `SESS-${Date.now()}`;
    this.startHeartbeat();
  }

  static getInstance(): ThreatDetectionService {
    if (!ThreatDetectionService.instance) {
      ThreatDetectionService.instance = new ThreatDetectionService();
    }
    return ThreatDetectionService.instance;
  }

  private startHeartbeat() {
    setInterval(() => {
      const metrics = this.tracker.getMetrics();
      this.healthMetrics = {
        ...this.healthMetrics,
        cpuLoad: Math.min(100, Math.max(5, this.healthMetrics.cpuLoad + (Math.random() - 0.5) * 5)),
        cpmMetrics: metrics
      };

      // --- ADAPTIVE RATE LIMIT CHECK ---
      if (this.config.sensitivity === 'ADAPTIVE') {
          const threshold = Calibration.calculateAdaptiveThreshold('MASTER_NATT', metrics.intensity);
          if (metrics.currentCPM > threshold) {
              this.triggerStagingFlow(`High Activity Detected: ${metrics.currentCPM} CPM (Threshold: ${threshold.toFixed(0)})`);
          }
      }
    }, 2000);
  }

  public updateConfig(newConfig: Partial<SecurityConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public trackUserActivity(type: string) {
    if (type === 'keydown') this.tracker.trackKey();
    if (type === 'click') this.tracker.trackClick();
  }

  public trackKeystroke() { this.tracker.trackKey(); }

  private triggerStagingFlow(reason: string) {
    QuantumBuffer.enqueue('TRAFFIC_STAGING', { reason }, 1);
    
    const threat: SecurityThreat = {
      id: `STAGE-${Date.now()}`,
      type: 'ANOMALY',
      level: 'STAGING',
      details: reason,
      timestamp: Date.now(),
      status: 'STAGED',
      sessionId: this.sessionId,
      clientIP: this.clientIP,
      userAgent: navigator.userAgent
    };

    this.listeners.forEach(l => l(threat));
  }

  private triggerThreat(type: ThreatType, level: ThreatLevel, details: string) {
    const threat: SecurityThreat = {
      id: `THREAT-${Date.now()}`,
      type, level, details,
      timestamp: Date.now(),
      status: 'DETECTED',
      sessionId: this.sessionId,
      clientIP: this.clientIP,
      userAgent: navigator.userAgent
    };

    if (this.config.autoBlock && (level === 'CRITICAL' || level === 'HIGH')) {
        this.blockedEntities.add(this.clientIP);
        threat.status = 'BLOCKED';
    }

    NotifyBus.push({
      type: 'RISK',
      title: `SECURITY ALERT: ${type}`,
      content: details,
      persona: PersonaID.KRIS
    });

    this.listeners.forEach(l => l(threat));
  }

  public subscribe(listener: (threat: SecurityThreat) => void) {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  public getHealth() { return this.healthMetrics; }
  public getConfig() { return this.config; }
  public getBlockedEntities() { return Array.from(this.blockedEntities); }
  public async scanFile(file: File) { return true; } // Placeholder
  public checkInputContent(content: string) {} // Placeholder
}

export const ThreatDetection = ThreatDetectionService.getInstance();
export default ThreatDetection;
