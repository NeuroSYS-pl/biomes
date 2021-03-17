import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AssetAggregate, AssetDTO } from '../../../domain';
import { AssetRepository } from '../../../infrastructure';
import { CreateAssetCommand } from '../create-asset.command';

@CommandHandler(CreateAssetCommand)
export class CreateAssetHandler implements ICommandHandler<CreateAssetCommand> {
  readonly logger = new Logger(CreateAssetHandler.name);

  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: AssetRepository,
  ) {}

  async execute(command: CreateAssetCommand): Promise<AssetDTO> {
    const { data, author } = command;

    const asset = this.publisher.mergeObjectContext(new AssetAggregate());
    await asset.create({ ...data, author });

    const dto = await this.repository.createAsset(asset);
    asset.commit();
    this.logger.verbose(`Created ${asset}`);
    return dto;
  }
}
