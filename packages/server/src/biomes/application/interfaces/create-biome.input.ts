import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateBiomeInput {
  @Field(() => String)
  readonly name: string;

  @Field(() => String, { nullable: true })
  readonly description?: string;

  @Field(() => String, { nullable: true })
  readonly link?: string;
}
