import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CommonModule } from './common/common.module';
import { PrismaModule } from './common/prisma';
import { UsersModule } from './users';
import { BiomesModule } from './biomes';
import { AssetsModule } from './assets';
import { SpeciesModule } from './species';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.graphql',
      context: ({ req }): GqlContext => ({
        request: req,
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'assets'),
      serveRoot: '/public/assets/',
      serveStaticOptions: {
        cacheControl: false,
      },
    }),
    PrismaModule,
    CommonModule,
    UsersModule,
    BiomesModule,
    AssetsModule,
    SpeciesModule,
  ],
})
export class AppModule {}
