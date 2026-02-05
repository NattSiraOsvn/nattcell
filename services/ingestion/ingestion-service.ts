
import { FileMetadata, IngestStatus } from '../../types';
import { ShardingService } from '../blockchainService';
import { NotifyBus } from '../notificationService';

/**
 * 🚀 OMEGA INGESTION SERVICE v2.0
 * Triển khai theo cấu trúc đề xuất của Master Natt.
 */
class IngestionService {
  private static instance: IngestionService;
  private fileRegistry: Map<string, FileMetadata> = new Map();

  static getInstance() {
    if (!IngestionService.instance) IngestionService.instance = new IngestionService();
    return IngestionService.instance;
  }

  /**
   * 🛡️ STEP 1: VALIDATE & IDEMPOTENCY
   */
  async preIngest(file: File, userId: string): Promise<FileMetadata | null> {
    const fileHash = ShardingService.generateShardHash({
      name: file.name,
      size: file.size,
      lastModified: file.lastModified
    });

    // Check Idempotency (Chống trùng lặp tuyệt đối)
    if (this.isDuplicate(fileHash)) {
      NotifyBus.push({
        type: 'RISK',
        title: 'TRÙNG LẶP DỮ LIỆU',
        content: `File ${file.name} đã tồn tại trong Shard. Robot đã chặn xử lý lặp.`,
        priority: 'MEDIUM'
      });
      return null;
    }

    const metadata: FileMetadata = {
      id: `FILE-${Math.random().toString(36).substring(7).toUpperCase()}`,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      hash: fileHash,
      // Fixed: Added required uploadedAt field
      uploadedAt: Date.now(),
      uploadedBy: userId,
      timestamp: Date.now(),
      status: IngestStatus.QUEUED
    };

    this.fileRegistry.set(metadata.id, metadata);
    return metadata;
  }

  private isDuplicate(hash: string): boolean {
    return Array.from(this.fileRegistry.values()).some(f => f.hash === hash);
  }

  /**
   * ⚙️ STEP 2: UPDATE STATUS
   */
  updateStatus(id: string, status: IngestStatus, extra?: Partial<FileMetadata>) {
    const meta = this.fileRegistry.get(id);
    if (meta) {
      this.fileRegistry.set(id, { ...meta, status, ...extra });
    }
  }

  getAllRecords() {
    return Array.from(this.fileRegistry.values()).sort((a, b) => b.timestamp - a.timestamp);
  }
}

export const Ingestion = IngestionService.getInstance();
