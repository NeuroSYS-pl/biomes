import { Reference } from '../../../core';
import { BiomeSelector } from '../../domain/interfaces/query';

export class DeleteBiomeCommand {
  constructor(
    public readonly selector: BiomeSelector,
    public readonly user: Reference,
  ) {}
}
