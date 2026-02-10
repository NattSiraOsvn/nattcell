import { ConfigEntry } from '../../domain/entities';
import { ConfigRepository } from '../../ports/ConfigRepository';

export class GetConfigUseCase {
  constructor(private readonly repository: ConfigRepository) {}

  async execute(key: string): Promise<{ entry: ConfigEntry | null; found: boolean }> {
    const entry = await this.repository.get(key);
    return { entry, found: entry !== null };
  }
}
