import {
  FragmentSelector,
  FragmentFilter,
} from '../../domain/interfaces/query/fragment.query';

type FragmentQueryType = 'many' | 'single';

const isFilter = (
  type: FragmentQueryType,
  query: FragmentFilter | FragmentSelector,
): query is FragmentFilter => type === 'many';

const isSelector = (
  type: FragmentQueryType,
  query: FragmentFilter | FragmentSelector,
): query is FragmentSelector => type === 'single';

export class GetFragmentQuery {
  public readonly filter?: FragmentFilter;
  public readonly selector?: FragmentSelector;

  constructor(type: 'many', selector: FragmentFilter);
  constructor(type: 'single', selector: FragmentSelector);
  constructor(
    public readonly type: FragmentQueryType,
    query?: FragmentFilter | FragmentSelector,
  ) {
    if (isFilter(type, query)) {
      this.filter = query;
    } else if (isSelector(type, query)) {
      this.selector = query;
    }
  }
}
