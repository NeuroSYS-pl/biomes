import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../common/prisma';
import * as CommandHandlers from './application/commands/handlers';
import * as QueryHandlers from './application/queries/handlers';
import * as Resolvers from './application/resolvers';
import * as Infrastructure from './infrastructure';

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [
    ...Object.values(QueryHandlers),
    ...Object.values(CommandHandlers),
    ...Object.values(Resolvers),
    ...Object.values(Infrastructure),
  ],
  exports: [Resolvers.UserResolver],
})
export class UsersModule {}
