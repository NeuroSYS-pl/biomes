import type { UserAggregate } from '../user.aggregate';
import type { UserDTO } from './dto';
import { UserSelector } from './query';

export interface IUserRepository {
  getOne(query: UserSelector): Promise<UserDTO>;
  getAll(): Promise<UserDTO[]>;

  create(aggregate: UserAggregate): Promise<UserDTO>;
  update(aggregate: UserAggregate): Promise<UserDTO>;
  delete(aggregate: UserAggregate): Promise<void>;
}
