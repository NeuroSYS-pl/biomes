import { Injectable } from '@nestjs/common';
import {
  Prisma,
  Assets,
  AssetInvalidityReason,
  AssetStatus,
} from '@biomes/prisma';
import { EnumMapper, Reference, UUID } from '../../../core';
import { AssetAggregate, AssetDTO } from '../../domain';
import {
  AssetStatus as DomainStatus,
  AssetInvalidityReason as DomainInvalidity,
} from '../../domain/utils/asset-status';

export type AssetsWithReferences = Assets & {
  fragments: { uuid: UUID }[];
};

@Injectable()
export class AssetMapping {
  readonly StatusMap = new EnumMapper<DomainStatus, AssetStatus>([
    [DomainStatus.UPLOADING, AssetStatus.uploading],
    [DomainStatus.PROCESSING, AssetStatus.processing],
    [DomainStatus.READY, AssetStatus.ready],
    [DomainStatus.INVALID, AssetStatus.invalid],
  ]);

  readonly InvalidityMap = new EnumMapper<
    DomainInvalidity,
    AssetInvalidityReason
  >([
    [DomainInvalidity.CHECKSUM, AssetInvalidityReason.checksum],
    [DomainInvalidity.INTERNAL, AssetInvalidityReason.internal],
    [DomainInvalidity.TIMEOUT, AssetInvalidityReason.timeout],
  ]);

  mapEntityToDTO(entity: AssetsWithReferences): AssetDTO {
    return {
      uuid: entity.uuid,
      binary: entity.binary ?? null,
      digest: entity.digest,
      compressed: entity.compressed,
      filename: entity.filename,
      status: this.StatusMap.backward(entity.status),
      draft:
        entity.draftRequestId != null || entity.draftExpectedParts != null
          ? {
              requestId: entity.draftRequestId,
              expectedParts: entity.draftExpectedParts,
              fragments: entity.fragments.map(f => Reference.create(f.uuid)),
            }
          : null,
      invalid:
        entity.invalidReason || entity.invalidTimestamp
          ? {
              reason: this.InvalidityMap.backward(entity.invalidReason),
              timestamp: entity.invalidTimestamp,
            }
          : null,
      authorship: {
        created: entity.created,
        createdBy: Reference.create(entity.createdByUuid),
        modified: entity.modified,
        modifiedBy: Reference.create(entity.modifiedByUuid),
      },
    };
  }

  mapAggregateToCreateEntity(
    aggregate: AssetAggregate,
  ): Prisma.AssetsCreateInput {
    return this.mapAggregateToBaseEntity(aggregate);
  }

  mapAggregateToUpdateEntity(
    aggregate: AssetAggregate,
  ): Prisma.AssetsUpdateInput {
    return this.mapAggregateToBaseEntity(aggregate);
  }

  private mapAggregateToBaseEntity(
    aggregate: AssetAggregate,
  ): Prisma.AssetsCreateInput & Prisma.AssetsUpdateInput {
    const { model } = aggregate;
    return {
      uuid: model.uuid,
      binary: model.binary,
      filename: model.filename,
      digest: model.digest,
      compressed: model.compressed,
      status: this.StatusMap.forward(model.status),
      draftRequestId: model.draft?.requestId ?? null,
      draftExpectedParts: model.draft?.expectedParts ?? null,
      invalidReason: model.invalid
        ? this.InvalidityMap.forward(model.invalid.reason)
        : null,
      invalidTimestamp: model.invalid?.timestamp ?? null,
      created: model.authorship.created,
      createdBy: {
        connect: { uuid: model.authorship.createdBy.uuid },
      },
      modified: model.authorship.modified,
      modifiedBy: model.authorship.modifiedBy
        ? { connect: { uuid: model.authorship.modifiedBy.uuid } }
        : undefined,
    };
  }
}
