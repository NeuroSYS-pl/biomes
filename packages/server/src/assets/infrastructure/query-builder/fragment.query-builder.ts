import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Query } from '../../domain';

@Injectable()
export class FragmentQueryBuilder {
  unique(query: Query.FragmentSelector): Prisma.FragmentsWhereUniqueInput {
    if (Query.fragmentSelector.isUuid(query)) {
      return { uuid: query.uuid };
    } else if (Query.fragmentSelector.isAsset(query)) {
      return {
        assetPartKey: {
          assetsByUuid: query.asset,
          part: query.part,
        },
      };
    }

    throw new Error(`Invalid query: ${query}`);
  }

  filter(query: Query.FragmentFilter): Prisma.FragmentsWhereInput {
    if (Query.fragmentFilter.isAsset(query)) {
      return {
        assets: { uuid: query.asset },
      };
    }

    throw new Error(`Invalid query: ${query}`);
  }
}
