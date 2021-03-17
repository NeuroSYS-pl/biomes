import { InputType, Field } from '@nestjs/graphql';
import { CharacteristicSimpleDTO } from '../../domain';

@InputType()
export class CharacteristicInput implements CharacteristicSimpleDTO {
  @Field(() => String)
  key: string;

  @Field(() => String)
  value: string;
}
