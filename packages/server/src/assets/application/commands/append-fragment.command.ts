import { WriteStream } from 'fs';
import { UUID } from '../../../core';

export class AppendFragmentCommand {
  constructor(
    public readonly uuid: UUID,
    public readonly stream: WriteStream,
  ) {}
}
