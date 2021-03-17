import { MigrationStatus } from './types';

export interface AppliedMigrationInfoDTO {
  readonly checksum: string;
  readonly timestamp: Date;
}

export interface MigrationDTO {
  readonly pk: number;
  readonly name: string;
  readonly changelog: string;
  readonly commitChecksum: string;
  readonly status: MigrationStatus;
  readonly applied?: AppliedMigrationInfoDTO;
}
