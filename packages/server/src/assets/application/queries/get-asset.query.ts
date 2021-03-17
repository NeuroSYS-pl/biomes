import { AssetSelector } from '../../domain/interfaces/query';

export class GetAssetQuery {
  constructor(public readonly query: AssetSelector) {}
}
