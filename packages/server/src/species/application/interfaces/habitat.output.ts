import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Reference, UUID } from '../../../core';

@ObjectType()
export class Habitat {
  readonly uuid: UUID;
  readonly biome: Reference;
  readonly species: Reference;
  readonly createdBy: Reference;

  @Field(() => GraphQLISODateTime)
  readonly created: Date;
}
