import { IEvent } from '@nestjs/cqrs';
import { UUID } from '../../../core';
import { AssetInvalidityReason, AssetStatus } from '../utils/asset-status';

export class ChangedStatusEvent implements IEvent {
  constructor(
    public readonly uuid: UUID,
    public readonly status: AssetStatus,
    public readonly reason?: AssetInvalidityReason,
  ) {}
}
