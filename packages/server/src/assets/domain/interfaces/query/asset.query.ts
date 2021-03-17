import { UUID } from '../../../../core';

export type AssetSelectorByUuid = { uuid: UUID };
export type AssetSelector = AssetSelectorByUuid;

export const assetSelector = {
  isUuid(query: AssetSelector): query is AssetSelectorByUuid {
    const key: keyof AssetSelectorByUuid = 'uuid';
    return Object.keys(query).includes(key);
  },
};
