export const AuditService = {
  log: (action: string, data: any) => {},
};

export class AuditProvider {
  static logAction(_actor: string, _action: string, _meta?: unknown): void {}
  static getInstance(): AuditProvider { return new AuditProvider(); }
}
export default AuditProvider;
