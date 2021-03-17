import { IEvent } from '@nestjs/cqrs';
import { AssetDTO } from '../interfaces/dto';

export class AssetFinalizedEvent implements IEvent {
  constructor(public readonly asset: AssetDTO) {}
}
