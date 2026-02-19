export class QuantumBrain {
  static think() { return 'thought'; }
  static subscribe(callback?: any) { return { unsubscribe: () => {} }; }
  static getEvents() { return []; }
  static manualCollapse() { return; }
}
