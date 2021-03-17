import { UUID } from '../../../../core';

export type SpeciesSelectorByUUID = { uuid: UUID };
export type SpeciesSelectorByTag = { tag: string; generation: number };
export type SpeciesSelectorByAsset = { asset: UUID };
export type SpeciesSelector =
  | SpeciesSelectorByUUID
  | SpeciesSelectorByTag
  | SpeciesSelectorByAsset;

export type SpeciesFilterByTag = { tag: string };
export type SpeciesFilterByBiome = { biome: UUID };
export type SpeciesFilter = SpeciesFilterByTag | SpeciesFilterByBiome;

export const speciesSelector = {
  isUUID(selector: SpeciesSelector): selector is SpeciesSelectorByUUID {
    const key: keyof SpeciesSelectorByUUID = 'uuid';
    return Object.keys(selector).includes(key);
  },
  isAsset(selector: SpeciesSelector): selector is SpeciesSelectorByAsset {
    const key: keyof SpeciesSelectorByAsset = 'asset';
    return Object.keys(selector).includes(key);
  },
  isTagGeneration(selector: SpeciesSelector): selector is SpeciesSelectorByTag {
    const keys: (keyof SpeciesSelectorByTag)[] = ['tag', 'generation'];
    return keys.every(k => Object.keys(selector).includes(k));
  },
};

export const speciesFilter = {
  isTag(selector: SpeciesFilter): selector is SpeciesFilterByTag {
    const key: keyof SpeciesFilterByTag = 'tag';
    return Object.keys(selector).includes(key);
  },
  isBiome(selector: SpeciesFilter): selector is SpeciesFilterByBiome {
    const key: keyof SpeciesFilterByBiome = 'biome';
    return Object.keys(selector).includes(key);
  },
};
