import { Injectable, Logger } from '@nestjs/common';
import { createReadStream, promises as fs } from 'fs';
import { createHash } from 'crypto';
import { join } from 'path';
import yaml from 'js-yaml';
import { MigrationConfig } from '../migration.config';
import {
  MigrationConfigRecord,
  MigrationsConfig,
  LocalMigrationDTO,
} from './interfaces/dto';

@Injectable()
export class MigrationFileSystem {
  readonly logger = new Logger(MigrationFileSystem.name);

  constructor(private readonly config: MigrationConfig) {}

  async getLocalMigrations(): Promise<LocalMigrationDTO[]> {
    const configPath = join(this.config.source, this.config.configName);
    const content = await fs.readFile(configPath, 'utf8');
    const data = yaml.load(content) as MigrationsConfig;

    return Promise.all(
      data.migrations.map(async record => this.mapRecordToLocalDTO(record)),
    );
  }

  async calculateHash(filepath: string): Promise<string> {
    const hash = createHash('sha256');
    await new Promise((resolve, reject) => {
      createReadStream(filepath, { flags: 'r' })
        .once('error', reject)
        .once('end', resolve)
        .pipe(hash);
    });
    const result = hash.digest('hex');
    return result;
  }

  private async mapRecordToLocalDTO(
    record: MigrationConfigRecord,
  ): Promise<LocalMigrationDTO> {
    const commitFilepath = join(
      this.config.source,
      this.config.migrationDir(record.id),
      this.config.commitFilename,
    );
    const rollbackFilepath = join(
      this.config.source,
      this.config.migrationDir(record.id),
      this.config.rollbackFilename,
    );

    return {
      id: record.id,
      name: record.name,
      changelog: record.changelog,
      commitFilepath,
      rollbackFilepath,
      commitChecksum: await this.calculateHash(commitFilepath),
    };
  }
}
