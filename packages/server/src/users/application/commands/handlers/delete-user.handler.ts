import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserAggregate } from '../../../domain';
import { UserRepository } from '../../../infrastructure';
import { DeleteUserCommand } from '../delete-user.command';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const user = this.publisher.mergeObjectContext(
      new UserAggregate().from(
        await this.userRepository.getOne({ uuid: command.uuid }),
      ),
    );
    await user.delete();
    await this.userRepository.delete(user);
    user.commit();
  }
}
