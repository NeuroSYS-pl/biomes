import { Type } from 'class-transformer';
import * as validator from 'class-validator';
import { Model } from '../../../core';
import { MigrationDTO, MigrationStatus } from '../interfaces';
import { AppliedMigrationInfoModel } from './applied-migration-info.model';

export class MigrationModel extends Model<MigrationDTO> {
  @validator.IsNotEmpty()
  @validator.IsNumber()
  @validator.Min(0)
  readonly pk: number;

  @validator.IsNotEmpty()
  @validator.IsString()
  readonly name: string;

  @validator.IsOptional()
  @validator.IsString()
  readonly changelog?: string;

  @validator.IsNotEmpty()
  @validator.IsHash('sha256')
  readonly commitChecksum: string;

  @validator.IsNotEmpty()
  @validator.IsEnum(MigrationStatus)
  readonly status: MigrationStatus;

  @validator.IsOptional()
  @validator.ValidateNested()
  @Type(() => AppliedMigrationInfoModel)
  readonly applied?: AppliedMigrationInfoModel;

  toString = (): string => `Migration(${this.pk})`;
}
