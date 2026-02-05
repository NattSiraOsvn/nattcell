import { AuditInterceptor } from '../admin/AuditInterceptor.ts';

export interface AuditOptions {
  module: string;
  action: string;
  maskFields?: string[];
  logPayload?: boolean;
}

/**
 * 🔒 @Auditable Decorator
 * Tự động băm Shard Hash và ghi log cho các phương thức quan trọng.
 * Đảm bảo mọi mutation nghiệp vụ đều có dấu vết định danh.
 */
export function Auditable(options: AuditOptions) {
  return function (
    _target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      // Lấy identity từ context của instance nếu có
      const userId = (this as any).context?.user?.id || 'system:omega';
      const methodName = String(propertyKey);
      
      try {
        const result = await originalMethod.apply(this, args);
        
        // Ghi Audit thành công
        await AuditInterceptor.record(
          options.module,
          options.action || methodName,
          {
            args: options.logPayload ? this.maskSensitiveData(args, options.maskFields) : '[PROTECTED]',
            result: options.logPayload ? this.maskSensitiveData(result, options.maskFields) : '[PROTECTED]',
            duration: Date.now() - startTime,
            status: 'SUCCESS'
          },
          userId
        );
        
        return result;
      } catch (error: any) {
        // Ghi Audit thất bại
        await AuditInterceptor.record(
          options.module,
          options.action || methodName,
          {
            args: options.logPayload ? this.maskSensitiveData(args, options.maskFields) : '[PROTECTED]',
            error: error.message,
            duration: Date.now() - startTime,
            status: 'FAILED'
          },
          userId
        );
        throw error;
      }
    };

    // Helper mask data attached to prototype
    if (!(_target as any).maskSensitiveData) {
      (_target as any).maskSensitiveData = function(data: any, maskFields: string[] = []) {
        if (!data || !maskFields.length) return data;
        const clean = JSON.parse(JSON.stringify(data));
        const mask = (obj: any) => {
          for (const key in obj) {
            if (maskFields.includes(key)) obj[key] = '***MASKED***';
            else if (typeof obj[key] === 'object' && obj[key] !== null) mask(obj[key]);
          }
        };
        mask(clean);
        return clean;
      };
    }

    return descriptor;
  };
}