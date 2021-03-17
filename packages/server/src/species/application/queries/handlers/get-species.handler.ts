import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SpeciesDTO } from '../../../domain';
import { SpeciesRepository } from '../../../infrastructure';
import { GetSpeciesQuery } from '../get-species.query';

@QueryHandler(GetSpeciesQuery)
export class GetSpeciesHandler implements IQueryHandler<GetSpeciesQuery> {
  constructor(private readonly repository: SpeciesRepository) {}

  async execute(query: GetSpeciesQuery): Promise<SpeciesDTO | SpeciesDTO[]> {
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
