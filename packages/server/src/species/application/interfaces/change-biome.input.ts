import { InputType, Field, ID } from '@nestjs/graphql';
import { UUID } from '../../../core';

@InputType()
export class ChangeSpeciesBiomeInput {
  @Field(() => ID)
  readonly uuid: UUID;

  @Field(() => String)
  readonly biome?: string;
}
