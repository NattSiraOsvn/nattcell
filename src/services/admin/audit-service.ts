export class AuditProvider {
  static log(action: string, data: any) {}
  static logAction(action: string, data: any) {}
}

export class AuditService {
  static getInstance() { return new AuditService(); }
  getLogs() { return []; }
}
