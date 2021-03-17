import { TokenAuthGuard } from './auth.guard';

describe('TokenAuthGuard', () => {
  it('should be defined', () => {
    expect(new TokenAuthGuard()).toBeDefined();
  });
});
