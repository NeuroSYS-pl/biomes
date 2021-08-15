import { Injectable } from '@nestjs/common';
import { Prisma } from '@biomes/prisma';
import { Query } from '../../domain';

@Injectable()
export class AssetQueryBuilder {
  unique(query: Query.AssetSelector): Prisma.AssetsWhereUniqueInput {
    if (Query.assetSelector.isUuid(query)) {
      return { uuid: query.uuid };
    }

    throw new Error(`Invalid query: ${query}`);
  }

  filter(query: Query.FragmentFilter): Prisma.AssetsWhereInput {
    throw new Error(`Invalid query: ${query}`);
  }
}
