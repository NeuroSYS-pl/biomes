import { UUID } from '../../../../core';

export type FragmentSelectorByUuid = { uuid: UUID };
export type FragmentSelectorByAsset = { asset: UUID; part: number };
export type FragmentSelector = FragmentSelectorByUuid | FragmentSelectorByAsset;

export type FragmentFilterByAsset = { asset: UUID };
export type FragmentFilter = FragmentFilterByAsset;

export const fragmentSelector = {
  isUuid(query: FragmentSelector): query is FragmentSelectorByUuid {
    const key: keyof FragmentSelectorByUuid = 'uuid';
    return Object.keys(query).includes(key);
  },
  isAsset(query: FragmentSelector): query is FragmentSelectorByAsset {
    const keys: (keyof FragmentSelectorByAsset)[] = ['asset', 'part'];
    return keys.every(key => Object.keys(query).includes(key));
  },
};

export const fragmentFilter = {
  isAsset(query: FragmentFilter): query is FragmentFilterByAsset {
    const key: keyof FragmentFilterByAsset = 'asset';
    return Object.keys(query).includes(key);
  },
};
