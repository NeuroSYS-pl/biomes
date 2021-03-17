import { CreateUserInput } from '../interfaces/create-user.input';

export class CreateUserCommand {
  constructor(public data: CreateUserInput) {}
}
