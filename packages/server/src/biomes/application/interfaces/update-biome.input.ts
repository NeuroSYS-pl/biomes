import { InputType, Field, ID } from '@nestjs/graphql';
import { UUID } from '../../../core';

@InputType()
export class UpdateBiomeInput {
  @Field(() => ID)
  readonly uuid: UUID;

  @Field(() => String, { nullable: true })
  readonly name?: string;

  @Field(() => String, { nullable: true })
  readonly description?: string;

  @Field(() => String, { nullable: true })
  readonly link?: string;
}
