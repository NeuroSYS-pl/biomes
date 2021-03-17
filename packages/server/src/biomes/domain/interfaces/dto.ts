import { Reference, UUID } from '../../../core';
import { AuthorshipDTO } from '../../../common/authorship';

export interface BiomeDTO {
  readonly uuid: UUID;
  readonly name: string;
  readonly description?: string;
  readonly link?: string;
  readonly species: ReadonlyArray<Reference>;
  readonly authorship: AuthorshipDTO;
}
