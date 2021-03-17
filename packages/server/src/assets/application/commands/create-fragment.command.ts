import { CreateFragmentDTO } from '../../domain';

export class CreateFragmentCommand {
  constructor(
    public readonly data: CreateFragmentDTO,
    public readonly file: Express.Multer.File,
  ) {}
}
