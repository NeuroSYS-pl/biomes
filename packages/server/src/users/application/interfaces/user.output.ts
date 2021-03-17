import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';
import { UUID } from '../../../core/types';
import { UserDTO } from '../../domain/interfaces';

@ObjectType()
export class User implements UserDTO {
  @Field(() => ID)
  uuid: UUID;

  @Field(() => String)
  email: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Field(() => GraphQLISODateTime)
  created: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  modified?: Date;
}
