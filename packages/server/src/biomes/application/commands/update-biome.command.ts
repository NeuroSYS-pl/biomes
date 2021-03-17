import { Reference } from '../../../core';
import { UpdateBiomeInput } from '../interfaces';

export class UpdateBiomeCommand {
  constructor(
    public readonly data: UpdateBiomeInput,
    public readonly author: Reference,
  ) {}
}
