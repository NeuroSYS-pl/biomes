import { IEvent } from '@nestjs/cqrs';
import { SpeciesDTO } from '../interfaces';

export class SpeciesModifiedEvent implements IEvent {
  constructor(public readonly species: SpeciesDTO) {}
}
