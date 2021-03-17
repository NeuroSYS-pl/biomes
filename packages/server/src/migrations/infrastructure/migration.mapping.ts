import { Injectable } from '@nestjs/common';
import { Migrations, Prisma } from '@prisma/client';
import { MigrationAggregate, MigrationDTO, MigrationStatus } from '../domain';
import { LocalMigrationDTO } from './interfaces/dto';

@Injectable()
export class MigrationMapping {
  mapToDTO(local: LocalMigrationDTO, remote: Migrations | null): MigrationDTO {
    return {
      pk: local.id,
      name: local.name,
      changelog: local.changelog ?? null,
      status:
        remote != null ? MigrationStatus.applied : MigrationStatus.pending,
      commitChecksum: local.commitChecksum,
      applied:
        remote != null
          ? {
              checksum: remote.checksum,
              timestamp: remote.timestamp,
            }
          : null,
    };
  }

  mapAggregateToEntity(
    aggregate: MigrationAggregate,
  ): Prisma.MigrationsUpdateInput & Prisma.MigrationsCreateInput {
    const { model } = aggregate;
    return {
      id: model.pk,
      name: model.name,
      timestamp: model.applied?.timestamp,
      checksum: model.applied?.checksum,
    };
  }
}
