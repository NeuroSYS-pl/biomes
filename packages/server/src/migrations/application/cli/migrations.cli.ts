import { Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Command } from 'commander';
import { createPromptModule } from 'inquirer';
import { blueBright, bold, gray, green, red, redBright, yellow } from 'chalk';
import { Commander } from '../../../tags';
import * as Queries from '../queries';
import * as Commands from '../commands';
import { MigrationDTO, MigrationStatus } from '../../domain';

interface MigrationsListOptions extends Command {
  applied: boolean;
  pending: boolean;
}

@Injectable()
export class MigrationsCLI {
  constructor(
    @Inject(Commander) private program: Command,
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {
    const group = this.program
      .command('migrations')
      .description('Commands for database migrations');

    group
      .command('list')
      .alias('ls')
      .description('List all migrations')
      .option('--applied', 'include only applied migrations')
      .option('--pending', 'include only pending migrations')
      .action(this.listMigrations.bind(this));

    group
      .command('apply [pk]')
      .description('Apply all or specific migration(s) to the database')
      .action(this.applyMigration.bind(this));

    group
      .command('rollback <pk>')
      .description('Rollback to the specific migration')
      .action(this.rollbackMigration.bind(this));
  }

  async listMigrations(options: MigrationsListOptions): Promise<void> {
    let query: Queries.GetMigrationsQuery;
    if (options.applied && !options.pending) {
      query = new Queries.GetMigrationsQuery('many', {
        status: MigrationStatus.applied,
      });
    } else if (!options.applied && options.pending) {
      query = new Queries.GetMigrationsQuery('many', {
        status: MigrationStatus.pending,
      });
    } else {
      query = new Queries.GetMigrationsQuery('all');
    }

    const migrations = await this.queryBus.execute(query);
    this.printList(migrations);
  }

  async applyMigration(rawPk?: string): Promise<void> {
    const pk = rawPk != null ? parseInt(rawPk, 10) : null;
    const toApply: ReadonlyArray<MigrationDTO> = await this.queryBus.execute(
      pk != null
        ? new Queries.GetMigrationsQuery('many', {
            predecessorsOf: pk,
            includeOrigin: true,
            onlyWithStatus: MigrationStatus.pending,
          })
        : new Queries.GetMigrationsQuery('many', {
            status: MigrationStatus.pending,
          }),
    );

    if (toApply.length === 0) {
      // eslint-disable-next-line no-console
      console.log(gray('Nothing to apply: aborting...'));
    } else {
      const status = `⭐ ${bold(yellow('Will be applied'))}`;
      toApply.forEach(migration => {
        this.printMigration(migration, status);
      });

      if (await this.askForConfirmation()) {
        await this.commandBus.execute(
          new Commands.ApplyMigrationCommand(toApply.map(r => r.pk)),
        );
        this.printList(
          await this.queryBus.execute(new Queries.GetMigrationsQuery('all')),
        );
      }
    }
  }

  async rollbackMigration(pk: string): Promise<void> {
    const toRollback: ReadonlyArray<MigrationDTO> = await this.queryBus.execute(
      new Queries.GetMigrationsQuery('many', {
        successorsOf: parseInt(pk, 10),
        includeOrigin: true,
        onlyWithStatus: MigrationStatus.applied,
      }),
    );

    if (toRollback.length === 0) {
      // eslint-disable-next-line no-console
      console.log(gray('Nothing to revert: aborting...'));
    } else {
      const status = `🚨 ${bold(redBright('Will be reverted'))}`;
      toRollback.forEach(migration => {
        this.printMigration(migration, status);
      });

      if (await this.askForConfirmation()) {
        await this.commandBus.execute(
          new Commands.RollbackMigrationCommand(toRollback.map(r => r.pk)),
        );
        this.printList(
          await this.queryBus.execute(new Queries.GetMigrationsQuery('all')),
        );
      }
    }
  }

  private async askForConfirmation(
    message = 'Continue?',
    defaultValue = false,
  ) {
    const prompt = await createPromptModule()<{ confirmation: boolean }>({
      name: 'confirmation',
      type: 'confirm',
      message,
      default: defaultValue,
    });
    return prompt.confirmation;
  }

  private printMigration(
    m: MigrationDTO,
    status?: string,
    padding = '    ',
  ): void {
    const changelog = m.changelog
      .trim()
      .split('\n')
      .map(line => `│${padding}${blueBright(line)}`)
      .join('\n');

    /* eslint-disable no-console */
    console.log(`├ ${status}`);
    console.log(`│${padding}${gray(`Migration ${m.pk}`)}: ${bold(m.name)}`);
    console.log(changelog);
    console.log('│');
    /* eslint-enable no-console */
  }

  private printList(migrations: ReadonlyArray<MigrationDTO>): void {
    migrations.forEach(migration => {
      let status: string;
      if (migration.status === MigrationStatus.applied) {
        status =
          migration.commitChecksum === migration.applied.checksum
            ? `🟢 ${green('Applied')}`
            : `❗ ${bold(red('Applied but SQL file has changed!'))}`;
      } else {
        status = `🟡 ${yellow('Pending')}`;
      }

      this.printMigration(migration, status);
    });
    this.printSummary(migrations);
  }

  private printSummary(migrations: ReadonlyArray<MigrationDTO>): void {
    const applied = migrations.filter(
      migration => migration.status === MigrationStatus.applied,
    );

    const pending = migrations.filter(
      migration => migration.status === MigrationStatus.pending,
    );

    /* eslint-disable no-console */
    console.log(`├ ${green('Applied:')} ${bold(green(applied.length))}`);
    console.log(`└ ${yellow('Pending:')} ${bold(yellow(pending.length))}`);
    /* eslint-enable no-console */
  }
}
