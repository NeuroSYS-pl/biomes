import { Type } from 'class-transformer';
import * as validator from 'class-validator';
import { Model, Reference, UUID } from '../../../core';
import { HabitatDTO } from '../interfaces';

export class HabitatModel extends Model<HabitatDTO> {
  @validator.IsNotEmpty()
  @validator.IsUUID('4')
  readonly uuid: UUID;

  @validator.IsNotEmpty()
  @validator.ValidateNested()
  @Type(() => Reference)
  readonly biome: Reference;

  @validator.IsNotEmpty()
  @validator.ValidateNested()
  @Type(() => Reference)
  readonly species: Reference;

  @validator.IsNotEmpty()
  @validator.IsDate()
  readonly created: Date;

  @validator.IsNotEmpty()
  @validator.ValidateNested()
  @Type(() => Reference)
  readonly createdBy: Reference;

  toString = (): string => `Habitat(${this.uuid})`;
}
