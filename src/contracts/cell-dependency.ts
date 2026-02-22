/**
 * CELL DEPENDENCY - NATT-OS
 * Điều 16: Cell Dependency Direction Rules
 */

import { CellLayer } from './cell.contract';

export const CELL_LAYER_REGISTRY: Record<string, CellLayer> = {
  'cell:config': CellLayer.KERNEL,
  'cell:rbac': CellLayer.KERNEL,
  'cell:monitor': CellLayer.KERNEL,
  'cell:audit': CellLayer.KERNEL,
  'cell:security': CellLayer.KERNEL,
  'cell:sync': CellLayer.INFRASTRUCTURE,
  'cell:smartlink': CellLayer.INFRASTRUCTURE,
  'cell:api': CellLayer.INFRASTRUCTURE,
  'cell:WAREHOUSE': CellLayer.INFRASTRUCTURE,
  'cell:sales': CellLayer.BUSINESS,
  'cell:finance': CellLayer.BUSINESS,
  'cell:HR': CellLayer.BUSINESS,
  'cell:production': CellLayer.BUSINESS,
  'cell:DASHBOARD': CellLayer.PRESENTATION,
  'cell:reports': CellLayer.PRESENTATION,
};

export interface LayerDependencyRule {
  layer: CellLayer;
  can_depend_on: CellLayer[];
  raw_access: boolean;
}

export const LAYER_DEPENDENCY_RULES: LayerDependencyRule[] = [
  { layer: CellLayer.KERNEL, can_depend_on: [], raw_access: true },
  { layer: CellLayer.INFRASTRUCTURE, can_depend_on: [CellLayer.KERNEL], raw_access: false },
  { layer: CellLayer.BUSINESS, can_depend_on: [CellLayer.KERNEL, CellLayer.INFRASTRUCTURE], raw_access: false },
  { layer: CellLayer.PRESENTATION, can_depend_on: [CellLayer.KERNEL, CellLayer.INFRASTRUCTURE, CellLayer.BUSINESS], raw_access: false },
];

export type DependencyViolation = {
  type: 'LAYER_VIOLATION';
  source_cell: string;
  target_cell: string;
  message: string;
};

export function getCellLayer(cellId: string): CellLayer | undefined {
  return CELL_LAYER_REGISTRY[cellId];
}

export function canDependOn(sourceCell: string, targetCell: string): boolean {
  const sourceLayer = CELL_LAYER_REGISTRY[sourceCell];
  const targetLayer = CELL_LAYER_REGISTRY[targetCell];
  
  if (sourceLayer === undefined || targetLayer === undefined) {
    return false;
  }
  
  const rule = LAYER_DEPENDENCY_RULES.find(r => r.layer === sourceLayer);
  if (!rule) return false;
  
  return rule.can_depend_on.includes(targetLayer);
}

export function validateCellDependency(
  sourceCell: string,
  targetCell: string
): DependencyViolation | null {
  if (sourceCell === targetCell) return null;
  
  const sourceLayer = CELL_LAYER_REGISTRY[sourceCell];
  const targetLayer = CELL_LAYER_REGISTRY[targetCell];
  
  if (sourceLayer === undefined) {
    return {
      type: 'LAYER_VIOLATION',
      source_cell: sourceCell,
      target_cell: targetCell,
      message: `Unknown cell: ${sourceCell}`,
    };
  }
  
  if (targetLayer === undefined) {
    return {
      type: 'LAYER_VIOLATION',
      source_cell: sourceCell,
      target_cell: targetCell,
      message: `Unknown cell: ${targetCell}`,
    };
  }
  
  if (!canDependOn(sourceCell, targetCell)) {
    return {
      type: 'LAYER_VIOLATION',
      source_cell: sourceCell,
      target_cell: targetCell,
      message: `Layer ${CellLayer[sourceLayer]} không được phụ thuộc Layer ${CellLayer[targetLayer]}`,
    };
  }
  
  return null;
}
