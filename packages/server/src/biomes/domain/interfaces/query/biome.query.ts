import { UUID } from '../../../../core';

export type BiomeSelectorByUUID = { uuid: UUID };
export type BiomeSelectorByName = { name: string };
export type BiomeFilterByName = { name: string };

export type BiomeSelector = BiomeSelectorByUUID | BiomeSelectorByName;
export type BiomeFilter = BiomeFilterByName;

export const biomeSelector = {
  isUuid(selector: BiomeSelector): selector is BiomeSelectorByUUID {
    const key: keyof BiomeSelectorByUUID = 'uuid';
    return Object.keys(selector).includes(key);
  },
  isName(selector: BiomeSelector): selector is BiomeSelectorByName {
    const key: keyof BiomeSelectorByName = 'name';
    return Object.keys(selector).includes(key);
  },
};

export const biomeFilter = {
  isName(selector: BiomeSelector): selector is BiomeSelectorByName {
    const key: keyof BiomeSelectorByName = 'name';
    return Object.keys(selector).includes(key);
  },
};
