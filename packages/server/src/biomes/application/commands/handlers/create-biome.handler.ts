import { BadRequestException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { BiomeAggregate, BiomeDTO } from '../../../domain';
import { BiomeRepository } from '../../../infrastructure';
import { CreateBiomeCommand } from '../create-biome.command';

@CommandHandler(CreateBiomeCommand)
export class CreateBiomeHandler implements ICommandHandler<CreateBiomeCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: BiomeRepository,
  ) {}

  async execute(command: CreateBiomeCommand): Promise<BiomeDTO> {
    const { data, author } = command;

    const alreadyExists = await this.repository.hasBiome({ name: data.name });
    if (alreadyExists) {
      throw new BadRequestException(`Biome(${data.name}) already exists!`);
    }

    const biome = this.publisher.mergeObjectContext(new BiomeAggregate());
    await biome.create({ ...data, author });

    const dto = await this.repository.create(biome);
    biome.commit();
    return dto;
  }
}
