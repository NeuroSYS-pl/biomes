import { v4 as uuidv4 } from 'uuid';
import { Aggregate, Reference, Transition, UUID } from '../../../core';
import { CreateFragmentDTO } from '../interfaces/transitions';
import * as Events from '../events';
import { FragmentModel } from '../models';

export class FragmentAggregate extends Aggregate<FragmentModel> {
  ModelType = FragmentModel;
  id = (): UUID => this.model.uuid;
  toString = (): string => `Fragment(${this.id()})`;

  @Transition()
  async create(
    data: CreateFragmentDTO,
    file: Express.Multer.File,
  ): Promise<FragmentAggregate> {
    return this.nextState(
      () =>
        new FragmentModel({
          uuid: uuidv4(),
          asset: Reference.create(data.asset),
          part: data.part,
          binary: file.path,
        }),
      next => new Events.FragmentCreatedEvent(next),
    );
  }

  @Transition()
  async delete(): Promise<FragmentAggregate> {
    return this;
  }
}
