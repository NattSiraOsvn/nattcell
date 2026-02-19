/**
 * NATT-OS — Showroom Cell
 * Domain Service: ShowroomEngine
 */

import { Appointment } from '../entities/appointment.entity';
import { DISPLAY_ZONES, DisplayZone } from '../value-objects/display-zone';

export class ShowroomEngine {
  static getAppointmentsByDate(appts: Appointment[], date: Date): Appointment[] {
    return appts.filter(a => {
      const d = a.scheduledAt;
      return d.getFullYear() === date.getFullYear()
        && d.getMonth() === date.getMonth()
        && d.getDate() === date.getDate();
    });
  }

  static getUpcoming(appts: Appointment[]): Appointment[] {
    const now = new Date();
    return appts.filter(a =>
      a.scheduledAt > now && a.status !== 'CANCELLED' && a.status !== 'COMPLETED'
    );
  }

  static getNoShows(appts: Appointment[]): Appointment[] {
    return appts.filter(a => a.status === 'NO_SHOW');
  }

  static getZoneCapacity(zone: DisplayZone, currentCount: number): { available: number; isFull: boolean } {
    const config = DISPLAY_ZONES[zone];
    return { available: config.maxItems - currentCount, isFull: currentCount >= config.maxItems };
  }

  /**
   * Detect booking conflict — cùng khách, cùng branch, overlap thời gian
   */
  static detectConflict(
    appts: Appointment[],
    customerId: string,
    branchCode: string,
    scheduledAt: Date,
    durationMinutes: number,
  ): Appointment | null {
    const newStart = scheduledAt.getTime();
    const newEnd = newStart + durationMinutes * 60 * 1000;

    for (const a of appts) {
      if (a.customerId !== customerId) continue;
      if (a.branchCode !== branchCode) continue;
      if (['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(a.status)) continue;

      const existStart = a.scheduledAt.getTime();
      const existEnd = existStart + a.durationMinutes * 60 * 1000;

      // Overlap check
      if (newStart < existEnd && newEnd > existStart) return a;
    }
    return null;
  }
}
