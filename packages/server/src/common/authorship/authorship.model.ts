import * as validator from 'class-validator';
import { Model, Reference } from '../../core';
import { AuthorshipDTO } from './authorship.dto';

export class AuthorshipModel extends Model<AuthorshipDTO> {
  @validator.IsNotEmpty()
  @validator.IsDate()
  readonly created: Date;

  @validator.IsNotEmpty()
  @validator.ValidateNested()
  readonly createdBy: Reference;

  @validator.IsOptional()
  @validator.IsDate()
  readonly modified?: Date;

  @validator.IsOptional()
  @validator.ValidateNested()
  readonly modifiedBy?: Reference;

  toString = (): string => 'Authorship';
}
