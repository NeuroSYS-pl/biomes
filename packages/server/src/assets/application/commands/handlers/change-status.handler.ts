import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AssetAggregate, AssetDTO } from '../../../domain';
import { AssetRepository } from '../../../infrastructure';
import { ChangeStatusCommand } from '../change-status.command';

@CommandHandler(ChangeStatusCommand)
export class ChangeStatusHandler
  implements ICommandHandler<ChangeStatusCommand> {
  readonly logger = new Logger(ChangeStatusCommand.name);

  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: AssetRepository,
  ) {}

  async execute(command: ChangeStatusCommand): Promise<AssetDTO> {
    const { assetUUID, status, reason } = command;

    const asset = this.publisher.mergeObjectContext(
      new AssetAggregate().from(
        await this.repository.getOne({ uuid: assetUUID }),
      ),
    );

    await asset.changeStatus(status, reason);

    const dto = await this.repository.updateAsset(asset);
    asset.commit();
    this.logger.verbose(this.getMessage(asset));
    return dto;
  }

  private getMessage(asset: AssetAggregate): string {
    const { status, invalid } = asset.model;
    const statusMsg = `${asset} changed status to ${status}`;
    const reasonMsg = invalid ? ` due to: ${invalid.reason}` : '';
    return `${statusMsg}${reasonMsg}`;
  }
}
