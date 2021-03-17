import { SpeciesFilter, SpeciesSelector } from '../../domain/interfaces/query';

export type SpeciesQueryType = 'all' | 'many' | 'single';

const isFilter = (
  type: SpeciesQueryType,
  selector: SpeciesFilter | SpeciesSelector,
): selector is SpeciesFilter => type === 'many';

const isSelector = (
  type: SpeciesQueryType,
  selector: SpeciesFilter | SpeciesSelector,
): selector is SpeciesSelector => type === 'single';

export class GetSpeciesQuery {
  public readonly filter?: SpeciesFilter;
  public readonly selector?: SpeciesSelector;

  constructor(type: 'all');
  constructor(type: 'many', selector: SpeciesFilter);
  constructor(type: 'single', selector: SpeciesSelector);
  constructor(
    public readonly type: SpeciesQueryType,
    selector?: SpeciesFilter | SpeciesSelector,
  ) {
    if (isFilter(type, selector)) {
      this.filter = selector;
    } else if (isSelector(type, selector)) {
      this.selector = selector;
    }
  }
}
