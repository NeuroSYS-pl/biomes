import { Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Command } from 'commander';
import { createPromptModule } from 'inquirer';
import { green, bold, red } from 'chalk';
import { Commander } from '../../../tags';
import * as Queries from '../queries';
import { DeleteInvalidAssetsCommand } from '../commands';

type Answer = {
  picked: string;
};

const enum Choice {
  CANCEL = 'cancel',
  CONTINUE = 'continue',
}

@Injectable()
export class AssetsCLI {
  constructor(
    @Inject(Commander) private program: Command,
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {
    const group = this.program
      .command('assets')
      .description('Commands group for assets management');

    group
      .command('purge')
      .description('Displays and optionally purges all invalid assets')
      .option('--all', 'includes also uploading and processing assets')
      .option('--dry', 'nothing will be removed, only displays assets')
      .action(this.purgeInvalidAssets.bind(this));
  }

  async purgeInvalidAssets(): Promise<void> {
    await this.listInvalidAssets();
    const dry = this.program.args.includes('--dry');
    const all = this.program.args.includes('--all');
    if (dry) {
      // eslint-disable-next-line no-console
      console.log(green('Selected dry option. The processing is finished'));
      return;
    }
    const answer = await createPromptModule()<Answer>([
      {
        type: 'list',
        name: 'picked',
        message:
          'Do You wish to Continue the process and purge entities or Cancel it?',
        choices: [{ name: Choice.CONTINUE }, { name: Choice.CANCEL }],
      },
    ]);
    // eslint-disable-next-line no-console
    console.log(green(`Picked ${answer.picked}`));
    if (answer.picked === Choice.CANCEL) {
      return;
    }
    // eslint-disable-next-line no-console
    console.log(
      green(
        `Purging ${
          all ? 'invalid, uploading, processing' : 'invalid'
        } assets...`,
      ),
    );
    try {
      await this.commandBus.execute(new DeleteInvalidAssetsCommand(all));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(red(error));
    }
    // eslint-disable-next-line no-console
    console.log(green(bold('Assets have been purged.')));
  }

  private async listInvalidAssets(): Promise<void> {
    const invalidAssets = await this.queryBus.execute(
      new Queries.GetInvalidAssetsQuery(!!this.program.all),
    );
    // eslint-disable-next-line no-console
    console.table(invalidAssets, ['uuid', 'filename', 'created']);
  }
}
