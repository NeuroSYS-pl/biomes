import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FragmentDTO } from '../../../domain';
import { AssetRepository } from '../../../infrastructure';
import { GetOrphanedFragmentsQuery } from '../get-orphaned-fragments.query';

@QueryHandler(GetOrphanedFragmentsQuery)
export class GetOrphanedFragmentsHandler
  implements IQueryHandler<GetOrphanedFragmentsQuery> {
  constructor(private readonly repository: AssetRepository) {}

  async execute(): Promise<FragmentDTO[]> {
    return this.repository.getOrphanedFragments();
  }
}
