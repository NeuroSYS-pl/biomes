import { Injectable } from '@nestjs/common';
import { Prisma, Fragments } from '@prisma/client';
import { Reference } from '../../../core';
import { FragmentAggregate, FragmentDTO } from '../../domain';

@Injectable()
export class FragmentMapping {
  mapEntityToDTO(entity: Fragments): FragmentDTO {
    return {
      uuid: entity.uuid,
      asset: Reference.create(entity.assetsByUuid),
      binary: entity.binary,
      part: entity.part,
    };
  }

  mapAggregateToEntity(
    aggregate: FragmentAggregate,
  ): Prisma.FragmentsCreateInput & Prisma.FragmentsUpdateInput {
    const { model } = aggregate;
    return {
      uuid: model.uuid,
      binary: model.binary,
      part: model.part,
      assets: {
        connect: { uuid: model.asset.uuid },
      },
    };
  }
}
