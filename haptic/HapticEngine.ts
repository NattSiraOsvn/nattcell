
/**
 * ⚡ NATT-OS HAPTIC ENGINE v8.0
 * Giao thức phản hồi xúc giác và lực lượng tử.
 */
export class HapticEngine {
  static patterns = {
    click: [10],
    confirm: [40, 20, 40],
    error: [100, 50, 100, 50],
    heavy: [150, 0, 150],
    light: [5],
    spatial: [20, 0, 40, 0, 60]
  };

  static vibrate(pattern: keyof typeof HapticEngine.patterns | number[] = 'click') {
    if (!navigator.vibrate) return;
    const sequence = typeof pattern === 'string' ? this.patterns[pattern] : pattern;
    navigator.vibrate(sequence);
  }

  /**
   * Giả lập áp lực thông qua sóng âm tần số thấp
   * @param force Độ mạnh từ 0 -> 1
   */
  static async simulateForce(force: number) {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(60 + (force * 40), audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(Math.min(0.1, force * 0.1), audioCtx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2 + (force * 0.2));
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
      }, 500);
    } catch (e) {
      // Thầm lặng nếu AudioContext bị block
    }
  }
}
