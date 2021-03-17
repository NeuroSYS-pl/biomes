import { IsNotEmpty, IsUUID, IsInt, Min } from 'class-validator';
import { UUID } from '../../../core';

export class CreateFragmentInput {
  @IsNotEmpty()
  @IsUUID('4')
  readonly asset: UUID;

  @IsNotEmpty()
  @IsUUID('4')
  readonly requestId: UUID;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  readonly part: number;
}
