import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { IUserRepository, UserAggregate, UserDTO } from '../domain';
import { userSelector, UserSelector } from '../domain/interfaces/query';
import { UserMapping } from './user.mapping';
import { UserQueryBuilder } from './user.query-builder';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapping: UserMapping,
    private readonly queryBuilder: UserQueryBuilder,
  ) {}

  async getOne(query: UserSelector): Promise<UserDTO> {
    const user = userSelector.isToken(query)
      ? await this.prisma.client.users.findFirst({
          where: this.queryBuilder.first(query),
        })
      : await this.prisma.client.users.findUnique({
          where: this.queryBuilder.unique(query),
        });

    if (!user) {
      throw new NotFoundException();
    } else {
      return this.mapping.mapEntityToDTO(user);
    }
  }

  async getAll(): Promise<UserDTO[]> {
    const users = await this.prisma.client.users.findMany();
    return users.map(this.mapping.mapEntityToDTO);
  }

  async create(aggregate: UserAggregate): Promise<UserDTO> {
    const data = this.mapping.mapAggregateToEntity(aggregate);
    const response = await this.prisma.client.users.create({ data });
    return this.mapping.mapEntityToDTO(response);
  }

  async update(aggregate: UserAggregate): Promise<UserDTO> {
    const data = this.mapping.mapAggregateToEntity(aggregate);
    const response = await this.prisma.client.users.update({
      data,
      where: { uuid: aggregate.id() },
    });
    return this.mapping.mapEntityToDTO(response);
  }

  async delete(aggregate: UserAggregate): Promise<void> {
    await this.prisma.client.users.delete({
      where: { uuid: aggregate.id() },
    });
  }
}
