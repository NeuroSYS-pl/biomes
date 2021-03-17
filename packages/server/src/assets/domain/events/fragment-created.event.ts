import { IEvent } from '@nestjs/cqrs';
import { FragmentDTO } from '../interfaces/dto';

export class FragmentCreatedEvent implements IEvent {
  constructor(public readonly fragment: FragmentDTO) {}
}
