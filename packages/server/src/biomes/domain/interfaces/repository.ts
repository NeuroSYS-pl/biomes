import type { BiomeAggregate } from '../biome.aggregate';
import type { BiomeDTO } from './dto';
import { BiomeFilter, BiomeSelector } from './query';

export interface IBiomeRepository {
  getOne(query: BiomeSelector): Promise<BiomeDTO>;
  getMany(query: BiomeFilter): Promise<BiomeDTO[]>;
  getAll(): Promise<BiomeDTO[]>;

  hasBiome(query: BiomeSelector): Promise<boolean>;

  create(aggregate: BiomeAggregate): Promise<BiomeDTO>;
  update(aggregate: BiomeAggregate): Promise<BiomeDTO>;
  delete(aggregate: BiomeAggregate): Promise<void>;
}
