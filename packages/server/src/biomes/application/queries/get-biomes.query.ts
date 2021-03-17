import { BiomeSelector, BiomeFilter } from '../../domain/interfaces/query';

type BiomeQueryType = 'all' | 'many' | 'single';

const isFilter = (
  type: BiomeQueryType,
  selector: BiomeFilter | BiomeSelector,
): selector is BiomeFilter => type === 'many';

const isSelector = (
  type: BiomeQueryType,
  selector: BiomeFilter | BiomeSelector,
): selector is BiomeSelector => type === 'single';

export class GetBiomesQuery {
  public readonly filter?: BiomeFilter;
  public readonly selector?: BiomeSelector;

  constructor(type: 'all');
  constructor(type: 'many', selector: BiomeFilter);
  constructor(type: 'single', selector: BiomeSelector);
  constructor(
    public readonly type: BiomeQueryType,
    selector?: BiomeFilter | BiomeSelector,
  ) {
    if (isFilter(type, selector)) {
      this.filter = selector;
    } else if (isSelector(type, selector)) {
      this.selector = selector;
    }
  }
}
