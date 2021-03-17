import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AssetDTO } from '../../../domain';
import { AssetRepository } from '../../../infrastructure';
import { GetInvalidAssetsQuery } from '../get-invalid-assets.query';

@QueryHandler(GetInvalidAssetsQuery)
export class GetInvalidAssetsHandler
  implements IQueryHandler<GetInvalidAssetsQuery> {
  constructor(private readonly repository: AssetRepository) {}

  async execute(query: GetInvalidAssetsQuery): Promise<AssetDTO[]> {
    return query.purgeAll
      ? this.repository.getNotValid()
      : this.repository.getInvalid();
  }
}
