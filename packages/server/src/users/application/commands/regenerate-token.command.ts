import { UUID } from '../../../core/types';

export class RegenerateTokenCommand {
  constructor(public user: UUID) {}
}
