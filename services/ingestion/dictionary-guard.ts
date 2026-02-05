
// src/services/ingestion/DictionaryGuard.ts
import { deepFreeze } from './utils';

// 3️⃣ Nâng cấp Giao thức Quyết định Buffer (Natt-OS Philosophy)
export enum BufferDecision {
  PROCEED = 'PROCEED',
  HOLD = 'HOLD',
  REJECT = 'REJECT'
}

interface BusinessDictionary {
  SKUList: string[];
  prohibitedWords: string[];
  validSuppliers: string[];
  categories: string[];
}

export const DictionaryGuard = {
  _dictionary: null as BusinessDictionary | null,
  _version: 1,

  loadDictionary(rawDict?: any) {
    if (!rawDict) {
      // Default Omega Dictionary
      rawDict = {
        SKUList: ['NNA-ROLEX-01', 'NNU-HALO-02', 'BT-DIAMOND-03'],
        prohibitedWords: ['CONFIDENTIAL', 'SECRET', 'INTERNAL_ONLY', 'FAKE'],
        validSuppliers: ['Tam Luxury Master', 'Tam Luxury Factory', 'Gia Công A'],
        categories: ['Trang sức Nam', 'Trang sức Nữ', 'Kim cương rời']
      };
      this._version = Date.now();
    }
    this._dictionary = deepFreeze(rawDict);
    return this._dictionary;
  },

  getVersion() {
    return this._version;
  }
};

/**
 * ⚛️ MAPPING & DECISION ENGINE
 * Đã bẻ lái logic: Không báo đỏ, chuyển sang trạng thái ngủ đông (HOLD).
 */
export function matchWithDictionary(data: any, dictionary: any): BufferDecision {
  if (!dictionary || !data) return BufferDecision.PROCEED;

  let decision = BufferDecision.PROCEED;

  // 1. Validate SKU
  if (data.extractedFields?.SKU) {
    const sku = data.extractedFields.SKU;
    const isValid = dictionary.SKUList.some((validSku: string) => 
      sku.includes(validSku) || validSku.includes(sku)
    );
    
    data.extractedFields.SKU_valid = isValid;
    if (!isValid) {
      console.warn(`[Dictionary] SKU "${sku}" dị thường -> Chuyển vùng HOLD.`);
      decision = BufferDecision.HOLD; // Thay vì throw
    }
  }

  // 2. Check Prohibited Words (Silent Audit)
  if (dictionary.prohibitedWords && data.text) {
    for (let word of dictionary.prohibitedWords) {
      if (data.text.toUpperCase().includes(word.toUpperCase())) {
        data.flagged = true;
        data.flagReason = `Chứa từ cấm: ${word}`;
        console.warn(`[Dictionary] Phát hiện từ cấm -> Kích hoạt Hibernation.`);
        decision = BufferDecision.HOLD; // Không chặn, chỉ đưa vào hàng chờ kiểm soát
      }
    }
  }

  data.dictionaryVersion = DictionaryGuard.getVersion();
  return decision;
}
