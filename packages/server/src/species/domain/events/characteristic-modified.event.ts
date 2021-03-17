import { IEvent } from '@nestjs/cqrs';
import { CharacteristicDTO } from '../interfaces';

export class CharacteristicModifiedEvent implements IEvent {
  constructor(public readonly characteristic: CharacteristicDTO) {}
}
