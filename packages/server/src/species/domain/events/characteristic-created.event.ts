import { IEvent } from '@nestjs/cqrs';
import { CharacteristicDTO } from '../interfaces';

export class CharacteristicCreatedEvent implements IEvent {
  constructor(public readonly characteristic: CharacteristicDTO) {}
}
