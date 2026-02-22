export const MODULE_REGISTRY: Record<string, unknown> = {};

export const ModuleRegistry = {
  getAllModules: () => Object.values(MODULE_REGISTRY),
  registerModule: (mod: unknown) => {
    if (mod && typeof mod === 'object' && 'id' in mod) {
      MODULE_REGISTRY[(mod as { id: string }).id] = mod;
    }
  },
  getModule: (id: string) => MODULE_REGISTRY[id],
};

export const moduleregistry = MODULE_REGISTRY;
export default ModuleRegistry;
