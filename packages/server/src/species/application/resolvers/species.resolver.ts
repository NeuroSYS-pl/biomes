import * as gql from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { Reference, UUID } from '../../../core';
import { GqlTokenAuthGuard } from '../../../common/auth/gql-auth.guard';
import { UserDTO, CurrentUser } from '../../../users';
import * as assets from '../../../assets';
import { Species, CreateSpeciesInput, UpdateSpeciesInput } from '../interfaces';
import * as Queries from '../queries';
import * as Commands from '../commands';
import { SpeciesDTO } from '../../domain';

@gql.Resolver(() => Species)
export class SpeciesResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly assetResolver: assets.AssetResolver,
  ) {}

  async getSpeciesByUUID(uuid: UUID): Promise<Species> {
    const results = await this.species(uuid, null, null, null);
    return results?.[0] ?? null;
  }

  async getSpeciesByTag(tag: string): Promise<Species[]>;
  async getSpeciesByTag(tag: string, generation?: number): Promise<Species>;
  async getSpeciesByTag(
    tag: string,
    generation?: number,
  ): Promise<Species | Species[]> {
    const results = await this.species(null, tag, generation, null);
    return generation != null ? results?.[0] ?? null : results;
  }

  async getSpeciesByBiome(biome: UUID): Promise<Species[]> {
    return this.species(null, null, null, biome);
  }

  @gql.ResolveField(() => assets.Asset)
  async asset(@gql.Parent() species: Species): Promise<assets.Asset> {
    return species.asset.resolve(uuid => this.assetResolver.asset(uuid));
  }

  @gql.Query(() => [Species])
  async species(
    @gql.Args('uuid', { type: () => gql.ID, nullable: true }) uuid?: UUID,
    @gql.Args('tag', { type: () => String, nullable: true }) tag?: string,
    @gql.Args('generation', { type: () => Number, nullable: true })
    generation?: number,
    @gql.Args('biome', { type: () => String, nullable: true }) biome?: string,
  ): Promise<Species[]> {
    let query: Queries.GetSpeciesQuery;
    if (uuid != null) {
      query = new Queries.GetSpeciesQuery('single', { uuid });
    } else if (tag != null && generation != null) {
      query = new Queries.GetSpeciesQuery('single', { tag, generation });
    } else if (tag != null) {
      query = new Queries.GetSpeciesQuery('many', { tag });
    } else if (biome != null) {
      query = new Queries.GetSpeciesQuery('many', { biome });
    } else {
      query = new Queries.GetSpeciesQuery('all');
    }

    const results: Species | Species[] = await this.queryBus.execute(query);
    const species = Array.isArray(results) ? results : [results];
    return species.map(s => plainToClass(Species, s));
  }

  @gql.Mutation(() => Species)
  @UseGuards(GqlTokenAuthGuard)
  async createSpecies(
    @gql.Args('data') data: CreateSpeciesInput,
    @gql.Args('asset') assetData: assets.CreateAssetInput,
    @CurrentUser() user: UserDTO,
  ): Promise<Species> {
    const asset: assets.AssetDTO = await this.commandBus.execute(
      new assets.Commands.CreateAssetCommand(
        assetData,
        Reference.create(user.uuid),
      ),
    );

    const species: SpeciesDTO = await this.commandBus.execute(
      new Commands.CreateSpeciesCommand(
        data,
        Reference.create(asset.uuid),
        Reference.create(user.uuid),
      ),
    );
    return plainToClass(Species, species);
  }

  @gql.Mutation(() => Species)
  @UseGuards(GqlTokenAuthGuard)
  async updateSpecies(
    @gql.Args('data') data: UpdateSpeciesInput,
    @CurrentUser() user: UserDTO,
  ): Promise<Species> {
    const species: SpeciesDTO = await this.commandBus.execute(
      new Commands.UpdateSpeciesCommand(data, Reference.create(user.uuid)),
    );
    return plainToClass(Species, species);
  }
}
