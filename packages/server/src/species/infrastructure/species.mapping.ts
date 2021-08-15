import { Injectable } from '@nestjs/common';
import { Prisma, Species, Habitats, Characteristics } from '@biomes/prisma';
import { Reference } from '../../core';
import { SpeciesDTO, SpeciesAggregate } from '../domain';
import { CharacteristicMapping } from './characteristic.mapping';
import { HabitatMapping } from './habitat.mapping';

export type SpeciesWithRelations = Species & {
  habitats: Habitats[];
  characteristics: Characteristics[];
};

@Injectable()
export class SpeciesMapping {
  constructor(
    private readonly habitatMapping: HabitatMapping,
    private readonly characteristicMapping: CharacteristicMapping,
  ) {}

  mapEntityToDTO(entity: SpeciesWithRelations): SpeciesDTO {
    return {
      uuid: entity.uuid,
      tag: entity.tag,
      generation: entity.generation,
      description: entity.description,
      link: entity.link,
      habitats: entity.habitats.map(r => this.habitatMapping.mapEntityToDTO(r)),
      characteristics: entity.characteristics.map(c =>
        this.characteristicMapping.mapEntityToDTO(c),
      ),
      asset: Reference.create(entity.assetByUuid),
      authorship: {
        created: entity.created,
        createdBy: Reference.create(entity.createdByUuid),
        modified: entity.modified,
        modifiedBy: Reference.create(entity.modifiedByUuid),
      },
    };
  }

  mapModelToCreateEntity(
    aggregate: SpeciesAggregate,
  ): Prisma.SpeciesCreateInput {
    const { model } = aggregate;
    const entity: Prisma.SpeciesCreateInput = {
      ...this.mapModelToBaseEntity(aggregate),
      asset: {
        connect: { uuid: model.asset.uuid },
      },
      habitats: {
        create: model.habitats.map(m =>
          this.habitatMapping.mapModelToEntity(m),
        ),
      },
      characteristics: {
        create: model.characteristics.map(m =>
          this.characteristicMapping.mapModelToEntity(m),
        ),
      },
    };
    return entity;
  }

  mapModelToUpdateEntity(
    aggregate: SpeciesAggregate,
    entity: SpeciesWithRelations,
  ): Prisma.SpeciesUpdateInput {
    const { model } = aggregate;
    const nextHabitats = model.habitats.map(habitat => habitat.uuid);
    const prevHabitats = entity.habitats.map(habitat => habitat.uuid);

    const newHabitats = nextHabitats.filter(
      uuid => !prevHabitats.includes(uuid),
    );
    const removedHabitats = prevHabitats.filter(
      uuid => !nextHabitats.includes(uuid),
    );

    const species: Prisma.SpeciesUpdateInput = {
      ...this.mapModelToBaseEntity(aggregate),
      asset:
        model.asset.uuid !== entity.assetByUuid
          ? { connect: { uuid: model.asset.uuid } }
          : undefined,
      habitats: {
        create:
          newHabitats.length > 0
            ? model.habitats
                .filter(habitat => newHabitats.includes(habitat.uuid))
                .map(m => this.habitatMapping.mapModelToEntity(m))
            : undefined,
        deleteMany:
          removedHabitats.length > 0
            ? removedHabitats.map(uuid => ({ uuid }))
            : undefined,
      },
      characteristics:
        this.characteristicMapping.mapModelCollectionToUpdateEntity(
          model.characteristics,
          entity.characteristics,
        ),
    };

    return species;
  }

  private mapModelToBaseEntity(
    aggregate: SpeciesAggregate,
  ): Omit<Prisma.SpeciesUpdateInput & Prisma.SpeciesCreateInput, 'asset'> {
    const { model } = aggregate;
    const { createdBy, modifiedBy } = model.authorship;

    return {
      uuid: model.uuid,
      tag: model.tag,
      generation: model.generation,
      description: model.description,
      link: model.link,
      created: model.authorship.created,
      createdBy: model.authorship.createdBy
        ? { connect: { uuid: createdBy.uuid } }
        : undefined,
      modified: model.authorship.modified,
      modifiedBy: model.authorship.modifiedBy
        ? { connect: { uuid: modifiedBy.uuid } }
        : undefined,
    };
  }
}
