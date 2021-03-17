import { UpdateUserInput } from '../interfaces/update-user.input';

export class UpdateUserCommand {
  constructor(public data: UpdateUserInput) {}
}
