import { Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { Aggregate, Transition, UUID } from '../../../core';
import { AssetInvalidityReason, AssetStatus } from '../utils/asset-status';
import { InvalidityDTO, CreateAssetDTO } from '../interfaces';
import { AssetModel } from '../models';
import * as Events from '../events';

export class AssetAggregate extends Aggregate<AssetModel> {
  readonly logger = new Logger(AssetAggregate.name);

  ModelType = AssetModel;
  id = (): UUID => this.model.uuid;
  toString = (): string => `Asset(${this.id()})`;

  @Transition()
  async create(data: CreateAssetDTO): Promise<AssetAggregate> {
    return this.nextState(
      () =>
        new AssetModel({
          uuid: uuidv4(),
          binary: join('public', 'assets', uuidv4()),
          filename: data.filename,
          digest: data.digest,
          compressed: data.compressed,
          status: AssetStatus.UPLOADING,
          invalid: null,
          draft: {
            requestId: data.requestId,
            expectedParts: data.expectedParts,
            fragments: [],
          },
          authorship: {
            created: new Date(),
            createdBy: data.author,
          },
        }),
      next => new Events.AssetCreatedEvent(next),
    );
  }

  @Transition()
  async changeStatus(
    status: AssetStatus,
    reason?: AssetInvalidityReason,
  ): Promise<AssetAggregate> {
    let invalid: InvalidityDTO | null = null;
    if (status === AssetStatus.INVALID) {
      invalid = {
        reason: reason ?? AssetInvalidityReason.INTERNAL,
        timestamp: new Date(),
      };
    }

    return this.nextState(
      prev => prev.update({ status, invalid }),
      next =>
        new Events.ChangedStatusEvent(
          next.uuid,
          next.status,
          next.invalid?.reason,
        ),
    );
  }

  @Transition()
  async finalize(checksum: string): Promise<AssetAggregate> {
    return this.nextState(
      prev => {
        if (checksum !== prev.digest) {
          this.logger.warn(
            `Invalid checksum for "${prev.binary}"!` +
              ` Got: ${checksum} (Expected: ${prev.digest})`,
          );
          return prev.update({
            status: AssetStatus.INVALID,
            invalid: {
              reason: AssetInvalidityReason.CHECKSUM,
              timestamp: new Date(),
            },
          });
        }
        return prev.update({ status: AssetStatus.READY });
      },
      next =>
        new Events.ChangedStatusEvent(
          next.uuid,
          next.status,
          next.invalid?.reason,
        ),
    );
  }

  @Transition()
  async cleanup(): Promise<AssetAggregate> {
    return this.nextState(prev =>
      prev.update({
        binary: null,
        draft: null,
      }),
    );
  }

  @Transition()
  async delete(): Promise<AssetAggregate> {
    return this;
  }
}
