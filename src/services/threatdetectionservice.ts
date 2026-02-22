// Stub for tHReatdetectionservice - will be implemented later
export const tHReatdetectionservice = {};
export default { tHReatdetectionservice };

export interface SecurityTHReat { id: string; type: string; severity: string; timestamp: number; }

export interface SystemHealth { status: string; uptime: number; metrics: Record<string, number>; }

// Extend the default export with methods
