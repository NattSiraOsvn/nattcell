
import { 
  QuantumState, QuantumEvent, ConsciousnessField, 
  EntanglementPair, NeuralPulse, PersonaID 
} from '../types';
import { ShardingService } from './blockchainService';
import { NotifyBus } from './notificationService';

// --- CONSTANTS ---
const COHERENCE_DECAY = 0.05; // Mất tính kết hợp theo thời gian
const MAX_ENTROPY = 100;

/**
 * QUANTUM FLOW ORCHESTRATOR (QFO)
 * Hệ thần kinh xử lý phi tuyến tính, mô phỏng hành vi lượng tử
 * để đưa ra quyết định tối ưu trong môi trường hỗn loạn.
 */
export class QuantumFlowEngine {
  private static instance: QuantumFlowEngine;
  
  // Trạng thái hệ thống (System State)
  private state: QuantumState = {
    coherence: 1.0,
    entropy: 10,
    superpositionCount: 0,
    entanglementCount: 0,
    energyLevel: 0.8,
    waveFunction: { amplitude: 0.7, phase: 0, frequency: 440 }
  };

  // Trường Ý Thức (Consciousness Field)
  private consciousness: ConsciousnessField = {
    awarenessLevel: 0.5,
    focusPoints: [],
    mood: 'STABLE',
    lastCollapse: Date.now()
  };

  private entanglements: EntanglementPair[] = [];
  private events: QuantumEvent[] = [];
  private listeners: ((state: QuantumState, consciousness: ConsciousnessField) => void)[] = [];

  // Giả lập Neural Network đơn giản
  private neurons = new Map<string, number>(); // ID -> Activation Level

  private constructor() {
    this.startHeartbeat();
  }

  public static getInstance() {
    if (!QuantumFlowEngine.instance) QuantumFlowEngine.instance = new QuantumFlowEngine();
    return QuantumFlowEngine.instance;
  }

  /**
   * Vòng lặp sự sống (Game Loop của hệ thống)
   */
  private startHeartbeat() {
    setInterval(() => {
      // 1. Decoherence (Mất dần tính kết hợp)
      if (this.state.coherence > 0.2) {
        this.state.coherence -= COHERENCE_DECAY * Math.random();
      }

      // 2. Wave Function Oscillation (Dao động sóng)
      this.state.waveFunction.phase += 0.1;
      this.state.waveFunction.amplitude = 0.5 + Math.sin(Date.now() / 1000) * 0.2;

      // 3. Update Consciousness based on Entropy
      if (this.state.entropy > 80) this.consciousness.mood = 'CRITICAL';
      else if (this.state.entropy > 50) this.consciousness.mood = 'CAUTIOUS';
      else this.consciousness.mood = 'STABLE';

      this.notifyListeners();
    }, 1000);
  }

  // --- SENSITIVITY ANALYZER ---

  /**
   * Phân tích sự kiện đầu vào và tính toán Vector Độ Nhạy
   */
  public analyzeSensitivity(eventType: string, data: any): QuantumEvent {
    // Heuristic Logic: Định nghĩa độ nhạy dựa trên quy tắc nghiệp vụ
    let temporal = 0.2;
    let financial = 0.1;
    let risk = 0.1;
    let operational = 0.3;

    if (eventType.includes('ORDER')) {
        financial = 0.9;
        temporal = 0.7; // Khách hàng chờ
    }
    if (eventType.includes('RISK') || eventType.includes('ALERT')) {
        risk = 0.95;
        temporal = 1.0; // Xử lý ngay
    }
    if (eventType.includes('PRODUCTION')) {
        operational = 0.8;
    }

    // Nếu giá trị đơn hàng lớn -> Tăng Financial & Risk
    if (data.amount && data.amount > 1000000000) { // > 1 Tỷ
        financial = 1.0;
        risk += 0.3;
    }

    const probability = (temporal + financial + risk + operational) / 4;

    return {
      id: `Q-EVT-${Date.now()}`,
      type: eventType,
      sensitivityVector: { temporal, financial, risk, operational },
      status: 'SUPERPOSITION',
      probability,
      timestamp: Date.now()
    };
  }

  // --- CORE PROCESSING ---

  /**
   * Tiếp nhận sự kiện từ thế giới bên ngoài (EventBridge)
   */
  public processEvent(eventType: string, data: any) {
    // 1. Analyze
    const qEvent = this.analyzeSensitivity(eventType, data);
    this.events.push(qEvent);
    this.state.superpositionCount++;

    // 2. Update System Energy
    this.state.energyLevel = Math.min(1.0, this.state.energyLevel + 0.05);
    this.state.entropy += (qEvent.sensitivityVector.risk * 5);

    // 3. Entanglement Logic (Tạo mối liên kết)
    if (eventType === 'SALES_ORDER_CREATED') {
       this.createEntanglement('SALES', 'INVENTORY', 0.8);
       this.createEntanglement('SALES', 'FINANCE', 0.9);
    }

    // 4. Wave Function Collapse Check (Quyết định sụp đổ hay giữ chồng chập)
    if (qEvent.probability > 0.8 || qEvent.sensitivityVector.risk > 0.8) {
        this.collapseWaveFunction(qEvent);
    } else {
        console.log(`[QUANTUM] Sự kiện ${eventType} được giữ ở trạng thái chồng chập (Chưa quyết định).`);
    }

    this.notifyListeners();
  }

  /**
   * Sụp đổ hàm sóng: Đưa ra quyết định cụ thể
   */
  private collapseWaveFunction(event: QuantumEvent) {
    event.status = 'COLLAPSED';
    this.state.superpositionCount--;
    this.state.coherence = 1.0; // Reset coherence khi có quyết định
    this.consciousness.lastCollapse = Date.now();
    this.consciousness.focusPoints.push(event.type);
    
    // Giảm Entropy sau khi xử lý
    this.state.entropy = Math.max(0, this.state.entropy - 10);

    // Decision Logic
    if (event.sensitivityVector.risk > 0.8) {
        event.decision = 'KÍCH HOẠT GIAO THỨC BẢO MẬT CAO (OMEGA LOCK)';
        NotifyBus.push({
            type: 'RISK',
            title: 'Sụp Đổ Hàm Sóng: RỦI RO CAO',
            content: `Hệ thống đã tự động kích hoạt cơ chế phòng vệ do phát hiện sự kiện ${event.type} có độ nhạy rủi ro ${(event.sensitivityVector.risk * 100).toFixed(0)}%.`,
            persona: PersonaID.KRIS
        });
    } else if (event.sensitivityVector.financial > 0.8) {
        event.decision = 'ƯU TIÊN XỬ LÝ (FAST TRACK)';
        NotifyBus.push({
            type: 'SUCCESS',
            title: 'Sụp Đổ Hàm Sóng: Ưu Tiên',
            content: `Đơn hàng giá trị cao đã được đưa vào luồng Fast Track.`,
            persona: PersonaID.CAN
        });
    }

    console.log(`[QUANTUM] Collapsed Event: ${event.type} -> Decision: ${event.decision}`);
  }

  private createEntanglement(entityA: string, entityB: string, strength: number) {
      const id = `ENT-${Date.now()}`;
      this.entanglements.push({
          id, entityA, entityB, strength, type: strength > 0.8 ? 'GHZ_STATE' : 'BELL_PAIR'
      });
      this.state.entanglementCount++;
  }

  // --- PUBLIC API FOR UI ---

  public subscribe(listener: (state: QuantumState, consciousness: ConsciousnessField) => void) {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  private notifyListeners() {
    this.listeners.forEach(l => l({ ...this.state }, { ...this.consciousness }));
  }

  public getEvents() { return this.events; }
  public getEntanglements() { return this.entanglements; }
  
  public manualCollapse() {
      // Cho phép người dùng can thiệp thủ công (Observation Effect)
      this.state.coherence = 1.0;
      this.state.entropy = 0;
      this.events.forEach(e => {
          if (e.status === 'SUPERPOSITION') this.collapseWaveFunction(e);
      });
      this.notifyListeners();
  }
}

export const QuantumBrain = QuantumFlowEngine.getInstance();
