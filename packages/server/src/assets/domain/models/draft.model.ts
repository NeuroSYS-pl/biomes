import { Type } from 'class-transformer';
import * as validator from 'class-validator';
import { Model, Reference, UUID } from '../../../core';
import { DraftDTO } from '../interfaces';

export class DraftModel extends Model<DraftDTO> {
  @validator.IsNotEmpty()
  @validator.IsUUID('4')
  readonly requestId: UUID;

  @validator.IsNotEmpty()
  @validator.IsInt()
  @validator.Min(1)
  readonly expectedParts: number;

  @validator.IsNotEmpty()
  @validator.IsArray()
  @validator.ValidateNested({ each: true })
  @Type(() => Reference)
  readonly fragments: ReadonlyArray<Reference>;

  toString = (): string => `DraftAsset(${this.requestId})`;
}
