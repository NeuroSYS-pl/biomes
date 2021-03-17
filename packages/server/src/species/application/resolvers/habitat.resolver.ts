import * as gql from '@nestjs/graphql';
import { forwardRef, Inject } from '@nestjs/common';
import * as biomes from '../../../biomes';
import * as users from '../../../users';
import { Species, Habitat } from '../interfaces';
import { SpeciesResolver } from './species.resolver';

@gql.Resolver(() => Habitat)
export class HabitatResolver {
  constructor(
    @Inject(forwardRef(() => biomes.BiomeResolver))
    private readonly biomeResolver: biomes.BiomeResolver,
    private readonly speciesResolver: SpeciesResolver,
    private readonly userResolver: users.UserResolver,
  ) {}

  @gql.ResolveField(() => biomes.Biome)
  async biome(@gql.Parent() record: Habitat): Promise<biomes.Biome> {
    return record.biome.resolve(uuid => this.biomeResolver.biome(uuid));
  }

  @gql.ResolveField(() => Species)
  async species(@gql.Parent() record: Habitat): Promise<Species> {
    return record.species.resolve(
      uuid => this.speciesResolver.species(uuid)[0],
    );
  }

  @gql.ResolveField(() => users.User)
  async createdBy(@gql.Parent() record: Habitat): Promise<users.User> {
    return record.createdBy.resolve(uuid => this.userResolver.user(uuid));
  }
}
