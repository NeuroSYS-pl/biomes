import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { Reference } from '../../../core';
import { Authorship } from '../../../common/authorship';
import { Habitat } from './habitat.output';
import { Characteristic } from './characteristics.output';

@ObjectType()
export class Species {
  asset: Reference;

  @Field(() => ID)
  uuid: string;

  @Field(() => String)
  tag: string;

  @Field(() => Number)
  generation: number;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  link?: string;

  @Type(() => Habitat)
  @Field(() => [Habitat])
  habitats: Habitat[];

  @Type(() => Characteristic)
  @Field(() => [Characteristic], { defaultValue: [] })
  characteristics: Characteristic[];

  @Type(() => Authorship)
  @Field(() => Authorship)
  authorship: Authorship;
}
