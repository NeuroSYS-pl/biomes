import { MigrationAggregate } from '../migration.aggregate';
import { MigrationDTO } from './dto';
import { MigrationFilter, MigrationSelector } from './query';

export interface IMigrationRepository {
  getOne(query: MigrationSelector): Promise<MigrationDTO>;
  getMany(query: MigrationFilter): Promise<MigrationDTO[]>;
  getAll(): Promise<MigrationDTO[]>;

  apply(aggregate: MigrationAggregate): Promise<void>;
  rollback(aggregate: MigrationAggregate): Promise<void>;
}
