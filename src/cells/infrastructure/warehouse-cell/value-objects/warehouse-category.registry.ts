export const WarehouseCategory = {
  MAIN: 'MAIN',
  BRANCH: 'BRANCH',
  SHOWROOM: 'SHOWROOM',
} as const;
export type WarehouseCategory = typeof WarehouseCategory[keyof typeof WarehouseCategory];

export interface CategoryDefinition {
  code: string;
  name: string;
  defaultUnit: string;
  defaultLocation: string;
  requiresInsurance: boolean;
  isConsumable: boolean;
}

export interface RegisterCategoryCommand {
  code: string;
  name: string;
  defaultUnit: string;
  defaultLocation: string;
  requiresInsurance: boolean;
  isConsumable: boolean;
  createdBy: string;
}

export class WarehouseCategoryRegistry {
  private categories: Map<string, CategoryDefinition> = new Map();

  constructor() {
    // Seed defaults
    this.register({
      code: 'MAIN',
      name: 'Main Vault',
      defaultUnit: 'PIECE',
      defaultLocation: 'VAULT',
      requiresInsurance: true,
      isConsumable: false,
      createdBy: 'system'
    });
    this.register({
      code: 'BRANCH',
      name: 'Branch Storage',
      defaultUnit: 'PIECE',
      defaultLocation: 'BRANCH',
      requiresInsurance: true,
      isConsumable: false,
      createdBy: 'system'
    });
    this.register({
      code: 'SHOWROOM',
      name: 'Showroom Floor',
      defaultUnit: 'PIECE',
      defaultLocation: 'SHOWROOM',
      requiresInsurance: false,
      isConsumable: true,
      createdBy: 'system'
    });
  }

  register(cmd: RegisterCategoryCommand): { success: boolean; error?: string } {
    if (this.categories.has(cmd.code)) {
      return { success: false, error: 'Category already exists' };
    }
    this.categories.set(cmd.code, {
      code: cmd.code,
      name: cmd.name,
      defaultUnit: cmd.defaultUnit,
      defaultLocation: cmd.defaultLocation,
      requiresInsurance: cmd.requiresInsurance,
      isConsumable: cmd.isConsumable,
    });
    return { success: true };
  }

  findByCode(code: string): CategoryDefinition | undefined {
    return this.categories.get(code);
  }

  getActive(): CategoryDefinition[] {
    return Array.from(this.categories.values());
  }
}

export type WarehouseUnit = string;
export type WarehouseLocation = string;
