import { QueryBus } from '@nestjs/cqrs';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { UserDTO } from '../../domain';
import { User } from '../interfaces/user.output';
import * as Queries from '../queries';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    const users: UserDTO[] = await this.queryBus.execute(
      new Queries.GetUserQuery('all'),
    );
    return users.map(user => plainToClass(User, user));
  }

  @Query(() => User)
  async user(@Args('uuid') uuid: string): Promise<User> {
    const user: UserDTO = await this.queryBus.execute(
      new Queries.GetUserQuery('single', { uuid }),
    );
    return plainToClass(User, user);
  }
}
