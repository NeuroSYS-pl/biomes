import { InputType, Field } from '@nestjs/graphql';
import { UUID } from '../../../core';

@InputType()
export class CreateAssetInput {
  @Field(() => String)
  readonly requestId: UUID;

  @Field(() => Number)
  readonly expectedParts: number;

  @Field(() => String)
  readonly filename: string;

  @Field(() => String)
  readonly digest: string;

  @Field(() => Boolean)
  readonly compressed: boolean;
}
