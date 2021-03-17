import { UUID } from '../../../core';

export class DeleteAssetCommand {
  constructor(public readonly uuid: UUID) {}
}
