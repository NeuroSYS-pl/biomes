import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { Authorship } from '../../../common/authorship';

@ObjectType()
export class Characteristic {
  @Field(() => ID)
  uuid: string;

  @Field(() => String)
  key: string;

  @Field(() => String)
  value: string;

  @Type(() => Authorship)
  @Field(() => Authorship)
  authorship: Authorship;
}
