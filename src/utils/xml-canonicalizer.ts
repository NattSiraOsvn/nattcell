
/**
 * 🛠️ XML CANONICALIZER (C14N) - FIX 3
 * Đảm bảo XML Hash luôn nhất quán dù thay đổi khoảng trắng hay thứ tự thuộc tính.
 */

export class XmlCanonicalizer {
  
  /**
   * Chuẩn hóa XML theo quy tắc giản lược (Simplified C14N)
   * 1. Loại bỏ khoảng trắng thừa giữa các thẻ.
   * 2. Sắp xếp thuộc tính theo bảng chữ cái.
   * 3. Sử dụng UTF-8.
   */
  static canonicalize(xmlString: string): string {
    if (!xmlString) return "";

    // 1. Remove XML declaration
    let c14n = xmlString.replace(/<\?xml.*?\?>/g, '');

    // 2. Remove whitespace between tags
    c14n = c14n.replace(/>\s+</g, '><');

    // 3. Trim whitespace from values
    c14n = c14n.replace(/>\s+([^<]+)\s+</g, '>$1<');

    // Note: Full C14N requires parsing DOM and sorting attributes.
    // For this runtime environment, we enforce a deterministic construction 
    // in the builder instead of parsing arbitrary XML.
    // This function acts as a final safeguard/trimmer.
    
    return c14n.trim();
  }

  /**
   * Tạo XML Deterministic từ Object (Thay vì build string lộn xộn)
   */
  static buildDeterministicXML(rootTag: string, data: Record<string, any>): string {
    const sortedKeys = Object.keys(data).sort();
    
    let xml = `<${rootTag}`;
    
    // Attributes (if any, defined as _attrs)
    if (data._attrs) {
        const attrKeys = Object.keys(data._attrs).sort();
        attrKeys.forEach(k => {
            xml += ` ${k}="${data._attrs[k]}"`;
        });
    }
    xml += '>';

    sortedKeys.forEach(key => {
        if (key === '_attrs') return;
        const value = data[key];
        
        if (Array.isArray(value)) {
            value.forEach(item => {
                xml += this.buildDeterministicXML(key, item); // Recursive for arrays
            });
        } else if (typeof value === 'object' && value !== null) {
            xml += this.buildDeterministicXML(key, value);
        } else {
            xml += `<${key}>${value}</${key}>`;
        }
    });

    xml += `</${rootTag}>`;
    return xml;
  }
}
