import { UUID } from '../../../core';
import { AssetAggregate, FragmentAggregate } from '../aggregates';
import { AssetDTO, FragmentDTO } from './dto';
import { AssetSelector, FragmentSelector } from './query';

export interface IAssetRepository {
  getOne(query: AssetSelector): Promise<AssetDTO>;
  getOneFragment(query: FragmentSelector): Promise<FragmentDTO>;
  getAssetFragments(assetUUID: UUID): Promise<FragmentDTO[]>;
  getAssetSize(query: AssetSelector): Promise<number>;

  getInvalid(): Promise<AssetDTO[]>;
  getNotValid(): Promise<AssetDTO[]>;
  getOrphanedFragments(): Promise<FragmentDTO[]>;

  createAsset(aggregate: AssetAggregate): Promise<AssetDTO>;
  updateAsset(aggregate: AssetAggregate): Promise<AssetDTO>;
  deleteAsset(aggregate: AssetAggregate): Promise<void>;
  deleteAssetFragments(aggregate: AssetAggregate): Promise<void>;

  createFragment(aggregate: FragmentAggregate): Promise<FragmentDTO>;
  deleteFragment(aggregate: FragmentAggregate): Promise<void>;
}
