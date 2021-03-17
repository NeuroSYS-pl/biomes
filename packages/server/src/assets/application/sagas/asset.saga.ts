import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, QueryBus, Saga } from '@nestjs/cqrs';
import { Observable, of } from 'rxjs';
import * as rx from 'rxjs/operators';
import { Reference } from '../../../core';
import { FragmentDTO, AssetStatus } from '../../domain';
import * as Events from '../../domain/events';
import * as Commands from '../commands';
import * as Queries from '../queries';

@Injectable()
export class AssetSaga {
  readonly logger = new Logger(AssetSaga.name);

  constructor(private readonly queryBus: QueryBus) {}

  @Saga()
  processAsset = (events$: Observable<unknown>): Observable<ICommand> =>
    events$.pipe(
      ofType(Events.ChangedStatusEvent),
      rx.filter(ev => ev.status === AssetStatus.PROCESSING),
      rx.tap(ev => this.logger.log(`Finalize Asset(${ev.uuid})`)),
      rx.map(ev => new Commands.FinalizeAssetCommand(ev.uuid)),
    );

  @Saga()
  cleanupInvalidAsset = (events$: Observable<unknown>): Observable<ICommand> =>
    events$.pipe(
      ofType(Events.ChangedStatusEvent),
      rx.filter(ev => ev.status === AssetStatus.INVALID),
      rx.tap(ev => this.logger.log(`Cleanup invalid Asset(${ev.uuid})`)),
      rx.map(ev => new Reference(ev.uuid)),
      rx.mergeMap(asset =>
        this.removeFragments$(asset).pipe(
          rx.endWith(new Commands.CleanupAssetCommand(asset.uuid)),
        ),
      ),
    );

  @Saga()
  cleanupReadyAsset = (events$: Observable<unknown>): Observable<ICommand> =>
    events$.pipe(
      ofType(Events.ChangedStatusEvent),
      rx.filter(ev => ev.status === AssetStatus.READY),
      rx.tap(ev => this.logger.log(`Cleanup ready Asset(${ev.uuid})`)),
      rx.map(ev => new Reference(ev.uuid)),
      rx.mergeMap(asset => this.removeFragments$(asset)),
    );

  private removeFragments$ = (asset: Reference): Observable<ICommand> =>
    of(asset).pipe(
      rx.mergeMap(this.getFragments),
      rx.mergeAll(),
      rx.pluck('uuid'),
      rx.map(fragment => new Commands.DeleteFragmentCommand(fragment)),
    );

  private getFragments = (asset: Reference): Promise<FragmentDTO[]> =>
    this.queryBus.execute(
      new Queries.GetFragmentQuery('many', { asset: asset.uuid }),
    );
}
