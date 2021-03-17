import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AssetAggregate, FragmentAggregate } from '../../../domain';
import { AssetRepository } from '../../../infrastructure';
import { DeleteInvalidAssetsCommand } from '../delete-invalid-assets.command';

@CommandHandler(DeleteInvalidAssetsCommand)
export class DeleteInvalidAssetsHandler
  implements ICommandHandler<DeleteInvalidAssetsCommand> {
  readonly logger = new Logger(DeleteInvalidAssetsCommand.name);

  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: AssetRepository,
  ) {}

  async execute(command: DeleteInvalidAssetsCommand): Promise<void> {
    const Asset = this.publisher.mergeClassContext(AssetAggregate);

    const rawAssets = command.purgeAll
      ? await this.repository.getNotValid()
      : await this.repository.getInvalid();

    const assets = rawAssets.map(asset => new Asset().from(asset));
    await Promise.all(assets.map(asset => this.deleteAsset(asset)));
  }

  private async deleteAsset(asset: AssetAggregate): Promise<void> {
    const Fragment = this.publisher.mergeClassContext(FragmentAggregate);

    const rawFragments = await this.repository.getAssetFragments(asset.id());
    const fragments = rawFragments.map(f => new Fragment().from(f));

    await Promise.all(fragments.map(f => f.delete()));
    await asset.delete();

    await this.repository.deleteAssetFragments(asset);
    await this.repository.deleteAsset(asset);

    fragments.forEach(f => f.commit());
    asset.commit();

    this.logger.verbose(`Deleted Asset(${asset.id()})`);
  }
}
