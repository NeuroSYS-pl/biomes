import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserAggregate, UserDTO } from '../../../domain';
import { UserRepository } from '../../../infrastructure';
import { RegenerateTokenCommand } from '../regenerate-token.command';

@CommandHandler(RegenerateTokenCommand)
export class RegenerateTokenHandler
  implements ICommandHandler<RegenerateTokenCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: UserRepository,
  ) {}

  async execute(command: RegenerateTokenCommand): Promise<UserDTO> {
    const user = this.publisher.mergeObjectContext(
      new UserAggregate().from(
        await this.repository.getOne({ uuid: command.user }),
      ),
    );
    await user.regenerateToken();

    const dto = await this.repository.update(user);
    user.commit();
    return dto;
  }
}
