import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { from } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
import { MigrationAggregate } from '../../../domain';
import { MigrationRepository } from '../../../infrastructure';
import { ApplyMigrationCommand } from '../apply-migration.command';

@CommandHandler(ApplyMigrationCommand)
export class ApplyMigrationHandler
  implements ICommandHandler<ApplyMigrationCommand> {
  constructor(private readonly repository: MigrationRepository) {}

  async execute(command: ApplyMigrationCommand): Promise<void> {
    const pending = [...command.pending].sort();
    await from(pending)
      .pipe(
        concatMap(pk => this.repository.getOne({ pk })),
        map(migration => new MigrationAggregate().from(migration)),
        concatMap(migration => migration.commitMigration()),
        concatMap(async migration => {
          await this.repository.apply(migration);
          return migration;
        }),
        tap(m => m.commit()),
      )
      .toPromise();
  }
}
