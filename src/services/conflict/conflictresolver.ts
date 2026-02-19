export class ConflictEngine {
  static resolve(conflict: any) { return conflict; }
  static resolveConflicts(conflicts: any[], context?: any): any[] {
    return conflicts.map(c => ({ ...this.resolve(c), context }));
  }
}
