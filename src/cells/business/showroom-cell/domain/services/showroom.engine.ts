import { Appointment } from '../entities/appointment.entity';
import { DISPLAY_ZONES, DisplayZone } from '../value-objects/display-zone';

export class ShowroomEngine {
  static getAppointmentsByDate(appts: Appointment[], date: Date): Appointment[] {
    return appts.filter(a => { const d = a.scheduledAt; return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth() && d.getDate() === date.getDate(); });
  }
  static getUpcoming(appts: Appointment[]): Appointment[] {
    const now = new Date(); return appts.filter(a => a.scheduledAt > now && a.status !== 'CANCELLED' && a.status !== 'COMPLETED');
  }
  static getNoShows(appts: Appointment[]): Appointment[] { return appts.filter(a => a.status === 'NO_SHOW'); }
  static getZoneCapacity(zone: DisplayZone, currentCount: number): { available: number; isFull: boolean } {
    const config = DISPLAY_ZONES[zone]; return { available: config.maxItems - currentCount, isFull: currentCount >= config.maxItems };
  }
}
