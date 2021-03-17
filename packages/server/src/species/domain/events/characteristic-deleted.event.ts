import { IEvent } from '@nestjs/cqrs';
import { CharacteristicDTO } from '../interfaces';

export class CharacteristicDeletedEvent implements IEvent {
  constructor(public readonly characteristic: CharacteristicDTO) {}
}
