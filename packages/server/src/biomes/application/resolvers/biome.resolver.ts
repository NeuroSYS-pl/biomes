import * as gql from '@nestjs/graphql';
import * as nestjs from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { Reference } from '../../../core/reference';
import { GqlTokenAuthGuard } from '../../../common/auth/gql-auth.guard';
import { ValidationErrorInterceptor } from '../../../common/validation-error.interceptor';
import { UserDTO, CurrentUser } from '../../../users';
import { Species, SpeciesResolver } from '../../../species';
import * as Queries from '../queries';
import * as Commands from '../commands';
import { Biome, CreateBiomeInput, UpdateBiomeInput } from '../interfaces';
import { BiomeDTO } from '../../domain';

@gql.Resolver(() => Biome)
export class BiomeResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly speciesResolver: SpeciesResolver,
  ) {}

  @gql.ResolveField(() => [Species])
  async species(@gql.Parent() biome: Biome): Promise<Species[]> {
    return this.speciesResolver.getSpeciesByBiome(biome.uuid);
  }

  @gql.Query(() => Biome)
  async biome(
    @gql.Args('uuid', { type: () => gql.ID, nullable: true }) uuid?: string,
    @gql.Args('name', { type: () => String, nullable: true }) name?: string,
  ): Promise<Biome> {
    if (uuid == null && name == null) {
      throw new nestjs.NotFoundException();
    }

    const biome: BiomeDTO = await this.queryBus.execute(
      new Queries.GetBiomesQuery('single', { uuid, name }),
    );

    return plainToClass(Biome, biome);
  }

  @gql.Query(() => [Biome])
  async biomes(): Promise<Biome[]> {
    const biomes: BiomeDTO[] = await this.queryBus.execute(
      new Queries.GetBiomesQuery('all'),
    );
    return biomes.map(biome => plainToClass(Biome, biome));
  }

  @gql.Mutation(() => Biome)
  @nestjs.UseGuards(GqlTokenAuthGuard)
  @nestjs.UseInterceptors(ValidationErrorInterceptor)
  async createBiome(
    @gql.Args('data') data: CreateBiomeInput,
    @CurrentUser() user: UserDTO,
  ): Promise<Biome> {
    const biome: BiomeDTO = await this.commandBus.execute(
      new Commands.CreateBiomeCommand(data, new Reference(user.uuid)),
    );
    return plainToClass(Biome, biome);
  }

  @gql.Mutation(() => Biome)
  @nestjs.UseGuards(GqlTokenAuthGuard)
  @nestjs.UseInterceptors(ValidationErrorInterceptor)
  async updateBiome(
    @gql.Args('data') data: UpdateBiomeInput,
    @CurrentUser() user: UserDTO,
  ): Promise<Biome> {
    const biome: BiomeDTO = await this.commandBus.execute(
      new Commands.UpdateBiomeCommand(data, new Reference(user.uuid)),
    );
    return plainToClass(Biome, biome);
  }

  @gql.Mutation(() => Boolean)
  @nestjs.UseGuards(GqlTokenAuthGuard)
  @nestjs.UseInterceptors(ValidationErrorInterceptor)
  async deleteBiome(
    @gql.Args('uuid', { type: () => gql.ID }) uuid: string,
    @CurrentUser() user: UserDTO,
  ): Promise<boolean> {
    const userRef = new Reference(user.uuid);
    await this.commandBus.execute(
      new Commands.DeleteBiomeCommand({ uuid }, userRef),
    );
    return true;
  }
}
