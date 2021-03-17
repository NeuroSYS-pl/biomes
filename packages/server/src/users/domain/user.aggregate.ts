import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'crypto';
import { UUID } from '../../core/types';
import { Aggregate, Transition } from '../../core/aggregate';
import { CreateUserDTO, UpdateUserDTO } from './interfaces/transitions';
import { UserModel } from './models';

export class UserAggregate extends Aggregate<UserModel> {
  ModelType = UserModel;
  id = (): UUID => this.model.uuid;
  toString = (): string => `UserAggregate(${this.id})`;

  @Transition()
  async create(data: CreateUserDTO): Promise<UserAggregate> {
    return this.nextState(
      () =>
        new UserModel({
          uuid: uuidv4(),
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          token: UserAggregate.nextToken(),
          created: new Date(),
        }),
    );
  }

  @Transition()
  async update(data: UpdateUserDTO): Promise<UserAggregate> {
    return this.nextState(prev =>
      prev.update({
        email: data.email ?? prev.email,
        firstName: data.firstName ?? prev.firstName,
        lastName: data.lastName ?? prev.lastName,
        modified: new Date(),
      }),
    );
  }

  @Transition()
  async regenerateToken(): Promise<UserAggregate> {
    return this.nextState(prev =>
      prev.update({
        token: UserAggregate.nextToken(),
        modified: new Date(),
      }),
    );
  }

  @Transition()
  async delete(): Promise<UserAggregate> {
    return this.nextState(prev => prev);
  }

  private static nextToken(): string {
    return randomBytes(32).toString('hex');
  }
}
