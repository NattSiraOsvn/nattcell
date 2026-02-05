
// src/services/moduleHelpers.ts

export interface ValidationSchema {
  [field: string]: {
    required?: boolean;
    type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    enum?: any[];
    validator?: (val: any) => boolean;
  };
}

export interface TransformationRule {
  [field: string]: string | ((val: any, row: any) => any);
}

export class ModuleHelpers {
  private static instance: ModuleHelpers;
  private cache = new Map<string, { value: any; expiry: number }>();

  static getInstance() {
    if (!ModuleHelpers.instance) ModuleHelpers.instance = new ModuleHelpers();
    return ModuleHelpers.instance;
  }

  // ✅ HELPER 1: Data Validation
  validateData(data: any, schema: ValidationSchema) {
    const errors: string[] = [];
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];

      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`Field '${field}' is required`);
        continue;
      }

      if (value !== undefined && value !== null) {
        if (rules.type && typeof value !== rules.type) {
           // Allow number string parsing if applicable
           if (rules.type === 'number' && !isNaN(Number(value))) {
             // pass
           } else {
             errors.push(`Field '${field}' must be of type ${rules.type}`);
           }
        }
        if (rules.minLength && String(value).length < rules.minLength) {
          errors.push(`Field '${field}' must be at least ${rules.minLength} chars`);
        }
        if (rules.pattern && !rules.pattern.test(String(value))) {
          errors.push(`Field '${field}' format invalid`);
        }
        if (rules.enum && !rules.enum.includes(value)) {
          errors.push(`Field '${field}' must be one of: ${rules.enum.join(', ')}`);
        }
        if (rules.validator && !rules.validator(value)) {
           errors.push(`Field '${field}' failed custom validation`);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  // ✅ HELPER 2: Data Transformation
  transformData(data: any, rules: TransformationRule) {
    const transformed: any = { ...data };
    
    for (const [field, transform] of Object.entries(rules)) {
      if (typeof transform === 'function') {
        transformed[field] = transform(data[field], data);
      } else if (typeof transform === 'string') {
        const val = String(data[field] || '');
        switch (transform) {
          case 'uppercase': transformed[field] = val.toUpperCase(); break;
          case 'lowercase': transformed[field] = val.toLowerCase(); break;
          case 'trim': transformed[field] = val.trim(); break;
          case 'number': transformed[field] = Number(val) || 0; break;
          case 'date': transformed[field] = new Date(val).toISOString(); break;
          case 'boolean': transformed[field] = val === 'true' || val === '1'; break;
        }
      }
    }
    return transformed;
  }

  // ✅ HELPER 5: Batch Processing (Async)
  async processBatch<T>(
    items: T[], 
    processor: (item: T) => Promise<any>, 
    batchSize = 10,
    delayMs = 100
  ) {
    const results: any[] = [];
    const errors: any[] = [];

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      console.log(`[Helpers] Processing batch ${i/batchSize + 1}`);

      const batchPromises = batch.map(async (item) => {
         try {
            const res = await processor(item);
            return { status: 'fulfilled', value: res };
         } catch (e) {
            return { status: 'rejected', reason: e };
         }
      });

      const batchResults = await Promise.all(batchPromises);
      
      batchResults.forEach((res: any, idx) => {
         if (res.status === 'fulfilled') results.push(res.value);
         else errors.push({ item: batch[idx], error: res.reason });
      });

      if (delayMs > 0) await new Promise(r => setTimeout(r, delayMs));
    }

    return { results, errors, total: items.length };
  }

  // ✅ HELPER 6: Caching
  async getWithCache<T>(key: string, fetcher: () => Promise<T>, ttlSec = 300): Promise<T> {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) return cached.value;

    const fresh = await fetcher();
    this.cache.set(key, { value: fresh, expiry: Date.now() + ttlSec * 1000 });
    return fresh;
  }
}

export const Helpers = ModuleHelpers.getInstance();
