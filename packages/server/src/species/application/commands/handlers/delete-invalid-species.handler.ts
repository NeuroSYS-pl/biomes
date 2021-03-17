import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { SpeciesAggregate } from '../../../domain';
import { SpeciesRepository } from '../../../infrastructure';
import { DeleteInvalidSpeciesCommand } from '../delete-invalid-species.command';

@CommandHandler(DeleteInvalidSpeciesCommand)
export class DeleteInvalidSpeciesHandler
  implements ICommandHandler<DeleteInvalidSpeciesCommand> {
  readonly logger = new Logger(DeleteInvalidSpeciesCommand.name);

  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: SpeciesRepository,
  ) {}

  async execute(command: DeleteInvalidSpeciesCommand): Promise<void> {
    const Species = this.publisher.mergeClassContext(SpeciesAggregate);

    const rawSpecies = command.purgeAll
      ? await this.repository.getNotValid()
      : await this.repository.getInvalid();

    const species = rawSpecies.map(s => new Species().from(s));
    await Promise.all(species.map(s => s.delete()));

    await this.repository.deleteMany(species);
    species.forEach(s => s.commit());
  }
}
