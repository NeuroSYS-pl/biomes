import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SpeciesDTO } from '../../../domain';
import { SpeciesRepository } from '../../../infrastructure';
import { GetInvalidSpeciesQuery } from '../get-invalid-species.query';

@QueryHandler(GetInvalidSpeciesQuery)
export class GetInvalidSpeciesHandler
  implements IQueryHandler<GetInvalidSpeciesQuery> {
  constructor(private readonly repository: SpeciesRepository) {}

  async execute(query: GetInvalidSpeciesQuery): Promise<SpeciesDTO[]> {
    return query.purgeAll
      ? this.repository.getNotValid()
      : this.repository.getInvalid();
  }
}
