import { IsDate, IsEnum, IsNotEmpty } from 'class-validator';
import { Model } from '../../../core';
import { InvalidityDTO } from '../interfaces';
import { AssetInvalidityReason } from '../utils/asset-status';

export class InvalidityModel extends Model<InvalidityDTO> {
  @IsNotEmpty()
  @IsEnum(AssetInvalidityReason)
  readonly reason: AssetInvalidityReason;

  @IsNotEmpty()
  @IsDate()
  readonly timestamp: Date;

  toString = (): string => `Invalid(${this.reason} @ ${this.timestamp})`;
}
