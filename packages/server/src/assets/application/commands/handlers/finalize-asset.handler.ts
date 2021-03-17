import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AssetAggregate, AssetDTO } from '../../../domain';
import { AssetFileSystem, AssetRepository } from '../../../infrastructure';
import { FinalizeAssetCommand } from '../finalize-asset.command';

@CommandHandler(FinalizeAssetCommand)
export class FinalizeAssetHandler
  implements ICommandHandler<FinalizeAssetCommand> {
  readonly logger = new Logger(FinalizeAssetHandler.name);

  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: AssetRepository,
    private readonly fs: AssetFileSystem,
  ) {}

  async execute(command: FinalizeAssetCommand): Promise<AssetDTO> {
    const { uuid } = command;

    const asset = this.publisher.mergeObjectContext(
      new AssetAggregate().from(await this.repository.getOne({ uuid })),
    );

    const hash = await this.fs.calculateHash(asset.model.binary);
    await asset.finalize(hash);

    const dto = await this.repository.updateAsset(asset);
    asset.commit();
    this.logger.verbose(`Finalized ${asset}`);
    return dto;
  }
}
