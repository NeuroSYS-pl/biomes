import { Type } from 'class-transformer';
import * as validator from 'class-validator';
import { AuthorshipModel } from '../../../common/authorship';
import { Model, UUID } from '../../../core';
import { CharacteristicDTO } from '../interfaces/dto';

export class CharacteristicModel extends Model<CharacteristicDTO> {
  @validator.IsNotEmpty()
  @validator.IsUUID('4')
  readonly uuid: UUID;

  @validator.IsNotEmpty()
  @validator.IsString()
  readonly key: string;

  @validator.IsNotEmpty()
  @validator.IsString()
  readonly value: string;

  @validator.IsNotEmpty()
  @validator.ValidateNested()
  @Type(() => AuthorshipModel)
  readonly authorship: AuthorshipModel;

  toString = (): string => `Characteristic(${this.uuid})`;
}
