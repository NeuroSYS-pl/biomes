import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { SpeciesAggregate, SpeciesDTO } from '../../../domain';
import { SpeciesRepository } from '../../../infrastructure';
import { CreateSpeciesCommand } from '../create-species.command';

@CommandHandler(CreateSpeciesCommand)
export class CreateSpeciesHandler
  implements ICommandHandler<CreateSpeciesCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: SpeciesRepository,
  ) {}

  async execute(command: CreateSpeciesCommand): Promise<SpeciesDTO> {
    const { data, asset, author } = command;

    const ancestors = await this.repository.getMany({ tag: data.tag });
    const generations = ancestors.map(a => a.generation);
    const nextGeneration =
      generations.length > 0 ? Math.max(...generations) + 1 : 0;

    const species = this.publisher.mergeObjectContext(new SpeciesAggregate());
    await species.create({
      ...data,
      generation: nextGeneration,
      asset,
      author,
    });

    const dto = await this.repository.create(species);
    species.commit();
    return dto;
  }
}
