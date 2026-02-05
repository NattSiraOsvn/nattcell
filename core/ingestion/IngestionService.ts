
import { FileMetadata, IngestStatus } from '../../types';
import { ShardingService } from '../../services/blockchainService';

export class IngestionService {
  private static instance: IngestionService;
  private fileRegistry: Map<string, FileMetadata> = new Map();

  static getInstance() {
    if (!IngestionService.instance) IngestionService.instance = new IngestionService();
    return IngestionService.instance;
  }

  async validateAndRegister(file: File): Promise<FileMetadata> {
    const hash = ShardingService.generateShardHash({
      name: file.name,
      size: file.size,
      lastModified: file.lastModified
    });

    // Check Idempotency
    const existing = Array.from(this.fileRegistry.values()).find(f => f.hash === hash);
    if (existing) {
      throw new Error(`File trùng lặp đã tồn tại trong Shard: ${existing.id}`);
    }

    const metadata: FileMetadata = {
      id: `ING-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      hash: hash,
      status: IngestStatus.QUEUED,
      uploadedAt: Date.now()
    };

    this.fileRegistry.set(metadata.id, metadata);
    return metadata;
  }

  updateStatus(id: string, status: IngestStatus, extra?: Partial<FileMetadata>) {
    const meta = this.fileRegistry.get(id);
    if (meta) {
      this.fileRegistry.set(id, { ...meta, status, ...extra });
    }
  }

  getHistory() {
    return Array.from(this.fileRegistry.values()).sort((a, b) => b.uploadedAt - a.uploadedAt);
  }
}

export const Ingestion = IngestionService.getInstance();
