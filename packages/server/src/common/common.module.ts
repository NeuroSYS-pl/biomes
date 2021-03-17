import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AuthorshipModule } from './authorship/authorship.module';

@Module({
  imports: [AuthorshipModule, AuthModule],
  exports: [AuthorshipModule, AuthModule],
})
export class CommonModule {}
