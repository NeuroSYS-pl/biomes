import { IEvent } from '@nestjs/cqrs';
import { BiomeDTO } from '../interfaces';

export class BiomeModifiedEvent implements IEvent {
  constructor(public readonly biome: BiomeDTO) {}
}
