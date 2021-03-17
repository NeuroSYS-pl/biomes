import { UUID } from '../../../core';

export class FinalizeAssetCommand {
  constructor(public readonly uuid: UUID) {}
}
