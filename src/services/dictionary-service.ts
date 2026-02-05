
import { DictionaryVersion } from '../types';

export class DictionaryService {
  private static instance: DictionaryService;
  private versions: DictionaryVersion[] = [];

  private constructor() {
    this.seedMockData();
  }

  static getInstance() {
    if (!DictionaryService.instance) {
      DictionaryService.instance = new DictionaryService();
    }
    return DictionaryService.instance;
  }

  private seedMockData() {
    // Version 1 (Initial)
    this.versions.push({
      id: 'VER-001',
      version: 1, // Fixed: changed from string to number
      versionNumber: 1,
      status: 'ARCHIVED',
      isFrozen: true,
      termsCount: 10,
      dictionaryId: 'MASTER_DICT',
      data: { SKUList: ['NNA-01'], ValidSuppliers: ['Tâm Luxury'] },
      changes: { added: 10, removed: 0, modified: 0, diffSummary: ['Initial load'] },
      createdBy: 'SYSTEM_INIT',
      createdAt: Date.now() - 10000000,
      metadata: { reason: 'System Initialization' },
      type: 'CORE' 
    });

    // Version 2 (Current)
    this.versions.push({
      id: 'VER-002',
      version: 2, // Fixed: changed from string to number
      versionNumber: 2,
      status: 'ACTIVE',
      isFrozen: false,
      termsCount: 12,
      dictionaryId: 'MASTER_DICT',
      previousVersionId: 'VER-001',
      data: { SKUList: ['NNA-01', 'NNU-02'], ValidSuppliers: ['Tâm Luxury', 'Gia Công A'] },
      changes: { added: 2, removed: 0, modified: 1, diffSummary: ['Added SKU NNU-02', 'Added Supplier'] },
      createdBy: 'MASTER_NATT',
      createdAt: Date.now() - 5000000,
      metadata: { reason: 'Update Q1/2026' },
      type: 'UPDATE' 
    });
  }

  getVersions(): DictionaryVersion[] {
    return [...this.versions].sort((a, b) => (b.versionNumber || 0) - (a.versionNumber || 0));
  }

  getCurrentVersion(): DictionaryVersion {
    return this.getVersions()[0];
  }

  async rollbackTo(versionId: string): Promise<DictionaryVersion> {
    await new Promise(r => setTimeout(r, 1500)); // Simulate DB latency
    
    const target = this.versions.find(v => v.id === versionId);
    if (!target) throw new Error("Version not found");

    const newVersion: DictionaryVersion = {
      id: `VER-ROLLBACK-${Date.now()}`,
      version: (this.getCurrentVersion().versionNumber || 0) + 1, // Fixed: string to number
      versionNumber: (this.getCurrentVersion().versionNumber || 0) + 1,
      status: 'ACTIVE',
      isFrozen: false,
      termsCount: target.termsCount,
      dictionaryId: target.dictionaryId,
      previousVersionId: this.getCurrentVersion().id,
      data: target.data,
      changes: { 
        added: 0, removed: 0, modified: 0, 
        diffSummary: [`Rollback to v${target.versionNumber}`] 
      },
      createdBy: 'MASTER_NATT',
      createdAt: Date.now(),
      metadata: { reason: `Emergency Rollback to v${target.versionNumber}` },
      type: 'ROLLBACK' 
    };

    this.versions.push(newVersion);
    return newVersion;
  }
}

export const DictService = DictionaryService.getInstance();
