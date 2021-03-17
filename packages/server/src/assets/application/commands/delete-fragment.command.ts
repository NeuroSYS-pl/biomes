import { UUID } from '../../../core';

export class DeleteFragmentCommand {
  constructor(public readonly uuid: UUID) {}
}
