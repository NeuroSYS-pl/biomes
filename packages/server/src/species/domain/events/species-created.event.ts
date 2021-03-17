import { IEvent } from '@nestjs/cqrs';
import { SpeciesDTO } from '../interfaces';

export class SpeciesCreatedEvent implements IEvent {
  constructor(public readonly species: SpeciesDTO) {}
}
