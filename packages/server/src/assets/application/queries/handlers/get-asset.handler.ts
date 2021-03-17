import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AssetDTO } from '../../../domain';
import { AssetRepository } from '../../../infrastructure';
import { GetAssetQuery } from '../get-asset.query';

@QueryHandler(GetAssetQuery)
export class GetAssetHandler implements IQueryHandler<GetAssetQuery> {
  constructor(private readonly repository: AssetRepository) {}

  async execute({ query }: GetAssetQuery): Promise<AssetDTO> {
    return this.repository.getOne(query);
  }
}
