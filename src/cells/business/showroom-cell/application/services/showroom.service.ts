/**
 * NATT-OS — Showroom Cell
 * Application Service: ShowroomService
 * Quản lý lịch hẹn & trưng bày Tâm Luxury
 */

import { Appointment, AppointmentProps } from '../../domain/entities/appointment.entity';
import { ShowroomEngine } from '../../domain/services/showroom.engine';
import { DisplayZone } from '../../domain/value-objects/display-zone';

// ═══ COMMANDS ═══

export interface BookAppointmentCommand {
  customerId: string;
  customerName: string;
  phone: string;
  branchCode: string;
  scheduledAt: Date;
  durationMinutes?: number;
  purpose: string;
  itemsRequested?: string[];
  notes?: string;
}

// ═══ CONSTANTS ═══

export const DEFAULT_APPOINTMENT_DURATION = 60;    // 60 phút
export const MIN_BOOKING_NOTICE_HOURS = 2;         // Đặt lịch trước ít nhất 2h

// ═══ SERVICE ═══

export class ShowroomService {
  private appointments: Appointment[] = [];

  // ─── Booking ───

  bookAppointment(cmd: BookAppointmentCommand): { appointment: Appointment; errors: string[] } {
    const errors: string[] = [];

    const now = new Date();
    const minBookingTime = new Date(now.getTime() + MIN_BOOKING_NOTICE_HOURS * 3600 * 1000);

    if (cmd.scheduledAt < minBookingTime)
      errors.push(`Lịch hẹn phải đặt trước ít nhất ${MIN_BOOKING_NOTICE_HOURS} giờ`);

    const duration = cmd.durationMinutes ?? DEFAULT_APPOINTMENT_DURATION;

    // Conflict detection — cùng khách trong cùng thời điểm
    const conflict = ShowroomEngine.detectConflict(
      this.appointments,
      cmd.customerId,
      cmd.branchCode,
      cmd.scheduledAt,
      duration,
    );
    if (conflict) errors.push(`Khách đã có lịch hẹn ${conflict.scheduledAt.toLocaleString('vi-VN')} tại showroom này`);

    const props: AppointmentProps = {
      id: `AP-${Date.now()}`,
      customerId: cmd.customerId,
      customerName: cmd.customerName,
      phone: cmd.phone,
      branchCode: cmd.branchCode,
      scheduledAt: cmd.scheduledAt,
      durationMinutes: duration,
      status: 'BOOKED',
      purpose: cmd.purpose,
      itemsRequested: cmd.itemsRequested,
      notes: cmd.notes,
      createdAt: new Date(),
    };

    const appointment = new Appointment(props);
    if (errors.length === 0) this.appointments.push(appointment);
    return { appointment, errors };
  }

  // ─── Transitions ───

  confirm(id: string, staff: string): { success: boolean; error?: string } {
    const a = this.findById(id);
    if (!a) return { success: false, error: `Không tìm thấy lịch hẹn ${id}` };
    try { a.confirm(staff); return { success: true }; }
    catch (e) { return { success: false, error: String(e) }; }
  }

  start(id: string): { success: boolean; error?: string } {
    const a = this.findById(id);
    if (!a) return { success: false, error: `Không tìm thấy lịch hẹn ${id}` };
    try { a.start(); return { success: true }; }
    catch (e) { return { success: false, error: String(e) }; }
  }

  complete(id: string, notes?: string): { success: boolean; error?: string } {
    const a = this.findById(id);
    if (!a) return { success: false, error: `Không tìm thấy lịch hẹn ${id}` };
    try { a.complete(notes); return { success: true }; }
    catch (e) { return { success: false, error: String(e) }; }
  }

  markNoShow(id: string): { success: boolean; error?: string } {
    const a = this.findById(id);
    if (!a) return { success: false, error: `Không tìm thấy lịch hẹn ${id}` };
    try { a.noShow(); return { success: true }; }
    catch (e) { return { success: false, error: String(e) }; }
  }

  cancel(id: string): { success: boolean; error?: string } {
    const a = this.findById(id);
    if (!a) return { success: false, error: `Không tìm thấy lịch hẹn ${id}` };
    try { a.cancel(); return { success: true }; }
    catch (e) { return { success: false, error: String(e) }; }
  }

  // ─── Zone ───

  getZoneCapacity(zone: DisplayZone, currentCount: number) {
    return ShowroomEngine.getZoneCapacity(zone, currentCount);
  }

  // ─── Queries ───

  findById(id: string): Appointment | undefined {
    return this.appointments.find(a => a.id === id);
  }

  getByDate(date: Date): Appointment[] {
    return ShowroomEngine.getAppointmentsByDate(this.appointments, date);
  }

  getByBranch(branchCode: string): Appointment[] {
    return this.appointments.filter(a => a.branchCode === branchCode);
  }

  getUpcoming(): Appointment[] {
    return ShowroomEngine.getUpcoming(this.appointments);
  }

  getNoShows(): Appointment[] {
    return ShowroomEngine.getNoShows(this.appointments);
  }

  getNoShowRate(): number {
    const total = this.appointments.filter(a =>
      ['COMPLETED', 'NO_SHOW'].includes(a.status)
    ).length;
    const noShows = this.appointments.filter(a => a.status === 'NO_SHOW').length;
    return total > 0 ? Math.round(noShows / total * 100) : 0;
  }
}
