/**
 * NATT-OS INVENTORY PORT CONTRACT
 * Domain: Tâm Luxury (High-Value Assets)
 * Constitutional Layer: Business Domain
 */

import { DomainEvent } from '../../../infrastructure/shared-contracts-cell/ports';

// --- CORE TYPES ---

export type ItemStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'MAINTENANCE' | 'QUARANTINE';

export interface InventoryItem {
    id: string;             // UUID nội bộ
    sku: string;            // Mã dòng sản phẩm (VD: RLX-DJ36)
    serialNumber: string;   // Số seri duy nhất (Bắt buộc với hàng Luxury)
    productName: string;
    status: ItemStatus;
    locationCode: string;   // Mã kho (VD: 'SR01', 'VAULT')
    condition: 'NEW' | 'LIKE_NEW' | 'USED'; // Tình trạng hàng (quan trọng cho Buyback)
    importDate: Date;
}

// --- DTOs (Data Transfer Objects) ---

export interface CheckStockRequest {
    sku: string;
    serialNumber?: string; // Nếu tìm đích danh món cụ thể
}

export interface CheckStockResponse {
    isAvailable: boolean;
    item?: InventoryItem;
    reason?: string; // Lý do không sẵn sàng (VD: "Đang bảo dưỡng")
}

export interface ReserveItemRequest {
    itemId: string;
    customerId: string;
    durationHours: number; // Mặc định 24h
    depositAmount?: number; // Số tiền cọc (nếu có)
}

// --- PORT INTERFACE (API Contract) ---

export interface IInventoryPort {
    /**
     * Kiểm tra trạng thái tồn kho (Read-only)
     */
    checkAvailability(req: CheckStockRequest): Promise<CheckStockResponse>;

    /**
     * Giữ hàng tạm thời (Write)
     * @emits InventoryReservedEvent
     */
    reserveItem(req: ReserveItemRequest): Promise<boolean>;

    /**
     * Xuất kho bán hàng (Write)
     * @emits InventorySoldEvent
     */
    deductItem(itemId: string, orderId: string): Promise<void>;

    /**
     * Giải phóng hàng cọc (Write)
     * Dùng khi khách hủy cọc hoặc hết giờ
     */
    releaseReservation(itemId: string): Promise<void>;
}

// --- EVENTS (SmartLink) ---

export class InventoryReservedEvent implements DomainEvent {
    type = 'INVENTORY.RESERVED';
    timestamp = new Date();
    constructor(
        public payload: { 
            itemId: string; 
            customerId: string; 
            expiry: Date 
        },
        public metadata: any = {}
    ) {}
}

export class InventorySoldEvent implements DomainEvent {
    type = 'INVENTORY.SOLD';
    timestamp = new Date();
    constructor(
        public payload: { 
            itemId: string; 
            orderId: string; 
            finalPrice: number 
        },
        public metadata: any = {}
    ) {}
}
