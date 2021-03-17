import { InputType, Field } from '@nestjs/graphql';
import { CharacteristicInput } from './characteristics.input';

@InputType()
export class CreateSpeciesInput {
  @Field(() => String)
  readonly tag: string;

  @Field(() => String, { nullable: true })
  readonly description?: string;

  @Field(() => String, { nullable: true })
  readonly link?: string;

  @Field(() => [String], { nullable: true })
  readonly biomes?: string[];

  @Field(() => [CharacteristicInput], { nullable: true })
  readonly characteristics?: CharacteristicInput[];
}
