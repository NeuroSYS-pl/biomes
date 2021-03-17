import { IEvent } from '@nestjs/cqrs';
import { UUID } from '../../../core';

export class AssetUploadTimeoutEvent implements IEvent {
  constructor(
    public readonly uuid: UUID,
    public readonly temporaryFile?: string,
  ) {}
}
