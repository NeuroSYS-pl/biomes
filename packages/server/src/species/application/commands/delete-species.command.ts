import { SpeciesSelector } from '../../domain/interfaces/query';

export class DeleteSpeciesCommand {
  constructor(public readonly selector: SpeciesSelector) {}
}
