import { IEvent } from '@nestjs/cqrs';
import { BiomeDTO } from '../interfaces';

export class BiomeCreatedEvent implements IEvent {
  constructor(public readonly biome: BiomeDTO) {}
}
