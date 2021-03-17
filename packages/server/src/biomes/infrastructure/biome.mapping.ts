import { Injectable } from '@nestjs/common';
import { Prisma, Biomes, Habitats } from '@prisma/client';
import { Reference } from '../../core';
import { BiomeAggregate, BiomeDTO } from '../domain';

export type BiomesWithReferences = Biomes & {
  habitats: Habitats[];
};

@Injectable()
export class BiomeMapping {
  mapEntityToDTO(entity: BiomesWithReferences): BiomeDTO {
    return {
      uuid: entity.uuid,
      name: entity.name,
      species: entity.habitats.map(record =>
        Reference.create(record.speciesByUuid),
      ),
      description: entity.description,
      link: entity.link,
      authorship: {
        created: entity.created,
        createdBy: Reference.create(entity.createdByUuid),
        modified: entity.modified,
        modifiedBy: Reference.create(entity.modifiedByUuid),
      },
    };
  }

  mapAggregateToCreateEntity(
    aggregate: BiomeAggregate,
  ): Prisma.BiomesCreateInput {
    return this.mapAggregateToBaseEntity(aggregate);
  }

  mapAggregateToUpdateEntity(
    aggregate: BiomeAggregate,
  ): Prisma.BiomesUpdateInput {
    return this.mapAggregateToBaseEntity(aggregate);
  }

  private mapAggregateToBaseEntity(
    aggregate: BiomeAggregate,
  ): Prisma.BiomesCreateInput & Prisma.BiomesUpdateInput {
    const { model } = aggregate;
    return {
      uuid: model.uuid,
      name: model.name,
      description: model.description,
      link: model.link,
      habitats: undefined,
      created: model.authorship.created,
      createdBy: {
        connect: { uuid: model.authorship.createdBy.uuid },
      },
      modified: model.authorship.modified,
      modifiedBy: model.authorship.modifiedBy
        ? {
            connect: { uuid: model.authorship.modifiedBy.uuid },
          }
        : undefined,
    };
  }
}
