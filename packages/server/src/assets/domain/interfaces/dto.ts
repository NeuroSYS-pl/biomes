import { AuthorshipDTO } from '../../../common/authorship';
import { Reference, UUID } from '../../../core';
import { AssetInvalidityReason, AssetStatus } from '../utils/asset-status';

export interface AssetDTO {
  readonly uuid: UUID;
  readonly binary?: string;
  readonly digest: string;
  readonly compressed: boolean;
  readonly filename: string;
  readonly status: AssetStatus;
  readonly draft?: DraftDTO;
  readonly invalid?: InvalidityDTO;
  readonly authorship: AuthorshipDTO;
}

export interface DraftDTO {
  readonly requestId: UUID;
  readonly expectedParts: number;
  readonly fragments: ReadonlyArray<Reference>;
}

export interface InvalidityDTO {
  readonly reason: AssetInvalidityReason;
  readonly timestamp: Date;
}

export interface FragmentDTO {
  readonly uuid: UUID;
  readonly asset: Reference;
  readonly part: number;
  readonly binary: string;
}
