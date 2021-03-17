import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthorshipResolver } from './authorship.resolver';
import { UsersModule } from '../../users';

@Module({
  imports: [CqrsModule, UsersModule],
  providers: [AuthorshipResolver],
})
export class AuthorshipModule {}
