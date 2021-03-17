import { Type } from 'class-transformer';
import * as validator from 'class-validator';
import { Model, Reference, UUID } from '../../../core';
import { FragmentDTO } from '../interfaces';

export class FragmentModel extends Model<FragmentDTO> {
  @validator.IsNotEmpty()
  @validator.IsUUID('4')
  readonly uuid: UUID;

  @validator.IsNotEmpty()
  @validator.ValidatePromise()
  @Type(() => Reference)
  readonly asset: Reference;

  @validator.IsNotEmpty()
  @validator.IsInt()
  @validator.Min(0)
  readonly part: number;

  @validator.IsNotEmpty()
  @validator.IsString()
  @validator.Matches(/^[0-9a-zA-Z_\-. /]+$/)
  readonly binary: string;

  toString = (): string => `Fragment(${this.uuid})`;
}
