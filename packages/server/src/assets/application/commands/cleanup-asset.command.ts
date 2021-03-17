import { UUID } from '../../../core';

export class CleanupAssetCommand {
  constructor(public readonly uuid: UUID) {}
}
