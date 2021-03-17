import { MigrationStatus } from '../types';

export type MigrationSelectorByPk = { pk: number };
export type MigrationSelector = MigrationSelectorByPk;

export type MigrationFilterByStatus = { status: MigrationStatus };
export type MigrationFilterSuccessors = {
  successorsOf: number;
  includeOrigin: boolean;
  onlyWithStatus?: MigrationStatus;
};
export type MigrationFilterPredecessors = {
  predecessorsOf: number;
  includeOrigin: boolean;
  onlyWithStatus?: MigrationStatus;
};
export type MigrationFilter =
  | MigrationFilterByStatus
  | MigrationFilterSuccessors
  | MigrationFilterPredecessors;

export const migrationSelector = {
  isPk(selector: MigrationSelector): selector is MigrationSelectorByPk {
    const key: keyof MigrationSelectorByPk = 'pk';
    return Object.keys(selector).includes(key);
  },
};

export const migrationFilter = {
  isStatus(selector: MigrationFilter): selector is MigrationFilterByStatus {
    const key: keyof MigrationFilterByStatus = 'status';
    return Object.keys(selector).includes(key);
  },
  isSuccesors(
    selector: MigrationFilter,
  ): selector is MigrationFilterSuccessors {
    const keys: ReadonlyArray<keyof MigrationFilterSuccessors> = [
      'successorsOf',
      'includeOrigin',
    ];
    return keys.every(key => Object.keys(selector).includes(key));
  },
  isPredecessors(
    selector: MigrationFilter,
  ): selector is MigrationFilterPredecessors {
    const keys: ReadonlyArray<keyof MigrationFilterPredecessors> = [
      'predecessorsOf',
      'includeOrigin',
    ];
    return keys.every(key => Object.keys(selector).includes(key));
  },
};
