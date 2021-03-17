import { UserSelector } from '../../domain/interfaces/query';

export type UsersQueryType = 'all' | 'single';

export class GetUserQuery {
  constructor(type: 'all');
  constructor(type: 'single', selector: UserSelector);
  constructor(
    public readonly type: UsersQueryType,
    public readonly selector?: UserSelector,
  ) {}
}
