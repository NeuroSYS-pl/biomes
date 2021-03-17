import { Logger } from '@nestjs/common';
import { Aggregate, Transition } from '../../core';
import { MigrationStatus } from './interfaces';
import { MigrationModel } from './models';
// import * as Events from '../events';

export class MigrationAggregate extends Aggregate<MigrationModel> {
  readonly logger = new Logger(MigrationAggregate.name);

  ModelType = MigrationModel;
  id = (): string => this.model.pk.toString();
  toString = (): string => `Migration(${this.id()})`;

  @Transition()
  async commitMigration(): Promise<MigrationAggregate> {
    return this.nextState(prev => {
      if (prev.status !== MigrationStatus.pending) {
        throw new Error('Cannot commit non-pending migration!');
      }

      return prev.update({
        status: MigrationStatus.applied,
        applied: {
          timestamp: new Date(),
          checksum: prev.commitChecksum,
        },
      });
    });
  }

  @Transition()
  async rollbackMigration(): Promise<MigrationAggregate> {
    return this.nextState(prev => {
      if (prev.status !== MigrationStatus.applied) {
        throw new Error('Cannot rollback non-applied migration!');
      }

      return prev.update({
        status: MigrationStatus.pending,
        applied: null,
      });
    });
  }
}
