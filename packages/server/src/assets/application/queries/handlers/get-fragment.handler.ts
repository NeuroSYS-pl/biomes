import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FragmentDTO } from '../../../domain';
import { AssetRepository } from '../../../infrastructure';
import { GetFragmentQuery } from '../get-fragment.query';

@QueryHandler(GetFragmentQuery)
export class GetFragmentHandler implements IQueryHandler<GetFragmentQuery> {
  constructor(private readonly repository: AssetRepository) {}

  async execute(query: GetFragmentQuery): Promise<FragmentDTO | FragmentDTO[]> {
    if (query.type === 'single') {
      return this.repository.getOneFragment(query.selector);
    } else if (query.type === 'many') {
      return this.repository.getAssetFragments(query.filter.asset);
    }

    throw new NotFoundException('Unsupported query');
  }
}
