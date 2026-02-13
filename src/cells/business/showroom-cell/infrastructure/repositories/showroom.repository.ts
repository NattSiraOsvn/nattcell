import { Appointment, AppointmentProps } from '../../domain/entities/appointment.entity';
export class InMemoryShowroomRepository {
  private store: Map<string, AppointmentProps> = new Map();
  async findById(id: string) { const d = this.store.get(id); return d ? new Appointment(d) : null; }
  async save(a: Appointment) { this.store.set(a.id, a.toJSON()); }
  async getAll() { return Array.from(this.store.values()).map(d => new Appointment(d)); }
}
