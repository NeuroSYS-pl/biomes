import { Injectable, Logger } from '@nestjs/common';
import { Migrations } from '@prisma/client';
import { LocalMigrationDTO } from '../interfaces/dto';
import { IntegrityError } from '../interfaces/exceptions';

@Injectable()
export class IntegrityService {
  readonly logger = new Logger(IntegrityService.name);

  mergeRecords(
    local: LocalMigrationDTO[],
    remote: Migrations[],
  ): ReadonlyArray<[LocalMigrationDTO, Migrations | null]> {
    const localIds = local.map(r => r.id);

    if (new Set(localIds).size !== local.length) {
      throw new IntegrityError('Duplicated migration "id"!');
    }

    if (!remote.every(r => localIds.includes(r.id))) {
      throw new IntegrityError(
        'Database has applied migration which is missing the local manifest!',
      );
    }

    return local.map(localRecord => {
      const remoteRecord = remote.find(r => r.id === localRecord.id);
      return [localRecord, remoteRecord];
    });
  }
}
