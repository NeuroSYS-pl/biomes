import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { FragmentAggregate } from '../../../domain';
import { AssetRepository } from '../../../infrastructure';
import { DeleteOrphanedFragmentsCommand } from '../delete-orphaned-fragments.command';

@CommandHandler(DeleteOrphanedFragmentsCommand)
export class DeleteOrphanedFragmentsHandler
  implements ICommandHandler<DeleteOrphanedFragmentsCommand> {
  readonly logger = new Logger(DeleteOrphanedFragmentsCommand.name);

  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: AssetRepository,
  ) {}

  async execute(): Promise<void> {
    const Fragment = this.publisher.mergeClassContext(FragmentAggregate);

    const rawFragments = await this.repository.getOrphanedFragments();
    const fragments = rawFragments.map(f => new Fragment().from(f));
    await Promise.all(fragments.map(f => this.deleteFragment(f)));
  }

  async deleteFragment(fragment: FragmentAggregate): Promise<void> {
    await fragment.delete();
    await this.repository.deleteFragment(fragment);
    fragment.commit();
    this.logger.verbose(`Deleted orphaned Fragment(${fragment.id()})`);
  }
}
