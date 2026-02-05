
/**
 * 🧠 RETRY ENGINE
 * Xử lý lỗi tạm thời (Transient Errors) theo cơ chế Exponential Backoff.
 */
export class RetryPolicy {
  private static MAX_ATTEMPTS = 3;
  private static BASE_DELAY = 1000; // 1 giây

  public static async execute<T>(
    action: () => Promise<T>, 
    context: string,
    onFinalFailure: (error: any) => Promise<void>
  ): Promise<T | null> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= this.MAX_ATTEMPTS; attempt++) {
      try {
        return await action();
      } catch (error) {
        lastError = error;
        const delay = this.BASE_DELAY * Math.pow(2, attempt - 1);
        console.warn(`[RETRY-ENGINE] ${context} thất bại lần ${attempt}/${this.MAX_ATTEMPTS}. Thử lại sau ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    console.error(`[RETRY-ENGINE] ${context} thất bại hoàn toàn sau ${this.MAX_ATTEMPTS} lần.`);
    await onFinalFailure(lastError);
    return null;
  }
}
