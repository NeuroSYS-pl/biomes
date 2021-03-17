import { Injectable } from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';
import { UserAggregate, UserDTO } from '../domain';

@Injectable()
export class UserMapping {
  mapEntityToDTO(entity: Users): UserDTO {
    return {
      uuid: entity.uuid,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      token: entity.token,
      created: entity.created,
      modified: entity.modified,
    };
  }

  mapAggregateToEntity(
    aggregate: UserAggregate,
  ): Prisma.UsersUpdateInput & Prisma.UsersCreateInput {
    const { model } = aggregate;
    return {
      uuid: model.uuid,
      email: model.email,
      firstName: model.firstName,
      lastName: model.lastName,
      token: model.token,
      created: model.created,
      modified: model.modified,
    };
  }
}
