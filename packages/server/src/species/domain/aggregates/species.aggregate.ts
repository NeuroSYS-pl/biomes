import { v4 as uuidv4 } from 'uuid';
import { Aggregate, Reference, Transition, UUID } from '../../../core';
import { CreateSpeciesDTO, UpdateSpeciesDTO } from '../interfaces';
import { SpeciesModel, HabitatModel } from '../models';
import * as Events from '../events';
import * as Characteristics from './characteristic.helper';

export class SpeciesAggregate extends Aggregate<SpeciesModel> {
  ModelType = SpeciesModel;
  id = (): UUID => this.model.uuid;
  toString = (): string => `Species(${this.id()})`;

  @Transition()
  async create(data: CreateSpeciesDTO): Promise<SpeciesAggregate> {
    const biomes = data.biomes ?? [];
    const chars = data.characteristics ?? [];
    return this.nextState(
      () => {
        const speciesUuid = uuidv4();
        return new SpeciesModel({
          uuid: speciesUuid,
          tag: data.tag,
          generation: data.generation,
          description: data.description ?? null,
          link: data.link ?? null,
          asset: data.asset,
          characteristics: chars.map(c =>
            Characteristics.create(c, data.author.uuid),
          ),
          habitats: biomes.map(biome => ({
            uuid: uuidv4(),
            species: Reference.create(speciesUuid),
            biome: Reference.create(biome),
            created: new Date(),
            createdBy: data.author,
          })),
          authorship: {
            created: new Date(),
            createdBy: data.author,
          },
        });
      },
      next => new Events.SpeciesCreatedEvent(next),
    );
  }

  @Transition()
  async update(data: UpdateSpeciesDTO): Promise<SpeciesAggregate> {
    return this.nextState(
      prev =>
        prev.update({
          tag: data.tag ?? prev.tag,
          generation: data.generation ?? prev.generation,
          description: data.description ?? prev.description,
          link: data.link ?? prev.link,
          characteristics: Characteristics.updateAll(
            prev.characteristics,
            data.characteristics,
            data.author.uuid,
          ),
          habitats: this.updateHabitats(
            prev.uuid,
            prev.habitats,
            data.biomes,
            data.author.uuid,
          ),
          authorship: prev.authorship.update({
            modified: new Date(),
            modifiedBy: Reference.create(data.author.uuid),
          }),
        }),
      next => new Events.SpeciesModifiedEvent(next),
    );
  }

  @Transition()
  async delete(): Promise<SpeciesAggregate> {
    return this.nextState(
      prev => prev,
      next => new Events.SpeciesDeletedEvent(next),
    );
  }

  private updateHabitats(
    parent: UUID,
    prev: ReadonlyArray<HabitatModel>,
    next: ReadonlyArray<UUID> | null | undefined,
    author: UUID,
  ): ReadonlyArray<HabitatModel> {
    if (!next) {
      return prev;
    }

    const currentBiomes = prev.filter(r => next.includes(r.biome.uuid));
    const currentUuids = currentBiomes.map(r => r.biome.uuid);
    const newBiomes = next
      .filter(uuid => !currentUuids.includes(uuid))
      .map(
        biomeUuid =>
          new HabitatModel({
            uuid: uuidv4(),
            species: Reference.create(parent),
            biome: Reference.create(biomeUuid),
            created: new Date(),
            createdBy: Reference.create(author),
          }),
      );

    return [...currentBiomes, ...newBiomes];
  }
}
