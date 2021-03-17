import { UUID } from '../../../core';

export class DeleteUserCommand {
  constructor(public uuid: UUID) {}
}
