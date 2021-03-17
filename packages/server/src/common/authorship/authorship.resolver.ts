import { Resolver, Parent, ResolveField } from '@nestjs/graphql';
import { User, UserResolver } from '../../users';
import { Authorship } from './authorship.output';

@Resolver(() => Authorship)
export class AuthorshipResolver {
  constructor(private readonly userResolver: UserResolver) {}

  @ResolveField(() => User)
  async createdBy(@Parent() authorship: Authorship): Promise<User> {
    return authorship.createdBy.resolve(uuid => this.userResolver.user(uuid));
  }

  @ResolveField(() => User, { nullable: true })
  async modifiedBy(@Parent() authorship: Authorship): Promise<User> {
    return authorship.modifiedBy?.resolve(uuid => this.userResolver.user(uuid));
  }
}
