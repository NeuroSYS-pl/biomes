import { KeyError } from './key-error';

export class EnumMapper<T, U> {
  protected forwardMap: ReadonlyMap<T, U>;
  protected backwardMap: ReadonlyMap<U, T>;

  constructor(mapping: [T, U][]) {
    this.forwardMap = new Map(mapping);
    this.backwardMap = new Map(mapping.map(([t, u]) => [u, t]));
  }

  forward(key: T): U {
    if (!this.forwardMap.has(key)) {
      throw new KeyError(key);
    }
    return this.forwardMap.get(key);
  }

  backward(key: U): T {
    if (!this.backwardMap.has(key)) {
      throw new KeyError(key);
    }
    return this.backwardMap.get(key);
  }
}
