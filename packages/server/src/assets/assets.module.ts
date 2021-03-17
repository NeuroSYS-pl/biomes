import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../common/prisma';
import { MulterModule } from './multer.module';
import { AssetConfig } from './domain/utils/config';
import * as CommandHandlers from './application/commands/handlers';
import * as QueryHandlers from './application/queries/handlers';
import * as Sagas from './application/sagas';
import * as Infrastructure from './infrastructure';
import * as Resolvers from './application/resolvers';
import { AssetController } from './application/controllers';

@Module({
  imports: [CqrsModule, PrismaModule, MulterModule],
  controllers: [AssetController],
  providers: [
    AssetConfig,
    ...Object.values(Resolvers),
    ...Object.values(Infrastructure),
    ...Object.values(QueryHandlers),
    ...Object.values(CommandHandlers),
    ...Object.values(Sagas),
  ],
  exports: [Resolvers.AssetResolver],
})
export class AssetsModule {}
