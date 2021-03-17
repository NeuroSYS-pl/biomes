import { UpdateSpeciesInput } from '../interfaces';
import { Reference } from '../../../core';

export class UpdateSpeciesCommand {
  constructor(
    public readonly data: UpdateSpeciesInput,
    public readonly author: Reference,
  ) {}
}
