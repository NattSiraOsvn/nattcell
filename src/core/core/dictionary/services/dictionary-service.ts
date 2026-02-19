import { DictionaryVersion } from '@/types';

class DictionaryService {
  private static instance: DictionaryService;
  private versions: DictionaryVersion[] = [];
  private isFrozen: boolean = false;

  static getInstance() {
    if (!DictionaryService.instance) DictionaryService.instance = new DictionaryService();
    return DictionaryService.instance;
  }

  async createSnapshot(type: string, comment: string): Promise<DictionaryVersion> {
    const newVersion: DictionaryVersion = {
      id: `VER-${Date.now()}`,
      type,
      version: String(this.versions.length + 1),
      // Fixed: added required properties versionNumber and status
      versionNumber: this.versions.length + 1,
      status: 'ACTIVE',
      isFrozen: false,
      createdAt: Date.now(),
      termsCount: Math.floor(Math.random() * 1000) + 500, // Mock
      comment
    };
    this.versions.unshift(newVersion);
    return newVersion;
  }

  async freezeVersion(id: string) {
    const ver = this.versions.find(v => v.id === id);
    if (ver) ver.isFrozen = true;
  }

  getVersions() {
    return [...this.versions];
  }

  async rollbackTo(id: string): Promise<DictionaryVersion> {
    const target = this.versions.find(v => v.id === id);
    if (!target) throw new Error("Version not found");
    
    // Tạo version mới từ target
    return this.createSnapshot(target.type, `Rollback from v${target.version}`);
  }
}

export const DictService = DictionaryService.getInstance();