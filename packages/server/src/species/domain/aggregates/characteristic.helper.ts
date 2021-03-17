import { v4 as uuidv4 } from 'uuid';
import { Reference, UUID } from '../../../core';
import { CharacteristicSimpleDTO } from '../interfaces/transitions';
import { CharacteristicModel } from '../models/characteristics.model';

export const update = (
  p: CharacteristicModel,
  n: CharacteristicSimpleDTO,
  author: UUID,
): CharacteristicModel =>
  p.update({
    value: n.value,
    authorship: p.authorship.update(
      n.value !== p.value
        ? {
            modified: new Date(),
            modifiedBy: Reference.create(author),
          }
        : {},
    ),
  });

export const create = (
  n: CharacteristicSimpleDTO,
  author: UUID,
): CharacteristicModel =>
  new CharacteristicModel({
    uuid: uuidv4(),
    key: n.key,
    value: n.value,
    authorship: {
      created: new Date(),
      createdBy: Reference.create(author),
    },
  });

export const updateAll = (
  prev: ReadonlyArray<CharacteristicModel>,
  next: ReadonlyArray<CharacteristicSimpleDTO> | null | undefined,
  author: UUID,
): ReadonlyArray<CharacteristicModel> => {
  if (!next) {
    return prev;
  }

  const characteristics = next.map(nextChar => {
    const prevChar = prev.find(c => c.key === nextChar.key);
    return prevChar != null
      ? update(prevChar, nextChar, author)
      : create(nextChar, author);
  });

  return characteristics;
};
