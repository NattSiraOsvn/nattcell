/**
 * ConfigValidationService
 * Domain service for validating configuration entries
 */

import { ConfigEntry } from '../entities';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class ConfigValidationService {
  validateEntry(entry: ConfigEntry): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!entry.key || entry.key.trim().length === 0) {
      errors.push('Config key cannot be empty');
    }

    if (entry.value === undefined) {
      errors.push('Config value cannot be undefined');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  validateConsistency(entries: Map<string, ConfigEntry>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const requiredKeys = ['system.name', 'system.version', 'system.environment'];
    for (const key of requiredKeys) {
      if (!entries.has(key)) {
        warnings.push(`Recommended config '${key}' is missing`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
