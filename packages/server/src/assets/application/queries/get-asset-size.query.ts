import { AssetSelector } from '../../domain/interfaces/query';

export class GetAssetSizeQuery {
  constructor(public readonly query: AssetSelector) {}
}
