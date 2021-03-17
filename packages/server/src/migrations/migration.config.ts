import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class MigrationConfig {
  readonly source = join('db', 'migrations');
  readonly configName = 'migrations.yml';
  readonly commitFilename = 'up.sql';
  readonly rollbackFilename = 'down.sql';
  readonly migrationsTableName = '_migrations';

  readonly migrationDir = (id: number | string): string =>
    id.toString().padStart(4, '0');
}
