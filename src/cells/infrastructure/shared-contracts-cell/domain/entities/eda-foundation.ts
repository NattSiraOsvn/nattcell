export interface IdempotencyKey {
  hashKey: string;
  ttl: number; // Thời gian sống
  createdAt: Date;
}

export interface OutboxEvent {
  eventId: string;
  topic: string;
  payload: any;
  status: 'PENDING' | 'PUBLISHED' | 'FAILED';
  retryCount: number;
  createdAt: Date;
}
