import { Injectable } from '@nestjs/common';
import { MigrationDTO, Query } from '../domain';

@Injectable()
export class MigrationQueryBuilder {
  many(query: Query.MigrationFilter): (r: MigrationDTO) => boolean {
    if (Query.migrationFilter.isStatus(query)) {
      return r => r.status === query.status;
    } else if (Query.migrationFilter.isSuccesors(query)) {
      return r => {
        const pkCondition = query.includeOrigin
          ? r.pk >= query.successorsOf
          : r.pk > query.successorsOf;
        const statusCondition =
          query.onlyWithStatus != null
            ? r.status === query.onlyWithStatus
            : true;
        return pkCondition && statusCondition;
      };
    } else if (Query.migrationFilter.isPredecessors(query)) {
      return r => {
        const pkCondition = query.includeOrigin
          ? r.pk <= query.predecessorsOf
          : r.pk < query.predecessorsOf;
        const statusCondition =
          query.onlyWithStatus != null
            ? r.status === query.onlyWithStatus
            : true;
        return pkCondition && statusCondition;
      };
    }

    throw new Error(`Invalid selector: ${query}`);
  }
}
