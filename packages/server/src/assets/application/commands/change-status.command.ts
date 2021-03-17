import { UUID } from '../../../core';
import { AssetInvalidityReason, AssetStatus } from '../../domain';

export class ChangeStatusCommand {
  constructor(
    public readonly assetUUID: UUID,
    public readonly status: AssetStatus,
    public readonly reason?: AssetInvalidityReason,
  ) {}
}
