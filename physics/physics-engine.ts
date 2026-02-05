
/**
 * ⚛️ NATT-OS PHYSICS ENGINE v8.0
 * Lõi tính toán chuyển động cơ học cho UI Runtime.
 */
export class PhysicsEngine {
  static readonly DRAG = 0.92;
  static readonly SPRING = 0.35;
  static readonly FRICTION = 0.88;
  static readonly GRAVITY = 0.5;

  /**
   * Tính toán vị trí dựa trên lực đàn hồi
   */
  static applySpring(current: number, target: number, velocity: number) {
    const force = (target - current) * this.SPRING;
    let nextVelocity = (velocity + force) * this.DRAG;
    return { position: current + nextVelocity, velocity: nextVelocity };
  }

  /**
   * Tính toán quán tính và ma sát
   */
  static applyInertia(position: number, velocity: number) {
    let nextVelocity = velocity * this.FRICTION;
    return { position: position + nextVelocity, velocity: nextVelocity };
  }

  /**
   * Kiểm tra va chạm giữa 2 thực thể hình tròn trong không gian 2D
   */
  static checkCollision(obj1: {x: number, y: number, r: number}, obj2: {x: number, y: number, r: number}) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = obj1.r + obj2.r;
    
    if (distance < minDistance) {
      return {
        collided: true,
        overlap: minDistance - distance,
        forceX: dx / distance,
        forceY: dy / distance
      };
    }
    return { collided: false, overlap: 0, forceX: 0, forceY: 0 };
  }
}
