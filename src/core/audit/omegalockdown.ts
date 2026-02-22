export const OmegaLockdown = {
  activate: () => {},
};

// enforce method stub
if ('enforce' in OmegaLockdown === false) { (OmegaLockdown as unknown as Record<string, unknown>)['enforce'] = async () => {}; }
