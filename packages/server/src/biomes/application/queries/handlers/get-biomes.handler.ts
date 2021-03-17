import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BiomeDTO } from '../../../domain';
import { BiomeRepository } from '../../../infrastructure';
import { GetBiomesQuery } from '../get-biomes.query';

@QueryHandler(GetBiomesQuery)
export class GetBiomesHandler implements IQueryHandler<GetBiomesQuery> {
  constructor(private readonly repository: BiomeRepository) {}

  async execute(query: GetBiomesQuery): Promise<BiomeDTO | BiomeDTO[]> {
    if (query.type === 'all') {
      return this.repository.getAll();
    } else if (query.type === 'many') {
      return this.repository.getMany(query.filter);
    } else if (query.type === 'single') {
      return this.repository.getOne(query.selector);
    }

    throw new NotFoundException('Unsupported query');
  }
}
