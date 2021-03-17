import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersModule } from '../../users';
import { TokenStrategy } from './token.strategy';
import { GqlTokenAuthGuard } from './gql-auth.guard';
import { TokenAuthGuard } from './auth.guard';

@Module({
  imports: [CqrsModule, UsersModule, PassportModule],
  providers: [TokenStrategy, GqlTokenAuthGuard, TokenAuthGuard],
})
export class AuthModule {}
