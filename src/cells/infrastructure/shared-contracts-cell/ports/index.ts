export interface DomainEvent { type: string; payload: any; timestamp: Date; }
export interface Command { type: string; data: any; correlationId: string; }
export interface Query { type: string; filters: any; }
export class CellViolationError extends Error { 
    constructor(code: string, msg: string, public metadata: any) { super(msg); } 
}
