export class PhysicsEngine {
  static applySpring(current: number, target: number, _velocity: number): { position: number; velocity: number } {
    const stiffness = 0.1;
    const position = current + (target - current) * stiffness;
    return { position, velocity: target - current };
  }
  static simulate(_config?: object): void {}
}
