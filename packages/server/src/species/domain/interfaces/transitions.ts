import { Reference, UUID } from '../../../core';

export interface CreateSpeciesDTO {
  readonly tag: string;
  readonly generation: number;
  readonly description?: string;
  readonly link?: string;
  readonly asset: Reference;
  readonly biomes?: ReadonlyArray<UUID>;
  readonly characteristics?: ReadonlyArray<CharacteristicSimpleDTO>;
  readonly author: Reference;
}

export interface UpdateSpeciesDTO {
  readonly uuid: string;
  readonly tag?: string;
  readonly generation?: number;
  readonly description?: string;
  readonly link?: string;
  readonly biomes?: ReadonlyArray<UUID>;
  readonly characteristics?: ReadonlyArray<CharacteristicSimpleDTO>;
  readonly author: Reference;
}

export interface CharacteristicSimpleDTO {
  readonly key: string;
  readonly value: string;
}
