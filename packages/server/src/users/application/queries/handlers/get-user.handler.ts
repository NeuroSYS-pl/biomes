import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserDTO } from '../../../domain';
import { UserRepository } from '../../../infrastructure';
import { GetUserQuery } from '../get-user.query';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetUserQuery): Promise<UserDTO | UserDTO[]> {
    if (query.type === 'all') {
      return this.userRepository.getAll();
    } else if (query.type === 'single') {
      return this.userRepository.getOne(query.selector);
    }

    throw new Error('Unsupported query');
  }
}
