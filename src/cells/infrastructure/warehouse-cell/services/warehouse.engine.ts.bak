export class WarehouseEngine {
  static calculateAvailableSpace(warehouse: { capacity: number; currentStock: number }): number {
    return warehouse.capacity - warehouse.currentStock;
  }

  static validateNewItem(
    sku: string,
    name: string,
    categoryCode: string,
    initialQty: number,
    unitCostVND: number,
    registry: any
  ): string[] {
    const errors: string[] = [];
    if (!sku) errors.push('SKU is required');
    if (!name) errors.push('Name is required');
    if (!categoryCode) errors.push('Category code is required');
    if (!registry.findByCode(categoryCode)) errors.push('Category code does not exist');
    if (initialQty < 0) errors.push('Initial quantity must be non-negative');
    if (unitCostVND < 0) errors.push('Unit cost must be non-negative');
    return errors;
  }

  static suggestMinThreshold(categoryCode: string, registry: any): number {
    const cat = registry.findByCode(categoryCode);
    return cat?.isConsumable ? 10 : 5;
  }

  static computeStatus(stock: number, threshold?: number): string { 
    return stock > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK'; 
  }

  static validateReceive(quantity: number): string[] { 
    return quantity > 0 ? [] : ["Số lượng phải lớn hơn 0"]; 
  }

  static validateRelease(item: any, quantity: number): string[] { 
    const errors: string[] = [];
    if (quantity <= 0) errors.push("Số lượng phải lớn hơn 0");
    if (item.quantity < quantity) errors.push("Không đủ hàng trong kho");
    return errors;
  }
}
