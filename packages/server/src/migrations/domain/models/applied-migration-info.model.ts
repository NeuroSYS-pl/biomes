import * as validator from 'class-validator';
import { Model } from '../../../core';
import { AppliedMigrationInfoDTO } from '../interfaces';

export class AppliedMigrationInfoModel extends Model<AppliedMigrationInfoDTO> {
  @validator.IsNotEmpty()
  @validator.IsHash('sha256')
  readonly checksum: string;

  @validator.IsNotEmpty()
  @validator.IsDate()
  readonly timestamp: Date;

  toString = (): string => `AppliedMigrationInfo(${this.timestamp})`;
}
