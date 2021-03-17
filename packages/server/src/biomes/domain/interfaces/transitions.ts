import { Reference } from '../../../core';

export interface CreateBiomeDTO {
  readonly name: string;
  readonly description?: string;
  readonly link?: string;
  readonly author: Reference;
}

export interface UpdateBiomeDTO {
  readonly name?: string;
  readonly description?: string;
  readonly link?: string;
  readonly author: Reference;
}
