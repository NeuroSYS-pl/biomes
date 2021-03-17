import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { AuthorshipDTO, Authorship } from '../../../common/authorship';
import { Reference, UUID } from '../../../core';

@ObjectType()
export class Biome {
  @Field(() => ID)
  uuid: UUID;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  link?: string;

  @Type(() => Authorship)
  @Field(() => Authorship)
  authorship: AuthorshipDTO;

  species: Reference[];
}
