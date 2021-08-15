import { Injectable } from '@nestjs/common';
import { Prisma } from '@biomes/prisma';
import { Query } from '../domain';

@Injectable()
export class BiomeQueryBuilder {
  unique(selector: Query.BiomeSelector): Prisma.BiomesWhereUniqueInput {
    if (Query.biomeSelector.isUuid(selector)) {
      return { uuid: selector.uuid };
    }

    throw new Error(`Invalid query: ${selector}`);
  }

  first(selector: Query.BiomeSelector): Prisma.BiomesWhereInput {
    if (Query.biomeSelector.isUuid(selector)) {
      return { uuid: selector.uuid };
    } else if (Query.biomeSelector.isName(selector)) {
      return {
        name: {
          equals: selector.name,
          mode: 'insensitive',
        },
      };
    }

    throw new Error(`Invalid query: ${selector}`);
  }

  many(selector: Query.BiomeFilter): Prisma.BiomesWhereInput {
    if (Query.biomeFilter.isName(selector)) {
      return {
        name: {
          equals: selector.name,
          mode: 'insensitive',
        },
      };
    }

    throw new Error(`Invalid query: ${selector}`);
  }
}
