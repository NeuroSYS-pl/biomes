import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../common/prisma';
import * as CommandHandlers from './application/commands/handlers';
import * as QueryHandlers from './application/queries/handlers';
import * as Sagas from './application/sagas';
import * as Resolvers from './application/resolvers';
import { SpeciesResolver } from './application/resolvers';
import * as Infrastructure from './infrastructure';
import { UsersModule } from '../users';
import { BiomesModule } from '../biomes';
import { AssetsModule } from '../assets';

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    UsersModule,
    AssetsModule,
    forwardRef(() => BiomesModule),
  ],
  providers: [
    ...Object.values(Resolvers),
    ...Object.values(Infrastructure),
    ...Object.values(QueryHandlers),
    ...Object.values(CommandHandlers),
    ...Object.values(Sagas),
  ],
  exports: [SpeciesResolver],
})
export class SpeciesModule {}
