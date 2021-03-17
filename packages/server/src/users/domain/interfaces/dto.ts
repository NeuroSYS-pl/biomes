import { UUID } from '../../../core/types';

export interface UserDTO {
  readonly uuid: UUID;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly token?: string;
  readonly created: Date;
  readonly modified?: Date;
}
