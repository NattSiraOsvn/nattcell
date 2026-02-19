// NATT-OS Blockchain Service (thật, dùng SHA-256)
export class ShardingService {
  static async generateShardHash(data: any): Promise<string> {
    const str = JSON.stringify(data);
    // Sử dụng Web Crypto API nếu ở browser, hoặc Node crypto nếu ở server
    if (typeof window !== 'undefined' && window.crypto?.subtle) {
      const encoder = new TextEncoder();
      const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(str));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
      // Fallback cho Node (nếu cần)
      const crypto = require('crypto');
      return crypto.createHash('sha256').update(str).digest('hex');
    }
  }
}
export default { ShardingService };
