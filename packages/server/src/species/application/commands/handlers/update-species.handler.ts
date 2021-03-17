import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { SpeciesAggregate, SpeciesDTO } from '../../../domain';
import { SpeciesRepository } from '../../../infrastructure';
import { UpdateSpeciesCommand } from '../update-species.command';

@CommandHandler(UpdateSpeciesCommand)
export class UpdateSpeciesHandler
  implements ICommandHandler<UpdateSpeciesCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: SpeciesRepository,
  ) {}

  async execute(command: UpdateSpeciesCommand): Promise<SpeciesDTO> {
    const { data, author } = command;

    const species = this.publisher.mergeObjectContext(
      new SpeciesAggregate().from(
        await this.repository.getOne({ uuid: data.uuid }),
      ),
    );

    const generation =
      data.tag != null && data.tag !== species.model.tag
        ? await this.getGeneration(data.tag)
        : species.model.generation;

    await species.update({ ...data, generation, author });

    const dto = await this.repository.update(species);
    species.commit();
    return dto;
  }

  async getGeneration(tag: string): Promise<number> {
    const ancestors = await this.repository.getMany({ tag });
    const generations = ancestors.map(a => a.generation);
    return generations.length > 0 ? Math.max(...generations) + 1 : 0;
  }
}
