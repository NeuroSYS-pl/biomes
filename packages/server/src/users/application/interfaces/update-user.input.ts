import { InputType, Field, ID } from '@nestjs/graphql';
import { UUID } from '../../../core/types';

@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  readonly uuid: UUID;

  @Field(() => String, { nullable: true })
  readonly email?: string;

  @Field(() => String, { nullable: true })
  readonly firstName?: string;

  @Field(() => String, { nullable: true })
  readonly lastName?: string;
}
