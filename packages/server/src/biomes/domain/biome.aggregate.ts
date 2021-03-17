import { v4 as uuidv4 } from 'uuid';
import { Aggregate, Transition, Reference, UUID } from '../../core';
import { CreateBiomeDTO, UpdateBiomeDTO } from './interfaces';
import { BiomeModel } from './models';
import * as Events from './events';

export class BiomeAggregate extends Aggregate<BiomeModel> {
  ModelType = BiomeModel;
  id = (): UUID => this.model.uuid;
  toString = (): string => `Biome(${this.id()})`;

  @Transition()
  async create(data: CreateBiomeDTO): Promise<BiomeAggregate> {
    return this.nextState(
      () =>
        new BiomeModel({
          uuid: uuidv4(),
          name: data.name,
          description: data.description ?? null,
          link: data.link ?? null,
          species: [],
          authorship: {
            created: new Date(),
            createdBy: data.author,
          },
        }),
      next => new Events.BiomeCreatedEvent(next),
    );
  }

  @Transition()
  async update(data: UpdateBiomeDTO): Promise<BiomeAggregate> {
    return this.nextState(
      prev =>
        prev.update({
          name: data.name ?? prev.name,
          description: data.description ?? prev.description,
          link: data.link ?? prev.link,
          authorship: prev.authorship.update({
            modified: new Date(),
            modifiedBy: data.author,
          }),
        }),
      next => new Events.BiomeModifiedEvent(next),
    );
  }

  @Transition()
  async delete(user: Reference): Promise<BiomeAggregate> {
    return this.nextState(
      prev => prev,
      next => new Events.BiomeDeletedEvent(next, user),
    );
  }
}
