import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { IMigrationRepository, MigrationDTO } from '../domain/interfaces';
import * as Query from '../domain/interfaces/query';
import { MigrationAggregate } from '../domain/migration.aggregate';
import { MigrationConfig } from '../migration.config';
import { MigrationFileSystem } from './migration.fs';
import { MigrationMapping } from './migration.mapping';
import { MigrationQueryBuilder } from './migration.query-builder';
import { IntegrityService } from './services/integrity.service';
import { PostgresService } from './services/postgres.service';

@Injectable()
export class MigrationRepository implements IMigrationRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: MigrationConfig,
    private readonly mapping: MigrationMapping,
    private readonly integrity: IntegrityService,
    private readonly postgres: PostgresService,
    private readonly fs: MigrationFileSystem,
    private readonly queryBuilder: MigrationQueryBuilder,
  ) {}

  async getOne(query: Query.MigrationSelector): Promise<MigrationDTO> {
    const all = await this.getAll();
    let migration: MigrationDTO;

    if (Query.migrationSelector.isPk(query)) {
      migration = all.find(r => r.pk === query.pk);
    } else {
      throw new Error('Invalid selector');
    }

    if (!migration) {
      throw new NotFoundException();
    } else {
      return migration;
    }
  }

  async getMany(query: Query.MigrationFilter): Promise<MigrationDTO[]> {
    const all = await this.getAll();
    return all.filter(this.queryBuilder.many(query));
  }

  async getAll(): Promise<MigrationDTO[]> {
    const dbReady = await this.migrationsTableExists();
    const localMigrations = await this.fs.getLocalMigrations();
    const dbMigrations = dbReady
      ? await this.prisma.client.migrations.findMany()
      : [];

    const records = this.integrity.mergeRecords(localMigrations, dbMigrations);
    return records.map(([local, remote]) =>
      this.mapping.mapToDTO(local, remote),
    );
  }

  async apply(aggregate: MigrationAggregate): Promise<void> {
    const localMigrations = await this.fs.getLocalMigrations();
    const migration = localMigrations.find(m => m.id === aggregate.model.pk);

    const success = await this.postgres.run(migration.commitFilepath);
    if (!success) {
      throw new Error('Cannot apply');
    }

    await this.prisma.client.migrations.create({
      data: this.mapping.mapAggregateToEntity(aggregate),
    });
  }

  async rollback(aggregate: MigrationAggregate): Promise<void> {
    const localMigrations = await this.fs.getLocalMigrations();
    const migration = localMigrations.find(m => m.id === aggregate.model.pk);

    const success = await this.postgres.run(migration.rollbackFilepath);
    if (!success) {
      throw new Error('Cannot rollback');
    }

    const canModifyDb = await this.migrationsTableExists();
    if (canModifyDb) {
      await this.prisma.client.migrations.delete({
        where: { id: aggregate.model.pk },
      });
    }
  }

  private migrationsTableExists(): Promise<boolean> {
    return this.postgres.exists(this.config.migrationsTableName);
  }
}
