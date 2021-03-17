import { UUID } from '../../../../core';

export type HabitatFilterByBiome = { biome: UUID };
export type HabitatFilter = HabitatFilterByBiome;

export const habitatFilter = {
  isBiome(selector: HabitatFilter): selector is HabitatFilterByBiome {
    const key: keyof HabitatFilterByBiome = 'biome';
    return Object.keys(selector).includes(key);
  },
};
