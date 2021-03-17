import { Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ValidationError } from 'class-validator';
import { Command } from 'commander';
import { createPromptModule } from 'inquirer';
import { green, bold, bgWhite, gray, red } from 'chalk';
import { Commander } from '../../../tags';
import * as Queries from '../queries';
import * as Commands from '../commands';
import { CreateUserDTO, UserDTO } from '../../domain';

interface UserTokenOptions extends Command {
  create: boolean;
}

@Injectable()
export class UsersCLI {
  constructor(
    @Inject(Commander) private program: Command,
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {
    const group = this.program
      .command('users')
      .description('Commands group for users management');

    group
      .command('list')
      .alias('ls')
      .description('List all users')
      .action(this.listUsers.bind(this));

    group
      .command('create')
      .description('Create new user')
      .action(this.createUser.bind(this));

    group
      .command('token <uuid>')
      .description("Operate on user's token")
      .option('-c, --create', 'create new token')
      .action(this.userToken.bind(this));
  }

  async listUsers(): Promise<void> {
    const users = await this.queryBus.execute(new Queries.GetUserQuery('all'));
    // eslint-disable-next-line no-console
    console.table(users, ['uuid', 'email', 'firstName', 'lastName']);
  }

  async createUser(): Promise<void> {
    const answers = await createPromptModule()<CreateUserDTO>([
      {
        name: 'email',
        message: 'Email:',
      },
      {
        name: 'firstName',
        message: 'First name:',
      },
      {
        name: 'lastName',
        message: 'Last name:',
      },
    ]);
    try {
      const user = await this.commandBus.execute(
        new Commands.CreateUserCommand(answers),
      );
      // eslint-disable-next-line no-console
      console.log(
        green(
          'Created account for',
          bold(`${user.firstName} ${user.lastName} <${user.email}>`),
        ),
      );
    } catch (error) {
      if (error instanceof ValidationError) {
        // eslint-disable-next-line no-console
        console.log(error.toString(true));
      } else {
        // eslint-disable-next-line no-console
        console.log(red(error));
      }
    }
  }

  async userToken(uuid: string, { create }: UserTokenOptions): Promise<void> {
    const user = create
      ? await this.regenerateUserToken(uuid)
      : await this.getUserToken(uuid);
    // eslint-disable-next-line no-console
    console.log(
      'Token for',
      `${user.firstName} ${user.lastName} <${user.email}>: `,
      bgWhite(gray(user.token)),
    );
  }

  private getUserToken(uuid: string): Promise<UserDTO> {
    return this.queryBus.execute(new Queries.GetUserQuery('single', { uuid }));
  }

  private regenerateUserToken(uuid: string): Promise<UserDTO> {
    return this.commandBus.execute(new Commands.RegenerateTokenCommand(uuid));
  }
}
