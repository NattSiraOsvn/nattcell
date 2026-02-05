
import { NotifyBus } from '../notificationService';
import { PersonaID } from '../../types';

/**
 * 🛡️ IMMUNE-CELL SCANNER v2.0
 * Chạy build-time/runtime validation để bảo vệ tính cô lập của Cell.
 */
export class CICDEnforcer {
  private static instance: CICDEnforcer;

  public static getInstance() {
    if (!CICDEnforcer.instance) CICDEnforcer.instance = new CICDEnforcer();
    return CICDEnforcer.instance;
  }

  /**
   * Cưỡng chế ranh giới Cell (BOOK III ĐIỀU 7)
   */
  public async validateCellBoundaries(filePath: string, content: string) {
    // 1. Chặn import trực tiếp giữa các Cell (Ngoại trừ SmartLink Router)
    const crossCellImport = /import.*from.*['"]\.\.\/([a-z-]+-cell).*['"]/g;
    
    if (crossCellImport.test(content)) {
        // Miễn trừ cho chính các service bên trong cell tự import file nội bộ
        const cellMatch = filePath.match(/cells\/([a-z-]+-cell)/);
        const importMatch = content.match(crossCellImport);
        
        if (importMatch && (!cellMatch || !importMatch[0].includes(cellMatch[1]))) {
            NotifyBus.push({
                type: 'RISK',
                title: 'BOUNDARY BREACH DETECTED',
                content: `Vi phạm Điều 7: Phát hiện import trực tiếp giữa các Cell tại ${filePath}.`,
                persona: PersonaID.KRIS,
                priority: 'HIGH'
            });
            console.error(`[IMMUNE-CELL] Blocked illegal import in ${filePath}`);
            return false;
        }
    }
    return true;
  }

  /**
   * Kiểm tra hồ sơ Manifest
   */
  public validateManifest(cellId: string, manifest: any) {
      if (!manifest.id || !manifest.capabilities) {
          throw new Error(`CORRUPTED_MANIFEST: Cell ${cellId} missing core DNA.`);
      }
  }
}

export const CICDGuard = CICDEnforcer.getInstance();
