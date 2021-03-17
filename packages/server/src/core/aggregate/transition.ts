import { validateOrReject } from 'class-validator';
import { Model } from '../model';
import type { Aggregate } from './aggregate';

type TransitionFn<S> = (...args: unknown[]) => Promise<S>;

export function Transition() {
  return <S extends Aggregate<N>, N extends Model<unknown>>(
    target: S,
    _: string,
    descriptor: TypedPropertyDescriptor<TransitionFn<S>>,
  ): TypedPropertyDescriptor<TransitionFn<S>> => {
    const fn = descriptor.value;
    async function transition(this: S, ...args: unknown[]) {
      await fn.apply(this, args);
      await validateOrReject(this.model);
      return this;
    }

    return {
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      enumerable: descriptor.enumerable,
      value: transition,
    };
  };
}
