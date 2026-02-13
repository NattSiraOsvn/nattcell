/**
 * NATT-OS — Warranty Cell — Application Service
 */
import { WarrantyClaim } from '../../domain/entities/warranty-claim.entity';
import { WarrantyEngine, WarrantyCheckInput, WarrantyCheckResult } from '../../domain/services/warranty.engine';

export class WarrantyService {
  private claims: WarrantyClaim[] = [];

  checkWarranty(input: WarrantyCheckInput): WarrantyCheckResult {
    return WarrantyEngine.checkWarrantyStatus(input);
  }

  submitClaim(claim: WarrantyClaim): void {
    this.claims.push(claim);
  }

  getClaimsByCustomer(customerId: string): WarrantyClaim[] {
    return this.claims.filter(c => c.customerId === customerId);
  }

  getOverdueClaims(): WarrantyClaim[] {
    return WarrantyEngine.getOverdueClaims(this.claims);
  }

  getClaimById(id: string): WarrantyClaim | undefined {
    return this.claims.find(c => c.id === id);
  }
}
