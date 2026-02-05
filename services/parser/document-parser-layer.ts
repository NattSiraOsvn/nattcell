
import { QuantumBuffer } from '../quantumBufferService';
import { NotifyBus } from '../notificationService';
import { PersonaID } from '../../types';

export interface IngestTask {
  file: File;
  id: string;
  status: 'QUEUED' | 'PARSING' | 'COMPLETED' | 'FAILED';
}

/**
 * 📦 DOCUMENT PARSER LAYER (ASYNC DECOUPLING)
 * Không parse trực tiếp. Chỉ validate và đẩy vào Shard Buffer.
 */
export class DocumentParserLayer {
  
  static async ingest(file: File): Promise<string> {
    const taskId = `TASK-${Math.random().toString(36).substring(7).toUpperCase()}`;
    
    // 1. Validate nhanh (Quick Scan)
    if (file.size > 500 * 1024 * 1024) { // 500MB Limit per Shard
       throw new Error("Shard size exceeds 500MB safe limit.");
    }

    // 2. Enqueue vào QuantumBuffer để xử lý background
    console.log(`[PARSER-LAYER] Enqueuing ${file.name} to Quantum Buffer...`);
    
    QuantumBuffer.enqueue('MEDIA_INGEST', { 
      taskId, 
      fileName: file.name, 
      fileType: file.type,
      fileBlob: file // Giữ blob để OmegaProcessor pick up
    }, 2); // Priority 2 cho Media Ingest

    NotifyBus.push({
      type: 'NEWS',
      title: 'Đã tiếp nhận Media',
      content: `Tệp "${file.name}" đã được đưa vào hàng chờ bóc tách lượng tử.`,
      persona: PersonaID.PHIEU
    });

    return taskId;
  }

  // Phương thức thực thi thực tế (Sẽ được gọi bởi Worker/OmegaProcessor)
  static async executeHeavyParse(file: File): Promise<any[][]> {
      // Giả lập logic parse nặng (OCR/Excel) đã có từ trước
      // ... (Logic bóc tách thực tế nằm ở đây)
      await new Promise(r => setTimeout(r, 2000)); 
      return [["Bóc tách thành công"], [file.name]];
  }
}
