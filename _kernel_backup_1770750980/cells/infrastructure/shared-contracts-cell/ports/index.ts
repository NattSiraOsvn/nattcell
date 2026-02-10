// Shared Contracts Port Definitions
// Purpose: Shared type definitions and interfaces for EDA foundation

export interface DomainEvent {
    type: string;
    payload: any;
    timestamp: Date;
    metadata: Record<string, any>;
}

export interface Command {
    type: string;
    data: any;
    correlationId: string;
}

export interface Query {
    type: string;
    filters: Record<string, any>;
    options?: {
        limit?: number;
        offset?: number;
        sort?: Record<string, 1 | -1>;
    };
}

export type EventHandler<T = DomainEvent> = (event: T) => Promise<void>;
export type CommandHandler<T = Command> = (command: T) => Promise<any>;
export type QueryHandler<T = Query> = (query: T) => Promise<any>;
