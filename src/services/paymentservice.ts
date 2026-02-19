export class PaymentEngine {
  static process(amount: number) { return { success: true }; }
}
export class PaymentResponse {
  constructor(public success: boolean, public transactionId?: string) {}
}
