import { IEvent } from '@nestjs/cqrs';
import { AssetDTO } from '../interfaces/dto';

export class AssetCreatedEvent implements IEvent {
  constructor(public readonly asset: AssetDTO) {}
}
