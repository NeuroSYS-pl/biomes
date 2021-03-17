import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import * as rx from 'rxjs/operators';
import { Reference } from '../../../core';
import * as assets from '../../../assets';
import * as Commands from '../commands';
import * as Events from '../../domain/events';

@Injectable()
export class SpeciesSaga {
  readonly logger = new Logger(SpeciesSaga.name);
  readonly deletionDelay = 30 * 1000;

  @Saga()
  removeWhenInvalidAsset = (
    events$: Observable<unknown>,
  ): Observable<ICommand> =>
    events$.pipe(
      ofType(assets.ChangedStatusEvent),
      rx.filter(ev => ev.status === assets.AssetStatus.INVALID),
      rx.map(ev => new Reference(ev.uuid)),
      rx.tap(asset =>
        this.logger.verbose(`Species related to ${asset} marked for deletion`),
      ),
      rx.delay(this.deletionDelay),
      rx.map(asset => new Commands.DeleteSpeciesCommand({ asset: asset.uuid })),
    );

  @Saga()
  removeOrphanedAsset = (events$: Observable<unknown>): Observable<ICommand> =>
    events$.pipe(
      ofType(Events.SpeciesDeletedEvent),
      rx.map(
        ev => new assets.Commands.DeleteAssetCommand(ev.species.asset.uuid),
      ),
    );
}
