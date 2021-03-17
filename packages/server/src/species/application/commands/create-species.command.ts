import { Reference } from '../../../core';
import { CreateSpeciesInput } from '../interfaces';

export class CreateSpeciesCommand {
  constructor(
    public readonly data: CreateSpeciesInput,
    public readonly asset: Reference,
    public readonly author: Reference,
  ) {}
}
