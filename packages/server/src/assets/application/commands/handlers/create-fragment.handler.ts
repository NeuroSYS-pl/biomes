import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { FragmentAggregate, FragmentDTO } from '../../../domain';
import { AssetRepository } from '../../../infrastructure';
import { CreateFragmentCommand } from '../create-fragment.command';

@CommandHandler(CreateFragmentCommand)
export class CreateFragmentHandler
  implements ICommandHandler<CreateFragmentCommand> {
  readonly logger = new Logger(CreateFragmentHandler.name);

  constructor(
    private readonly publisher: EventPublisher,
    private readonly repository: AssetRepository,
  ) {}

  async execute(command: CreateFragmentCommand): Promise<FragmentDTO> {
    const { data, file } = command;

    const fragment = this.publisher.mergeObjectContext(new FragmentAggregate());
    await fragment.create(data, file);

    const dto = await this.repository.createFragment(fragment);
    fragment.commit();
    this.logger.verbose(`Created ${fragment}`);
    return dto;
  }
}
