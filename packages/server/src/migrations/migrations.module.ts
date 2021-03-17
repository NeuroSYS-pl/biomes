import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../common/prisma';
import { MigrationConfig } from './migration.config';
import * as CommandHandlers from './application/commands/handlers';
import * as QueryHandlers from './application/queries/handlers';
import * as Infrastructure from './infrastructure';

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [
    MigrationConfig,
    ...Object.values(QueryHandlers),
    ...Object.values(CommandHandlers),
    ...Object.values(Infrastructure),
  ],
})
export class MigrationsModule {}
