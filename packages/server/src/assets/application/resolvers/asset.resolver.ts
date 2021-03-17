import * as gql from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { Reference } from '../../../core';
import { GqlTokenAuthGuard } from '../../../common/auth/gql-auth.guard';
import { CreateAssetInput } from '../interfaces/create-asset.input';
import { Asset } from '../interfaces/asset.output';
import { UserDTO, CurrentUser } from '../../../users';
import { AssetDTO } from '../../domain';
import * as Queries from '../queries';
import * as Commands from '../commands';

@gql.Resolver(() => Asset)
export class AssetResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @gql.ResolveField(() => Number, { nullable: true })
  async size(@gql.Parent() asset: Asset): Promise<number | null> {
    const size: number = await this.queryBus.execute(
      new Queries.GetAssetSizeQuery({ uuid: asset.uuid }),
    );
    return size > 0 ? size : null;
  }

  @gql.Query(() => Asset)
  async asset(
    @gql.Args('uuid', { type: () => gql.ID }) uuid: string,
  ): Promise<Asset> {
    const asset: AssetDTO = await this.queryBus.execute(
      new Queries.GetAssetQuery({ uuid }),
    );
    return plainToClass(Asset, asset);
  }

  @gql.Mutation(() => Asset)
  @UseGuards(GqlTokenAuthGuard)
  async createAsset(
    @gql.Args('data') data: CreateAssetInput,
    @CurrentUser() user: UserDTO,
  ): Promise<Asset> {
    const asset: AssetDTO = await this.commandBus.execute(
      new Commands.CreateAssetCommand(data, Reference.create(user.uuid)),
    );
    return plainToClass(Asset, asset);
  }
}
