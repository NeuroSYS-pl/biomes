import { Reference } from '../../core/reference';

export interface AuthorshipDTO {
  readonly created: Date;
  readonly createdBy: Reference;
  readonly modified?: Date;
  readonly modifiedBy?: Reference;
}
