import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Reference } from '../../core';
import { AuthorshipDTO } from './authorship.dto';

@ObjectType()
export class Authorship implements AuthorshipDTO {
  @Field(() => GraphQLISODateTime)
  created: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  modified?: Date;

  createdBy: Reference;
  modifiedBy?: Reference;
}
