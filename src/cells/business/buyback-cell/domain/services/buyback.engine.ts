import { BuybackTransaction } from '../entities/buyback-transaction.entity';
import { AUTHENTICATION_REQUIRED_THRESHOLD, MIN_GOLD_WEIGHT_GRAM } from '../value-objects/buyback-rules';

export class BuybackEngine {
  static validateTransaction(tx: BuybackTransaction): string[] {
    const errors: string[] = [];
    if (tx.goldWeightGram < MIN_GOLD_WEIGHT_GRAM) errors.push(`Trọng lượng vàng tối thiểu ${MIN_GOLD_WEIGHT_GRAM}g`);
    if (tx.requiresAuthentication && !tx.toJSON().isAuthenticated) errors.push('Cần xác thực nguồn gốc sản phẩm');
    return errors;
  }

  static needsAuthentication(estimatedValue: number): boolean {
    return estimatedValue >= AUTHENTICATION_REQUIRED_THRESHOLD;
  }
}
