import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Query } from '../domain';

@Injectable()
export class UserQueryBuilder {
  unique(selector: Query.UserSelector): Prisma.UsersWhereUniqueInput {
    if (Query.userSelector.isUuid(selector)) {
      return { uuid: selector.uuid };
    } else if (Query.userSelector.isEmail(selector)) {
      return { email: selector.email };
    }

    throw new Error(`Invalid query: ${selector}`);
  }

  first(selector: Query.UserSelector): Prisma.UsersWhereInput {
    if (Query.userSelector.isToken(selector)) {
      return { token: selector.token };
    }

    throw new Error(`Invalid query: ${selector}`);
  }
}
