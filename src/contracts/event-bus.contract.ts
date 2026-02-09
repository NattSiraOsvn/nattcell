/**
 * EVENT BUS CONTRACT - NATT-OS SmartLink Communication
 * Điều 13: Mọi giao tiếp qua EventBus
 */

import { BaseEvent } from './base-event.contract';

export type EventHandler = (event: BaseEvent) => Promise<void>;

export interface EventSubscription {
  id: string;
  pattern: string;
  handler: EventHandler;
  cell_id: string;
  created_at: number;
}

export interface PublishOptions {
  retry_count?: number;
  delay_ms?: number;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
}

export interface IEventBus {
  publish(event: BaseEvent, options?: PublishOptions): Promise<void>;
  subscribe(pattern: string, handler: EventHandler, cell_id: string): EventSubscription;
  unsubscribe(subscriptionId: string): void;
  getSubscriptions(): EventSubscription[];
  getEventHistory(limit?: number): BaseEvent[];
}

export class InMemoryEventBus implements IEventBus {
  private subscriptions: Map<string, EventSubscription> = new Map();
  private eventHistory: BaseEvent[] = [];
  private maxHistorySize = 1000;
  
  async publish(event: BaseEvent, options?: PublishOptions): Promise<void> {
    // Store in history
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
    
    // Find matching subscribers
    const handlers: EventHandler[] = [];
    
    for (const sub of this.subscriptions.values()) {
      if (this.matchPattern(sub.pattern, event.event_type)) {
        handlers.push(sub.handler);
      }
    }
    
    // Execute handlers
    const delay = options?.delay_ms || 0;
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    await Promise.all(handlers.map(h => h(event).catch(console.error)));
  }
  
  subscribe(pattern: string, handler: EventHandler, cell_id: string): EventSubscription {
    const subscription: EventSubscription = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      pattern,
      handler,
      cell_id,
      created_at: Date.now(),
    };
    
    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }
  
  unsubscribe(subscriptionId: string): void {
    this.subscriptions.delete(subscriptionId);
  }
  
  getSubscriptions(): EventSubscription[] {
    return Array.from(this.subscriptions.values());
  }
  
  getEventHistory(limit: number = 100): BaseEvent[] {
    return this.eventHistory.slice(-limit);
  }
  
  private matchPattern(pattern: string, eventType: string): boolean {
    if (pattern === '*') return true;
    if (pattern.endsWith('.*')) {
      const prefix = pattern.slice(0, -2);
      return eventType.startsWith(prefix + '.');
    }
    return pattern === eventType;
  }
}
