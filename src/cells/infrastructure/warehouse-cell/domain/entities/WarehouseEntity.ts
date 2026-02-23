export interface WarehouseEntity {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentStock: number;
}

export interface WarehouseItem {
  id: string;
  name: string;
  quantity: number;
  category?: string;
  releaseStock?: (qty: number, reason: string, by: string) => void;
  getAllItems?: () => WarehouseItem[];
  [key: string]: unknown;
}
