/**
 * NATT-OS — Inventory Cell
 * Interface Layer: Public exports cho cells khác
 *
 * Boundary: Cells khác CHỈ được import từ file này
 * KHÔNG được import trực tiếp từ domain/ hoặc application/
 */

// --- Public Types ---
export type { ItemStatus, ItemCondition } from '../domain/value-objects/item-status';
export type { BranchLocation } from '../domain/value-objects/location-codes';
export type { CustomerTier, ReservationPolicy } from '../domain/value-objects/reservation-rules';
export type { InventoryItemProps } from '../domain/entities/inventory-item.entity';
export type { StockCheckResult, StockAlert } from '../domain/services/stock-management.engine';
export type { ReservationResult } from '../domain/services/reservation.engine';

// --- Public Use Case Types ---
export type { CheckAvailabilityInput, CheckAvailabilityOutput } from '../application/use-cases/check-availability';
export type { ReserveItemInput } from '../application/use-cases/reserve-item';
export type { DeductItemInput, DeductItemOutput } from '../application/use-cases/deduct-item';
export type { ReleaseReservationInput, ReleaseReservationOutput } from '../application/use-cases/release-reservation';

// --- Public Service ---
export { InventoryService } from '../application/services/inventory.service';
