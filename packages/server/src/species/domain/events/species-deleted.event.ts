import { IEvent } from '@nestjs/cqrs';
import { SpeciesDTO } from '../interfaces';

export class SpeciesDeletedEvent implements IEvent {
  public readonly uuid: string;

  constructor(public readonly species: SpeciesDTO) {
    this.uuid = species.uuid;
  }
}
