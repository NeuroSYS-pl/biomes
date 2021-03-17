import { Reference } from '../../../core';
import { CreateAssetInput } from '../interfaces/create-asset.input';

export class CreateAssetCommand {
  constructor(
    public readonly data: CreateAssetInput,
    public readonly author: Reference,
  ) {}
}
