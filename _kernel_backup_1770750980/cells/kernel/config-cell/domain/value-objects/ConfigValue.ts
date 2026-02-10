/**
 * ConfigValue Value Object
 * Wraps configuration values with type safety
 */

export type ConfigValueType = 
  | string 
  | number 
  | boolean 
  | null 
  | ConfigValueType[] 
  | { [key: string]: ConfigValueType };

export class ConfigValue {
  private readonly _value: ConfigValueType;
  private readonly _type: string;

  private constructor(value: ConfigValueType) {
    this._value = value;
    this._type = ConfigValue.detectType(value);
  }

  static create(value: unknown): ConfigValue {
    if (!ConfigValue.isValidType(value)) {
      throw new Error(`Invalid config value type: ${typeof value}`);
    }
    return new ConfigValue(value as ConfigValueType);
  }

  private static isValidType(value: unknown): boolean {
    if (value === null) return true;
    const type = typeof value;
    if (['string', 'number', 'boolean'].includes(type)) return true;
    if (Array.isArray(value)) return value.every(v => this.isValidType(v));
    if (type === 'object') {
      return Object.values(value as object).every(v => this.isValidType(v));
    }
    return false;
  }

  private static detectType(value: ConfigValueType): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }

  get value(): ConfigValueType {
    return this._value;
  }

  get type(): string {
    return this._type;
  }

  asString(): string {
    if (typeof this._value !== 'string') {
      throw new Error('Value is not a string');
    }
    return this._value;
  }

  asNumber(): number {
    if (typeof this._value !== 'number') {
      throw new Error('Value is not a number');
    }
    return this._value;
  }

  asBoolean(): boolean {
    if (typeof this._value !== 'boolean') {
      throw new Error('Value is not a boolean');
    }
    return this._value;
  }

  toJSON(): ConfigValueType {
    return this._value;
  }
}
