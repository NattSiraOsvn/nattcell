/**
 * ConfigEntry Entity
 * Core domain entity representing a single configuration entry
 */

export interface ConfigEntryProps {
  key: string;
  value: unknown;
  version: number;
  category: string;
  isSecret: boolean;
  isReadOnly: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export class ConfigEntry {
  private readonly props: ConfigEntryProps;

  private constructor(props: ConfigEntryProps) {
    this.props = props;
  }

  static create(
    key: string,
    value: unknown,
    createdBy: string,
    options?: Partial<Pick<ConfigEntryProps, 'category' | 'isSecret' | 'isReadOnly' | 'description'>>
  ): ConfigEntry {
    if (!key || key.trim().length === 0) {
      throw new Error('ConfigKey cannot be empty');
    }

    const now = new Date();
    return new ConfigEntry({
      key: key.trim(),
      value,
      version: 1,
      category: options?.category || 'general',
      isSecret: options?.isSecret || false,
      isReadOnly: options?.isReadOnly || false,
      description: options?.description || '',
      createdAt: now,
      updatedAt: now,
      createdBy,
      updatedBy: createdBy,
    });
  }

  get key(): string { return this.props.key; }
  get value(): unknown { return this.props.value; }
  get version(): number { return this.props.version; }
  get category(): string { return this.props.category; }
  get isSecret(): boolean { return this.props.isSecret; }
  get isReadOnly(): boolean { return this.props.isReadOnly; }
  get description(): string { return this.props.description; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  update(newValue: unknown, updatedBy: string): ConfigEntry {
    if (this.isReadOnly) {
      throw new Error(`ConfigEntry ${this.key} is read-only`);
    }

    return new ConfigEntry({
      ...this.props,
      value: newValue,
      version: this.props.version + 1,
      updatedAt: new Date(),
      updatedBy,
    });
  }

  toJSON(): Record<string, unknown> {
    return {
      key: this.key,
      value: this.isSecret ? '***REDACTED***' : this.value,
      version: this.version,
      category: this.category,
      isSecret: this.isSecret,
      isReadOnly: this.isReadOnly,
      description: this.description,
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt.toISOString(),
    };
  }
}
