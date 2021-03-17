import { AuthorshipDTO } from '../../../common/authorship';
import { Reference, UUID } from '../../../core';

export interface SpeciesDTO {
  readonly uuid: UUID;
  readonly tag: string;
  readonly generation: number;
  readonly description?: string;
  readonly link?: string;
  readonly habitats: ReadonlyArray<HabitatDTO>;
  readonly characteristics: ReadonlyArray<CharacteristicDTO>;
  readonly asset: Reference;
  readonly authorship: AuthorshipDTO;
}

export interface HabitatDTO {
  readonly uuid: UUID;
  readonly biome: Reference;
  readonly species: Reference;
  readonly created: Date;
  readonly createdBy: Reference;
}

export interface CharacteristicDTO {
  readonly uuid: UUID;
  readonly key: string;
  readonly value: string;
  readonly authorship: AuthorshipDTO;
}
