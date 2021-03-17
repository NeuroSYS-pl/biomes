import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AssetRepository } from '../../../infrastructure';
import { GetAssetSizeQuery } from '../get-asset-size.query';

@QueryHandler(GetAssetSizeQuery)
export class GetAssetSizeHandler implements IQueryHandler<GetAssetSizeQuery> {
  constructor(private readonly repository: AssetRepository) {}

  async execute({ query }: GetAssetSizeQuery): Promise<number | null> {
    return this.repository.getAssetSize(query);
  }
}
