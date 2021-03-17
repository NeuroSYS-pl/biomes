import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  readonly email: string;

  @Field(() => String)
  readonly firstName: string;

  @Field(() => String)
  readonly lastName: string;
}
