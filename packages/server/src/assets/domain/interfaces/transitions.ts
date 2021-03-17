import { Reference, UUID } from '../../../core';

export interface CreateAssetDTO {
  readonly requestId: UUID;
  readonly expectedParts: number;
  readonly digest: string;
  readonly filename: string;
  readonly compressed: boolean;
  readonly author: Reference;
}

export interface CreateFragmentDTO {
  readonly asset: UUID;
  readonly requestId: UUID;
  readonly part: number;
}
