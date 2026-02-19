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
