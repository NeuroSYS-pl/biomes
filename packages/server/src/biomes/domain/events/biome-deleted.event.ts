import { IEvent } from '@nestjs/cqrs';
import { Reference } from '../../../core';
import { BiomeDTO } from '../interfaces';

export class BiomeDeletedEvent implements IEvent {
  public readonly uuid: string;

  constructor(
    public readonly biome: BiomeDTO,
    public readonly user: Reference,
  ) {
    this.uuid = biome.uuid;
  }
}
