import {
  MigrationSelector,
  MigrationFilter,
} from '../../domain/interfaces/query';

type MigrationQueryType = 'all' | 'many' | 'single';

const isFilter = (
  type: MigrationQueryType,
  selector: MigrationSelector | MigrationFilter,
): selector is MigrationFilter => type === 'many';

const isSelector = (
  type: MigrationQueryType,
  selector: MigrationFilter | MigrationSelector,
): selector is MigrationSelector => type === 'single';

export class GetMigrationsQuery {
  public readonly filter?: MigrationFilter;
  public readonly selector?: MigrationSelector;

  constructor(type: 'all');
  constructor(type: 'many', selector: MigrationFilter);
  constructor(type: 'single', selector: MigrationSelector);
  constructor(
    public readonly type: MigrationQueryType,
    selector?: MigrationFilter | MigrationSelector,
  ) {
    if (isFilter(type, selector)) {
      this.filter = selector;
    } else if (isSelector(type, selector)) {
      this.selector = selector;
    }
  }
}
