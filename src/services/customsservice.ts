export class CustomsRobotEngine {
  static process(declaration: any) { return { success: true }; }
  static batchProcess(declarations: any[]) { return declarations.map(d => ({ ...this.process(d), actionPlans: [] })); }
}
