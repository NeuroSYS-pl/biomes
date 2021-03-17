import { IsNotEmpty, IsUUID } from 'class-validator';
import { UUID } from './types';

export class Reference {
  @IsNotEmpty()
  @IsUUID('4')
  readonly uuid: UUID;

  static create(uuid: UUID): Reference;
  static create(uuid: null | undefined): null;
  static create(uuid?: UUID | null): Reference | null {
    return uuid ? new Reference(uuid) : null;
  }

  constructor(uuid: string) {
    this.uuid = uuid;
  }

  toString = (): string => `Reference(${this.uuid})`;

  resolve<R>(fn: (uuid: UUID) => R): R {
    return fn(this.uuid);
  }
}
