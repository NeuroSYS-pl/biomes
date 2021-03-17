import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserAggregate, UserDTO } from '../../../domain';
import { UserRepository } from '../../../infrastructure';
import { CreateUserCommand } from '../create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: UserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserDTO> {
    const user = this.publisher.mergeObjectContext(new UserAggregate());
    await user.create(command.data);

    const dto = await this.repository.create(user);
    user.commit();
    return dto;
  }
}
