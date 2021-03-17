import { InputType, Field, ID } from '@nestjs/graphql';
import { UUID } from '../../../core';
import { CharacteristicInput } from './characteristics.input';

@InputType()
export class UpdateSpeciesInput {
  @Field(() => ID)
  readonly uuid: UUID;

  @Field(() => String, { nullable: true })
  readonly tag?: string;

  @Field(() => String, { nullable: true })
  readonly description?: string;

  @Field(() => String, { nullable: true })
  readonly link?: string;

  @Field(() => [ID], { nullable: true })
  readonly biomes?: string[];

  @Field(() => [CharacteristicInput], { nullable: true })
  readonly characteristics?: CharacteristicInput[];
}
