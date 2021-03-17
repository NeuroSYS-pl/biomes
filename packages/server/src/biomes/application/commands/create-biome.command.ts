import { Reference } from '../../../core';
import { CreateBiomeInput } from '../interfaces';

export class CreateBiomeCommand {
  constructor(
    public readonly data: CreateBiomeInput,
    public readonly author: Reference,
  ) {}
}
