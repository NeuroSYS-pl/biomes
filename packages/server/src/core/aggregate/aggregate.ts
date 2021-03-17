import { AggregateRoot, IEvent } from '@nestjs/cqrs';
import type { Model } from '../model';
import { UUID } from '../types';
import { AggregateInvalidState } from './exceptions/invalid-use';

export abstract class Aggregate<
  M extends Model<DTO>,
  E extends IEvent = IEvent,
  DTO = M extends Model<infer D> ? D : unknown
> extends AggregateRoot<E> {
  private state: M;

  abstract id(): UUID;
  abstract toString(): string;
  protected abstract ModelType: { new (dto: DTO): M };

  from(dto: DTO): this {
    if (this.state != null) {
      throw new AggregateInvalidState();
    } else {
      this.state = new this.ModelType(dto);
      return this;
    }
  }

  get model(): Readonly<M> {
    if (this.state == null) {
      throw new AggregateInvalidState();
    } else {
      return this.state;
    }
  }

  protected nextState(
    fn: (prev: M) => M,
    eventFactory?: (next: M) => E | E[],
  ): this {
    this.state = fn(this.state);

    if (eventFactory) {
      const eventOrEvents = eventFactory(this.state);
      const eventsArray = Array.isArray(eventOrEvents)
        ? eventOrEvents
        : [eventOrEvents];
      eventsArray.forEach(ev => this.apply(ev));
    }

    return this;
  }
}
