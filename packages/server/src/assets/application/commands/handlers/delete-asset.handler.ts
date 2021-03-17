import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AssetAggregate, FragmentAggregate } from '../../../domain';
import { AssetRepository } from '../../../infrastructure';
import { DeleteAssetCommand } from '../delete-asset.command';

@CommandHandler(DeleteAssetCommand)
export class DeleteAssetHandler implements ICommandHandler<DeleteAssetCommand> {
  readonly logger = new Logger(DeleteAssetHandler.name);

  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: AssetRepository,
  ) {}

  async execute(command: DeleteAssetCommand): Promise<void> {
    const { uuid } = command;

    const Asset = this.publisher.mergeClassContext(AssetAggregate);
    const Fragment = this.publisher.mergeClassContext(FragmentAggregate);

    const asset = new Asset().from(await this.repository.getOne({ uuid }));

    const rawFragments = await this.repository.getAssetFragments(uuid);
    const fragments = rawFragments.map(f => new Fragment().from(f));

    await Promise.all(fragments.map(f => f.delete()));
    await asset.delete();

    await this.repository.deleteAssetFragments(asset);
    await this.repository.deleteAsset(asset);

    fragments.forEach(f => f.commit());
    asset.commit();

    this.logger.verbose(`Deleted Asset(${uuid})`);
  }
}
