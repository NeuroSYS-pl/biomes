import { SpeciesAggregate } from '../aggregates';
import { SpeciesDTO } from './dto';
import { SpeciesFilter, SpeciesSelector } from './query';

export interface ISpeciesRepository {
  getOne(query: SpeciesSelector): Promise<SpeciesDTO>;
  getMany(query: SpeciesFilter): Promise<SpeciesDTO[]>;
  getAll(): Promise<SpeciesDTO[]>;

  getInvalid(): Promise<SpeciesDTO[]>;
  getNotValid(): Promise<SpeciesDTO[]>;

  create(aggregate: SpeciesAggregate): Promise<SpeciesDTO>;
  update(aggregate: SpeciesAggregate): Promise<SpeciesDTO>;
  delete(aggregate: SpeciesAggregate): Promise<void>;
  deleteMany(aggregates: ReadonlyArray<SpeciesAggregate>): Promise<void>;
}
