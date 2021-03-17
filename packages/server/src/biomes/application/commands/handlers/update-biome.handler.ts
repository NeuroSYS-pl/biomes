import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { BiomeAggregate, BiomeDTO } from '../../../domain';
import { BiomeRepository } from '../../../infrastructure';
import { UpdateBiomeCommand } from '../update-biome.command';

@CommandHandler(UpdateBiomeCommand)
export class UpdateBiomeHandler implements ICommandHandler<UpdateBiomeCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: BiomeRepository,
  ) {}

  async execute(command: UpdateBiomeCommand): Promise<BiomeDTO> {
    const { data, author } = command;

    const biome = this.publisher.mergeObjectContext(
      new BiomeAggregate().from(
        await this.repository.getOne({ uuid: command.data.uuid }),
      ),
    );
    await biome.update({ ...data, author });

    const dto = await this.repository.update(biome);
    biome.commit();
    return dto;
  }
}
