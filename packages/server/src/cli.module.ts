import { Inject, Module } from '@nestjs/common';
import { Command, createCommand } from 'commander';
import { CqrsModule } from '@nestjs/cqrs';
import { Commander } from './tags';
import { AppModule } from './app.module';
import { MigrationsModule, MigrationsCLI } from './migrations';
import { UsersModule, UsersCLI } from './users';
import { AssetsModule, AssetsCLI } from './assets';

@Module({
  imports: [CqrsModule, AppModule, MigrationsModule, UsersModule, AssetsModule],
  providers: [
    { provide: Commander, useValue: createCommand() },
    MigrationsCLI,
    UsersCLI,
    AssetsCLI,
  ],
})
export class CliModule {
  constructor(@Inject(Commander) private command: Command) {
    this.command.version('0.1.0').description('Biomes Server Management CLI');
  }

  async run(argv: string[]): Promise<void> {
    await this.command.parseAsync(argv);
  }
}
