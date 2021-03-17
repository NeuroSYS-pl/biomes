import { GqlTokenAuthGuard } from './gql-auth.guard';

describe('GqlTokenAuthGuard', () => {
  it('should be defined', () => {
    expect(new GqlTokenAuthGuard()).toBeDefined();
  });
});
