import { Type } from 'class-transformer';
import * as validator from 'class-validator';
import { Model, UUID } from '../../../core';
import { AuthorshipModel } from '../../../common/authorship';
import { AssetDTO } from '../interfaces';
import { InvalidityModel } from './invalidity.model';
import { DraftModel } from './draft.model';
import { AssetStatus } from '../utils/asset-status';

export class AssetModel extends Model<AssetDTO> {
  @validator.IsNotEmpty()
  @validator.IsUUID('4')
  readonly uuid: UUID;

  @validator.IsOptional()
  @validator.IsString()
  readonly binary?: string;

  @validator.IsNotEmpty()
  @validator.IsHash('sha256')
  readonly digest: string;

  @validator.IsNotEmpty()
  @validator.IsBoolean()
  readonly compressed: boolean;

  @validator.IsNotEmpty()
  @validator.Matches(/^[0-9a-zA-Z_\-. ]+$/)
  readonly filename: string;

  @validator.IsNotEmpty()
  @validator.IsEnum(AssetStatus)
  readonly status: AssetStatus;

  @validator.IsOptional()
  @validator.ValidateNested()
  @Type(() => DraftModel)
  readonly draft?: DraftModel;

  @validator.ValidateIf((m: AssetModel) => m.status === AssetStatus.INVALID)
  @validator.IsNotEmpty()
  @validator.ValidateNested()
  @Type(() => InvalidityModel)
  readonly invalid?: InvalidityModel;

  @validator.IsNotEmpty()
  @validator.ValidateNested()
  @Type(() => AuthorshipModel)
  readonly authorship: AuthorshipModel;

  toString = (): string => `Asset(${this.uuid})`;
}
