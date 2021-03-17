import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { SpeciesAggregate } from '../../../domain';
import { SpeciesRepository } from '../../../infrastructure';
import { DeleteSpeciesCommand } from '../delete-species.command';

@CommandHandler(DeleteSpeciesCommand)
export class DeleteSpeciesHandler
  implements ICommandHandler<DeleteSpeciesCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: SpeciesRepository,
  ) {}

  async execute(command: DeleteSpeciesCommand): Promise<void> {
    const species = this.publisher.mergeObjectContext(
      new SpeciesAggregate().from(
        await this.repository.getOne(command.selector),
      ),
    );
    await species.delete();

    await this.repository.delete(species);
    species.commit();
  }
}
