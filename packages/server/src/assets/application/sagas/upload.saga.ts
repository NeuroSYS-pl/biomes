import { Injectable, Logger } from '@nestjs/common';
import { CommandBus, ICommand, ofType, Saga } from '@nestjs/cqrs';
import { createWriteStream, WriteStream } from 'fs';
import { Observable, of } from 'rxjs';
import * as rx from 'rxjs/operators';
import { AssetDTO } from '../../domain/interfaces';
import {
  AssetInvalidityReason,
  AssetStatus,
  AssetConfig,
} from '../../domain/utils';
import * as Events from '../../domain/events';
import * as Commands from '../commands';

interface State {
  next: number;
  buffered: ReadonlyArray<Events.FragmentCreatedEvent>;
  processing: ReadonlyArray<Events.FragmentCreatedEvent>;
}

@Injectable()
export class AssetUploadSaga {
  readonly logger = new Logger(AssetUploadSaga.name);

  constructor(
    private readonly config: AssetConfig,
    private readonly commandBus: CommandBus,
  ) {}

  @Saga()
  assetCreated = (events$: Observable<unknown>): Observable<ICommand> =>
    events$.pipe(
      ofType(Events.AssetCreatedEvent),
      rx.mergeMap(ev => this.processAsset(events$, ev.asset)),
    );

  private processAsset = (
    events$: Observable<unknown>,
    asset: AssetDTO,
  ): Observable<ICommand> => {
    const stream = createWriteStream(asset.binary, { flags: 'w' });
    const initialState: State = {
      next: 0,
      buffered: [],
      processing: [],
    };

    return events$.pipe(
      ofType(Events.FragmentCreatedEvent),
      rx.filter(ev => ev.fragment.asset.uuid === asset.uuid),
      rx.timeout(this.config.uploadTimeout),
      rx.scan(this.sortAndBufferFragments, initialState),
      rx.pluck('processing'),
      rx.concatAll(),
      rx.concatMap(ev => this.appendFragment(ev, stream)),
      rx.take(asset.draft?.expectedParts),
      rx.endWith(
        new Commands.ChangeStatusCommand(asset.uuid, AssetStatus.PROCESSING),
      ),
      rx.catchError(() => {
        stream.destroy();
        const cmd = new Commands.ChangeStatusCommand(
          asset.uuid,
          AssetStatus.INVALID,
          AssetInvalidityReason.TIMEOUT,
        );
        return of(cmd);
      }),
      rx.finalize(() => {
        if (stream.writable) {
          this.logger.verbose(`Closing stream for ${asset.uuid}`);
          stream.close();
        }
      }),
    );
  };

  private sortAndBufferFragments = (
    state: State,
    event: Events.FragmentCreatedEvent,
  ): State => {
    const pending = [event, ...state.buffered];
    pending.sort((a, b) => a.fragment.part - b.fragment.part);
    const next = pending.reduce(
      (acc, ev) => (acc === ev.fragment.part ? ev.fragment.part + 1 : acc),
      state.next,
    );
    return {
      next,
      buffered: pending.filter(ev => ev.fragment.part > next),
      processing: pending.filter(ev => ev.fragment.part < next),
    };
  };

  private appendFragment = async (
    ev: Events.FragmentCreatedEvent,
    stream: WriteStream,
  ): Promise<void> => {
    await this.commandBus.execute(
      new Commands.AppendFragmentCommand(ev.fragment.uuid, stream),
    );
  };
}
