
import { InputPersona, CalibrationData, InputMetrics } from '../../types';

export class CalibrationEngine {
  private static instance: CalibrationEngine;
  private userProfiles: Map<string, CalibrationData> = new Map();

  // Ngưỡng cơ sở cho các Persona (CPM - Characters Per Minute)
  private readonly PERSONA_BASELINES: Record<string, number> = {
    ['OFFICE']: 150,
    ['DATA_ENTRY']: 450,
    ['PHARMACY']: 300,
    ['EXPERT']: 350,
    ['MASTER']: 500
  };

  public static getInstance(): CalibrationEngine {
    if (!CalibrationEngine.instance) CalibrationEngine.instance = new CalibrationEngine();
    return CalibrationEngine.instance;
  }

  /**
   * Lưu trữ hồ sơ đã hiệu chuẩn của người dùng
   */
  public saveProfile(profile: CalibrationData) {
    this.userProfiles.set(profile.userId, profile);
    localStorage.setItem(`CALIB_PROFILE_${profile.userId}`, JSON.stringify(profile));
    console.log(`[CALIBRATION] Profile locked for ${profile.userId}: ${profile.persona} @ ${profile.avgCPM} CPM`);
  }

  public getProfile(userId: string): CalibrationData | null {
    const cached = this.userProfiles.get(userId);
    if (cached) return cached;
    
    const stored = localStorage.getItem(`CALIB_PROFILE_${userId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      this.userProfiles.set(userId, parsed);
      return parsed;
    }
    return null;
  }

  /**
   * Thuật toán phân loại Persona dựa trên mẫu test 60s
   */
  public identifyPersona(metrics: InputMetrics): { persona: keyof InputPersona, confidence: number } {
    const cpm = metrics.currentCPM;
    let bestPersona: keyof InputPersona = 'OFFICE';
    let minDiff = Infinity;

    Object.entries(this.PERSONA_BASELINES).forEach(([persona, baseline]) => {
        const diff = Math.abs(cpm - baseline);
        if (diff < minDiff) {
            minDiff = diff;
            bestPersona = persona as keyof InputPersona;
        }
    });

    // Tính độ tin cậy dựa trên tính ổn định (Giả lập)
    const confidence = Math.max(0.6, 1 - (minDiff / 500));

    return { persona: bestPersona, confidence };
  }

  /**
   * Tính toán ngưỡng linh hoạt (Adaptive Threshold)
   */
  public calculateAdaptiveThreshold(userId: string, currentIntensity: number): number {
    const profile = this.getProfile(userId);
    if (!profile) return 200; // Default CPM limit

    // Ngưỡng = CPM trung bình * Burst Capacity * Cường độ hiện tại
    const base = profile.avgCPM;
    const burst = profile.burstCapacity || 1.5;
    
    return base * burst * (1 + currentIntensity * 0.5);
  }
}

export const Calibration = CalibrationEngine.getInstance();
