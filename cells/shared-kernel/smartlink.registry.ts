
// 👑 sovereign: anh_nat
/**
 * ⚛️ cell registry - absolute lowercase
 */
export const cell_registry = {
  warehouse: () => import('../warehouse-cell/warehouse.service.ts'),
  sales: () => import('../sales-cell/sales.service.ts'),
  constants: () => import('../constants-cell/constants.service.ts'),
  event: () => import('../event-cell/event-bridge.service.ts')
} as const;

export const resolve_cell_path = (cell_id: string) => {
  // 🛠️ Fixed: type Record instead of lowercase record
  const mapping: Record<string, string> = {
    'cell:warehouse': './cells/warehouse-cell/warehouse.service.ts',
    'cell:sales': './cells/sales-cell/sales.service.ts',
    'cell:constants': './cells/constants-cell/constants.service.ts',
    'cell:event_bridge': './cells/event-cell/event-bridge.service.ts'
  };
  return mapping[cell_id];
};

// 🛠️ Fixed: Added getCell method for DashboardService
export const getCell = async (id: string) => {
    const key = id.toLowerCase();
    const loader = (cell_registry as any)[key];
    if (!loader) throw new Error(`Cell ${id} not found in registry.`);
    const module = await loader();
    return module.WarehouseProvider || module.SalesProvider || module.EventBridgeProvider || module.default || module;
};
