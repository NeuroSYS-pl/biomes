import { Type } from 'class-transformer';
import * as validator from 'class-validator';
import { Model, Reference, UUID } from '../../../core';
import { AuthorshipModel } from '../../../common/authorship';
import { SpeciesDTO } from '../interfaces/dto';
import { HabitatModel } from './habitat.model';
import { CharacteristicModel } from './characteristics.model';

export class SpeciesModel extends Model<SpeciesDTO> {
  @validator.IsNotEmpty()
  @validator.IsUUID('4')
  readonly uuid: UUID;

  @validator.IsNotEmpty()
  @validator.IsString()
  readonly tag: string;

  @validator.IsNotEmpty()
  @validator.IsInt()
  @validator.Min(0)
  readonly generation: number;

  @validator.IsOptional()
  @validator.IsString()
  readonly description?: string;

  @validator.IsOptional()
  @validator.IsString()
  readonly link?: string;

  @validator.IsNotEmpty()
  @validator.IsArray()
  @validator.ValidateNested({ each: true })
  @Type(() => HabitatModel)
  readonly habitats: ReadonlyArray<HabitatModel>;

  @validator.IsNotEmpty()
  @validator.IsArray()
  @validator.ValidateNested({ each: true })
  @Type(() => CharacteristicModel)
  readonly characteristics: ReadonlyArray<CharacteristicModel>;

  @validator.IsNotEmpty()
  @validator.ValidateNested()
  @Type(() => Reference)
  readonly asset: Reference;

  @validator.IsNotEmpty()
  @validator.ValidateNested()
  @Type(() => AuthorshipModel)
  readonly authorship: AuthorshipModel;

  toString = (): string => `Species(${this.uuid})`;
}
