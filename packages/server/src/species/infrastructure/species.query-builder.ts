import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Query } from '../domain';

@Injectable()
export class SpeciesQueryBuilder {
  unique(selector: Query.SpeciesSelector): Prisma.SpeciesWhereUniqueInput {
    if (Query.speciesSelector.isUUID(selector)) {
      return { uuid: selector.uuid };
    } else if (Query.speciesSelector.isTagGeneration(selector)) {
      return {
        tagGenerationKey: {
          tag: selector.tag,
          generation: selector.generation,
        },
      };
    } else if (Query.speciesSelector.isAsset(selector)) {
      return { assetByUuid: selector.asset };
    }

    throw new Error(`Invalid query: ${selector}`);
  }

  filter(query: Query.SpeciesFilter): Prisma.SpeciesWhereInput {
    if (Query.speciesFilter.isTag(query)) {
      return { tag: query.tag };
    } else if (Query.speciesFilter.isBiome(query)) {
      return {
        habitats: {
          some: {
            biomesByUuid: query.biome,
          },
        },
      };
    }

    throw new Error(`Invalid query: ${query}`);
  }
}
