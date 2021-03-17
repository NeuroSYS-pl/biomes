import { Migrations } from '@prisma/client';

export interface MigrationConfigRecord {
  readonly id: number;
  readonly name: string;
  readonly changelog: string;
}

export interface MigrationsConfig {
  readonly migrations: ReadonlyArray<MigrationConfigRecord>;
}

export interface LocalMigrationDTO {
  readonly id: number;
  readonly name: string;
  readonly changelog?: string;
  readonly commitFilepath: string;
  readonly commitChecksum: string;
  readonly rollbackFilepath: string;
}

export type DbMigrationDTO = Migrations;
