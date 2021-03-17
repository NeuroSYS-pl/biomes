import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { FragmentAggregate } from '../../../domain';
import { AssetRepository } from '../../../infrastructure';
import { DeleteFragmentCommand } from '../delete-fragment.command';

@CommandHandler(DeleteFragmentCommand)
export class DeleteFragmentHandler
  implements ICommandHandler<DeleteFragmentCommand> {
  readonly logger = new Logger(DeleteFragmentHandler.name);

  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: AssetRepository,
  ) {}

  async execute(command: DeleteFragmentCommand): Promise<void> {
    const { uuid } = command;

    const fragment = this.publisher.mergeObjectContext(
      new FragmentAggregate().from(
        await this.repository.getOneFragment({ uuid }),
      ),
    );

    await fragment.delete();

    await this.repository.deleteFragment(fragment);
    fragment.commit();
    this.logger.verbose(`Deleted ${fragment}`);
  }
}
