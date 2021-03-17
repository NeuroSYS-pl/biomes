import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AssetAggregate } from '../../../domain';
import { AssetRepository } from '../../../infrastructure';
import { CleanupAssetCommand } from '../cleanup-asset.command';

@CommandHandler(CleanupAssetCommand)
export class CleanupAssetHandler
  implements ICommandHandler<CleanupAssetCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: AssetRepository,
  ) {}

  async execute(command: CleanupAssetCommand): Promise<void> {
    const { uuid } = command;

    const asset = this.publisher.mergeObjectContext(
      new AssetAggregate().from(await this.repository.getOne({ uuid })),
    );

    await asset.cleanup();

    await this.repository.updateAsset(asset);
    asset.commit();
  }
}
