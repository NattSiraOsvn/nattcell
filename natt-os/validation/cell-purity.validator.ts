
/**
 * 🛡️ NATT-OS CELL-PURITY VALIDATOR v2.0
 * Owner: KIM (Team 3)
 */
export const validateCellPurity = (filePath: string, content: string): { valid: boolean; violation?: string } => {
  const forbiddenPatterns = [
    { pattern: /export\s+.*from\s+.*services/, reason: "PROXY_PATTERN_FORBIDDEN" },
    { pattern: /import\s+.*warehouseService/i, reason: "LEGACY_IMPORT_DETECTED" },
    { pattern: /WarehouseService\.ts/i, reason: "LEGACY_FILE_DETECTED" },
    { pattern: /SalesService\.ts/i, reason: "LEGACY_FILE_DETECTED" },
    { pattern: /Proxy/i, reason: "PROXY_LOGIC_FORBIDDEN" },
    { pattern: /Redirect/i, reason: "REDIRECT_LOGIC_FORBIDDEN" },
    { pattern: /['"]\.\.\/services\/['"]/, reason: "BOUNDARY_VIOLATION" }
  ];
  
  for (const rule of forbiddenPatterns) {
    if (rule.pattern.test(content) || rule.pattern.test(filePath)) {
      return { valid: false, violation: rule.reason };
    }
  }
  
  return { valid: true };
};
