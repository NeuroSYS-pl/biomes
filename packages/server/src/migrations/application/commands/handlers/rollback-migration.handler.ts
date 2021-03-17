import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { from } from 'rxjs';
import { concatMap, map, tap, toArray } from 'rxjs/operators';
import { MigrationAggregate, MigrationDTO } from '../../../domain';
import { MigrationRepository } from '../../../infrastructure';
import { RollbackMigrationCommand } from '../rollback-migration.command';

@CommandHandler(RollbackMigrationCommand)
export class RollbackMigrationHandler
  implements ICommandHandler<RollbackMigrationCommand> {
  constructor(private readonly repository: MigrationRepository) {}

  async execute(command: RollbackMigrationCommand): Promise<void> {
    const migrations = await from(command.rollback)
      .pipe(
        concatMap(pk => this.repository.getOne({ pk })),
        map(migration => new MigrationAggregate().from(migration)),
        toArray(),
      )
      .toPromise();

    migrations.sort(this.sortDesc.bind(this));
    await from(migrations)
      .pipe(
        concatMap(migration => migration.rollbackMigration()),
        concatMap(async migration => {
          await this.repository.rollback(migration);
          return migration;
        }),
        tap(m => m.commit()),
      )
      .toPromise();
  }

  private sortDesc(a: MigrationDTO, b: MigrationDTO) {
    return b.applied?.timestamp.valueOf() - a.applied?.timestamp.valueOf();
  }
}
