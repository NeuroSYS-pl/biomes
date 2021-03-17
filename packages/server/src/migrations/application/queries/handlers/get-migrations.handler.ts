import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { MigrationDTO } from '../../../domain';
import { MigrationRepository } from '../../../infrastructure';
import { GetMigrationsQuery } from '../get-migrations.query';

@QueryHandler(GetMigrationsQuery)
export class GetMigrationsHandler implements IQueryHandler<GetMigrationsQuery> {
  constructor(private readonly repository: MigrationRepository) {}

  async execute(
    query: GetMigrationsQuery,
  ): Promise<MigrationDTO | MigrationDTO[]> {
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
