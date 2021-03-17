import { Injectable } from '@nestjs/common';
import { Prisma, Habitats } from '@prisma/client';
import { Reference } from '../../core';
import { HabitatDTO } from '../domain';
import { HabitatModel } from '../domain/models/habitat.model';

@Injectable()
export class HabitatMapping {
  mapEntityToDTO(entity: Habitats): HabitatDTO {
    return {
      uuid: entity.uuid,
      species: Reference.create(entity.speciesByUuid),
      biome: Reference.create(entity.biomesByUuid),
      created: entity.created,
      createdBy: Reference.create(entity.createdByUuid),
    };
  }

  mapModelToEntity(
    model: HabitatModel,
  ): Prisma.HabitatsCreateWithoutSpeciesInput &
    Prisma.HabitatsUpdateWithoutSpeciesInput {
    return {
      uuid: model.uuid,
      created: model.created,
      createdBy: {
        connect: { uuid: model.createdBy.uuid },
      },
      biomes: {
        connect: { uuid: model.biome.uuid },
      },
    };
  }
}
