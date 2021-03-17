import * as validator from 'class-validator';
import { Type } from 'class-transformer';
import { Model, UUID, Reference } from '../../../core';
import { AuthorshipModel } from '../../../common/authorship';
import { BiomeDTO } from '../interfaces';

export class BiomeModel extends Model<BiomeDTO> {
  @validator.IsNotEmpty()
  @validator.IsUUID('4')
  readonly uuid: UUID;

  @validator.IsNotEmpty()
  @validator.IsString()
  @validator.IsAlphanumeric()
  readonly name: string;

  @validator.IsOptional()
  @validator.IsString()
  readonly description?: string;

  @validator.IsOptional()
  @validator.IsString()
  readonly link?: string;

  @validator.IsNotEmpty()
  @validator.IsArray()
  @validator.ValidateNested({ each: true })
  @Type(() => Reference)
  readonly species: ReadonlyArray<Reference>;

  @validator.IsNotEmpty()
  @validator.ValidateNested()
  @Type(() => AuthorshipModel)
  readonly authorship: AuthorshipModel;

  toString = (): string => `Biome(${this.uuid})`;
}
