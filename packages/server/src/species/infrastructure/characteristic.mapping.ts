import { Injectable } from '@nestjs/common';
import { Prisma, Characteristics } from '@prisma/client';
import { Reference } from '../../core';
import { CharacteristicDTO } from '../domain';
import { CharacteristicModel } from '../domain/models/characteristics.model';

@Injectable()
export class CharacteristicMapping {
  mapEntityToDTO(entity: Characteristics): CharacteristicDTO {
    return {
      uuid: entity.uuid,
      key: entity.key,
      value: entity.value,
      authorship: {
        created: entity.created,
        createdBy: Reference.create(entity.createdByUuid),
        modified: entity.modified,
        modifiedBy: Reference.create(entity.modifiedByUuid),
      },
    };
  }

  mapModelToEntity(
    model: CharacteristicModel,
  ): Prisma.CharacteristicsCreateWithoutSpeciesInput &
    Prisma.CharacteristicsUpdateWithoutSpeciesInput {
    return {
      uuid: model.uuid,
      key: model.key,
      value: model.value,
      created: model.authorship.created,
      createdBy: model.authorship.createdBy
        ? { connect: { uuid: model.authorship.createdBy.uuid } }
        : undefined,
      modified: model.authorship.modified,
      modifiedBy: model.authorship.modifiedBy
        ? { connect: { uuid: model.authorship.modifiedBy.uuid } }
        : undefined,
    };
  }

  mapModelCollectionToUpdateEntity(
    model: ReadonlyArray<CharacteristicModel>,
    entity: ReadonlyArray<Characteristics>,
  ): Prisma.CharacteristicsUpdateManyWithoutSpeciesInput {
    const nextCharacteristics = model.map(c => c.uuid);
    const prevCharacteristics = entity.map(c => c.uuid);

    const newCharacteristics = nextCharacteristics.filter(
      uuid => !prevCharacteristics.includes(uuid),
    );
    const updatedCharacteristics = nextCharacteristics.filter(uuid =>
      prevCharacteristics.includes(uuid),
    );
    const removedCharacteristics = prevCharacteristics.filter(
      uuid => !nextCharacteristics.includes(uuid),
    );

    return {
      create:
        newCharacteristics.length > 0
          ? model
              .filter(c => newCharacteristics.includes(c.uuid))
              .map(c => this.mapModelToEntity(c))
          : undefined,
      update:
        updatedCharacteristics.length > 0
          ? model
              .filter(c => updatedCharacteristics.includes(c.uuid))
              .map(c => ({
                data: this.mapModelToEntity(c),
                where: { uuid: c.uuid },
              }))
          : undefined,
      deleteMany:
        removedCharacteristics.length > 0
          ? removedCharacteristics.map(uuid => ({ uuid }))
          : undefined,
    };
  }
}
