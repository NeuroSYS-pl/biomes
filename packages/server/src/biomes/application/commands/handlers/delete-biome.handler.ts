import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { BiomeAggregate } from '../../../domain';
import { BiomeRepository } from '../../../infrastructure';
import { DeleteBiomeCommand } from '../delete-biome.command';

@CommandHandler(DeleteBiomeCommand)
export class DeleteBiomeHandler implements ICommandHandler<DeleteBiomeCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: BiomeRepository,
  ) {}

  async execute(command: DeleteBiomeCommand): Promise<void> {
    const { selector, user } = command;

    const biome = this.publisher.mergeObjectContext(
      new BiomeAggregate().from(await this.repository.getOne(selector)),
    );
    await biome.delete(user);

    await this.repository.delete(biome);
    biome.commit();
  }
}
