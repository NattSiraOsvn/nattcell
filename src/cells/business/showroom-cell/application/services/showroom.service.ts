import { Appointment } from '../../domain/entities/appointment.entity';
import { ShowroomEngine } from '../../domain/services/showroom.engine';
import { DisplayZone } from '../../domain/value-objects/display-zone';
export class ShowroomService {
  private appointments: Appointment[] = [];
  book(a: Appointment) { this.appointments.push(a); }
  findById(id: string) { return this.appointments.find(a => a.id === id); }
  getByDate(date: Date) { return ShowroomEngine.getAppointmentsByDate(this.appointments, date); }
  getUpcoming() { return ShowroomEngine.getUpcoming(this.appointments); }
  getZoneCapacity(zone: DisplayZone, count: number) { return ShowroomEngine.getZoneCapacity(zone, count); }
}
