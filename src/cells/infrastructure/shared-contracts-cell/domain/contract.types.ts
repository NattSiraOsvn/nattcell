export type DotCase =
  `${Lowercase<string>}.${Lowercase<string>}` |
  `${Lowercase<string>}.${Lowercase<string>}.${Lowercase<string>}`;

export interface CellContract<
  TEmit extends readonly DotCase[],
  TConsume extends readonly (DotCase | '*')[]
> {
  cellId: string;
  emits: TEmit;
  consumes: TConsume;
}

export type DomainEvent = {
  eventId: string;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  timestamp: number;
  payload: any;
};
