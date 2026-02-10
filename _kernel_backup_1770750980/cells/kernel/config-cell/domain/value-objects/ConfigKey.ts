/**
 * ConfigKey Value Object
 * Immutable identifier for configuration entries
 */

export class ConfigKey {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): ConfigKey {
    if (!value || value.trim().length === 0) {
      throw new Error('ConfigKey cannot be empty');
    }

    // Validate key format: alphanumeric, dots, underscores, hyphens
    const keyPattern = /^[a-zA-Z][a-zA-Z0-9._-]*$/;
    if (!keyPattern.test(value)) {
      throw new Error(`Invalid ConfigKey format: ${value}`);
    }

    if (value.length > 256) {
      throw new Error('ConfigKey cannot exceed 256 characters');
    }

    return new ConfigKey(value.trim());
  }

  get value(): string {
    return this._value;
  }

  get namespace(): string {
    const parts = this._value.split('.');
    return parts.length > 1 ? parts[0] : 'default';
  }

  equals(other: ConfigKey): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
