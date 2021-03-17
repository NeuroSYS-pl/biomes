import * as validator from 'class-validator';
import { UUID } from '../../../core';
import { Model } from '../../../core/model';
import { UserDTO } from '../interfaces/dto';

export class UserModel extends Model<UserDTO> implements UserDTO {
  @validator.IsNotEmpty()
  @validator.IsUUID('4')
  readonly uuid: UUID;

  @validator.IsNotEmpty()
  @validator.IsString()
  @validator.IsEmail()
  readonly email: string;

  @validator.IsNotEmpty()
  @validator.IsString()
  readonly firstName: string;

  @validator.IsNotEmpty()
  @validator.IsString()
  readonly lastName: string;

  @validator.IsOptional()
  @validator.IsString()
  @validator.IsHexadecimal()
  @validator.Length(64)
  readonly token?: string;

  @validator.IsNotEmpty()
  @validator.IsDate()
  readonly created: Date;

  @validator.IsOptional()
  @validator.IsDate()
  readonly modified?: Date;

  toString = (): string => `User(${this.uuid})`;
}
