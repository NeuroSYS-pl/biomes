import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserAggregate, UserDTO } from '../../../domain';
import { UserRepository } from '../../../infrastructure';
import { UpdateUserCommand } from '../update-user.command';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: UserRepository,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UserDTO> {
    const user = this.publisher.mergeObjectContext(
      new UserAggregate().from(
        await this.repository.getOne({ uuid: command.data.uuid }),
      ),
    );
    await user.update(command.data);

    const dto = await this.repository.update(user);
    user.commit();
    return dto;
  }
}
