import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../common/prisma';
import { SpeciesModule } from '../species';
import * as CommandHandlers from './application/commands/handlers';
import * as QueryHandlers from './application/queries/handlers';
import * as Resolvers from './application/resolvers';
import * as Infrastructure from './infrastructure';

@Module({
  imports: [CqrsModule, PrismaModule, forwardRef(() => SpeciesModule)],
  providers: [
    ...Object.values(Resolvers),
    ...Object.values(Infrastructure),
    ...Object.values(QueryHandlers),
    ...Object.values(CommandHandlers),
  ],
  exports: [Resolvers.BiomeResolver],
})
export class BiomesModule {}
