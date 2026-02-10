/**
 * ConfigMetadata Value Object
 * Metadata associated with configuration entries
 */

export interface ConfigMetadataProps {
  description: string;
  category: string;
  isSecret: boolean;
  isReadOnly: boolean;
  validationSchema?: string;
  tags?: string[];
}

export class ConfigMetadata {
  private readonly props: ConfigMetadataProps;

  private constructor(props: ConfigMetadataProps) {
    this.props = props;
  }

  static create(props: Partial<ConfigMetadataProps>): ConfigMetadata {
    return new ConfigMetadata({
      description: props.description || '',
      category: props.category || 'general',
      isSecret: props.isSecret || false,
      isReadOnly: props.isReadOnly || false,
      validationSchema: props.validationSchema,
      tags: props.tags || [],
    });
  }

  get description(): string {
    return this.props.description;
  }

  get category(): string {
    return this.props.category;
  }

  get isSecret(): boolean {
    return this.props.isSecret;
  }

  get isReadOnly(): boolean {
    return this.props.isReadOnly;
  }

  get validationSchema(): string | undefined {
    return this.props.validationSchema;
  }

  get tags(): string[] {
    return [...(this.props.tags || [])];
  }

  toJSON(): Record<string, unknown> {
    return {
      description: this.description,
      category: this.category,
      isSecret: this.isSecret,
      isReadOnly: this.isReadOnly,
      validationSchema: this.validationSchema,
      tags: this.tags,
    };
  }
}
