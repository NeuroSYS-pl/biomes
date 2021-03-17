import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlTokenAuthGuard extends AuthGuard('bearer') {
  getRequest(context: ExecutionContext): Express.Request {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().request;
  }
}
