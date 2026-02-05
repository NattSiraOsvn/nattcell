
export type PaymentProvider = 'VNPAY' | 'MOMO' | 'ZALOPAY';

export interface PaymentRequest {
  orderId: string;
  amount: number;
  provider: PaymentProvider;
  customerName: string;
}

export interface PaymentResponse {
  paymentUrl: string;
  qrCodeUrl: string;
  transactionId: string;
}

export class PaymentEngine {
  static async createPayment(req: PaymentRequest): Promise<PaymentResponse> {
    await new Promise(r => setTimeout(r, 1200));
    const transactionId = `TL-${req.provider}-${Date.now().toString().slice(-6)}`;
    const qrPayload = JSON.stringify({ orderId: req.orderId, amount: req.amount, provider: req.provider, txnId: transactionId });
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrPayload)}&bgcolor=ffffff&color=${this.getProviderColor(req.provider)}`;
    return { paymentUrl: `https://sandbox.payment-gateway.vn/redirect/${transactionId}`, qrCodeUrl, transactionId };
  }
  private static getProviderColor(provider: PaymentProvider): string {
    switch (provider) {
      case 'VNPAY': return '005baa';
      case 'MOMO': return 'ae2070';
      case 'ZALOPAY': return '00aaff';
      default: return '000000';
    }
  }
}
