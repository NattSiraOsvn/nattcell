
import { ShiftSession } from '../../types';
import { NotifyBus } from '../notificationService';

export class ShiftService {
  static async startShift(employeeId: string, startCash: number): Promise<ShiftSession> {
    return {
      id: `SHIFT_${Date.now()}`,
      employeeId,
      startTime: Date.now(),
      openingCash: startCash,
      status: 'OPEN'
    };
  }

  static async endShift(shiftId: string, endCash: number, systemRevenue: number) {
    const difference = endCash - systemRevenue;
    
    if (Math.abs(difference) > 1000) {
      NotifyBus.push({
        type: 'RISK',
        title: 'LỆCH TIỀN CA LÀM VIỆC',
        content: `Ca ${shiftId} lệch: ${difference.toLocaleString()} VND. Yêu cầu giải trình ngay.`,
        priority: 'HIGH'
      });
    }

    return { 
      status: 'CLOSED', 
      endTime: Date.now(),
      endCash,
      difference 
    };
  }
}
