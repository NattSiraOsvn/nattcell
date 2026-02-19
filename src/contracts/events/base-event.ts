export interface BaseEvent {
  event_id: string;
  event_type: string;
  timestamp: number;
  payload: any;
}
