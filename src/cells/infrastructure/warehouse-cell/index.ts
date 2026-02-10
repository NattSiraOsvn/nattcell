/**
 * warehouse-cell — NATT-OS Infrastructure Cell
 * Wave: 2 | Status: QUARANTINED
 *
 * 5-layer anatomy: domain, application, interface, infrastructure, ports
 * 7-layer ADN metadata: see cell.manifest.json
 */
export { WarehouseCell } from './interface/WarehouseCell';
export { WarehouseItem } from './domain/entities/WarehouseEntity';
export type { IWarehouseRepository } from './ports/WarehouseRepository';
