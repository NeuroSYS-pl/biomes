import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { UUID } from '../../../core';
import { InvalidityDTO } from '../../domain/interfaces';
import { Authorship, AuthorshipDTO } from '../../../common/authorship';
import { AssetInvalidityReason, AssetStatus } from '../../domain';

registerEnumType(AssetStatus, { name: 'AssetStatus' });
registerEnumType(AssetInvalidityReason, { name: 'AssetInvalidityReason' });

@ObjectType()
export class Asset {
  invalid?: InvalidityDTO;
  binary?: string;

  @Field(() => ID)
  uuid: UUID;

  @Field(() => String)
  digest: string;

  @Field(() => Boolean)
  compressed: boolean;

  @Field(() => String)
  filename: string;

  @Field(() => AssetStatus)
  status: AssetStatus;

  @Field(() => Authorship)
  @Type(() => Authorship)
  authorship: AuthorshipDTO;

  @Field(() => String, { nullable: true })
  get url(): string | null {
    return this.status === AssetStatus.READY ? this.binary : null;
  }

  @Field(() => AssetInvalidityReason, { nullable: true })
  get invalidityReason(): AssetInvalidityReason | null {
    return this.invalid?.reason;
  }

  @Field(() => Date, { nullable: true })
  get invalidityTimestamp(): Date | null {
    return this.invalid?.timestamp;
  }
}
