export type DisplayZone = 'WINDOW' | 'MAIN_FLOOR' | 'VIP_LOUNGE' | 'VAULT_DISPLAY' | 'SEASONAL';

export interface DisplayConfig {
  zone: DisplayZone;
  maxItems: number;
  requiresSecurity: boolean;
  isCustomerFacing: boolean;
  description: string;
}

export const DISPLAY_ZONES: Record<DisplayZone, DisplayConfig> = {
  WINDOW:        { zone: 'WINDOW',        maxItems: 20,  requiresSecurity: true,  isCustomerFacing: true,  description: 'Tủ kính bên ngoài — thu hút khách' },
  MAIN_FLOOR:    { zone: 'MAIN_FLOOR',    maxItems: 100, requiresSecurity: true,  isCustomerFacing: true,  description: 'Sàn trưng bày chính' },
  VIP_LOUNGE:    { zone: 'VIP_LOUNGE',    maxItems: 30,  requiresSecurity: true,  isCustomerFacing: true,  description: 'Phòng VIP — xem hàng riêng' },
  VAULT_DISPLAY: { zone: 'VAULT_DISPLAY', maxItems: 10,  requiresSecurity: true,  isCustomerFacing: false, description: 'Trưng bày trong két — chỉ khi có yêu cầu' },
  SEASONAL:      { zone: 'SEASONAL',      maxItems: 50,  requiresSecurity: false, isCustomerFacing: true,  description: 'Trưng bày theo mùa / sự kiện' },
};

export type AppointmentStatus = 'BOOKED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED';
