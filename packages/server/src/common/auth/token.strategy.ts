import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import * as users from '../../users';

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly queryBus: QueryBus) {
    super();
  }

  async validate(token: string): Promise<users.UserDTO> {
    try {
      return await this.queryBus.execute(
        new users.Queries.GetUserQuery('single', { token }),
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException();
      } else {
        throw error;
      }
    }
  }
}
