import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FragmentAggregate } from '../../../domain';
import { AssetFileSystem, AssetRepository } from '../../../infrastructure';
import { AppendFragmentCommand } from '../append-fragment.command';

@CommandHandler(AppendFragmentCommand)
export class AppendFragmentHandler
  implements ICommandHandler<AppendFragmentCommand> {
  readonly logger = new Logger(AppendFragmentHandler.name);

  constructor(
    private readonly repository: AssetRepository,
    private readonly fs: AssetFileSystem,
  ) {}

  async execute(command: AppendFragmentCommand): Promise<void> {
    const { uuid, stream } = command;
    const fragment = new FragmentAggregate().from(
      await this.repository.getOneFragment({ uuid }),
    );
    await this.fs.appendToStream(stream, fragment.model.binary);
    this.logger.verbose(`Processed ${fragment}`);
  }
}
